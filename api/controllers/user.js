const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const User = require('../models/user');
const Token = require('../models/tokenverify');

exports.getUserList = (req, res, next) => {
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
}

exports.registerUser = (req, res, next) => {
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
                                if(result){
                                    Token.find({email:req.body.email}).remove().exec().then(rem=>{
                                        console.log("removed");
                                    })
                                    var token = Math.floor(100000 + Math.random() * 900000)	
                                    sendEmail(req.body.email , token);   // dummy email send for account confirmation
                                    res.status(201).json({
                                        status:true,
                                        response: result
                                    });
                                }
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
}

exports.login = (req, res, next) => {
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
}

exports.getUserById = (req, res, next) => {
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
}

exports.deleteUser = (req, res, next) => {
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
}

exports.updateUser = (req,res,next) => {
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
}

exports.getUserByType = (req, res, next) => {
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
}

exports.forgot = (req,res,next)=> {
	User.find({email:req.body.email})
	.exec()
	.then((user)=>{
		if(user.length<1){
			return res.status(400).json({
				message: 'This Email does not exists in our records.',
                status:false
			});
		}
		else {
			User.find({email:req.body.email}).exec().then((userid)=>{
					console.log(userid);
					Token.find({email:req.body.email})
					.then((tokenuser)=>{
						var token = Math.floor(100000 + Math.random() * 900000)						
						if(tokenuser.length >=1){
							Token.updateOne(
								{email:req.body.email},
								{
									$set:{token:token,status:true},
									$currentDate:{lastModified:true}
								}
							).exec().then(updatetoken=>{
								console.log(token);
									sendEmail(userid[0].email, token);
										if(updatetoken){
											res.status(200).json({
												message:"token has been sent to email id for resetting password.",
												status:true,
												token:token,
												userid:userid[0]._id
											})
										}else{
											res.status(400).json({
												message:"Token does not send.Please try again.",
												status:false
											})
										}
								})
						}else{
							console.log(">>>>>>>.......");
							const newtoken = new Token({
								_id: new mongoose.Types.ObjectId(),
								token:token,
								email:req.body.email,	
								isStatus:false
							})
							newtoken.save().then(result=>{
									sendEmail(newtoken.email, token);
										if(result){
											console.log(result);
											res.status(200).json({
												message:"token has been sent to email id for resetting password.",
												status:true,
												token:token,
												userid:userid[0]._id
											})
										}else{
											res.status(400).json({
												message:"Token does not send.Please try again.",
												status:false
											})
										}
								})
						
						}
					})
			})
		}
	})
}

exports.resetPasssword = (req,res,next)=>{
		bcrypt.hash(req.body.password, 10, (err, hash) => {
				console.log(req.body._id);
				console.log(req.body.userid);
				User.updateOne(
					{_id:req.body._id},
					{
						$set:{password:hash,status:true},
						$currentDate:{lastModified:true}
					}
				).exec().then(updatepassword=>{
							if(updatepassword){
								return res.status(200).json({
									status:true,
									message:"Your password has been changed successfully. Please login"
								})
							}else{
								return res.status(400).json({
									status:false,
									message:"Invalid Error"
								})
							}
				},err=>{
					return res.status(500).json({
						status:false,
						message:err.error
					})
				})
		})
}

//sending a email while registor a user
sendEmail = (email,token) => {
	let transporter = nodeMailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'radhey94500@gmail.com',
			pass: 'zjsylznlkprxaimo'
		}
	});
	let mailOptions = {
		from: 'Radhey94500<radhey94500@gmail.com>', // sender address
		to: email, // list of receivers
		subject: 'Account Verification Token',
		text:
			'Hello,\n\n' +
			'Please verify your account from given code. \n\n' + token // Subject line
	};

	transporter.sendMail(mailOptions, (error, result) => {
		if (error) {
			return console.log(error);
		} else {
			result.status(200).json({
				message: 'A verification email has been sent to ' + email + '.',
				status: true
			});
		}
	});
};
