import express from 'express'
import bodyParser from 'body-parser';

const app = express()
const PORT = 4000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/index', (req, res) => {
    res.json()
})



app.listen(PORT, () => {
    console.log('index server is running');
})

