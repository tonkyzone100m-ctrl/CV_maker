# Step 1: Use a lightweight Node.js base image
FROM node:18-slim

# Step 2: Install Python 3 inside the container
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Step 3: Create working directory in the container
WORKDIR /usr/src/app

# Step 4: Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Step 5: Copy all application code
COPY . .

# Step 6: Expose Express port
EXPOSE 5000

# Step 7: Start Node.js application
CMD ["node", "index.js"]