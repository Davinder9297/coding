import express from 'express';
const app = express();
import {router} from './routers/routes.js'
import bodyParser from 'body-parser';
import cors from 'cors'

const PORT = process.env.PORT || 3000; // Define a default port if not specified in environment variables

app.get('/', (req, res) => {
    res.send("Home Page");
});
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api',router)
app.listen(8080, () => console.log('Server running on port 8080'));
