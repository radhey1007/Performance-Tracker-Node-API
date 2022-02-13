const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
         type: String, required: true, trim: true 
    },
    contact:{
        type: String, required: true, trim: true
    },
    email:{
        type: String, 
        required: true,
        trim: true,
        match: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]/,
        unique:true
    },
    password:{
        type: String, required: true, trim: true
    },
    userType:{
        type: String, required: true, trim: true
    },
    isBatchAssigned:Boolean,
    isTaskAssigned:Boolean,
    adminCode:String,
    isSoftDelete:Boolean   
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema);