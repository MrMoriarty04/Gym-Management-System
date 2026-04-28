const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 name:{type:String ,required:true},
 email:{type:String ,required:true},
 password:{type:String ,required:true},
 role:{type:String,enum: ['Admin', 'Coach', 'Trainee'], default: 'Trainee'},
 otp  :{type:String},
 otpExpires:{type:Date},
 coachId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User' ,
  default: null
},
subscription: {
    plan: { type: Number, enum: [1, 3, 6, 12] },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false }
  }
}, 
{ timestamps: true }); 

module.exports = mongoose.model('User', userSchema);