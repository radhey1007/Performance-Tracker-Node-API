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
            res.status(200).json({
                response:docs,
                status:true
            }) 
        })
        .catch(err => {
            res.status(500).json({
                error:err,
                status:false
            })
        });
});

router.post('/', checkAuth ,(req, res, next) => {

    console.log(req.body, '========================');

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
                response: result,
                status:true
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error:error,
                status:false
            });
        });    
});

router.get('/:assignmentId',(req, res, next) => {
    const assignmentId = req.params.assignmentId;
    Assignment.findById(assignmentId)
        .exec()    
        .then( doc => {
            if(doc){
                res.status(200).json({
                    status:false,
                    result:doc
                });
            } else {
                res.status(404).json({
                    message:"Not a valid id : " + assignmentId,
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

router.delete('/:assignmentId',checkAuth , (req, res, next) => {
    const assignmentId = req.params.assignmentId;
    Assignment.remove({_id:assignmentId})
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
   
})


// Get Assignment by Batch Id
router.post('/getAssignmentByBatchId',(req, res, next) => {
    const batchId = req.body.batchId;
    Assignment.find({batchId:batchId})
        .exec()    
        .then(doc => {
            if(doc){
                res.status(200).json({
                   response:doc,
                   status:true
                });
            } else {
                res.status(404).json({
                    message:"Not a valid id :",
                    status:false
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err,
                status:false
            })
        })   
});

module.exports = router;