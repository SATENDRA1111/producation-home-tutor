const express=require('express');
const { getAllUsersController, getAllTeachersController, changeAccountStatusController } = require('../controller/adminCtrl');
const authMiddleware=require("../middleware/authMiddleware");


const router=express.Router();

//get methed|| users
router.get('/getAllUsers', authMiddleware,getAllUsersController);


//GET METHOD || DOCTORS
router.get('/getAllTeacher',authMiddleware,getAllTeachersController);

//POST ACCOUNT
router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController);
module.exports=router;