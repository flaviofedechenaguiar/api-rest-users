const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./database/database.js');

const userRoute = require('./routes/user.router.js');
const authenticationRoute = require('./routes/authentication.router.js');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/auth', authenticationRoute);
app.use('/users', userRoute);

connection.authenticate()
    .then(() => {
        console.log('Banco de Dados conectado');
    })
    .catch((err) => {
        console.log('Error: ', err);
    });

module.exports = app;