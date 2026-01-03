import mongose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';
import logger from '../utils/logger.js';

if(!DB_URI){
    throw new Error('please define the DBS_URI environment variable inside .env.<development/production>.local file');
}

const connectDB = async () => {
    try {
        await mongose.connect(DB_URI);
        logger.info('Successfully connected to MongoDB');
        console.log(`MongoDB connected successfully in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
