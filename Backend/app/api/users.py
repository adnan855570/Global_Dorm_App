from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, UserPublic
from app.db.mongodb import db
from app.auth.dependencies import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from bson.objectid import ObjectId

# This router manages all endpoints for user registration and login.
router = APIRouter(prefix="/users", tags=["Users"])

# Register a new user (student or landlord)
@router.post("/register", response_model=UserPublic)
async def register(user: UserCreate):
    # First, check if the email is already registered.
    existing = await db.users.find_one({"email": user.email})
    if existing:
        # If a user already exists with this email, return an error.
        raise HTTPException(status_code=400, detail="Email already registered")
    # If not, hash the user's password before saving (never store plain text!).
    hashed_pw = hash_password(user.password)
    await db.users.insert_one({"email": user.email, "hashed_password": hashed_pw})
    # Only return the public-facing user info, never the password!
    return UserPublic(email=user.email)

# User login endpoint
@router.post("/login")
async def login(user: UserLogin):
    # Look up the user by email.
    db_user = await db.users.find_one({"email": user.email})
    # If user doesn't exist or the password doesn't match, return error.
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    # If login is successful, create a JWT token with the user's email as the subject.
    token = create_access_token({"sub": user.email})
    # Return the token and token type, which the frontend will use for authentication.
    return {"access_token": token, "token_type": "bearer"}
