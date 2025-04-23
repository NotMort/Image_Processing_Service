FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project
COPY . .

# Start the app
CMD ["node", "server.js"]
