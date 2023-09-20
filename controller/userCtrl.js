
const userModel = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const {comparePassword,hashPassword}= require( "./fogetpassword");
const jwt = require("jsonwebtoken");
const teacherModel = require("../models/teacherModel");
const appointmentModel = require("../models/appoinmentModel");
const moment =require("moment")


//register callback
const registerController = async (req, res) => {
    try {
        const exisitingUser = await userModel.findOne({ email: req.body.email });
        if (exisitingUser) {
            return res
                .status(200)
                .send({ message: "User Already Exist", success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: "Register Sucessfully", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Register Controller ${error.message}`,
        });
    }
};

// login callback


const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ message: "user not found", success: false });
        }
       
        // const isMatch = await bcrypt.compare(req.body.password, user.password);
        const isMatch = await comparePassword(req.body.password, user.password);
        if (!isMatch) {
            return res
                .status(200)
                .send({ message: "Invlid EMail or Password", success: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).send({ message: "Login Success", success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
};

//forgetPasswordController
//  const forgetPasswordController=async(req,res)=>{
//     try {
//         const {email,answer, newPassword}=req.body
//         if(!email){
//             res.status(400).send({
//                 message:'email is required'
//             })
//            }

//            if(!answer){
//             res.status(400).send({
//                 message:'Answer is required'
//             })
//            }

//            if(!newPassword){
//             res.status(400).send({
//                 message:'New Password is  Required'
//             })
//         //check
//         const user =await userModel.findOne({email,answer});
//         //validation
//         if(!user){
//             return res.status(404).send({
//                 success:false,
//                 message:"Wrong Email or Answer"
//             })
//         }
        
//         const hashed =await hashPassword(newPassword);
//         await userModel.findByIdAndUpdate(user._id,{password: hashed});
//         res.status(200).send({
//             success: true,
//             message:"Password Reset Successfully",
//         })

//            }
//     } catch (error) {
//        console.log(error)
//        res.status(500).send({
//         success:false,
//         message:'something went wrong ',
//         error
//        }) 
//     }

//  }

const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: 'user not find',
                success: false
            })
        }
        else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'auth error',
            success: false,
            error
        })
    }
};

//apply teacher
const applyTeacherController = async (req, res) => {
    try {
        const newTeacher = await teacherModel({ ...req.body, status: "pending" });
        await newTeacher.save()
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification;
        notification.push({
            type: "apply-teacher-request",
            message: `${newTeacher.firstName} ${newTeacher.lastName} Has Applied For Teacher Account`,
            data: {
                teacherId: newTeacher._id,
                name: newTeacher.firstName + " " + newTeacher.lastName,
                onClickPath: "/admin/teachers",

            },
        });
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message: "Teacher Account Applid Successfully",
        });
    }

    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error While Applying for Teacher "
        });
    }
}


//notification controller

const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seennotification = user.seennotification
        const notification = user.notification
        seennotification.push(...notification)
        user.notification = []
        user.seennotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success: true,
            message: "All Notification Marked as Read",
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error in Notification",
            success: false,
            error
        })

    }
}


//delete All NotificationController

const deleteAllNotificationController=async(req,res)=>{
try {
  const user=await userModel.findOne({_id:req.body.userId})
  user.notification=[]
  user.seennotification=[]
  const updatedUser=await user.save()
  updatedUser.password=undefined
  res.status(200).send({
    success:true,
    message:'Notifications Deleted Successfully',
    data:updatedUser,
  })  
} catch (error) {
   console.log(error)
   res.status(500).send({
    success:false,
    message:'unable to delete all notification',
   }) 
}
}

//GET ALL TEACHER

const getAllTeacherController=async(req, res)=>{
try {
    const teachers=await teacherModel.find({status:'approved'})
    res.status(200).send({
        success:true,
        message:'Teachers Lists Fatched Successfully',
        data:teachers,
    });
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:'Error While Fetching Teacher'
    });
}
};

const bookAppointmentController=async(req,res)=>{
    try {
        req.body.date=moment(req.body.date,'DD-MM-YYYY').toISOString();
        req.body.status="pending"
        const newAppointment=new appointmentModel(req.body)
        await newAppointment.save();
        const user=await userModel.findOne({_id: req.body.teacherInfo.userId});
        user.notification.push({
            type:'New appointment-request',
            message:`A New Appointment Request from ${req.body.userInfo.name} phone number is ${req.body.userInfo.phone} And id  ${req.body.userInfo._id} `,
            onClickPath:"/user/appointments",
        });
        await user.save();
        res.status(200).send({
            success:true,
            message:'Appointment Book Successfully',
        })
    } catch (error) {
       console.log(error)
       res.status(500).send({
        success:false,
        error,
        message:'Error while Booking Appointment'
       }) 
    }
}

const userAppoinmentController =async(req,res)=>{
try {
   const appoinments=await appointmentModel.find({userId:req.body.userId})
  
   res.status(200).send({
    success:true,
    message:'user Appoinment Fatch Successfully',
    data:appoinments,
   }) 
} catch (error) {
   console.log(error) 
   res.status(500).send({
    success:false,
    error,
    message:'Error while user Appoinments'
   })
}
}
module.exports = {
    loginController,
    registerController,
    authController,
    applyTeacherController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllTeacherController,
    bookAppointmentController,
    userAppoinmentController,
    // forgetPasswordController,
};