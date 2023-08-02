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



exports.blogForm = async(req, res) =>{ // create blog form ko garako

    const { title, description, image} = req.body
    console.log(req.body)
    await blogs.create({  // index ko blogs ko name blogs.create dako
     title: title,
     description: description,
     image:null,
    })
    console.log(title, description, image)
    res.redirect('home')
 }