"""YOLO-based object detection and speech guidance."""
from __future__ import annotations

from dataclasses import dataclass
from threading import Lock, Thread
import pyttsx3

try:
    from ultralytics import YOLO
except Exception:  # pragma: no cover - optional during local setup
    YOLO = None

from .navigation import get_location_from_bbox

TARGET_CLASSES = {"person", "chair", "table", "bottle", "laptop", "door"}


@dataclass
class DetectedObject:
    object_name: str
    confidence: float
    location: str


class VisionDetector:
    """Wrapper around YOLOv8 inference with optional audio feedback."""

    def __init__(self) -> None:
        self.model = YOLO("yolov8n.pt") if YOLO else None
        self.tts_engine = pyttsx3.init()
        self._speech_lock = Lock()

    def detect(self, frame) -> list[DetectedObject]:
        if self.model is None:
            return []

        results = self.model.predict(source=frame, conf=0.45, verbose=False)
        detections: list[DetectedObject] = []
        for result in results:
            names = result.names
            for box in result.boxes:
                cls_idx = int(box.cls[0])
                object_name = names[cls_idx]
                if object_name not in TARGET_CLASSES:
                    continue

                x1, _, x2, _ = map(int, box.xyxy[0].tolist())
                location = get_location_from_bbox(x1, x2, frame.shape[1])
                detections.append(
                    DetectedObject(
                        object_name=object_name,
                        confidence=float(box.conf[0]),
                        location=location,
                    )
                )
        return detections

    def speak_async(self, message: str) -> None:
        def _speak() -> None:
            with self._speech_lock:
                self.tts_engine.say(message)
                self.tts_engine.runAndWait()

        Thread(target=_speak, daemon=True).start()
