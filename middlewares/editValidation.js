//Funktion för att validera den redigerade produkten
const validateItemEdit = (req, res, next) => {
    const {title, desc, price} = req.body;
    
    if(title && desc && price) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing title" });
          }
        if (typeof desc !== "string" || desc.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing desc" });
          }
        if (typeof price !== "number") {
            return res.status(400).json({ error: "Invalid or missing price" });
          }
    }

    if(title && desc) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing title" });
          }
        if (typeof desc !== "string" || desc.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing desc" });
          }
    }

    if(desc && price) {
        if (typeof desc !== "string" || desc.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing desc" });
          }
        if (typeof price !== "number") {
            return res.status(400).json({ error: "Invalid or missing price" });
          }
    }

    if(title && price) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing title" });
          }
        if (typeof price !== "number") {
            return res.status(400).json({ error: "Invalid or missing price" });
          }
    }

    if(title) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing title" });
          }
    }

    if(desc) {
        if (typeof desc !== "string" || desc.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing desc" });
          }
    }

    if(price) {
        if (typeof price !== "number") {
            return res.status(400).json({ error: "Invalid or missing price" });
          }
    }

    next()
  
  };


  export {validateItemEdit}