from fastapi import APIRouter, HTTPException, Depends
from schemas import ConstituencyRequest, ConstituencyResponse, PollingBooth
import maps_service
from config import get_settings, Settings
import logging

router = APIRouter(prefix="/api/constituency", tags=["Location"])
log = logging.getLogger("votesaathi")

@router.post("", response_model=ConstituencyResponse)
async def get_constituency(body: ConstituencyRequest, settings: Settings = Depends(get_settings)):
    """
    Reverse geocode lat/lng → constituency + nearest polling booths.
    """
    if not settings.has_google_maps_api_key:
        log.warning("Maps API key not set — returning mock constituency data.")
        return ConstituencyResponse(
            constituency="Secunderabad",
            state="Telangana",
            formatted_address="Secunderabad, Hyderabad, Telangana, India",
            booths=[
                PollingBooth(id="mock-1", name="Govt. High School, MG Road", address="MG Road, Secunderabad", lat=body.lat, lng=body.lng),
                PollingBooth(id="mock-2", name="Municipal Corporation Building", address="Clock Tower, Secunderabad", lat=body.lat, lng=body.lng),
                PollingBooth(id="mock-3", name="Community Hall, Trimulgherry", address="Trimulgherry, Secunderabad", lat=body.lat, lng=body.lng),
            ],
        )

    try:
        geocode_result = await maps_service.reverse_geocode(body.lat, body.lng)
        raw_booths = await maps_service.find_polling_booths(body.lat, body.lng)
    except Exception as e:
        log.error(f"Maps API error: {e}")
        raise HTTPException(status_code=502, detail=f"Maps service error: {str(e)}")

    booths = [
        PollingBooth(
            id=b.get("id", str(i)),
            name=b.get("name", f"Booth {i+1}"),
            address=b.get("address", ""),
            lat=b.get("lat"),
            lng=b.get("lng"),
        )
        for i, b in enumerate(raw_booths)
    ]

    return ConstituencyResponse(
        constituency=geocode_result["constituency"],
        state=geocode_result["state"],
        formatted_address=geocode_result["formatted_address"],
        booths=booths,
    )
