const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Assignment = require('../models/assignment');
const checkAuth = require('../middleware/check-auth');


// Handle Incoming request for Batch
router.get('/',(req, res, next) => {
    Assignment.find()
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

router.post('/', checkAuth ,(req, res, next) => {
    const assignment = new Assignment({
        _id:new mongoose.Types.ObjectId(),
        assignmentName:req.body.assignmentName,
        batchName:req.body.batchName,
        batchId:req.body.batchId,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        userId:req.body.userId,
        userType:req.body.userType,
        courseName:req.body.courseName,
        courseId:req.body.courseId,
        isAssignmentActive:req.body.isAssignmentActive,
        description:req.body.description,
        assignmentStatus:req.body.assignmentStatus
    });
    assignment.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message:'Assignment Added Successfully.',
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

router.get('/:assignmentId',(req, res, next) => {
    const assignmentId = req.params.assignmentId;
    Assignment.findById(assignmentId)
        .exec()    
        .then( doc => {
            if(doc){
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message:"Not a valid id : " + assignmentId
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error:err
            })
        })   
});

router.delete('/:assignmentId',checkAuth , (req, res, next) => {
    const assignmentId = req.params.assignmentId;
    Assignment.remove({_id:assignmentId})
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


router.patch('/:assignmentId',checkAuth , (req,res,next) => {
    let newvalues = {
        _id:req.body._id,
        assignmentName:req.body.assignmentName,
        batchName:req.body.batchName,
        batchId:req.body.batchId,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        userId:req.body.userId,
        userType:req.body.userType,
        courseName:req.body.courseName,
        courseId:req.body.courseId,
        isAssignmentActive:req.body.isAssignmentActive,
        description:req.body.description,
        assignmentStatus:req.body.assignmentStatus
    }; 
    let option = {new:true};  
    Assignment.updateOne({ _id: req.body._id }, { $set: newvalues },option)
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


// Get Assignment by Batch Id
router.post('/getAssignmentByBatchId',(req, res, next) => {
    const batchId = req.body.batchId;
    Assignment.find({batchId:batchId})
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