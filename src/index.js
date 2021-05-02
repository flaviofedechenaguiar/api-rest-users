const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./database/database.js');

const userRoute = require('./routes/user.router.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', userRoute);

connection.authenticate()
    .then(() => {
        console.log('Banco de Dados conectado');
    })
    .catch((err) => {
        console.log('Error: ', err);
    });

module.exports = app;