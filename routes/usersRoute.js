const express = require("express");
const {
  loginController,
   registerController,
   authController,
   applyTeacherController,
   getAllNotificationController,
   deleteAllNotificationController,
   getAllTeacherController,
   bookAppointmentController,
   userAppoinmentController,
   forgetPasswordController,
} = require("../controller/userCtrl");

const authMiddleware = require("../middleware/authMiddleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

// //forgate password
// router.post('/forget-password' , forgetPasswordController)

// //Auth || post
router.post("/getUserData", authMiddleware, authController);


//applyforteacher
router.post("/applyteacher", authMiddleware, applyTeacherController);


//notification
router.post("/get-all-notification", authMiddleware, getAllNotificationController);


//deletnotification
router.post("/delet-all-notification", authMiddleware, deleteAllNotificationController);


//GET ALL TEACHER
router.get('/getAllTeachers', authMiddleware, getAllTeacherController)


//BOOK APPOINMENT
router.post('/book-appoinment', authMiddleware,bookAppointmentController)

//APPOINMENT LIST
router.get('/user-appointments', authMiddleware, userAppoinmentController)

module.exports = router;


