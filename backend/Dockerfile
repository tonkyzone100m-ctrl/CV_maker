FROM node:20-slim

# Install Python inside container
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package files and prisma directory
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (runs prisma generate)
RUN npm install

# Copy rest of backend files
COPY . .

EXPOSE 5000

# Entry point pointing to your server.js inside src
CMD ["node", "src/server.js"]