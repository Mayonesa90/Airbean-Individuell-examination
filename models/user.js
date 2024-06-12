import Datastore from "nedb";
import { v4 as uuidv4 } from "uuid";

//Databas för användare
const userDb = new Datastore({ filename: "databases/users.db", autoload: true });

//Funktione för att skapa en ny användare i databasen
const createUser = (username, password, callback) => {
  const userId = uuidv4();
  const newUser = { userId, username, password, orders: [] };
  userDb.insert(newUser, callback);
}; 

// Funktion för att hämta en användare från databasen baserat på användar-ID.
const getUserById = (userId, callback) => {
  userDb.findOne({ userId }, callback);
}; 

// Funktion för att validera att användarnamn och lösenord finns i databasen
const validateUser = (username, password, callback) => {
  userDb.findOne({ username: username, password: password }, callback);
};

export { createUser, getUserById, validateUser };
