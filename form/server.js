const express = require('express');
const exphbs  = require('express-handlebars');

const {
    PORT
} = process.env;


var app = express();

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(PORT || 8080);