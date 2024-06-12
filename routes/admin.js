import express from 'express'
import session from "express-session";
import { validateUserCreation } from "../middlewares/validation.js";
import { createAdmin, getAdminById, validateAdmin } from "../models/admin.js";
import { updateItem, createMenuItem, getMenuItem, validateItemCreation } from '../models/menu.js'
import requireAdminLogin from '../middlewares/requireAdminLogin.js';
import {menu} from '../models/menu.js'

//För att få ut datan från menyn
let menuItems = null
menu.find({}, (err, docs) => {
  menuItems = docs
  getMenuItems(menuItems)
});

function getMenuItems(){
  return menuItems
}

const router = express.Router()
  

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
  

  //Om användaren skapas framgångsrikt, returneras ett svar med användar-ID. Annars returneras ett felmeddelande.
  // Get user by ID
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
  
      req.session.userId = user.userId; // Spara användarens ID i sessionen
  
      req.session.currentAdminUser = user.userId; //sparar den aktuella användarens id så det går att nås från alla funktioner
      req.session.adminIsOnline = true; //ändrar variabeln till true
  
      res.send(
        `Admin was successfully logged in. Login status is: ${req.session.adminIsOnline}`
      );
    });
  });
  
  // Check login status
  router.get("/status", (req, res) => {
    res.send(`Login status is: ${req.session.adminIsOnline}`);
  });
  
  // Logout och specifik användares varukorg rensas
  router.post("/logout", requireAdminLogin, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(400).send("User ID is missing from session");
      }
  
      req.session.adminIsOnline = false;
      req.session.userId = null;
      // Logga ut användaren
  
      res.send(
        `Admin was successfully logged out. Login status is: ${req.session.adminIsOnline}.`
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to log out");
    }
  });

 
  //DELETE för att ta bort meny item
  //GET visa meny
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
  //Visa produkt från meny med item id som path parameter
  router.get('/:itemId', (req, res) => {
    const itemId = req.params.itemId
    getMenuItem(itemId, (err, item) => {
      if (err || !item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    });

  })

  router.put('/:itemId', requireAdminLogin, (req, res) => {
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



  //PATCH? för att redigera meny item

export default router;