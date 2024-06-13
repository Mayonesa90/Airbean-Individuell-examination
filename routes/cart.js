import express from 'express'
import nedb from "nedb-promise";
import session from "express-session"; // for handling user sessions - login status
import sessionMiddleware from '../middlewares/session.js';
import deleteItem from '../services/cartServices.js';

//Databases
import { menu } from '../models/menu.js'

const router = express.Router()

//Databas för cart
const cart = new nedb({ filename: "databases/cart.db", autoload: true });

router.use(
  session({
    secret: "this is the key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to make session variables accessible
router.use(sessionMiddleware);

//Användaren kan lägga i varukorgen
router.post("/", async (req, res) => {
  try {
      const orderId = req.body.id; //hämtar id från JSON body
      let menuItems = null // skapar en variabel och sätter till null
     
      menu.findOne({itemId: orderId}, (err, docs) => { //justerat så att funktionen hämtar från meny-databasen
   
        menuItems = docs //sparar datan som hittas i variabeln

        //extraherar titel och pris för att presentera för användaren
        const productTitle = menuItems.title;
        const productPrice = menuItems.price;

        //kontroll om den inte hittar data eller om den är tom, då får man ett felmeddelande
        if (!menuItems || menuItems.length === 0) {
          return res.status(404).send("The requested product could not be found");
        }

        //lägger in produkt i användarens cart
        cart.insert({
          userId: req.session.currentUser || "guest", //sparar användarId eller gäst om man inte är inloggad
          productId: menuItems.itemId,
          title: menuItems.title,
          price: menuItems.price,
          date: new Date().toLocaleDateString(), //sparar datum för beställning
        });

        //meddelandet som skickas till användaren
        res.send(
          `${productTitle} (${productPrice} kr) was successfully added to cart`
        );

      });

      } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });

// Cart/Varukorg - användaren får en överblick över vad som beställts
router.get("/", async (req, res) => {
    try {
      const cartItems = await cart.find(
        //hämtar det som finns i cart som är har användarid på den som är inloggad eller 'guest' om man inte är inloggad
        { userId: req.session.currentUser || 'guest'},
        (err, docs) => {}
      );
  
      let cartSummary = "Cart:\n";
      const itemPrice = cartItems.map((item) => item.price);
      const sum = itemPrice.reduce((partialSum, a) => partialSum + a, 0);

      // kontroll om order.db är tom, i så fall får man ett felmeddelande
      if (cartItems.length === 0) {
        return res.send("Cart is empty :/");
      }
  
      cartItems.forEach((cartItem) => {
        const productName = cartItem.title;
        const cartDate = cartItem.date;
        const cartPrice = cartItem.price;
  
        cartSummary += `<li>${cartDate}: ${productName}, ${cartPrice} kr</li>`;
      });
  
      res.send(cartSummary + `<p>Total: ${sum}kr</p>`);
  
      return cartItems;
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Delete item from cart endpoint
  router.delete("/:id", async (req, res) => {
    try {
      const itemId = req.params.id;
      const numRemoved = await deleteItem(itemId);
  
      if (numRemoved === 0) {
        return res.status(404).json({ message: "Item not found in cart" });
      }
  
      res.json({ message: `Item with id: ${itemId} successfully deleted from cart` });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });

// Rensa användarens kundvagn baserat på användar-ID
router.delete("/delete/:userId", (req, res) => {
    const { userId } = req.params;
  
    cart.remove({ userId: userId }, { multi: true }, (err, numRemoved) => {
      if (err) {
        return res.status(500).json({ error: "Failed to clear cart" });
      }
      res.json({ message: "User's cart cleared successfully", numRemoved });
    });
  });
  
export {cart}
export default router;
