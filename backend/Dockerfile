# Step 1: Use a lightweight Node.js base image
FROM node:18-slim

# Step 2: Install Python 3 and pip inside the container
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Step 3: Create working directory in the server
WORKDIR /usr/src/app

# Step 4: Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Step 5: If you have a requirements.txt for Python, install it
# (If you don't have python libraries to install, you can leave requirements.txt empty or comment these 2 lines out)
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt || true

# Step 6: Copy all remaining backend files
COPY . .

# Step 7: Expose the port Express uses
EXPOSE 5000

# Step 8: Start the Node app
CMD ["node", "index.js"]