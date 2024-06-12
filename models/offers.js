import Datastore from "nedb";
import { v4 as uuidv4 } from "uuid";
import { menu } from './menu.js'

const offers = new Datastore({ filename: "databases/offers.db", autoload: true });

const createOffers = (item1, item2, callback) => {
    const offerId = uuidv4();
    const price= 40
    const createdAt = new Date().toLocaleString() //Lägger till datum och tid för när den skapats
    const newOffer = { offerId, item1, item2, price, createdAt };
    offers.insert(newOffer, callback);
}; 

// const validateItemsInOffer = (req, res, next) => {
//     const {item1, item2} = req.body;
    
//     menu.find({itemId: })

// }

export {createOffers}