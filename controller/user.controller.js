import User from "../model/user.model.js";
import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import crypto from "crypto";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) => {
    try {
        const { userId, fullname, email, password, role, location } = req.body;

        if (!fullname || !email || !password) {
            return next(new AppError("All fields are required", 400));
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new AppError("Email already exists", 400));
        }

        const user = await User.create({
            userId,
            fullname,
            email,
            password,
            location,
            avatar: {
                public_id: email,
                secure_url: "https://res.cloudinary.com/demo/image/gravatar/w_120,h_80,c_fill/e3264cf16f34ecd3c7c564f5668cbc1e.jpg"
            },
            role
        });

        if (!user) {
            return next(new AppError("User registration failed, please try again."), 400);
        }

        // File upload
        if (req.file) {
            console.log(req.file);
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "register",
                    width: 250,
                    gravity: 'faces',
                    crop: 'fill'
                });

                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    // remove file
                    fs.rm(`uploads/${req.file.filename}`);
                }
            }
            catch (e) {
                return next(new AppError(error || `File not uploaded, plase try again.`, 400));
            }
        }

        await user.save();

        user.password = undefined;
        const token = await user.generateJWTtoken();
        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export {
    register,
}
