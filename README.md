# SubTracker API

A subscription management backend built with Node.js and Express. Users track recurring expenses, manage billing cycles, and receive automated renewal reminders — secured with enterprise-grade runtime protection and a full DevSecOps CI/CD pipeline.

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb,docker,githubactions)](https://skillicons.dev)

---

## Features

### Application
- **Subscription tracking** — frequencies (daily/weekly/monthly/yearly), categories, currencies
- **JWT authentication** — secure cookie support, bcrypt password hashing
- **Ownership middleware** — strict data isolation; users can only access their own records
- **Automated reminders** — Upstash Workflow sends renewal alerts 7, 5, 2, and 1 day(s) before due
- **MongoDB transactions** — atomic writes during sign-up for data consistency
- **Structured logging** — Pino + Pino-HTTP with log rotation and sensitive field redaction

### Runtime Security (Arcjet)
| Protection | Detail |
|---|---|
| **Rate limiting** | Brute-force protection on auth endpoints |
| **Bot detection** | Blocks malicious bots, allows search engine crawlers |
| **Shield** | Real-time protection against common web vulnerabilities |

---

## DevSecOps CI/CD Pipeline

Three GitHub Actions workflows run on every push.

### `ci-api.yml` — Backend pipeline

| Stage | Tool | What it does |
|---|---|---|
| SAST / SCA | Checkov + Snyk | Static code + dependency vulnerability scan |
| Build | Docker Buildx | Builds the production image |
| Container scan | Trivy | Scans image for CVEs |
| DAST | OWASP ZAP | Dynamic scan against the running container |
| Publish | Docker Hub | Pushes to registry |

### `ci-ui.yml` — Frontend pipeline
Same stages as the backend (Checkov → Trivy → OWASP ZAP).

### `security.yml`
Checkov SAST on all `.github/workflows/*.yml` files.

### Docker Image Hardening
- Non-root user — reduced blast radius if compromised
- Multi-stage build — no dev tooling in the production image
- Health check
- Pinned base image (Alpine)

### Vulnerability Management
Dependencies are actively monitored. Example: upgraded `express` to 4.22.0 to patch a High-severity DoS vulnerability in the `qs` dependency detected by Snyk.

---

## Tech Stack

| Component | Technology |
|---|---|
| **Runtime** | Node.js (ES Modules) |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (secure cookie) + bcrypt |
| **Runtime security** | Arcjet |
| **Workflow automation** | Upstash Workflow (QStash) |
| **Logging** | Pino + Pino-HTTP |
| **Container** | Docker (multi-stage, non-root) |

---

## Quick Start

```bash
git clone https://github.com/dev126712/express-api
cd express-api
cp .env.example .env.development.local   # fill in DB_URI, JWT_SECRET, ARCJET_KEY, QSTASH_TOKEN
```

### Docker

```bash
docker build -t subtracker-api .
docker run -p 3000:3000 --env-file .env.development.local subtracker-api
```

### Local (Node)

```bash
npm install
npm run dev
```

---

## Configuration

```env
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:5500

DB_URI=                          # MongoDB connection string
JWT_SECRET=                      # Random secret, min 32 chars
JWT_EXPIRES_IN=1d

ARCJET_KEY=                      # Get from arcjet.com
ARCJET_ENV=development

QSTASH_TOKEN=                    # Upstash QStash token
QSTASH_URL=https://qstash.upstash.io
```

---

## Project Structure

```
express-api/
├── app.js                  # Application entry point
├── Dockerfile              # Multi-stage production image
├── config/                 # Arcjet, Upstash, env config
├── controllers/            # Auth, User, Subscription, Workflow handlers
├── database/               # MongoDB connection
├── middleware/             # Auth, ownership, error handling
├── models/                 # Mongoose schemas (User, Subscription)
├── routes/                 # API route definitions
└── utils/                  # Pino logger, helpers
```

---

## Related Repos

| Repo | Role |
|---|---|
| [express-api-CD](https://github.com/dev126712/express-api-CD) | Kustomize manifests + ArgoCD for K8s deployment |
| [express-api-Infrastructure](https://github.com/dev126712/express-api-Infrastructure) | Terraform GKE cluster |
