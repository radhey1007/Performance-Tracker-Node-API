const mongoose = require('mongoose');
const assignmentSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    assignmentName:{
         type: String, required: true, trim: true 
    },
    startDate:{
        type: String, required: true, trim: true
    },
    endDate:{
        type: String, required: true, trim: true
    },
    userId:{
        type: String, required: true, trim: true
    },
    userType:{
        type: String, required: true, trim: true
    },
    courseName:{
        type: String, required: true, trim: true
    },
    courseId:{
        type: String, required: true, trim: true
    },
    batchName:{
        type: String, required: true, trim: true
    },
    batchId:{
        type: String, required: true, trim: true
    },    
    description: {
        type: String, required: true, trim: true
    },
    isAssignmentActive:Boolean,
    assignmentStatus:{
        type: String, trim: true
    }
},{ timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);