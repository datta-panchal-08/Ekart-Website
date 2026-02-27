import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import crypto from 'crypto';
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency, status } = req.body;
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        const razorpayOrder = await razorpayInstance.orders.create(options);

        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            shipping,
            tax,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id,
        });

        await newOrder.save();

        return res.status(201).json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body;
        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            )

            return res.status(400).json({
                success: false,
                message: "Payment Failed",
                order
            });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZOR_SECRET_KEY)
            .update(sign.toString())
            .digest("hex")

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "Paid",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { new: true }
            );

            await Cart.findOneAndUpdate({ userId: req.user._id }, { $set: { items: [], totalPrice: 0 } })
            return res.status(200).json({
                message: "Payment Successfull",
                success: true,
                order
            })
        } else {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            )

            return res.status(400).json({
                success: false,
                message: "Invalid Signature",
                order
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId })
            .populate("user", "firstname lastname email")
            .populate({ path: "products.productId", select: "productName productPrice productImg" });
        if (!orders) {
            return res.status(404).json({
                message: "No Orders found",
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId })
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            })
            .populate("user", "firstname lastname email")

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate("user", "firstname email")
            .populate("products.productId", "productName productPrice");

        return res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getAllSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({ status: "Paid" });

        // Total Sales Amount
        const totalSaleAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalSales = totalSaleAgg[0].total || 0;

        // Sales Group By Date Last 30 Days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const salesByDate = await Order.aggregate([
            { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const formattedSales = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount
        }));

        return res.status(200).json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales: formattedSales
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}