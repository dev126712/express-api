import mongose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';
import logger from '../utils/logger.js';

if(!DB_URI){
    throw new Error('please define the DBS_URI environment variable inside .env.<development/production>.local file');
}

const connectDB = async () => {
    const start = Date.now();
    try {
        await mongose.connect(DB_URI);
        const duration = Date.now() - start;

        logger.info({
            durationMs: duration,
            env: NODE_ENV,
            dbHost: new URL(DB_URI).host
         }, 'MongoDB connected successfully');

        console.log(`MongoDB connected successfully in ${NODE_ENV} mode`);

    } catch (error) {
        logger.fatal({ err: error.message, stack: error.stack }, 'MongoDB connection failed');
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
