import express from 'express';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import cors from 'cors';
import pinoHTTP from 'pino-http';
import logger from './utils/logger.js';
import helmet from 'helmet'
import { PORT } from './config/env.js'


import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

app.set('trust proxy', true); // Moved to top
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      // 1. Fixes "Wildcard Directive" (10055)
      // Avoid using '*' or 'data:' in default-src
      defaultSrc: ["'self'"], 
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      // Only allow images from your own domain
      imgSrc: ["'self'"], 
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  // 2. Fixes "Spectre Vulnerability / Site Isolation" (90004)
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
}));

app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  next();
});

res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
});

app.use(pinoHTTP({
  logger,
  redact: ['req.body.password', 'req.headers.authorization', 'res.headers["set-cookie"]'], placeholder: '[REDACTED]' 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/workflow', workflowRouter);
app.set('trust proxy', true);
app.use(errorMiddleware);


app.get('/', (req, res) => {
    res.send('welcome to sub tracker api');
});

app.listen( PORT, async () => {
    console.log(`server running on http://localhost:${PORT}`);
    logger.info(`Server running on http://localhost:${PORT}`);
    await connectDB();
});

export default app;
