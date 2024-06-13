import express from 'express'
import nedb from "nedb-promise";
import session from "express-session"; // for handling user sessions - login status
import { v4 as uuidv4 } from "uuid";
import sessionMiddleware from '../middlewares/session.js';
import adminSessionMiddleware from '../middlewares/adminSession.js';
import { extractPrices, sumPrices } from '../services/orderServices.js';

//Databaser
import { menu } from '../models/menu.js'
import { cart } from './cart.js'

const router = express.Router()

//Databas för ordrar
const orders = new nedb({ filename: "databases/orders.db", autoload: true });


//Funktion för att ta ut innehållet i menyn
let menuItems = null
menu.find({}, (err, docs) => {
  menuItems = docs
  getMenuItems(menuItems)
});

function getMenuItems(){
  return menuItems
}


router.use(
  session({
    secret: "this is the key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to make session variables accessible
router.use(sessionMiddleware)
router.use(adminSessionMiddleware)

//Meny
router.get("/", async (req, res) => {
  try {
      getMenuItems()
      res.send(menuItems)

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal server error");
  }

  });

  // Place an order and store in order history
router.post("/", async (req, res) => {
  try {
    const currentUserCart = await cart.find({
      userId: req.session.currentUser ? req.session.currentUser : 'guest'
    });

    // Check if the cart is empty
    if (currentUserCart.length === 0) {
      return res.status(404).send("Cart is empty");
    }
    
    const estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    const prices = extractPrices(currentUserCart);
    const sum = sumPrices(prices)

    // Create an order
    const order = {
      userId: req.session.currentUser || 'guest',
      items: currentUserCart,
      total: sum,
      orderDate: new Date().toLocaleString(), //Här läggs datum för order till
      estimatedDeliveryTime,
      orderId: uuidv4() //Här skapas ett unikt orderid som sen skickas tillbaka till användaren
    };

    // Insert the order into the orders database
    await orders.insert(order);
    res.send(order)
    
    // Clear the cart for the current user
    await cart.remove({ userId: req.session.currentUser || 'guest'}, { multi: true });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Bekräftelsesida med hur långt det är kvar tills ordern kommer
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orders.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    const items = order.items
      .map((item) => `<li>${item.title} (${item.price} kr)</li>`)
      .join("");
      
    const estimatedDeliveryTime = order.estimatedDeliveryTime;

    res.send(
      `<p>Order confirmation</p><ul>${items}</ul><p>Estimated delivery time: ${estimatedDeliveryTime}</p>`
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export {orders}
export default router;