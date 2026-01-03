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

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: ['req.headers.authorization', 'req.body.password', 'password'],
  // In production/Docker, we log to console only to avoid EACCES issues
  transport: process.env.NODE_ENV === 'production' 
    ? { target: 'pino/file', options: { destination: 1 } } // 1 is stdout
    : {
        targets: [
          { target: 'pino-pretty', options: { colorize: true } },
          { target: 'pino/file', options: { destination: './logs/app.log', mkdir: true } }
        ]
      }
});
export default logger;
