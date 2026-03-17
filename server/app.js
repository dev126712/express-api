import express from 'express';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import cors from 'cors';
import pinoHTTP from 'pino-http';
import logger from './utils/logger.js';
import helmet from 'helmet';
import { PORT, ALLOWED_ORIGINS } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import workflowRouter from './routes/workflow.routes.js';
//import { ALLOWED_ORIGINS } from './config/env.js'; // Ensure this is exported in your env.js
const app = express();

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ALIVE' });
});

// 2. Readiness Probe: Checks if the Database is actually connected
app.get('/readyz', (req, res) => {
  // 1 = connected, 2 = connecting
  const isReady = mongoose.connection.readyState === 1; 
  
  if (isReady) {
    return res.status(200).json({ status: 'READY' });
  }
  
  logger.warn('Readiness check failed: DB not connected');
  res.status(503).json({ status: 'NOT_READY' });
});

app.set('trust proxy', true); // Moved to top
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], 
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"], 
      connectSrc: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
}));

app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  next();
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
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

/*const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://34.55.134.21'];

 app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));*/
const origins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : [];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin is in our environment-provided list
    if (origins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy violation'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/workflow', workflowRouter);
app.use(errorMiddleware);


app.get('/', (req, res) => {
    res.send('welcome to sub tracker api');
});

app.listen(PORT, async () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    await connectDB();
});

export default app;
