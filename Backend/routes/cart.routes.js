import express from 'express';
import { addToCart, getCart, removeFromCart, updateQuantity } from '../controllers/cart.controller.js';
const router = express.Router();

// GET Requests
router.get("/",getCart);
// POST Requests
router.post("/add",addToCart);
// PUT Requests
router.put("/update",updateQuantity)
// DELETE Requests
router.delete("/remove",removeFromCart);

export default router;
