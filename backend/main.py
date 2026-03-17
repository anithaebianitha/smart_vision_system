"""FastAPI entry point for Smart Vision System backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.camera_routes import router as camera_router
from routes.detection_routes import router as detection_router

app = FastAPI(title="Smart Vision System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"message": "Smart Vision backend is running"}


app.include_router(detection_router)
app.include_router(camera_router)
