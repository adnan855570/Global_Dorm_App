from fastapi import APIRouter, HTTPException
from app.db.mongodb import db
from app.services.geocode_service import postcode_to_coords
from app.services.distance_service import calculate_osrm_distance
from app.services.cache import get_cache, set_cache
from bson.objectid import ObjectId

# This router handles endpoints for external integrations (like geocoding and distance).
router = APIRouter(prefix="/external", tags=["External Services"])

# This is the postcode for the campus. Change this if your campus postcode is different!
CAMPUS_POSTCODE = "E1 4NS"

# Endpoint to get the latitude and longitude of any UK postcode.
@router.get("/geocode")
async def geocode_postcode(postcode: str):
    # Try to get cached coordinates to avoid unnecessary external API calls.
    cache_key = f"geocode:{postcode.strip().replace(' ', '').upper()}"
    result = get_cache(cache_key)
    if result is not None:
        return result

    # If not cached, call the geocoding service to get the coordinates.
    lat, lon = await postcode_to_coords(postcode)
    if lat is None or lon is None:
        raise HTTPException(400, "Could not geocode postcode")
    value = {"latitude": lat, "longitude": lon}
    # Store the result in the cache for future requests.
    set_cache(cache_key, value)
    return value

# Endpoint to calculate the distance from a room to the campus, using room_id.
@router.get("/room-distance")
async def room_to_campus_distance(room_id: str):
    # Some debug printouts to help when developing or troubleshooting!
    print(f"DEBUG: Received room_id: '{room_id}' (length: {len(room_id)})")
    clean_room_id = room_id.strip()
    print(f"DEBUG: Cleaned room_id: '{clean_room_id}' (length: {len(clean_room_id)})")
    try:
        obj_id = ObjectId(clean_room_id)
    except Exception as e:
        print(f"DEBUG: ObjectId conversion error: {e}")
        raise HTTPException(400, "Invalid room ID")

    # Try to get the distance from the cache first for efficiency.
    cache_key = f"distance:{clean_room_id}"
    result = get_cache(cache_key)
    if result is not None:
        return result

    # Find the room in the database. If it's not there, return an error.
    room = await db.rooms.find_one({"_id": obj_id})
    if not room:
        print(f"DEBUG: Room not found for _id: {obj_id}")
        raise HTTPException(404, "Room not found")

    # Geocode both the room's postcode and the campus postcode.
    room_lat, room_lon = await postcode_to_coords(room["postcode"])
    campus_lat, campus_lon = await postcode_to_coords(CAMPUS_POSTCODE)
    if None in (room_lat, room_lon, campus_lat, campus_lon):
        print(f"DEBUG: Failed to geocode postcodes: {room['postcode']} / {CAMPUS_POSTCODE}")
        raise HTTPException(400, "Failed to geocode postcodes")

    # Call the distance calculation service (OSRM) to get distance and duration.
    meters, duration = await calculate_osrm_distance(room_lat, room_lon, campus_lat, campus_lon)
    if meters is None:
        print("DEBUG: OSRM routing failed")
        raise HTTPException(400, "OSRM routing failed")

    # Prepare the result and save it in the cache.
    value = {
        "distance_meters": meters,
        "duration_seconds": duration
    }
    set_cache(cache_key, value)
    return value
