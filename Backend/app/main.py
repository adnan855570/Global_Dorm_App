from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.db.mongodb import db
from app.api.users import router as user_router
from app.api.rooms import router as rooms_router
from app.api.applications import router as applications_router
from app.api.external_services import router as external_router   # Import the external services router
from app.auth.dependencies import get_current_user

# Initialize the FastAPI app with some basic metadata.
app = FastAPI(
    title="Global Dorm API",
    description="Accommodation finder and integration API for international students",
    version="1.0.0"
)

# Enable CORS so that the frontend (like React) can make API calls.
# In production, you should specify the real frontend domain instead of ["*"]!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev/testing.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all the routers for different parts of the API.
app.include_router(user_router)           # Handles user registration/login
app.include_router(rooms_router)          # Handles room listings CRUD
app.include_router(applications_router)   # Handles applications for rooms
app.include_router(external_router)       # Handles external services (geocode, distance)

@app.get("/")
async def root():
    """
    Welcome route.
    Quick way to check if the API is running.
    """
    return {"message": "Welcome to Global Dorm API!"}

@app.get("/db-status")
async def db_status():
    """
    Returns a list of collections in the MongoDB database.
    Use this to quickly verify your DB connection is working.
    """
    collections = await db.list_collection_names()
    return {"ok": True, "collections": collections}

@app.get("/protected")
async def protected_route(current_user: str = Depends(get_current_user)):
    """
    Simple protected route example.
    Returns a welcome message if you are logged in with a valid JWT.
    """
    return {"msg": f"Hello {current_user}, you are authenticated!"}
