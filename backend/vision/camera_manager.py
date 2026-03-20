"""Helpers for opening and reading from the system webcam reliably."""
from __future__ import annotations

from importlib import import_module
from threading import Lock


class CameraManager:
    """Manage a shared OpenCV capture instance for the laptop webcam."""

    def __init__(self) -> None:
        self.capture = None
        self.camera_index = None
        self.backend_name = None
        self._lock = Lock()

    def _get_cv2(self):
        return import_module("cv2")

    def _candidate_sources(self):
        cv2 = self._get_cv2()
        return [
            (0, getattr(cv2, "CAP_DSHOW", 700)),
            (0, getattr(cv2, "CAP_MSMF", 1400)),
            (0, getattr(cv2, "CAP_ANY", 0)),
            (1, getattr(cv2, "CAP_ANY", 0)),
        ]

    def open(self) -> dict:
        with self._lock:
            if self.capture is not None and self.capture.isOpened():
                return {
                    "camera_available": True,
                    "camera_index": self.camera_index,
                    "backend_name": self.backend_name,
                }

            cv2 = self._get_cv2()
            for index, backend in self._candidate_sources():
                capture = cv2.VideoCapture(index, backend)
                if capture is not None and capture.isOpened():
                    self.capture = capture
                    self.camera_index = index
                    self.backend_name = str(backend)
                    return {
                        "camera_available": True,
                        "camera_index": index,
                        "backend_name": str(backend),
                    }
                if capture is not None:
                    capture.release()

            self.capture = None
            self.camera_index = None
            self.backend_name = None
            return {
                "camera_available": False,
                "camera_index": None,
                "backend_name": None,
            }

    def read(self):
        with self._lock:
            if self.capture is None or not self.capture.isOpened():
                return False, None
            return self.capture.read()

    def release(self) -> None:
        with self._lock:
            if self.capture is not None:
                self.capture.release()
            self.capture = None
            self.camera_index = None
            self.backend_name = None
