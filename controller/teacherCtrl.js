const appointmentModel = require("../models/appoinmentModel");
const teacherModel = require("../models/teacherModel");
const userModel = require("../models/usersModel");
const { trace } = require("../routes/usersRoute");


const getTeacherInfoController = async (req, res) => {
    try {
        const teacher = await teacherModel.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: 'teacher data fetch success',
            data: teacher,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error is Fatching teacher Details'
        })
    }

}

//update teacher profile
const updateprofileController = async (req, res) => {
    try {
        const teacher = await teacherModel.findOneAndUpdate({ userId: req.body.userId }, req.body)
        res.status(201).send({
            success: true,
            message: 'Teacher Profile Updated',
            data: teacher,
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'Teacher Profile Update Issue',
            error
        })
    }
};

const getTeacherByIdController = async (req, res) => {
    try {
        const teacher = await teacherModel.findOne({ _id: req.body.teacherId });
        res.status(200).send({
            success: true,
            message: 'Single Teacher Info Fetched',
            data: teacher,
        });
    } catch (error) { 
        // console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Single Teacher Info'
        })
    }
}


const teacherAppointmentController=async(req,res)=>{
    try {
        
        const teacher=await teacherModel.findOne({userId: req.body.userId});
        const appointments=await appointmentModel.find({teacherId:teacher._id,})
     
       res.status(200).send({
        success:true,
        message: 'Teacher Appoinment fetch Successfully',
        data: appointments,
       })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:'error in teacher appoinment'
        });
    }
}

const updateStatusController=async(req,res)=>{
    try {
       
       const {appointmentsId,status,teacherInfo}=req.body;
       const appoinments=await appointmentModel.findByIdAndUpdate(appointmentsId, {status}) ;
       const user=await userModel.findOne({_id: appoinments.userId});
       const notification=user.notification;
       user.notification.push({
           type:'staus-updated',
           message:`your appoinment has been ${status}`,
           onClickPath:"/teacher-appointments",
       });
       await user.save();
       res.status(200).send({
        success:true,
        message:'Appointment status Upadated'
       })
    } catch (error) {
    //   console.log(error)
      res.status(500).send({
        success:false,
        error,
        message:'error in update'
      })

    }
}
module.exports = { getTeacherInfoController, updateprofileController, getTeacherByIdController,teacherAppointmentController,updateStatusController }