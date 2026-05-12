# Docker image for running the Naver Search MCP server.
FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies without triggering any unwanted scripts
RUN npm install --ignore-scripts

# Copy all source code
COPY . .

# Build the application
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Command to run the server
CMD [ "node", "dist/src/index.js" ] 
