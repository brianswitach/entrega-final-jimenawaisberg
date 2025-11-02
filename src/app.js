const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passport-config');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const indexRouter = require('./routes/index');
const userRoutes = require('./routes/users');

const app = express();

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));


app.use(session({
    secret: 'secret', 
    resave: false,
    saveUninitialized: false
}));


initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', userRoutes);  
app.use('/', indexRouter);


mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to Database');
        app.listen(8080, () => {
            console.log('Server is running on port 8080');
        });
    })
    .catch(err => console.error(err));

module.exports = app;
