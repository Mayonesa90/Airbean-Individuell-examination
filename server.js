import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import axios from "axios";

import homeRouter from "./routes/home.js";
import aboutRouter from "./routes/about.js";
import orderRouter from './routes/order.js'
import cartRouter from './routes/cart.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'

import sessionMiddleware from "./middlewares/session.js";

const app = express();
const PORT = 8000;
const INDEX_URL = "http://localhost:4000"


//Middlewares
app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Session configuration - needed for login functionality
app.use(
  session({
    secret: "this is the key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to make session variables accessible
app.use(sessionMiddleware);

// Routes
// app.use('/', homeRouter)
app.get("/", async(req, res) => {
  try {
    const response = await axios.get(`${INDEX_URL}/index`)
    res.render('index.ejs', response)
  } catch (error) {
    res.status(500).json({message: 'Error fetching page'})
  }
});

app.use('/about', aboutRouter)
app.use('/order', orderRouter)
app.use('/cart', cartRouter)
app.use('/account', authRouter)
app.use('/admin', adminRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
