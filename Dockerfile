# Use a Node.js image with version 16
FROM node:16-alpine

# Install dependencies
RUN apk add --no-cache \
    curl \
    openjdk11-jdk

# Set JAVA_HOME environment variable
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk

# Create app directory
WORKDIR /app

# Copy wait-for-it script
COPY wait-for-it.sh /app/

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
