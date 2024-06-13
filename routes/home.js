import express from 'express'
import axios from "axios";
import bodyParser from 'body-parser';
const router = express.Router()
const INDEX_URL = "http://localhost:4000"

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/index", async(req, res) => {
    // res.sendFile(path.join(__dirname, "../public/index.html"));
    try {
      const response = await axios.get(`${INDEX_URL}/index`)
      console.log(response);
      res.render('index.ejs', response)
    } catch (error) {
      res.status(500).json({message: 'Error fetching page'})
    }
  });

  export default router;