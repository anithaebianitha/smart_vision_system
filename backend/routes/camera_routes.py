"""Camera control, voice parsing, and streaming APIs."""
from __future__ import annotations

from datetime import datetime
from importlib import import_module
import tempfile

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from backend.database import get_db
from backend.vision.camera_manager import CameraManager
from backend.vision.navigation import get_navigation_direction
from backend.vision.object_detection import VisionDetector

router = APIRouter(tags=["camera"])

camera_manager = CameraManager()
detector = VisionDetector()
state = {
    "running": False,
    "detection_enabled": False,
    "camera_available": False,
    "camera_index": None,
    "backend_name": None,
    "last_error": None,
}


def get_cv2():
    return import_module("cv2")


def encode_frame(frame):
    cv2 = get_cv2()
    ok, buffer = cv2.imencode(".jpg", frame)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to encode webcam frame")
    return (
        b"--frame\r\n"
        b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
    )


async def persist_detection(detection):
    await get_db().detections.insert_one(
        {
            "object_name": detection.object_name,
            "confidence": detection.confidence,
            "location": detection.location,
            "timestamp": datetime.utcnow(),
        }
    )


async def frame_generator():
    if not state["running"]:
        raise HTTPException(status_code=400, detail="Camera is not started")

    if not state["camera_available"]:
        opened = camera_manager.open()
        if not opened["camera_available"]:
            state["last_error"] = "Webcam could not be opened on this laptop"
            raise HTTPException(status_code=503, detail=state["last_error"])
        state.update(opened)

    while state["running"]:
        ok, frame = camera_manager.read()
        if not ok:
            state["camera_available"] = False
            state["last_error"] = "Unable to read a frame from the laptop webcam"
            break

        if state["detection_enabled"]:
            detections = detector.detect(frame)
            for item in detections:
                detector.speak_async(f"{item.object_name} detected on your {item.location}")
                await persist_detection(item)

        yield encode_frame(frame)


@router.post("/start-camera")
async def start_camera():
    opened = camera_manager.open()
    state["running"] = opened["camera_available"]
    state["detection_enabled"] = False
    state["camera_available"] = opened["camera_available"]
    state["camera_index"] = opened["camera_index"]
    state["backend_name"] = opened["backend_name"]

    if not opened["camera_available"]:
        state["last_error"] = "Unable to access the laptop camera. Close other apps using the webcam and try again."
        raise HTTPException(status_code=503, detail=state["last_error"])

    state["last_error"] = None
    return state


@router.post("/stop-camera")
async def stop_camera():
    camera_manager.release()
    state["running"] = False
    state["detection_enabled"] = False
    state["camera_available"] = False
    state["camera_index"] = None
    state["backend_name"] = None
    return state


@router.post("/detect-objects")
async def detect_objects():
    if not state["running"] or not state["camera_available"]:
        raise HTTPException(status_code=400, detail="Start the laptop camera before enabling object detection")
    state["detection_enabled"] = True
    return state


@router.post("/navigate")
async def navigate():
    direction = get_navigation_direction()
    detector.speak_async(f"Move {direction}")
    return {"direction": direction}


@router.post("/voice-command")
async def process_voice_command(file: UploadFile = File(...)):
    speech_recognition = import_module("speech_recognition")
    recognizer = speech_recognition.Recognizer()
    with tempfile.NamedTemporaryFile(delete=True, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp.flush()
        with speech_recognition.AudioFile(tmp.name) as source:
            audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
        return {"command": text.lower()}
    except speech_recognition.UnknownValueError as exc:
        raise HTTPException(status_code=400, detail="Could not recognize speech") from exc


@router.get("/camera-feed")
async def camera_feed():
    return StreamingResponse(
        frame_generator(), media_type="multipart/x-mixed-replace; boundary=frame"
    )


@router.get("/status")
async def camera_status():
    return state
