const express =require('express')
const authMiddleware=require('../middleware/authMiddleware')
const { getTeacherInfoController, updateprofileController, getTeacherByIdController, teacherAppointmentController, updateStatusController } = require('../controller/teacherCtrl')
const router=express.Router()

//post SINGLE TEACHER INFO
router.post('/getTeacherInfo',  authMiddleware, getTeacherInfoController)

//POST UPDATE PROFILE
router.post('/updateProfile',authMiddleware, updateprofileController)

//POST GET SINGLE TEACHER
router.post('/getTeacherById' ,  getTeacherByIdController)

//get appoinment
router.get('/teacher-appointments', authMiddleware,teacherAppointmentController)

//post update
router.post('/update-status',authMiddleware,updateStatusController)

module.exports=router ;