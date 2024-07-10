FROM node:20.11.1-alpine3.19

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3003

# Command to run the application
CMD [ "node", "src/index.js" ]
