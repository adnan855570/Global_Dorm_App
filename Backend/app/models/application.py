from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# This model is used when a user submits an application for a room.
class ApplicationCreate(BaseModel):
    room_id: str  # The ID of the room the user wants to apply for.

# This model is used if the status of an application needs to be updated
# (like cancelling or approving an application).
class ApplicationStatusUpdate(BaseModel):
    status: str  # For example: "cancelled", "approved", "pending", etc.

# Internal model to represent how the application looks in the database (includes MongoDB _id).
class ApplicationInDB(BaseModel):
    id: str = Field(..., alias="_id")  # This maps the MongoDB "_id" to "id" for easier access.
    user_email: str  # The email of the user who applied.
    room_id: str     # The ID of the room.
    status: str      # Current status of the application.
    applied_at: datetime  # When the application was created.

# Public model for API responses (what you send to the frontend).
class ApplicationPublic(BaseModel):
    id: str
    user_email: str
    room_id: str
    status: str
    applied_at: datetime
