import express from 'express'
import nedb from "nedb-promise";
import session from "express-session"; // for handling user sessions - login status
// import path, {dirname} from 'path'
// import { fileURLToPath } from "url";
// import { validateMenu } from '../models/menu.js';
// import { validateMenu, validatePrice } from '../middlewares/validation.js';
// import menu from "../models/coffeeMenu.js";
import { menu } from '../models/menu.js'
import { cart } from './cart.js'
const router = express.Router()
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const orders = new nedb({ filename: "databases/orders.db", autoload: true });
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
router.use((req, res, next) => {
  if (typeof req.session.isOnline === "undefined") {
    req.session.isOnline = false;
  }
  next();
});

router.use((req, res, next) => {
  if (typeof req.session.adminIsOnline === "undefined") {
    req.session.adminIsOnline = false;
  }
  next();
});


  //DELETE för att ta bort meny item
  //GET visa meny
  //POST för att skapa meny-item
  //PATCH? för att redigera meny item
  
  //Meny
router.get("/", async (req, res) => {
  try {
      getMenuItems()
      res.send(menuItems)

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal server error");
  }
  // try {
  //   const showMenu = menu.find({});
  //   console.log(showMenu);
  //   res.send(showMenu)

  // } catch (error) {
  //   res.send('Something went wrong')
  //   console.log(error);
  // }
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

    // Create an order
    const order = {
      userId: req.session.currentUser || 'guest',
      items: currentUserCart,
      estimatedDeliveryTime,
    };

    // Insert the order into the orders database
    await orders.insert(order); //på något sätt måste man få tillbaka orderid härifrån och skicka till användaren
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
    const order = await orders.findOne({ _id: orderId });

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