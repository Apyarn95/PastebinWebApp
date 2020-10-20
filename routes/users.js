const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')
//User model
const User = require('../models/User');
const Paste = require('../models/Paste');


//login page
router.get('/login',(req,res) => res.render('login'));


//Register page
router.get('/register',(req,res) => res.render('register'));


//Register Handle
router.post('/register',(req,res)=> {
    const {name,email,password,password2} = req.body;
    let errors = [];
    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg : 'Pleas fill i all fields'});
    }

    //check passwords match
    if(password2!=password){
        errors.push({msg : 'Passwords do not match'});
    }

    //check pass lenght
    if(password.lenght < 6){
        errors.push({msg:'Password should be atleast 6 characters'});
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });  
    }else{
        //Validation passed
        User.findOne({email:email})
        .then(user => {
            if(user){
               //User exists
               errors.push({msg:'Email is already registered'});
               res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            });   
            }else{
               const newUser = new User({
                   name,
                   email,
                   password
               });
              

               //Hash Password
               bcrypt.genSalt(10, (err,salt)=> 
                bcrypt.hash(newUser.password , salt , (err,hash)=>
               {
                    if(err) throw err;
                    //set password to hashed
                    newUser.password = hash;

                    //Save user
                    newUser.save()
                        .then(user=>{
                            req.flash('success_msg','You are now registered and can login')
                            res.redirect('login');
                        })
                        .catch(err=>console.log(err));
               }))
               
            }
        });
    }
});

//Login Handle
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});


//Logout Handle
router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login')
});

router.post('/paste',(req,res)=>{
    const {text,fname,key,name} = req.body
    console.log(req.body);
    let errors = [];
    //check required fields
    if(!text || !fname){
        errors.push({msg : 'Please fill the paste and the choose a file name'});
    }
    if(errors.length > 0){
        console.log(errors[0])
        // res.render('dashboard');  
    }else{
        //Validation passed
        Paste.findOne({name : name ,fname : fname})
        .then(user => {
            if(user){
               //User exists
               errors.push({msg:'File already exists'});
            //    res.render('dashboard');   
            }else{
               const newPaste = new Paste({
                   name,
                   fname,
                   text,
                   key
               });
              

               //Hash Password
               bcrypt.genSalt(10, (err,salt)=> 
                bcrypt.hash(newPaste.text , salt , (err,hash)=>
               {
                    if(err) throw err;
                    //set password to hashed
                    newPaste.text = hash;

                    //Save user
                    newPaste.save()
                        .then(user=>{
                            req.flash('success_msg','You are now registered and can login')
                            // res.render('dashboard');
                        })
                        .catch(err=>console.log(err));
               }))
               
            }
        });
    }

  
    
    
});

//create pastes
module.exports = router;
