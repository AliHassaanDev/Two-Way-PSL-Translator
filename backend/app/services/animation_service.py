import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class AnimationService:
    def __init__(self):
        self.registry = {}
        self.load_registry()

    def load_registry(self):
        # backend/data/animation_registry.json
        registry_path = Path(__file__).parent.parent.parent / "data" / "animation_registry.json"
        if registry_path.exists():
            with open(registry_path, "r", encoding="utf-8") as f:
                self.registry = json.load(f)
            logger.info(f"Loaded {len(self.registry)} animations from registry.")
        else:
            logger.warning(f"Animation registry not found at {registry_path}")

    def get_animation(self, token: str) -> dict:
        """
        Retrieves animation metadata for a given token.
        Falls back to a default empty asset if not found.
        """
        token_upper = token.upper()
        if token_upper in self.registry:
            return self.registry[token_upper]
        else:
            return {
                "asset": "fallback.glb",
                "type": "unknown",
                "duration_ms": 1000,
                "loop": False
            }

animation_service = AnimationService()
