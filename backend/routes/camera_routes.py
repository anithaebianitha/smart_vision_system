"""Camera control, voice parsing, and streaming APIs."""
from __future__ import annotations

from datetime import datetime
import tempfile
import cv2
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
import speech_recognition as sr

from database import get_db
from models import CameraState
from vision.navigation import get_navigation_direction
from vision.object_detection import VisionDetector

router = APIRouter(tags=["camera"])

detector = VisionDetector()
state = {"running": False, "detection_enabled": False}


def encode_frame(frame):
    _, buffer = cv2.imencode(".jpg", frame)
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
    capture = cv2.VideoCapture(0)
    try:
        while state["running"]:
            ok, frame = capture.read()
            if not ok:
                break

            if state["detection_enabled"]:
                detections = detector.detect(frame)
                for item in detections:
                    detector.speak_async(f"{item.object_name} detected on your {item.location}")
                    await persist_detection(item)

            yield encode_frame(frame)
    finally:
        capture.release()


@router.post("/start-camera", response_model=CameraState)
async def start_camera():
    state["running"] = True
    return state


@router.post("/stop-camera", response_model=CameraState)
async def stop_camera():
    state["running"] = False
    state["detection_enabled"] = False
    return state


@router.post("/detect-objects", response_model=CameraState)
async def detect_objects():
    state["detection_enabled"] = True
    return state


@router.post("/navigate")
async def navigate():
    direction = get_navigation_direction()
    detector.speak_async(f"Move {direction}")
    return {"direction": direction}


@router.post("/voice-command")
async def process_voice_command(file: UploadFile = File(...)):
    recognizer = sr.Recognizer()
    with tempfile.NamedTemporaryFile(delete=True, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp.flush()
        with sr.AudioFile(tmp.name) as source:
            audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
        return {"command": text.lower()}
    except sr.UnknownValueError as exc:
        raise HTTPException(status_code=400, detail="Could not recognize speech") from exc


@router.get("/camera-feed")
async def camera_feed():
    return StreamingResponse(
        frame_generator(), media_type="multipart/x-mixed-replace; boundary=frame"
    )


@router.get("/status", response_model=CameraState)
async def camera_status():
    return state
