# AI-Vet Platform

## Requirements

- Node.js and npm
- MongoDB (local or hosted)
- An OpenRouter or NVIDIA API key to use the AI assistant

## Run locally

1. Configure the server by creating `server/.env`:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=choose_a_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

   The AI key is optional unless you want to use the AI assistant. You can use
   `NVIDIA_API_KEY` instead of `OPENROUTER_API_KEY` if you select NVIDIA.

2. In a terminal, install dependencies and start the server:

   ```bash
   cd server
   npm install
   npm run dev
   ```

   The API runs on `http://localhost:5000`.

3. In a second terminal, install dependencies and start the client:

   ```bash
   cd client
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite (usually `http://localhost:5173`).

The client uses the hosted API by default. To use your local server, create
`client/.env` with:

```env
VITE_API_URL=http://localhost:5000
```
