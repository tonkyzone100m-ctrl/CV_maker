FROM node:18-slim

# Install Python inside container
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copy all files first
COPY . .

# Optional Python package install (will not break if requirements.txt doesn't exist)
RUN if [ -f requirements.txt ]; then pip3 install --no-cache-dir -r requirements.txt; fi

EXPOSE 5000

CMD ["node", "index.js"]