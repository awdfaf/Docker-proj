# Base Image
FROM node:16.8-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Install npm in the latest version
RUN npm install -g npm@latest

# Clear npm cache and install dependencies
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build application
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run npm start script
CMD [ "npm", "start" ]
