import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { connectDB } from './database/db.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.route.js';
import { isAuthenticated } from './middlewares/isAuthenticated.js';
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.PORT || 3200;
const _dirname = path.resolve();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/product",productRoutes);
app.use("/api/v1/cart",isAuthenticated,cartRoutes);
app.use("/api/v1/order",isAuthenticated,orderRoutes);
connectDB();

app.use(express.static(path.join(_dirname,"/frontend/dist")));
app.get((req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
app.listen(port,()=>{
    console.log(`Server is running on port : ${port} `)
});
