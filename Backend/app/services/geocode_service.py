import httpx

async def postcode_to_coords(postcode: str):
    """
    Converts a UK postcode to (latitude, longitude) using the free postcodes.io API.
    Returns (None, None) if the postcode is not found or if the API fails.

    Args:
        postcode (str): The UK postcode to look up.

    Returns:
        (latitude, longitude): Tuple of floats, or (None, None) on error.
    """
    # Remove spaces and extra characters from the postcode to keep the API happy.
    clean_postcode = postcode.strip().replace(' ', '')
    url = f"https://api.postcodes.io/postcodes/{clean_postcode}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        # Print debug info (useful for testing/diagnosing failures)
        print(f"DEBUG: Postcodes.io status {resp.status_code}, url={url}, body={resp.text}")
        if resp.status_code == 200:
            data = resp.json()
            # Only return coordinates if the postcode was actually found.
            if data["status"] == 200 and data["result"]:
                result = data["result"]
                return result["latitude"], result["longitude"]
    # If postcode is not valid or something went wrong, return None
    return None, None
