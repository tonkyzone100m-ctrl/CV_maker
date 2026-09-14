FROM node:18-slim

RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copy all remaining backend files
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]