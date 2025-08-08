from fastapi import APIRouter, HTTPException, status, Depends
from app.models.room import RoomCreate, RoomUpdate, RoomPublic
from app.db.mongodb import db
from app.auth.dependencies import get_current_user
from bson.objectid import ObjectId

# This router takes care of all room-related endpoints.
router = APIRouter(prefix="/rooms", tags=["Rooms"])

def room_serializer(room):
    """
    Helper function: Converts the MongoDB room object into a Python dict
    that works well for JSON responses in our API.
    """
    return {
        "id": str(room["_id"]),
        "title": room["title"],
        "description": room.get("description"),
        "address": room["address"],
        "price_per_month": room["price_per_month"],
        "postcode": room["postcode"]
    }

# Endpoint to create a new room listing.
@router.post("/", response_model=RoomPublic, status_code=201)
async def create_room(room: RoomCreate, user=Depends(get_current_user)):
    # Only authenticated users can create a room.
    result = await db.rooms.insert_one(room.dict())
    # After creating, fetch the new room from the DB and return it.
    new_room = await db.rooms.find_one({"_id": result.inserted_id})
    return room_serializer(new_room)

# Endpoint to get all rooms (for students to browse).
@router.get("/", response_model=list[RoomPublic])
async def list_rooms():
    rooms = []
    # Go through every room in the collection and serialize for API response.
    async for room in db.rooms.find():
        rooms.append(room_serializer(room))
    return rooms

# Endpoint to get details of a single room by its ID.
@router.get("/{room_id}", response_model=RoomPublic)
async def get_room(room_id: str):
    # Ensure room_id is a valid MongoDB ObjectId string.
    if not ObjectId.is_valid(room_id):
        raise HTTPException(400, "Invalid room ID")
    room = await db.rooms.find_one({"_id": ObjectId(room_id)})
    if not room:
        raise HTTPException(404, "Room not found")
    return room_serializer(room)

# Endpoint to update an existing room (owner only, in real-world).
@router.put("/{room_id}", response_model=RoomPublic)
async def update_room(room_id: str, data: RoomUpdate, user=Depends(get_current_user)):
    # Again, check the ID is valid.
    if not ObjectId.is_valid(room_id):
        raise HTTPException(400, "Invalid room ID")
    # Only update fields that are provided (not None).
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    # Ensure price is always a float if it's being updated.
    if "price_per_month" in update_data:
        update_data["price_per_month"] = float(update_data["price_per_month"])
    # If nothing was sent to update, show error.
    if not update_data:
        raise HTTPException(400, "No data provided to update")
    # Try to update the room. If not found, error.
    result = await db.rooms.update_one({"_id": ObjectId(room_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(404, "Room not found")
    # Fetch and return the updated room.
    room = await db.rooms.find_one({"_id": ObjectId(room_id)})
    return room_serializer(room)

# Endpoint to delete a room listing (for admin/owner).
@router.delete("/{room_id}", status_code=204)
async def delete_room(room_id: str, user=Depends(get_current_user)):
    # Validate ID.
    if not ObjectId.is_valid(room_id):
        raise HTTPException(400, "Invalid room ID")
    # Delete the room and check if it actually existed.
    result = await db.rooms.delete_one({"_id": ObjectId(room_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Room not found")
    # 204 status means "No Content" so we return nothing.
    return
