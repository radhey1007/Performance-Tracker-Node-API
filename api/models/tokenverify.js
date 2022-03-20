const mongoose = require('mongoose');
const tokenSchema = mongoose.Schema({
    // _userId:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'},
    _id:{type:mongoose.Schema.Types.ObjectId},
    token:{type:Number,required:true},
    email:{type:String,required:true},
    createdAt:{type:Date,required:true,default:Date.now},
    isStatus:{type:Boolean}
})

module.exports = mongoose.model('Token',tokenSchema);
