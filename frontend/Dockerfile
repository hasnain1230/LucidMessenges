# Use Node v20 as the base image
FROM node:20 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY . .

# Build the app
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 443
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
