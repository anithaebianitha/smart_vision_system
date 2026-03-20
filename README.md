# Voice-Controlled Real-Time Smart Vision System for Audio-Guided Object Detection and Navigation

A full-stack college final-year project that combines **React + FastAPI + MongoDB** for voice-controlled smart vision assistance.

## Tech Stack
- **Frontend:** React.js, Bootstrap 5, Axios, Web Speech API, Chart.js
- **Backend:** FastAPI, OpenCV, YOLOv8 (`ultralytics`), SpeechRecognition, pyttsx3
- **Database:** MongoDB with Motor/PyMongo-compatible schema

## Architecture
`React Frontend → FastAPI Backend → MongoDB`

## Folder Structure
```text
smart_vision_system/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── camera_routes.py
│   │   └── detection_routes.py
│   └── vision/
│       ├── camera_manager.py
│       ├── navigation.py
│       └── object_detection.py
├── frontend/
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── CameraFeed.js
│       │   ├── VoiceControl.js
│       │   ├── ObjectList.js
│       │   └── DetectionTable.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── VisionSystem.js
│       │   ├── History.js
│       │   └── Dashboard.js
│       └── services/api.js
└── .env.example
```

## MongoDB Schema
Collection: **`detections`**

```json
{
  "_id": "ObjectId",
  "object_name": "person",
  "confidence": 0.92,
  "location": "front",
  "timestamp": "2026-03-05T10:45:00"
}
```

## Backend Setup (Port 8000)
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp .env.example .env
uvicorn backend.main:app --reload --port 8000
```

## Frontend Setup (Port 3000)
```bash
cd frontend
npm install
copy ..\.env.example .env   # Windows Command Prompt
# or: cp ../.env.example .env  # Git Bash / macOS / Linux
npm start
```

## API Documentation
FastAPI docs available at:
- API root: `http://localhost:8000/`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Detection APIs
- `GET /detections`
- `GET /detections/{id}`
- `POST /detections`
- `PUT /detections/{id}`
- `DELETE /detections/{id}`

### Camera & Navigation APIs
- `POST /start-camera`
- `POST /stop-camera`
- `POST /detect-objects`
- `POST /navigate`
- `POST /voice-command`
- `GET /camera-feed`
- `GET /status`

## Voice Commands (Frontend)
- “Start camera”
- “Stop camera”
- “Detect objects”
- “Navigate”

## Features Implemented
1. Voice command capture with Web Speech API
2. Real-time camera streaming and YOLOv8 inference
3. Audio guidance using pyttsx3
4. Simulated navigation guidance
5. Detection history stored in MongoDB
6. Modern dashboard UI with object distribution chart
7. Full CRUD admin APIs
8. CORS-enabled FastAPI backend
9. Environment-based configuration

## Notes
- YOLO model `yolov8n.pt` downloads on first run.
- Webcam access is required for live detection.
- pyttsx3/speech packages may require OS audio backends.


## Backend not running? Quick fixes
- Install backend dependencies first: `pip install -r backend/requirements.txt`.
- Start the API from the project root with `uvicorn backend.main:app --reload --port 8000`.
- Open `http://localhost:8000/` to verify the backend is up.
- Open `http://localhost:8000/docs` for the API UI.
- If webcam streaming fails, the backend still starts, but `/camera-feed` returns a `503` until a webcam is available.


## Frontend troubleshooting
- On Windows, the old `PORT=3000 react-scripts start` style can fail in Command Prompt. The frontend now uses `cross-env`, so `npm start` works on Windows too.
- If the UI shows API errors, make sure the backend is running at `http://localhost:8000`.
- If needed, create `frontend/.env` with `REACT_APP_API_URL=http://localhost:8000`.


## Laptop camera troubleshooting
- The backend now attempts to open the laptop webcam using multiple OpenCV backends (`CAP_DSHOW`, `CAP_MSMF`, `CAP_ANY`).
- The frontend also requests browser camera permission with `getUserMedia()` so the user can immediately see the laptop camera preview.
- If camera start fails, close Zoom/Meet/Camera app and try again because only one app may hold the webcam.
