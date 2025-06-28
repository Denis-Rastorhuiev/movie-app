# Movies App

React-based web application for managing movies with Material-UI, Redux Toolkit, and custom styling.

## Prerequisites

- **Node.js**: Version 14 or higher
- **Docker**: For backend and building frontend image

## Installation

1. **Clone the repository**:
   ```bash
   git clone 
   cd movies-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8001/api/v1
   ```

## Running the Application

1. **Start the backend**:
   ```bash
   docker run -p 8000:8000 webbylabhub/movies
   ```

2. **Start the frontend**:
   ```bash
   npm start
   ```
   Application will be available at `http://localhost:8000`

## Docker Build

1. **Build the Docker image**:
   ```bash
   docker build -t denisrastorhuievprog/movies .
   ```

2. **Run the Docker container**:
   ```bash
   docker run --name movies -p 8001:8001 -e REACT_APP_API_URL=http://localhost:8001/api/v1 denisrastorhuievprog/movies
   ```

3. **Push to Docker Hub** (optional):
   ```bash
   docker login
   docker push denisrastorhuievprog/movies
   ```

## Dockerfile

Make sure you have this `Dockerfile` in your project root:

```dockerfile
FROM node:14
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8001
CMD ["nginx", "-g", "daemon off;"]

```
