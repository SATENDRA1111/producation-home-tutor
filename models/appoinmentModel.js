const mongoose =require('mongoose')

const appointmentSchema=new mongoose.Schema({
 

    userId:{
        type: String,
        required:true
    },
    teacherId:{
        type: String,
        required:true
    },
    teacherInfo:{
        type:String,
        required:true
    },
    userInfo:{
        type: String,
        required:true
    },

   
    name:{
        type:String,
        require:true,
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
    

},{timestamps:true}
);

const appointmentModel=mongoose.model('appointments',appointmentSchema)

module.exports=appointmentModel;