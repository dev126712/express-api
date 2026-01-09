import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  // Create a "child" logger so every log in this request has the same ID
  req.log = logger.child({ requestId }); 
  next();
};

export default requestLogger;
