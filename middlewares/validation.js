import menu from "../models/coffeeMenu.js";
const validateUserCreation = (req, res, next) => {
  //Funktionen validateUserCreation tar tre argument: req (request), res (response) och next.
  const { username, password } = req.body;
  //Destructuring används för att plocka ut username från req.body.

  if (!username || typeof username !== "string" || username.trim() === "") {
    // Funktionen kontrollerar om username är giltigt (inte tomt, är en sträng, och inte bara mellanslag).
    return res.status(400).json({ error: "Invalid username" });
    // Om username inte är giltigt: returnerar ett felmeddelande.
  }
  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ error: "Invalid password" });
  }

  next();
  // Om username är giltigt: går vidare till nästa middleware eller funktion med next().
};


const validatePrice = (req, res, next) => {
  const { id } = req.body;
  const selectedProduct = menu.find((product) => product.id === id);

  if (!selectedProduct) {
    return res.status(404).send("The requested product could not be found");
  }

  if (typeof selectedProduct.price !== "number" || selectedProduct.price <= 0) {
    return res.status(400).send("Invalid product price");
  }

  next();
};
export { validateUserCreation, validatePrice };
