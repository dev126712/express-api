## SubTracker API
SubTracker is a high-performance, DevSecOps-focused Subscription Management Backend built with Node.js and Express. It provides a centralized platform for users to track recurring expenses, manage payment cycles, and receive automated reminders while maintaining a high security posture through automated scanning and real-time protection.


# DevSecOps
![alt text](https://github.com/dev126712/dockerized-three-tier-app/blob/64105d4d0de1f6b2286aa6f47ae82d9ba965c086/licensed-image.jpeg)
#### CI/CD Workflows:
- ci-ui.yml:
  - SAST/SCA: Static code scanning with Checkov and Snyk.
  - Container Security: Image layer scanning with Trivy.
  - DAST: Dynamic analysis with OWASP ZAP.
- ci-api.yml:
  - Static scan code with checkov(SAST, SCA)
  - Build Image
  - Container security with Trivy (SCA, Image layes scan)
  - Dynamic scan with OWASP ZAP (DAST)
  - Push Image to DockerHub

- security.yml:
  - Scans for security flaws in all the workflows files ".yml" (SAST)

 ## Vulnerability Management
I actively monitor dependencies and patch issues immediately.

Recent Patch: Upgraded express to 4.22.0 to resolve a High-severity Allocation of Resources Without Limits (DoS) vulnerability in the qs dependency detected by Snyk.
![alt text](https://github.com/dev126712/express-api/blob/8ed375171f79fed50d708f4534741119f0d98abd/image.png)
 # 🐳 Docker Support
The project is container-ready. To build and run:
````
docker build -t express-api .
docker run -p 3000:3000 --env-file .env.production.local subtracker-api
````
### Docker image
  - Non-root user
  - Run command as a non root user reduce the impact of damage if conpromised
  - Multistage image
  - Healthcheck
  - Small initial image

## 🛡️ Security Policy
This API uses Arcjet to provide:

-  Rate Limiting: Protects against brute-force attacks.
  
-  Bot Detection: Blocks malicious bots while allowing search engines.
  
-  Shield: Real-time protection against common web vulnerabilities.


## Key Features
🔐 Robust Authentication: JWT-based auth with secure cookie support and password hashing.

🛡️ Enterprise-Grade Security:

-  Arcjet Integration: Bot detection, rate limiting, and SQL/XSS protection.
  
-  Ownership Middleware: Strict data isolation—users can only access their own subscriptions.
  
-  ⚙️ Automated Workflows: Powered by Upstash to send reminders 7, 5, 2, and 1 days before a subscription renews.
  
  -  📊 Subscription Tracking: Support for various frequencies (daily, weekly, monthly, yearly), categories, and     currencies.
  
-  ⚡ Performance & Logging: High-performance structured logging using Pino with log rotation and redaction for sensitive data.
  
-  📦 Transactional Integrity: Uses MongoDB Sessions/Transactions during sign-up to ensure data consistency.

## 🛠️ Tech Stack
````
  **Runtime**: Node.js (ES Modules)
  
  **Framework**: Express.js
  
  **Database**: MongoDB with Mongoose
  
  **Security**: Arcjet
  
  **Workflow/Automation**: Upstash Workflow
  
  **Logging**: Pino & Pino-HTTP
  
  **Date Handling**: Day.js
  
  **Containerization**: Docker
````

## 📁 Project Structure
````
├── config/             # Configuration for Arcjet, Upstash, and Env variables
├── controllers/        # Business logic (Auth, User, Subscription, Workflow)
├── database/           # MongoDB connection and setup
├── middleware/         # Security, Auth, and Centralized Error Handling
├── models/             # Mongoose Schemas (User, Subscription)
├── routes/             # API Endpoints
├── utils/              # Pino Logger and helper utilities
├── app.js              # Application entry point
└── Dockerfile          # Production-ready Docker configuration
````

## 🚀 Getting Started
Prerequisites
````
-  Node.js v20+
  
-  MongoDB instance (Atlas or local)
  
-  Upstash Account (for QStash/Workflows)
  
-  Arcjet API Key
````

## Configuration
Create a .env.development.local file in the server folder:
````
PORT=3000
NODE_ENV='development'
SERVER_URL="http://localhost:5500"

# Database
DB_URI=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN="1d"

# Arcjet
ARCJET_KEY=
ARCJET_ENV="development"

# UPSTASH
QSTASH_TOKEN=
QSTASH_URL="https://qstash.upstash.io"
````

#### client/
.env.<development/production>.local
````
VITE_API_BASE_URL=http://localhost:3000/api/v1
````








# 🛣️ API Endpoints
## 🔑 Authentication
| Method  | Endpoint | Description |
|-------|-------|-------|
| POST | /api/v1/auth/sign-up |Register a new user (Transactional) |
| POST | /api/v1/auth/sign-in | Login & receive JWT |
| POST | /api/v1/auth/sign-out | Logout user |

## 💳 Subscriptions
| Method | Endpoint | Description | 
|-------|-------|-------|
| GET | /api/v1/subscription | List all subs for current user |
| POST | /api/v1/subscription | Create a sub & trigger workflow |
| GET | /api/v1/subscription/:id | Get details (Ownership verified) |
| PUT | /api/v1/subscription/:id | Update sub (Ownership verified) |
| DELETE | /api/v1/subscription/:id | Delete sub (Ownership verified) |
| GET | /api/v1/subscription/upcoming-renewals | List subs renewing soon |



