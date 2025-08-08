from pydantic import BaseModel, EmailStr, Field

# Used when a user registers (signs up). Requires an email and password.
class UserCreate(BaseModel):
    email: EmailStr  # Validates that the email is a proper address
    password: str    # Plain password (will be hashed before storing)

# Used when a user tries to log in. Same fields as registration.
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Internal use only: represents how users are stored in MongoDB.
class UserInDB(BaseModel):
    email: EmailStr
    hashed_password: str  # Only store the hashed version of the password!

# What the API will return to the frontend (never exposes the password!).
class UserPublic(BaseModel):
    email: EmailStr
