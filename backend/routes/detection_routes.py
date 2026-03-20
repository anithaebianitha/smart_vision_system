"""CRUD APIs for detection history."""
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException

from backend.database import get_db
from backend.models import DetectionCreate, DetectionUpdate

router = APIRouter(prefix="/detections", tags=["detections"])


def serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


def parse_id(detection_id: str) -> ObjectId:
    try:
        return ObjectId(detection_id)
    except InvalidId as exc:
        raise HTTPException(status_code=400, detail="Invalid detection id") from exc


@router.get("")
async def get_detections():
    docs = await get_db().detections.find().sort("timestamp", -1).to_list(500)
    return [serialize(doc) for doc in docs]


@router.get("/{detection_id}")
async def get_detection(detection_id: str):
    doc = await get_db().detections.find_one({"_id": parse_id(detection_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Detection not found")
    return serialize(doc)


@router.post("")
async def create_detection(payload: DetectionCreate):
    result = await get_db().detections.insert_one(payload.model_dump())
    doc = await get_db().detections.find_one({"_id": result.inserted_id})
    return serialize(doc)


@router.put("/{detection_id}")
async def update_detection(detection_id: str, payload: DetectionUpdate):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    await get_db().detections.update_one({"_id": parse_id(detection_id)}, {"$set": updates})
    doc = await get_db().detections.find_one({"_id": parse_id(detection_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Detection not found")
    return serialize(doc)


@router.delete("/{detection_id}")
async def delete_detection(detection_id: str):
    result = await get_db().detections.delete_one({"_id": parse_id(detection_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Detection not found")
    return {"status": "deleted"}
