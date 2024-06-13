
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


  export {validateItemCreation}