const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
name:{
    type:String,
    require:[true,'name is require']
},
email:{
    type:String,
    require:[true,'email is require']
},
password:{
    type:String,
    require:[true,'password is require']
},
phone:{
    type:Number,
    require:[true,'password is require']
},
// newpassword:{
//     type:String,
//     require:[true,'password is require']
// },
// answer:{
// type: String,
// require:[true,'password is require'] 
// },
isAdmin:{
    type:Boolean,
    default:false,
},
isTeacher:{
    type:Boolean,
    default: false,
},
notification:{
    type:Array,
    default:[],
},
seennotification:{
    type:Array,
    default:[],
}
})

const userModel=mongoose.model('users',userSchema)

module.exports=userModel