import express, {Router} from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import bodyParser from "body-parser";
import session from "express-session";

import homeRouter from "./routes/home.js";
import aboutRouter from "./routes/about.js";
import orderRouter from './routes/order.js'
import cartRouter from './routes/cart.js'
import authRouter from './routes/auth.js'

import sessionMiddleware from "./middlewares/session.js";

const app = express();
const router = Router()
const PORT = 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const URL = 'http://localhost:8000'

//Middlewares
app.use(express.static('public'))
app.use("/", router);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
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
app.use('/', homeRouter)
app.use('/about', aboutRouter)
app.use('/order', orderRouter)
app.use('/cart', cartRouter)
app.use('/account', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
