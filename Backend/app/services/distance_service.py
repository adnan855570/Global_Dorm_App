import httpx

async def calculate_osrm_distance(start_lat, start_lon, end_lat, end_lon):
    """
    Calculates the driving distance and estimated duration between two points
    using the free public OSRM API.

    Args:
        start_lat (float): Latitude of the starting point
        start_lon (float): Longitude of the starting point
        end_lat (float): Latitude of the destination
        end_lon (float): Longitude of the destination

    Returns:
        (meters, duration): Tuple containing the distance in meters and time in seconds
        Returns (None, None) if OSRM fails or no route found.
    """
    # OSRM expects longitude,latitude order!
    url = f"http://router.project-osrm.org/route/v1/driving/{start_lon},{start_lat};{end_lon},{end_lat}?overview=false"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code == 200:
            data = resp.json()
            # If at least one route is found, return its distance and duration
            if data.get("routes"):
                meters = data["routes"][0]["distance"]
                duration = data["routes"][0]["duration"]
                return meters, duration
    # If anything goes wrong or no routes, return None
    return None, None
