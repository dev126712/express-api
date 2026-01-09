import logger from '../utils/logger.js';

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

    logger.error({
            msg: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            ip: req.ip,
            userId: req.user?._id || 'unauthenticated'
    });

    logger.error(errorData, `Request Error: ${err.message}`);

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message;

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            message = `Resource not found`;
            statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            message = 'Duplicate field value entered';
            error = new Error(message);
            statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            statusCode = 400;
        }
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Server Error'
        });
    } catch (error) {
        logger.fatal('Critical failure in Error Middleware:', fatalError);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export default errorMiddleware;
