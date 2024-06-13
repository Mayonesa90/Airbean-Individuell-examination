  import {cart} from '../routes/cart.js'
  
  // Helper function to delete an item from the cart
  export default async function deleteItem(id) {
    return cart.remove({ productId: id}, {}); //ändrade från id till productId
  }