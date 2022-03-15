const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const port = 4000;
const mongoose = require('mongoose');
// setup session
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);

const fileUpload = require('express-fileupload');


// using file upload , it adds a new property to request called files
app.use(fileUpload());

// connect to db 
mongoose.connect('mongodb://localhost:27017/e-commerce').then(() => console.log('connect to DB success'))

// defined session 
const STORE = new sessionStore({
    uri: 'mongodb://localhost/e-commerce',
    collection: 'sessions' // sessions will be saved in this collection
});
// use session
app.use(session({
    secret: 'this is session for me !!',
    saveUninitialized: false,
    resave: true,
    store: STORE,
    cookie: {
        maxAge: 24 * 60 * 60 * 100
    }
}));

app.use(express.json())
// defined static file('public')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'DBimages')));



//using flash session to display notifications alerts
const flash = require('connect-flash');
app.use(flash());

// setup template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Routing 
app.use('/', require('./routes/home'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/admin', require('./routes/admin/admin'));
// app.use('/admin', require('./routes/admin/mangProducts'));
app.use('/card', require('./routes/card'));
app.use('/product', require('./routes/products'));
app.use('/orders', require('./routes/orders'))
app.all('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
        res.locals
    })
})




app.listen(port, console.log(`server Ready at ${port}`))
