from fastapi import APIRouter, HTTPException, status, Depends
from app.models.application import ApplicationCreate, ApplicationPublic, ApplicationStatusUpdate
from app.db.mongodb import db
from app.auth.dependencies import get_current_user
from bson.objectid import ObjectId
from datetime import datetime

# This router handles all endpoints related to room applications.
router = APIRouter(prefix="/applications", tags=["Applications"])

# Helper function to convert MongoDB application documents into a more friendly format for our API responses.
def application_serializer(application):
    return {
        "id": str(application["_id"]),
        "user_email": application["user_email"],
        "room_id": application["room_id"],
        "status": application["status"],
        "applied_at": application["applied_at"]
    }

# Endpoint to apply for a room
@router.post("/", response_model=ApplicationPublic, status_code=201)
async def apply_for_room(data: ApplicationCreate, user=Depends(get_current_user)):
    # First, check if the room exists before allowing the user to apply.
    room = await db.rooms.find_one({"_id": ObjectId(data.room_id)})
    if not room:
        raise HTTPException(404, "Room not found")
    # Prevent users from applying more than once to the same room.
    existing = await db.applications.find_one({"user_email": user, "room_id": data.room_id, "status": "applied"})
    if existing:
        raise HTTPException(400, "Already applied for this room.")
    # If checks pass, create a new application document.
    doc = {
        "user_email": user,
        "room_id": data.room_id,
        "status": "applied",
        "applied_at": datetime.utcnow()
    }
    # Insert the application into the MongoDB collection.
    result = await db.applications.insert_one(doc)
    # Fetch and return the newly created application using the helper serializer.
    new_app = await db.applications.find_one({"_id": result.inserted_id})
    return application_serializer(new_app)

# Endpoint to get all of the current user's applications.
@router.get("/", response_model=list[ApplicationPublic])
async def get_my_applications(user=Depends(get_current_user)):
    apps = []
    # Search for all applications where the user_email matches the current user.
    async for app in db.applications.find({"user_email": user}):
        apps.append(application_serializer(app))
    return apps

# Endpoint to get a specific application by its ID.
@router.get("/{application_id}", response_model=ApplicationPublic)
async def get_application_by_id(application_id: str, user=Depends(get_current_user)):
    # Validate that the application ID is a valid MongoDB ObjectId.
    if not ObjectId.is_valid(application_id):
        raise HTTPException(400, "Invalid application ID")
    # Find the application and make sure it belongs to the current user.
    app = await db.applications.find_one({"_id": ObjectId(application_id)})
    if not app or app["user_email"] != user:
        raise HTTPException(404, "Application not found")
    return application_serializer(app)

# Endpoint to cancel an application.
@router.patch("/{application_id}/cancel", response_model=ApplicationPublic)
async def cancel_application(application_id: str, user=Depends(get_current_user)):
    # Again, check that the ID is valid.
    if not ObjectId.is_valid(application_id):
        raise HTTPException(400, "Invalid application ID")
    # Find the application for this user.
    app = await db.applications.find_one({"_id": ObjectId(application_id)})
    if not app or app["user_email"] != user:
        raise HTTPException(404, "Application not found")
    # Don't allow cancellation if it's already cancelled.
    if app["status"] == "cancelled":
        raise HTTPException(400, "Application already cancelled")
    # Set the status of the application to 'cancelled'.
    await db.applications.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": {"status": "cancelled"}}
    )
    # Return the updated application to the client.
    updated_app = await db.applications.find_one({"_id": ObjectId(application_id)})
    return application_serializer(updated_app)
