import Datastore from "nedb";
import { v4 as uuidv4 } from "uuid";

const menu = new Datastore({ filename: "databases/menu.db", autoload: true });

const createMenuItem = (title, desc, price, callback) => {
  const itemId = uuidv4();
  const newItem = { itemId, title, desc, price };
  menu.insert(newItem, callback);
}; 

const getMenuItem = (itemId, callback) => {
  menu.findOne({ itemId }, callback);
}; 

const validateItemCreation = (req, res, next) => {
  const {title, desc, price} = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing title" });
  }
  if (!desc || typeof desc !== "string" || desc.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing desc" });
  }
  if (!price || typeof price !== "number") {
    return res.status(400).json({ error: "Invalid or missing price" });
  }
  next()

};

const validateItemEdit = (req, res, next) => {
  const {itemId, title, desc, price} = req.body;
  console.log(itemId);
  const itemToEdit = menu.find({itemId: itemId})
  console.log(itemToEdit)
  if(!itemToEdit){
    return res.json({error: `The item with id ${itemId} could not be found`})
  }
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing title" });
  }
  if (!desc || typeof desc !== "string" || desc.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing desc" });
  }
  if (!price || typeof price !== "number") {
    return res.status(400).json({ error: "Invalid or missing price" });
  }
  next()

};

const createEditedItem = (itemId, title, desc, price, callback) => {
  const editedItem = { itemId, title, desc, price };
  const itemToEdit = menu.find({itemId: itemId})
  menu.update({itemToEdit}, { $set: {editedItem} })

}; 

export { createMenuItem, getMenuItem, validateItemCreation, validateItemEdit, createEditedItem, menu };
