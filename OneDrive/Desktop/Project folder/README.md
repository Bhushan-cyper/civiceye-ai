# CivicEye

CivicEye is a civic issue reporting and demonstration management platform. Citizens can report an issue with a description, photo, and map-selected location; the API can request an AI assessment from Gemini; and the dashboard supports tracking and status updates. This is a demonstration MVP, not a government service.

## Requirements

- Node.js 20 or newer and npm
- MongoDB running locally, or a MongoDB Atlas connection string
- Optional: a Google Gemini API key for AI image analysis and classification

## Run locally

1. **Install dependencies** from the project root:

   ```powershell
   npm install
   ```

2. **Configure the backend.** Copy the example environment file and edit `server/.env`:

   ```powershell
   Copy-Item server\.env.example server\.env
   ```

   Set `MONGODB_URI`. For a local MongoDB installation, use:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/civiceye
   ```

   `GEMINI_API_KEY` is optional. Without it (or if AI is temporarily unavailable), reports can still be submitted and are marked as not AI-analyzed. Never put this key in a client environment file.

3. **Start MongoDB** if using a local database. Ensure the database service is running before starting the API.

4. **Start the app** from the project root:

   ```powershell
   npm run dev
   ```

5. Open the Vite URL shown in the terminal (normally [http://localhost:5173](http://localhost:5173)). The API runs at [http://localhost:5000](http://localhost:5000); check it at [http://localhost:5000/api/health](http://localhost:5000/api/health).

Uploaded images are kept in `server/uploads/` for local development. Complaint records and status history are stored in MongoDB.

## Useful commands

Run these from the project root:

```powershell
npm run dev
npm run build
npm start
```

`npm start` starts only the API server. For a production-style local run, build the client with `npm run build`, start the API with `npm start`, and serve the generated `client/dist` directory using a static web server configured to proxy `/api` requests to port 5000.

For Render and Vercel deployment, see [deploy.md](./deploy.md).

## Features and demo workflow

1. Visit **Report an issue**, enter a name, select a category, describe the issue, and select the actual location on the map.
2. Optionally add a photo. When Gemini is configured, the backend analyzes it and returns a suggested category, severity, description, and action. The estimate is advisory and can be unavailable; it is not an engineering assessment.
3. Submit the report and save the generated complaint ID.
4. View it on the **Dashboard** or use **Track** to look it up by ID.
5. The dashboard and complaint detail page provide demonstration admin controls for status changes and remarks. These controls do not represent government action or integration.

Map tiles are provided by OpenStreetMap and require an internet connection. Complaint markers are shown only for reports with map-selected coordinates; the app does not invent report locations.

## Environment variables

See `server/.env.example`. The client uses Vite's `/api` development proxy and does not need a secret API key.

## Troubleshooting

- **MongoDB connection error:** start the local MongoDB service or correct `MONGODB_URI`; the API will not start without a database.
- **AI unavailable:** check `GEMINI_API_KEY` and network access. Reporting and manual classification remain available.
- **Map tiles missing:** verify internet access; map interaction and selected coordinates are independent of tile loading.
- **Port in use:** change `PORT` in `server/.env` for the API, and set a different Vite port when starting the client if needed.
