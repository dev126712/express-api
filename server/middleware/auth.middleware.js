import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "./async.middleware.js";

const authorize = asyncHandler(async (req, res, next) => {
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if(!token) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        if(!user) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        req.user = user;
        next();
    } catch (error) {
        // Specifically handle expired or invalid tokens
        if (error.name === 'TokenExpiredError') {
            error.message = 'Session expired, please log in again';
            error.statusCode = 401;
        } else if (error.name === 'JsonWebTokenError') {
            error.message = 'Invalid token, authorization denied';
            error.statusCode = 401;
        }
        next(error); // Pass to error handler with 401 status
    }
});

export const authorizeRole = (role) => {
    return (req, res, next) => {
        // Check if user exists and has the required role
        if (req.user.role !== role) {
            const error = new Error(`Role (${req.user.role}) is not allowed to access this resource`);
            error.statusCode = 403; // Forbidden
            throw error;
        }
        next();
    };
};

export default authorize;
