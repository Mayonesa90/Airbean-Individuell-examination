import Datastore from "nedb";
import { v4 as uuidv4 } from "uuid";

//Databas för administratörer
const adminDb = new Datastore({ filename: "databases/admin.db", autoload: true });

//Funktion för att skapa en admin
const createAdmin = (username, password, callback) => {
  const userId = uuidv4();
  const newUser = { userId, username, password };
  adminDb.insert(newUser, callback);
}; 

//Funktion för att hämta en admin baserat på id
const getAdminById = (userId, callback) => {
  adminDb.findOne({ userId }, callback);
}; 

//Funktion för att validera att användarnamn och lösenord finns i databasen
const validateAdmin = (username, password, callback) => {
  adminDb.findOne({ username: username, password: password }, callback);
};

export { createAdmin, getAdminById, validateAdmin };
