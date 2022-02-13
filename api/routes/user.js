const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

// Handle Incoming request for User
router.get('/',(req, res, next) => {
    User.find()
        .exec()
        .then(docs=> {            
            res.status(200).json(docs) 
        })
        .catch(err => {
            res.status(500).json({
                error:err
            })
        });
});

router.post('/',(req, res, next) => {
    User.find({email:req.body.email})
        .exec()
        .then(user=> {
            if(user.length >=1){
                return res.status(409).json({
                    message:'Mail already Exists'
                })   
            }
            else {
                bcrypt.hash(req.body.password , 10, (err,hash) => {
                    if(err){
                        return res.status(500).json({
                            error:err
                        })
                    } else {
                        const user = new User({
                            _id:new mongoose.Types.ObjectId(),
                            name:req.body.name,
                            contact:req.body.contact,
                            email:req.body.email,
                            password:hash,
                            userType:req.body.userType,
                            isBatchAssigned:req.body.isBatchAssigned,
                            isTaskAssigned:req.body.isTaskAssigned,
                            adminCode:req.body.adminCode,
                            isSoftDelete:req.body.isSoftDelete
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message:'User Registered Successfully.',
                                    response: result
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    error: error
                                });
                            }); 
                    }   
                });    
            }
        })
        .catch( err => {
            return res.status(500).json({
                error:err
            })
        })     
});

router.post("/login",(req, res, next) => {
    User.find({email:req.body.email}).exec()
    .then(user => {
            console.log('in login', user)
            if(user.length < 1){
                return res.status(401).json({
                    message:"Auth failed"
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err,result) => {
                    if(err){
                        return res.status(401).json({
                            message:"Auth failed"
                        })
                    }
                    if(result){
                       const token =  jwt.sign({
                            email:user[0].email,
                            _id:user[0]._id,
                        },process.env.JWT_KEY,
                         {
                           "expiresIn":"1h"  
                         });    
                        return res.status(200).json({
                            message:"Auth Successful",
                            token:token
                        })
                    } else {
                        return res.status(401).json({
                            message:"Auth failed"
                        })
                    }
                     
                })    
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            })
        }) 
});

router.get('/:userId',(req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .exec()    
        .then( doc => {
            if(doc){
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message:"Not a valid id :" + userId
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error:err
            })
        })   
});

router.delete('/:userId',checkAuth,(req, res, next) => {
    const userId = req.params.userId;
    User.remove({_id:userId})
        .exec()    
        .then( result => {
            res.status(200).json(result)           
        })
        .catch(err => {
            res.status(500).json({
                error:err
            })
        }) 
});


router.patch('/:userId', checkAuth , (req,res,next) => {
    let newvalues = {
        _id:req.body._id,
        name:req.body.name,
        contact:req.body.contact,
        email:req.body.email,
        password:req.body.password,
        userType:req.body.userType,
        isBatchAssigned:req.body.isBatchAssigned,
        isTaskAssigned:req.body.isTaskAssigned,
        adminCode:req.body.adminCode,
        isSoftDelete:req.body.isSoftDelete
    }; 
    let option = {new:true};  
    User.updateOne({ _id: req.body._id }, { $set: newvalues },option)
    .exec()
           .then(doc => {
                if(doc){
                   res.status(200).json({
                       response:doc,
                       message:'Record updated!'
                   });
                }
           })
           .catch(err=> {
                res.status(500).json({
                    error:err
                });
           });   
})


// Get User by User Type : Student | Teacher | Admin
router.post('/getUserByType',(req, res, next) => {
    const userType = req.body.userType;
    User.find({userType:userType})
        .exec()    
        .then(doc => {
            if(doc){
                res.status(200).json(doc);
            } else {
                console.log(err , 'errro');
                res.status(404).json({
                    message:"Not a valid id :"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            })
        })   
});



module.exports = router;