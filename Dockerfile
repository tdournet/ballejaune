# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY index.ts ./

# Run the script
CMD ["npm", "start"]
