const { users, blogs } = require("../model");
const bcrypt = require('bcrypt');
const sendEmail = require("../services/sendEmail");

exports.registerUser = async(req, res)=>{

    const {email, user,  password} = req.body
    
    const existingUser = await users.findAll({
        where:{
            email: email
           }
    });
console.log(existingUser)
    if (existingUser.length !== 0){
        res.render('error.ejs')
    }else{
        await users.create({ 
            name: user,
            email: email,
            password: bcrypt.hashSync(password,10)
    })
        console.log(email, user, password);
        res.redirect('/login')
    }

}


exports.loginUser = async(req, res) =>{
    const jwt = require('jsonwebtoken')
   
    
   
    const {email, password}= req.body
    const userExist = await users.findAll({ // findall check the data matching provide mail in database
       where:{
        email: email
       }
    })

    if(userExist.length == 0)
    {
        res.render('error.ejs')
    }else{
        // console.log(userExist[0].Password)
        // console.log(password)
        const isPasswordCorrect =  bcrypt.compareSync(password,userExist[0].password)
        if(isPasswordCorrect){
    const token =  jwt.sign({id:userExist[0].id},"hello") //hello is jwt secret key and {id:userExist[0].id} is jwt payload
    res.cookie("token",token)
    console.log(token)
            res.redirect('/home') 

        }else{
            res.redirect('/login')
        }
    }
    
    console.log(userExist)

}

exports.forgotPassword = async(req, res)=>{
    console.log(req.body)
    const {email} = req.body
    const otp = Math.floor(Math.random() * 9000) + 1000; // generates a random 4 digit OTP

     const userExist = await users.findAll( {
        where:{
            email: email,
        }
    } ) 
    if(userExist.length == 0)

     {
        res.render('error.ejs')
     }else{
        userExist[0].otp = otp
        await userExist[0].save()
        await sendEmail({
            email: email,
            subject: 'forgotPassword',
            otp:otp
        })
        
        res.render('otp') 
     }

}

exports.otp = async(req, res) =>{
    console.log(req.body,"Inside Otp")
    const {otp, password} = req.body;
    console.log(otp)
    const match = await users.findAll({
       where: {
        otp: otp
       }
        }
            ) 
            if (match.length == 0){
               
                res.render('error.ejs')
            }else{
                match[0].password = bcrypt.hashSync(password,8)
                await match[0].save()
                res.redirect('/login')
            }
}



exports.blogForm = async(req, res) =>{ // create  add blog form ko garako

    const { title, description, image} = req.body
    console.log(req.id)
    console.log(req.file)
    await blogs.create({  // index ko blogs ko name blogs.create dako
     title: title,
     description: description,
     image:"http://localhost:3000/"+req.file.filename, //database ma link dakaucha ani tho link copy garo vana browser ma dakaucha
     userId: req.userId // to show the user id in database
    })
    console.log(title, description, image)
    res.redirect('/home')
 }



 exports.homeBlogs = async(req, res) =>{ // many blogs dakauna
    const blogss = await blogs.findAll({
        include: users
    })
    console.log(blogss)
 
    res.render('home',{blogss}) // file ko name dako
 }



 exports.getBlogByID = async(req, res) =>{ // single blog dakaucha
 

   const blogId = await blogs.findAll({
       where:{
           id:req.params.id

       }, include: users
       
   });
   res.render('singleBlog', {blogId});
   
}

exports.deleteBlog = async(req, res) => {
    const deleteBlog = await blogs.destroy({
        where:{
            id:req.params.id
        }
    });
    res.redirect('/home') // redirect la change gara pataucha
} 


exports.editBlog = async(req, res) => {
    const blogEdit = await blogs.findAll({
       where:{
        id:req.params.id
       } 
    })
    res.render('edit',{blogEdit})
}


exports.update = async(req, res) => {
    console.log(req.file)
    let file;
    const blog = await blogs.findAll({where:{
        id : req.params.id
    }})
    if(req.file){
file = "http://localhost:3000/" + req.file.filename // current image yeti aayo vaney

    }else{
        file = blog[0].image // aayena vaney past ma j xa tehi hunchha
    }
    const updateBlog = await blogs.update({
        title:req.body.title,
        description:req.body.description,
        image:file,
    }, {
        where:{
            id:req.params.id
        }
    })
    res.redirect('/singleBlog/' + req.params.id)
}

exports.myBlog = async(req, res) =>{ 
    console.log(req.userId)
    const blogss = await blogs.findAll({
        where:{
            userId: req.userId
        },
        include: users
    })
    console.log(blogss)
 
    res.render('myBlog',{blogss}) // file ko name dako
 }