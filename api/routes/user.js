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
            res.status(200).json({
                status:true,
                response:docs
            }) 
        })
        .catch(err => {
            res.status(500).json({
                status:false,
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
                    message:'Mail already Exists',
                    status:false
                })   
            }
            else {
                bcrypt.hash(req.body.password , 10, (err,hash) => {
                    if(err){
                        return res.status(500).json({
                            error:err,
                            status:false
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
                                    status:true,
                                    response: result
                                });
                            })
                            .catch(error => {
                                res.status(500).json({
                                    error: error,
                                    status:false
                                });
                            }); 
                    }   
                });    
            }
        })
        .catch( err => {
            return res.status(500).json({
                error:err,
                status:false
            })
        })     
});

router.post("/login",(req, res, next) => {
    User.find({email:req.body.email}).exec()
    .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message:"Auth failed",
                    status:false
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err,result) => {
                    if(err){
                        return res.status(401).json({
                            message:"Auth failed",
                            status:false
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
                            token:token,
                            status:true,
                            response:user
                        })
                    } else {
                        return res.status(401).json({
                            message:"Auth failed",
                            status:false
                        })
                    }
                     
                })    
            }
        })
        .catch(err => {
            res.status(500).json({
                error:err,
                status:false
            })
        }) 
});

router.get('/:userId',(req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .exec()    
        .then( doc => {
            if(doc){
                res.status(200).json({
                    response:doc,
                    status:true
                });
            } else {
                res.status(404).json({
                    response:[],
                    status:false
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error:err,
                status:false
            })
        })   
});

router.delete('/:userId',checkAuth,(req, res, next) => {
    const userId = req.params.userId;
    User.remove({_id:userId})
        .exec()    
        .then( result => {
            res.status(200).json({
                response:result,
                status:true
            })           
        })
        .catch(err => {
            res.status(500).json({
                error:err,
                status:false
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

    bcrypt.hash(req.body.password , 10, (err,hash) => {
        if(err){
            return res.status(500).json({
                error:err,
                status:false
            })
        } else {
            newvalues.password = hash;
            let option = {new:true};  
            User.updateOne({ _id: req.body._id }, { $set: newvalues },option)
            .exec()
            .then(doc => {
                    if(doc){
                    res.status(200).json({
                        response:doc,
                        message:'Record updated!',
                        status:true
                    });
                    }
            })
           .catch(err=> {
                res.status(500).json({
                    error:err,
                    status:false
                });
           });  
        }
    });     
})


// Get User by User Type : Student | Teacher | Admin
router.post('/getUserByType',(req, res, next) => {
    const userType = req.body.userType;
    User.find({userType:userType})
        .exec()    
        .then(doc => {
            if(doc){
                res.status(200).json({
                    status:true,
                    response:doc
                });
            } else {
                res.status(404).json({
                    message:"Not a valid id",
                    response:[],
                    status:false,
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err,
                status:false,
            })
        })   
});



module.exports = router;