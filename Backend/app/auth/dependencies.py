from passlib.context import CryptContext

# Set up the password context using bcrypt for secure hashing.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash a plain-text password using bcrypt. This function is used
    whenever a new user registers, so we never store plain passwords.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compare a plain password (user input) against the hashed password in the database.
    Used for login authentication.
    """
    return pwd_context.verify(plain_password, hashed_password)

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt_handler import decode_access_token

# This sets up OAuth2 "Password Bearer" for JWT-based auth.
# tokenUrl is the login endpoint (where frontend POSTs to get a token).
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    This dependency is used for all protected endpoints.
    It decodes the JWT access token from the Authorization header
    and returns the user's email (from the "sub" field in JWT payload).
    """
    payload = decode_access_token(token)
    # If token is missing or invalid, raise an error so user can't access protected routes.
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return payload["sub"]  # This will be the user's email
