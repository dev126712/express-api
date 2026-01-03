import pino from 'pino';
import path from 'path';

// Use standard pino/file for stability in Docker
const targets = [
  {
    target: 'pino/file',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: {
        paths: ['body.password', 'req.body.password', 'password'],
        placeholder: '[REDACTED]'
    },
    options: { 
      destination: path.join(process.cwd(), 'logs', 'app.log'),
      mkdir: true 
    }
  },

  {
        target: 'pino-pretty',
        level: 'debug',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
];

const logger = pino(
  {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: ['req.headers.authorization', 'req.body.password', 'password'],
  },
  pino.transport({ targets })
);
export default logger;
