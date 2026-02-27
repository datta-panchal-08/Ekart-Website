import express from 'express';
import { createOrder, getAllOrders, getAllSalesData, getMyOrders, getUserOrders, verifyPayment } from '../controllers/order.controller.js';
import { isAdmin } from '../middlewares/isAuthenticated.js';
const router = express.Router();

// GET REQUESTS 
router.get("/my-orders",getMyOrders);
router.get("/user/:userId",getUserOrders);
router.get("/all",getAllOrders);
router.get("/sales",isAdmin,getAllSalesData);

// POST REQUESTS =>
router.post("/create-order",createOrder);
router.post("/verify-payment",verifyPayment);

export default router;
