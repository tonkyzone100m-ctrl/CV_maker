# Use Node 20 to clear engine warnings
FROM node:20-slim

# Install Python dependencies
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package metadata AND prisma schema directory
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (prisma generate will now locate schema.prisma)
RUN npm install

# Copy the rest of the application files
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]