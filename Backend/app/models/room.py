from pydantic import BaseModel, Field
from typing import Optional

# This base class has all the common fields every room should have.
class RoomBase(BaseModel):
    title: str  # Short name for the room (e.g., "Large Ensuite")
    description: Optional[str] = None  # Optional longer description
    address: str  # Full address of the property
    price_per_month: float  # Monthly rent in pounds
    postcode: str  # UK postcode

# Used for creating new rooms (inherits all fields from RoomBase).
class RoomCreate(RoomBase):
    pass

# Used for updating rooms. All fields are optional so you can PATCH just one field.
class RoomUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    price_per_month: Optional[float] = None
    postcode: Optional[str] = None

# Internal model for MongoDB with _id field (aliased as "id" for Pythonic access).
class RoomInDB(RoomBase):
    id: str = Field(..., alias="_id")

# What the frontend and API will actually see (no Mongo-specific stuff, just a nice "id" field).
class RoomPublic(RoomBase):
    id: str
