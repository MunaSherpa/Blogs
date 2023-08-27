const express = require('express')
const app = express();
const ejs = require('ejs')

const {sequelized, blog, blogs, users} = require ('./model/index')

const bcrypt = require ('bcrypt');
const { registerUser, loginUser, forgotPassword, otp, blogForm, homeBlogs, getBlogByID,  deleteBlog, editBlog, update, myBlog} = require('./controller/authController');


const { multer, storage } = require("./services/multerConfig");
const { isAuthenticated } = require('./services/isAuthenticated');
const upload = multer({ storage: storage });


app.use(express.json())
app.use(express.urlencoded({extended:true})) 

app.use(express.static("uploads")); // databasema null ako thauma link datakacha
app.use(require('cookie-parser')()) ;

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

app.get('/blog', (req,res) => {
    res.render('blog') 
})

app.post('/blog', isAuthenticated, upload.single("image"), blogForm) //upload.single('image') is middleware

app.get('/home', homeBlogs) // homepage many blog
 
app.get('/singleBlog/:id', getBlogByID) // single blog

app.get('/delete/:id', deleteBlog)

app.get('/edit/:id', editBlog)

app.post('/edit/:id', upload.single("image"), update)

app.get('/myBlog',isAuthenticated, myBlog)





app.listen(3000, () => {
    console.log("Server started at post 3000") 
});