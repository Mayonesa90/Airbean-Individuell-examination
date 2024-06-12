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


const updateItem = (itemId, origTitle, origDesc, origPrice, title, desc, price, callback) => {
    
  //skapar variabler för att sedan spara de antingen nya eller gamla värderna i dem
    let newTitle = ""
    let newDesc = ""
    let newPrice = ""

    //kontroll om nytt värde kommit in och det uppfyller kraven, om inte sparas det gamla värdet i varibeln
    if (!title || typeof title !== "string" || title.trim() === "") {
      newTitle = origTitle
    } else {
      newTitle = title
    }

    if (!desc || typeof desc !== "string" || desc.trim() === "") {
      newDesc = origDesc
    } else {
      newDesc = desc
    }

    if (!price || typeof price !== "number") {
      newPrice = origPrice
    } else {
      newPrice = price
    }
    // console.log(newTitle, newPrice, newDesc, itemId);

    //uppdatering av det valda item
    menu.update(
      { itemId: itemId }, //här ser man till att den rätta varan uppdateras
      { $set: { title: newTitle, desc: newDesc, price: newPrice }}, //här sparas de nya/gamla värdena i databasen
      { new: true, returnUpdatedDocs: true }, 
      (err, numAffected, affectedDocuments) => { //i affectedDocuments ligger det item som uppdaterats som skickas tillbaka till admin
      if (err) {
          return callback(err, null);
      }
      callback(null, affectedDocuments);
  });

}; 


const deleteItem = (itemId, callback) => {
  menu.remove(
    {itemId: itemId}, {}, (err, numRemoved) => {
    if(err){
      return callback(err, null)
    }
    callback(null, numRemoved)
  })
}

export { createMenuItem, getMenuItem, validateItemCreation, validateItemEdit, updateItem, deleteItem, menu };
