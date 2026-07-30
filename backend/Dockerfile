# Step 1: Use official Node 18 Alpine image for lightweight footprint
FROM node:18-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Step 4: Install production dependencies
RUN npm install --production

# Step 5: Copy rest of backend application source code
COPY . .

# Step 6: Expose port 5000 for backend REST API
EXPOSE 5000

# Step 7: Define startup command
CMD ["npm", "start"]
