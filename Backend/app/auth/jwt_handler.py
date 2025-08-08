import os
from datetime import datetime, timedelta
from jose import JWTError, jwt

# Secret key for signing JWTs, loaded from environment variable for security.
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"  # Using HMAC-SHA256 algorithm for JWTs.
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Tokens are valid for 1 hour.

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Creates a signed JWT access token.
    - data: A dict containing data to encode (e.g. {'sub': user_email}).
    - expires_delta: Optional custom token expiry. Defaults to 60 minutes.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})  # Add expiration time to the payload.
    # Return encoded JWT string (signed with our SECRET_KEY).
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    """
    Decodes a JWT access token.
    - Returns the payload if token is valid and not expired.
    - Returns None if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # If anything goes wrong (invalid, expired, wrong signature), return None.
        return None
