import Datastore from "nedb";
import { v4 as uuidv4 } from "uuid";

//Databas för menyn
const menu = new Datastore({ filename: "databases/menu.db", autoload: true });

//Funktion för att lägga till en produkt i menyn
const createMenuItem = (title, desc, price, callback) => {
  const itemId = uuidv4(); //Ger unikt id till produkt
  const createdAt = new Date().toLocaleString() //Lägger till datum och tid för när den skapats
  const newItem = { itemId, title, desc, price, createdAt };
  menu.insert(newItem, callback);
}; 

//Funktion för att hämta en produkt från databasen
const getMenuItem = (itemId, callback) => {
  menu.findOne({ itemId }, callback);
}; 

//Funktion för att validera den nya produkten
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

//Funktion för att validera redigering av en produkt
const validateItemEdit = (req, res, next) => {
  const {itemId, title, desc, price} = req.body; 
  const itemToEdit = menu.find({itemId: itemId}) //Här kontrolleras att den finns i databasen

  //Olika kontroler och felmeddelanden beroende på vad felet är
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

//Funcktion för att uppdatera en produkt
const updateItem = (itemId, origTitle, origDesc, origPrice, title, desc, price, callback) => {
    
  //skapar variabler för att sedan spara de antingen nya eller gamla värderna i dem
    let newTitle = ""
    let newDesc = ""
    let newPrice = ""
    let modifiedAt = new Date().toLocaleString()

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
      { $set: { title: newTitle, desc: newDesc, price: newPrice, modifiedAt: modifiedAt }}, //här sparas de nya/gamla värdena i databasen
      { new: true, returnUpdatedDocs: true }, 
      (err, numAffected, affectedDocuments) => { //i affectedDocuments ligger det item som uppdaterats som skickas tillbaka till admin
      if (err) {
          return callback(err, null);
      }
      callback(null, affectedDocuments);
  });

}; 

//Funktion för att ta bort en produkt from databasen
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
