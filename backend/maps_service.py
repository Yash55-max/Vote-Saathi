"""
Google Maps service — reverse geocoding and polling booth lookup.
"""
from __future__ import annotations

import httpx
from config import get_settings

settings = get_settings()

GEOCODE_URL    = "https://maps.googleapis.com/maps/api/geocode/json"
PLACES_URL     = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"


async def reverse_geocode(lat: float, lng: float) -> dict:
    """
    Convert lat/lng → constituency + state via Google Geocoding API.
    Returns dict with keys: constituency, state, formatted_address.
    """
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(GEOCODE_URL, params={
            "latlng": f"{lat},{lng}",
            "key": settings.google_maps_api_key,
            "language": "en",
        })
    data = resp.json()

    result = {
        "constituency": "Unknown",
        "state": "Unknown",
        "formatted_address": "",
    }

    import logging
    log = logging.getLogger("votesaathi")
    
    if data.get("status") != "OK":
        log.error(f"Google Maps API Error: {data.get('status')} - {data.get('error_message', 'No error message')}")
        return result

    if not data.get("results"):
        log.warning(f"Google Maps API: No results found for coordinates {lat}, {lng}")
        return result

    if data.get("status") == "OK" and data.get("results"):
        components = data["results"][0].get("address_components", [])
        result["formatted_address"] = data["results"][0].get("formatted_address", "")
        for comp in components:
            types = comp.get("types", [])
            if "administrative_area_level_3" in types or "sublocality_level_1" in types:
                result["constituency"] = comp.get("long_name", "Unknown")
                break
            if "administrative_area_level_2" in types or "locality" in types:
                # Fallback to district/city if sub-district is missing
                result["constituency"] = comp.get("long_name", "Unknown")
            if "administrative_area_level_1" in types:
                result["state"] = comp.get("long_name", "Unknown")

    return result


async def find_polling_booths(lat: float, lng: float) -> list[dict]:
    """
    Find nearby government buildings / polling stations via Places API.
    Returns list of booth dicts.
    """
    # In production, use a real election booth dataset or ECI API.
    # This uses Places API as a proxy — searching for government offices.
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(PLACES_URL, params={
            "location": f"{lat},{lng}",
            "radius": 3000,
            "type": "local_government_office",
            "key": settings.google_maps_api_key,
            "language": "en",
        })
    data = resp.json()
    booths = []
    for place in data.get("results", [])[:5]:
        geo = place.get("geometry", {}).get("location", {})
        booths.append({
            "id": place.get("place_id"),
            "name": place.get("name"),
            "address": place.get("vicinity"),
            "lat": geo.get("lat"),
            "lng": geo.get("lng"),
        })
    return booths
