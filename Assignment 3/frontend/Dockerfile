# Step 1: Use Node 18 Alpine as base image
FROM node:18-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files for dependency installation
COPY package*.json ./

# Step 4: Install frontend dependencies
RUN npm install

# Step 5: Copy frontend application source code
COPY . .

# Step 6: Set environment variables for container network binding
ENV PORT=3000
ENV REACT_APP_API_URL=http://localhost:5000

# Step 7: Expose port 3000
EXPOSE 3000

# Step 8: Start React development server
CMD ["npm", "start"]
