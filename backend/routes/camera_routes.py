"""Camera control, voice parsing, and streaming APIs."""
from __future__ import annotations

from datetime import datetime
from importlib import import_module
import tempfile

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from backend.database import get_db
from backend.models import CameraState
from backend.vision.navigation import get_navigation_direction
from backend.vision.object_detection import VisionDetector

router = APIRouter(tags=["camera"])

state = {
    "running": False,
    "detection_enabled": False,
    "camera_available": False,
    "last_error": None,
}
detector = VisionDetector()


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
    cv2 = get_cv2()
    capture = cv2.VideoCapture(0)
    if not capture.isOpened():
        state["camera_available"] = False
        state["last_error"] = "Webcam could not be opened on device index 0"
        raise HTTPException(status_code=503, detail=state["last_error"])

    state["camera_available"] = True
    state["last_error"] = None
    try:
        while state["running"]:
            ok, frame = capture.read()
            if not ok:
                state["last_error"] = "Unable to read a frame from the webcam"
                break

            if state["detection_enabled"]:
                detections = detector.detect(frame)
                for item in detections:
                    detector.speak_async(f"{item.object_name} detected on your {item.location}")
                    await persist_detection(item)

            yield encode_frame(frame)
    finally:
        capture.release()
        state["camera_available"] = False


@router.post("/start-camera")
async def start_camera():
    state["running"] = True
    state["last_error"] = None
    return state


@router.post("/stop-camera")
async def stop_camera():
    state["running"] = False
    state["detection_enabled"] = False
    return state


@router.post("/detect-objects")
async def detect_objects():
    if not state["running"]:
        raise HTTPException(status_code=400, detail="Start the camera before enabling object detection")
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
