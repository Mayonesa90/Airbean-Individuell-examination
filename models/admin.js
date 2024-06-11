import Datastore from "nedb";
import { v4 as uuidv4 } from "uuid";

const adminDb = new Datastore({ filename: "databases/admin.db", autoload: true });

const createAdmin = (username, password, callback) => {
  const userId = uuidv4();
  const newUser = { userId, username, password };
  adminDb.insert(newUser, callback);
}; 

const getAdminById = (userId, callback) => {
  adminDb.findOne({ userId }, callback);
}; 

const validateAdmin = (username, password, callback) => {
  adminDb.findOne({ username: username, password: password }, callback);
};

export { createAdmin, getAdminById, validateAdmin };
