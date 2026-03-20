"""Pydantic models used across the API."""
from datetime import datetime
from pydantic import BaseModel, Field


class DetectionBase(BaseModel):
    object_name: str = Field(..., examples=["person"])
    confidence: float = Field(..., ge=0, le=1)
    location: str = Field(..., examples=["left"])
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class DetectionCreate(DetectionBase):
    pass


class DetectionUpdate(BaseModel):
    object_name: str | None = None
    confidence: float | None = Field(default=None, ge=0, le=1)
    location: str | None = None


class DetectionInDB(DetectionBase):
    id: str


class CameraState(BaseModel):
    running: bool
    detection_enabled: bool
