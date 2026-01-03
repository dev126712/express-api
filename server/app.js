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

// --- 2. Security Headers (The "Helmet" configuration) ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Fixes: "Failure to Define Directive with No Fallback"
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  next();
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
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
