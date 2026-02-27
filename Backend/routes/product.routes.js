import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/isAuthenticated.js'
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/product.controller.js';
import { multipleUpload } from '../middlewares/multer.js';
const router = express.Router();

// GET Requests
router.get("/all-products", getAllProducts);

// POST Requests
router.post("/add", isAuthenticated, isAdmin, multipleUpload, createProduct);

// PUT Rwquests
router.put("/update/:productId", isAuthenticated, isAdmin, multipleUpload, updateProduct);

// DELETE Requests
router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);


export default router;