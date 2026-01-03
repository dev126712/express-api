import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "./async.middleware.js";

const authorize = asyncHandler(async (req, res, next) => {
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies && req.cookies.token) {
     token = req.cookies.token;
    }

    if(!token) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');;

    if(!user) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    req.user = user;
    next();
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
