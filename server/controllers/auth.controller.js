import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import  asyncHandler from '../middleware/async.middleware.js' 
import User from '../models/user.model.js';
import logger from '../utils/logger.js';

export const signUp = asyncHandler(async(req, res, next) => {
    req.log.info({ email: req.body.email }, 'Processing signup request');
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Create a new user
        const { name, email, password } = req.body;
        // check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists');
            error.status = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{ name, email, password: hashedPassword }], { session });
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        logger.info({
            userId: newUser[0]._id,
            email: email,
            event: 'AUTH_SIGNUP_SUCCESS'
        }, 'User account created');

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { user: newUser[0], token }
        });
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const signIn = asyncHandler(async(req, res, next) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: { user, token }
        });
});

export const signOut = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Signed out successfully'
    });

};
