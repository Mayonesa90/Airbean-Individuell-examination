import express from 'express'
import session from "express-session";
import validateUserCreation from "../middlewares/userValidation.js";
import { validateItemCreation } from '../middlewares/menuValidation.js'
import { validateItemEdit } from '../middlewares/editValidation.js';
import requireAdminLogin from '../middlewares/requireAdminLogin.js';
import { createAdmin, getAdminById, validateAdmin } from "../models/admin.js";
import { updateItem, createMenuItem, getMenuItem, deleteItem } from '../models/menu.js'
import { createOffers } from '../models/offers.js';

//Databases
import { menu } from '../models/menu.js'

const router = express.Router()

//För att få ut datan från menyn
let menuItems = null
menu.find({}, (err, docs) => {
  menuItems = docs
  getMenuItems(menuItems)
});

function getMenuItems(){
  return menuItems
}

// Skapar admin och returnerar admin-ID
router.post("/register", validateUserCreation, (req, res) => {
  const { username, password } = req.body;
  createAdmin(username, password, (err, user) => {
    if (err) {
      // Om det uppstår ett fel
      return res.status(500).json({ error: "Failed to create user" }); // Skicka ett felmeddelande: false
    }
    res.status(201).json({ userId: user.userId }); // Skicka användar-ID om inget fel uppstår: true
  });
});
  

//Om admin skapas framgångsrikt, returneras ett svar med id. Annars returneras ett felmeddelande.
router.get("/admin/:userId", (req, res) => {
  const { adminId } = req.params;
  getAdminById(adminId, (err, user) => {
    if (err || !user) {
       return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });
});
  
// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  validateAdmin(username, password, (err, user) => {
    if (!user) {
      res.status(401).send("Username or password was incorrect");
      return;
    }
  
    req.session.currentAdminUser = user.userId; //sparar den aktuella användarens id så det går att nås från alla funktioner
    req.session.adminIsOnline = true; //ändrar variabeln till true
    
    res.send(
      `Admin login: ${user.username} was successfully logged in.`
    );
  });
});
  
// Check login status
router.get("/status", (req, res) => {
  res.send(`Login status is: ${req.session.adminIsOnline}`);
});
  
// Logga-ut funktion tll admin
router.post("/logout", requireAdminLogin, async (req, res) => {
  try {

    const userId = req.session.currentAdminUser;
    //Kontroll om användarId inte finns
    if (!userId) {
      return res.status(400).send("User ID is missing from session");
    }

    // Logga ut admin
    req.session.adminIsOnline = false;
    req.session.currentAdminUser = null;
  
    res.send(
      `Admin was successfully logged out. Login status is: ${req.session.adminIsOnline}.`
    );

    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to log out");
    }
  });

 
  //POST för att skapa meny-item
  router.post('/create-item', requireAdminLogin, validateItemCreation, (req, res) => {
        
      const { title, desc, price } = req.body;

      createMenuItem(title, desc, price, (err, menu) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create menu item" }); // Skicka ett felmeddelande: false
        } else {
          res.status(201).json({ itemId: menu.itemId }); // Skicka menu-ID om inget fel uppstår: true
        }
      })
  })

  //GET produkt från meny med itemId som path parameter
  router.get('/:itemId', (req, res) => {
    const itemId = req.params.itemId
    getMenuItem(itemId, (err, item) => {
      if (err || !item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    });

  })

  //PUT - redigera item med itemId som path parameter och ändringar i JSON body
  router.put('/:itemId', requireAdminLogin, validateItemEdit, (req, res) => {
    const itemId = req.params.itemId

    getMenuItem(itemId, (err, item) => {
      if (err || !item) {
        return res.status(404).json({ error: "Item not found" });
      }
    
    const origTitle = item.title
    const origDesc = item.desc
    const origPrice = item.price

    const {title, desc, price} = req.body

    updateItem(itemId, origTitle, origDesc, origPrice, title, desc, price, (err, updatedItem) => {
      if (err || !updatedItem){
        return res.status(404).json({ error: "Item could not be edited" });
      }
      res.json(updatedItem)
    })
  })
})

//DELETE - ta bort item med itemId som pathparameter
router.delete('/:itemId', requireAdminLogin, (req, res) => {
  const itemId = req.params.itemId

  getMenuItem(itemId, (err, item) => {
    if (err || !item) {
      return res.status(404).json({ error: "Item not found" });
    }
  
    deleteItem(itemId, (err, numRemoved) => {
      if(err || !numRemoved){
      return res.status(404).json({error: 'Item could not be deleted'})
    }
    res.json(`Number of items removed: ${numRemoved}. Item with id ${itemId} successfully deleted`)
    })

  })

})

//POST - lägg till kampanjerbjudanden
router.post('/special-offers', requireAdminLogin, (req, res) => {
  const {item1, item2} = req.body

  getMenuItem(item1, (err, item1) => {
    if (err || !item1) {
      return res.status(404).json({ error: "Item1 not found" });
    }
    getMenuItem(item2, (err, item2) => {
      if (err || !item2) {
        return res.status(404).json({ error: "Item2 not found" });
      }
      //Skapa variabler för att lägga in pris från produkterna
      const priceForBoth = (item1.price + item2.price) * 0.8
      const discount = (item1.price + item2.price) * 0.2
      createOffers(item1, item2, priceForBoth, discount, (err, docs) => {
        if(err){
          return res.status(500).json({error: 'Offer could not be created'})
        }
        res.json(docs)
      })
    });
  });
})

export default router;