<<<<<<< HEAD
# Baby Care App

## Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (running locally or a connection string in .env)

## Installation

1.  **Install Root Dependencies:**
    Open a terminal in the root directory and run:
    ```bash
    npm install
    ```

2.  **Install Server Dependencies:**
    Navigate to the server directory and run:
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies:**
    Navigate to the client directory and run:
    ```bash
    cd ../client
    npm install
    ```

## Running the Application

To run both changes concurrently (client and server), from the root directory run:

```bash
npm run dev
```

This will start the backend server on port 5000 (default) and the frontend development server.

## Troubleshooting

-   **MongoDB Connection Error:** Ensure your MongoDB instance is running. If using a cloud database, check your `.env` file in the `server` directory for the correct `MONGO_URI`.
-   **Port Conflicts:** If port 5000 is in use, modify the `PORT` in your `.env` file or `server/index.js`.
=======
# Babycare-platform
Baby care 
>>>>>>> 0c14e92d9943c53a1259bd942c95457fb21b7ce5
