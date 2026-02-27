import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";


export const createProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.user._id;

        if (!productName?.trim() ||
            !productDesc?.trim() ||
            productPrice == null ||
            !category?.trim() ||
            !brand?.trim()) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one image is required",
                success: false
            });
        }

        let productImg = [];

        for (let file of req.files) {
            const fileUri = getDataUri(file);
            const result = await cloudinary.uploader.upload(fileUri.content, {
                folder: "ekart_products"
            });

            productImg.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        }

        const newProduct = await Product.create({
            productName,
            productPrice: Number(productPrice),
            category,
            brand,
            productDesc,
            productImg,
            userId
        });

        return res.status(201).json({
            message: "product added successfully.",
            success: true,
            product: newProduct
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        if (products.length === 0) {
            return res.status(404).json({
                message: "no products found.",
                success: false,
                products: []
            });
        }
        return res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "no product found",
                success: false
            })
        }
        // Delete images from cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        // Delete Product From Database
        await Product.findByIdAndDelete(product._id);
        return res.status(200).json({
            message: "Product deleted successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }
        let updatedImages = [];

        // Keep Selected Old images
        if (existingImages) {
            const keepIds = JSON.parse(existingImages);
            updatedImages = product.productImg.filter((img) =>
                keepIds.includes(img.public_id)
            );

            // Delete Only Removed Images
            const removedImages = product.productImg.filter((img) =>
                !keepIds.includes(img.public_id)
            );

            for (let img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        } else {
            // Keep All images if not change by user
            updatedImages = product.productImg;
        }

        // Upload new images if any
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri.content, { folder: "ekart_products" });
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // Update Product
        product.productName = productName || product.productName;
        product.productPrice = productPrice || product.productPrice;
        product.productDesc = productDesc || product.productDesc;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;
        
        await product.save();

        return res.status(200).json({
            message:"Product updated successfully.",
            success:true,
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}