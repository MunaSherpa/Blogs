const express = require('express')
const app = express();
const ejs = require('ejs')

const {sequelized, blog} = require ('./model/index')

const bcrypt = require ('bcrypt');
const { registerUser, loginUser, forgotPassword, otp} = require('./controller/authController');





app.use(express.json())
app.use(express.urlencoded({extended:true})) 

app.set('view engine', 'ejs')

app.get('/login', (req, res) => {
    // res.send("<h1> I am about page <h1>")
    res.render('login') // call from views folder indexfile
})

app.get('/register', (req, res) => {
    // res.send("<h1> I am about page <h1>")
    res.render('register') // call from views folder indexfile
})

app.post('/register', registerUser);

app.post('/login', loginUser);

app.get('/blogs', (req,res) => {
    res.render('Blogs')
})

app.get('/footer', (req,res) => {
    res.render('footer')
})

app.get('/forgotP', (req,res) => {
    res.render('forgotP') 
})

app.post('/forgetP', forgotPassword)

app.get('/otp', (req,res) => {
    res.render('otp') 
})

app.post('/otp', otp)

app.get('/home', (req,res) => {
    res.render('home') 
})






app.listen(3000, () => {
    console.log("Server started at post 3000") 
});