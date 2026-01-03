import aj from '../config/arject.js';
import logger from '../utils/logger.js';

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1});

    if(decision.isDenied()) {
     logger.warn({
        msg: 'Arcjet Request Denied',
        reason: decision.reason,
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      if(decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate limit exceeded' });
      if(decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

      return res.status(403).json({ error: 'Access denied' });  
    }
    next();
  } catch (error)  {
    logger.error({
      msg: 'Arcjet middleware error',
      error: error.message,
      stack: error.stack,
    });
    console.error('Arcjet middleware error:', `${error}`);
    next(error);
  }
};

export default arcjetMiddleware;
