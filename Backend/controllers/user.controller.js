import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyEmail } from "../email/emailVerify.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../email/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        if (!firstname || !lastname || !email | !password) {
            return res.status(400).json({
                succes: false,
                message: "All Fileds Are Required!"
            })
        }

        const isExists = await User.findOne({ email });

        if (isExists) {
            return res.status(400).json({
                success: false,
                message: "user already exists!"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ firstname, lastname, email, password: hashedPassword });
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: "10m"
        });
        verifyEmail(token, email); // Send Email Here
        newUser.token = token;

        await newUser.save();



        const userResponse = newUser.toObject();
        userResponse.password = "";

        return res.status(201).json({
            success: true,
            message: "user registered successfully!",
            user: userResponse
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "internal server error!",
            success: false
        })
    }
}

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    user.isVerified = true;
    user.token = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "10m"
        });
        verifyEmail(token, email); // Send Email Here
        user.token = token;
        await user.save();

        return res.status(200).json({
            message: "Reverification Email sent successfully",
            token: user.token,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            messages: error.message,
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: "all fileds aere required",
                success: false
            })
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            })
        }

        if (existingUser.isVerified === false) {
            return res.status(400).json({
                message: "verify your account then login",
                success: false
            })
        }

        const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "10d" });
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "30d" });

        existingUser.isLoggedIn = true;
        await existingUser.save();
        // Checked For Exisiting Session and deleted it
        const existingSession = await Session.findOne({ userId: existingUser._id });
        if (existingSession) {
            await Session.deleteOne({ userId: existingUser._id });
        }

        const userResponse = existingUser.toObject()
        userResponse.password = ""
        await Session.create({ userId: existingUser._id });
        return res.status(200).json({
            message: `✨ Welcome back ${existingUser.firstname}`,
            success: true,
            user: userResponse,
            accessToken,
            refreshToken
        })

    } catch (error) {
        return res.status(500).json({
            messages: error.message,
            success: false
        })
    }
}

export const logout = async (req, res) => {
    try {
        const userId = req.user._id;

        await Session.deleteMany({ userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const forgoPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();
        await sendOTPMail(otp, email);

        return res.status(200).json({
            message: "OTP sent to email successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;

        if (!otp) {
            return res.status(400).json({
                message: "OTP is required",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                message: "OTP is not generated or already verified",
                success: false
            })
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                message: "OTP has expired please request a new one",
                success: false
            })
        }
        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({
            message: "OTP is verified successfully!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "both fields are required!",
                success: false
            })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully",
            succes: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getallUsers = async(_,res)=>{
    try {
        const users = await User.find({});
        return res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

export const getUserById =async(req,res)=>{
    try {
        const {userId} = req.params;
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token");
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }
        res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message,
            succes:false
        })
    }
}

export const updateUser = async(req,res)=>{
    try {
        const userIdToUpdate = req.params.id;
        const loggedInUser = req.user;
        const {firstname,lastname,city,address,zipcode,phoneNo,role} = req.body;
        if(loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== "admin"){
            return res.status(400).json({
                success:false,
                message:"your not allowed to update this profile."
            });
        }
        let user = await User.findById(userIdToUpdate);
        if(!user){
            return res.status(404).json({
                message:"User not found.",
                success:false
            });
        }
        let profilePicUrl = user.profilepic;
        let profilePicPublicId = user.profilePublicId;

        // If a new file is uploaded
        if(req.file){
            if(profilePicPublicId){
                await cloudinary.uploader.destroy(profilePicPublicId);
            }
            const uploadResult = await new Promise((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream(
                    {folder:"profiles"},
                    (error,result)=>{
                        if(error){
                            reject(error);
                        }else{
                            resolve(result);
                        }
                    }
                ) 
                stream.end(req.file.buffer);
            });
            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipcode = zipcode || user.zipcode;
        user.phoneNo = phoneNo || user.phoneNo;
        user.profilepic = profilePicUrl;
        user.profilePublicId = profilePicPublicId;
        user.role = role || user.role;
        const updateUser = await user.save();
        
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully!",
            user:updateUser
        });


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}