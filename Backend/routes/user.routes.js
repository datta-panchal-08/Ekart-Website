import express from 'express';
import { changePassword, forgoPassword, getallUsers, getUserById, login, logout, register, reVerify, updateUser, verify, verifyOTP } from '../controllers/user.controller.js';
import { isAdmin, isAuthenticated } from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';
const router = express.Router();


// GET Requests =>
router.get("/all-users",isAuthenticated,isAdmin,getallUsers);
router.get("/get-user/:userId",isAuthenticated,getUserById);

// POST Request =>
router.post("/register",register);
router.post("/verify",verify);
router.post("/reverify",reVerify);
router.post("/login",login);
router.post("/forgot-password",isAuthenticated,forgoPassword);
router.post("/verify-otp/:email",verifyOTP);
router.post("/change-password/:email",changePassword)
router.post("/logout",isAuthenticated,logout)

//PUT Requests
router.put("/update/:id",isAuthenticated,singleUpload,updateUser);


export  default router