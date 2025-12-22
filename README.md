#### server/
.env.<development/production>.local
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


|  |   |   |   |
|------|------|------|------|
|CREATE|	POST|	/api/v1/user	|Create User|
READ	|GET|	/api/v1/user	|Gets all users|
UPDATE	|PUT|	/api/v1/user/:id|	Edits User|
DELETE|	DELETE|	/api/v1/user/:id	|Delete User|


|  |   |   |   |
|------|------|------|------|
|CREATE|	POST|	/api/v1/subscriptions	|Adds a new sub|
READ	|GET|	/api/v1/subscriptions	|Gets all user subs|
UPDATE	|PUT|	/api/v1/subscriptions/:id|	Edits one sub|
DELETE|	DELETE|	/api/v1/subscriptions/:id	|Removes one sub|

# DevSecOps
![alt text](https://github.com/dev126712/dockerized-three-tier-app/blob/64105d4d0de1f6b2286aa6f47ae82d9ba965c086/licensed-image.jpeg)
#### CI/CD Pipelines
Workflows:
- ci-ui.yml:
  - Static scan code with checkov (SAST, SCA)
  - Build Image
  - Dynamic scan code with Trivy (SCA, Container image security)
  - Push Image to DockerHub
   
- ci-api.yml:
  - Static scan code with checkov(SAST, SCA)
  - Build Image
  - Dynamic scan code with Trivy (SCA, Container image security)
  - Push Image to DockerHub

- security.yml:
  - Scans for security flaws in all the workflows files ".yml" (SAST)
