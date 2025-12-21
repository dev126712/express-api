# Use a lightweight Node image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# IMPORTANT: Vite needs --host to allow access from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
