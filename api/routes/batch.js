const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Batch = require('../models/batch');
const checkAuth = require('../middleware/check-auth');


// Handle Incoming request for Batch
router.get('/',(req, res, next) => {
    Batch.find()
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

router.post('/',checkAuth,(req, res, next) => {
    const batch = new Batch({
        _id:new mongoose.Types.ObjectId(),
        batchName:req.body.batchName,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        userId:req.body.userId,
        userType:req.body.userType,
        courseName:req.body.courseName,
        courseId:req.body.courseId,
        isBatchActive:req.body.isBatchActive,
    });
    batch.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message:'Batch Added Successfully.',
                response: result
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });    
});

router.get('/:batchId',(req, res, next) => {
    const batchId = req.params.batchId;
    Batch.findById(batchId)
        .exec()    
        .then( doc => {
            if(doc){
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message:"Not a valid id : " + batchId
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error:err
            })
        })   
});

router.delete('/:batchId',checkAuth,(req, res, next) => {
    const batchId = req.params.batchId;
    Batch.remove({_id:batchId})
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


router.patch('/:batchId',checkAuth,(req,res,next) => {
    let newvalues = {
        _id:req.body._id,
        batchName:req.body.batchName,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        userId:req.body.userId,
        userType:req.body.userType,
        courseName:req.body.courseName,
        courseId:req.body.courseId,
        isBatchActive:req.body.isBatchActive,
    }; 
    let option = {new:true};  
    Batch.updateOne({ _id: req.body._id }, { $set: newvalues },option)
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
router.post('/getBatchByCourseID',(req, res, next) => {
    const courseId = req.body.courseId;
    Batch.find({courseId:courseId})
        .exec()    
        .then(doc => {
            if(doc){
                res.status(200).json(doc);
            } else {
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