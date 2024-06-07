import express, { response } from 'express'
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import bodyParser from 'body-parser';

const router = express.Router()
const URL = 'http://localhost:8000'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.use(express.static('public'))
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", async(req, res) => {
    // res.sendFile(path.join(__dirname, "../public/index.html"));
    try {
      const reponse = await axios.get(`${URL}`)
      console.log(response);
      res.render('index.ejs', response)
    } catch (error) {
      res.status(500).json({message: 'Error fetching page'})
    }
  });

  export default router;