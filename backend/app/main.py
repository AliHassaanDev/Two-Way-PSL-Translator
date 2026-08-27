from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import translation, speech, animations

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

# Include Routers
app.include_router(translation.router)
app.include_router(speech.router)
app.include_router(animations.router)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
