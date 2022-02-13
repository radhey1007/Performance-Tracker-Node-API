const mongoose = require('mongoose');
const batchSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    batchName:{
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
    isBatchActive:Boolean
},{ timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);