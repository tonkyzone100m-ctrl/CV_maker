# Step 1: Use Node.js 20 (resolves the npm engine warnings)
FROM node:20-slim

# Step 2: Install Python inside container
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Step 3: Copy package files AND prisma schema folder
COPY package*.json ./
COPY prisma ./prisma/

# Step 4: Install dependencies (now prisma generate will find schema.prisma)
RUN npm install

# Step 5: Copy all remaining project files
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]