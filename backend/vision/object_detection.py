"""YOLO-based object detection and speech guidance."""
from __future__ import annotations

from dataclasses import dataclass
from importlib import import_module
from threading import Lock, Thread

from backend.vision.navigation import get_location_from_bbox

TARGET_CLASSES = {"person", "chair", "table", "bottle", "laptop", "door"}


@dataclass
class DetectedObject:
    object_name: str
    confidence: float
    location: str


class VisionDetector:
    """Wrapper around YOLOv8 inference with optional audio feedback."""

    def __init__(self) -> None:
        self.model = None
        self.tts_engine = None
        self._speech_lock = Lock()

    def _ensure_model(self) -> None:
        if self.model is not None:
            return
        ultralytics = import_module("ultralytics")
        self.model = ultralytics.YOLO("yolov8n.pt")

    def _ensure_tts(self) -> None:
        if self.tts_engine is not None:
            return
        pyttsx3 = import_module("pyttsx3")
        self.tts_engine = pyttsx3.init()

    def detect(self, frame) -> list[DetectedObject]:
        self._ensure_model()
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
            self._ensure_tts()
            with self._speech_lock:
                self.tts_engine.say(message)
                self.tts_engine.runAndWait()

        Thread(target=_speak, daemon=True).start()
