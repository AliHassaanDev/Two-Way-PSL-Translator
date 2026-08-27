from fastapi import APIRouter, HTTPException
from app.models.schemas import UrduToPSLRequest, UrduToPSLResponse
from app.services.urdutopsl_service import urdu_to_psl_service

router = APIRouter(prefix="/api")

@router.post("/translate/urdu-to-psl", response_model=UrduToPSLResponse)
def translate_urdu_to_psl(payload: UrduToPSLRequest):
    """
    Translates input Urdu text into Pakistani Sign Language gloss tokens and 3D avatar animation poses.
    Uses the urdutopsl model architecture with word-level sign mapping and fingerspelling fallback.
    """
    try:
        response = urdu_to_psl_service.translate(payload)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-info")
def model_info():
    return {
        "model_name": "urdutopsl",
        "supported_datasets": ["DynamicWordLevelPakistanSignLanguage", "UAlpha40"],
        "architecture": "Hybrid Sequence Embedding + PSL Fingerspelling Fallback",
        "exported_format": "ONNX / PyTorch"
    }
