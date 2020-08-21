const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const auth = require('./routers/auth')
const { handleError } = require("./helpers/error")
const DB_URL = 'mongodb://localhost:27017/faketwitterdb';

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

const port = 4000

app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // sup



app.use('/api/auth', auth)

app.use((err, req, res, next) => {

    handleError(err, res);
})

app.listen(port, () => {
    console.log(`app runing at http://localhost:${port}`);
})