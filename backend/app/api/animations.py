from fastapi import APIRouter, HTTPException
from app.models.schemas import AnimationMetadataResponse
from app.services.animation_service import animation_service

router = APIRouter(prefix="/api")

@router.get("/animations/{token}", response_model=AnimationMetadataResponse)
def get_animation_metadata(token: str):
    """
    Looks up a PSL sign token and returns the metadata of the corresponding 3D animation asset.
    """
    try:
        data = animation_service.get_animation(token)
        return {
            "token": token,
            "asset_url": f"/animations/{data['asset']}",
            "type": data["type"],
            "duration_ms": data["duration_ms"],
            "loop": data["loop"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
