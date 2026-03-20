"""MongoDB connection helpers."""
from motor.motor_asyncio import AsyncIOMotorClient
from os import getenv

MONGO_URI = getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = getenv("MONGO_DB_NAME", "smart_vision")

client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    """Create or return a singleton MongoDB client."""
    global client
    if client is None:
        client = AsyncIOMotorClient(MONGO_URI)
    return client


def get_db():
    """Return configured application database."""
    return get_client()[MONGO_DB_NAME]
