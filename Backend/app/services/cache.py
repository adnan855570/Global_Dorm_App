import time

# This simple dictionary will hold our cache data.
# Each key maps to a tuple: (timestamp when cached, the actual value)
_CACHE = {}

def get_cache(key: str, expire_seconds: int = 600):
    """
    Get a value from the cache.
    - key: cache key (usually a string related to the API query)
    - expire_seconds: how long (in seconds) the cache is valid for (default: 10 minutes)
    Returns the cached value if found and not expired, otherwise None.
    """
    now = time.time()
    if key in _CACHE:
        timestamp, value = _CACHE[key]
        # If value is still fresh, return it
        if now - timestamp < expire_seconds:
            return value
        else:
            # If value is too old, remove it from cache
            del _CACHE[key]
    return None

def set_cache(key: str, value):
    """
    Set a value in the cache.
    Stores the current time along with the value for expiration checking.
    """
    _CACHE[key] = (time.time(), value)
