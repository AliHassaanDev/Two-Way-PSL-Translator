from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import UrduToPSLRequest, UrduToPSLResponse
from app.services.urdutopsl_service import urdu_to_psl_service

app = FastAPI(
    title="SignBridge PK API",
    description="Two-Way Pakistani Sign Language (PSL) Communication Assistant API with urdutopsl model pipeline",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "SignBridge PK - PSL Communication API",
        "status": "online",
        "models": {
            "urdu_to_psl": {
                "name": "urdutopsl",
                "artifact": "urdutopsl.onnx",
                "version": "1.0.0-hybrid",
                "status": "ready"
            }
        }
    }

@app.post("/api/translate/urdu-to-psl", response_model=UrduToPSLResponse)
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

@app.get("/api/model-info")
def model_info():
    return {
        "model_name": "urdutopsl",
        "supported_datasets": ["DynamicWordLevelPakistanSignLanguage", "UAlpha40"],
        "architecture": "Hybrid Sequence Embedding + PSL Fingerspelling Fallback",
        "exported_format": "ONNX / PyTorch"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
