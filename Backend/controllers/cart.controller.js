import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cartItems = await Cart.findOne({ userId }).populate("items.productId");
        if (!cartItems) {
            return res.status(404).json({
                message: "Cart is empty!",
                success: false,
                cartItems: []
            });
        }
        return res.status(200).json({
            success: true,
            items: cartItems
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        let { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found!",
                success: false
            });
        }
        let cart = await Cart.findOne({ userId });

        // Check if Cart Exists with this user
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, price: product.productPrice, quantity: 1 }],
                totalPrice: product.productPrice
            })
        } else {
            // find if product is already in cart
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            )
            if (itemIndex > -1) {
                // if product is already exists just increase quantity
                cart.items[itemIndex].quantity += 1;
            } else {
                // If New Products Then Push To Cart
                cart.items.push({
                    productId,
                    quantity: 1,
                    price: product.productPrice
                });
            }
            // Recalculate Total Price
            cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }

        await cart.save();

        // Populating before sending response
        const populatedCart = await Cart.findById(cart._id).populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: populatedCart
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, type } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart is empty!",
                success: false
            })
        }

        const item = cart.items.find((item) => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({
                message: "item not found",
                success: false
            })
        }

        if (type === "increase") {
            item.quantity += 1;
        }
        if (type === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }

        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        await cart.save();
        cart = await cart.populate("items.productId");

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        cart.items = cart.items.filter(
            item => item.productId._id.toString() !== productId
        );

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        );

        await cart.save();
        cart = await cart.populate("items.productId");

        return res.status(200).json({
            message: "Product removed!",
            success: true,
            cart
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
