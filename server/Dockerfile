# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
#RUN yarn build

# Expose the port the server will run on
EXPOSE 4000

# Start the server
CMD ["yarn", "run", "dev"]
