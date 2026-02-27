import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
    key_id:process.env.RAZOR_API_KEY,
    key_secret:process.env.RAZOR_SECRET_KEY
});

export default razorpayInstance;