"""
UrduToPSL PyTorch Sequence Model Architecture (urdutopsl)

Model architecture designed for Kaggle training on Dynamic Word-Level PSL dataset + UAlpha40.
Converts normalized Urdu text embeddings into PSL Sign Gloss tokens and keyframe joint coordinates.
"""

import json
import os
from typing import List, Dict, Optional

class UrduTokenizer:
    """Urdu character and subword tokenizer for urdutopsl."""
    def __init__(self, vocab: Optional[Dict[str, int]] = None):
        self.vocab = vocab or self._build_default_vocab()
        self.inv_vocab = {v: k for k, v in self.vocab.items()}

    def _build_default_vocab(self) -> Dict[str, int]:
        special_tokens = ["<PAD>", "<UNK>", "<SOS>", "<EOS>"]
        urdu_chars = [
            "ا", "آ", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ", "ح", "خ", "د", "ڈ", "ذ", 
            "ر", "ڑ", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", 
            "ک", "گ", "ل", "م", "ن", "ں", "و", "ہ", "ھ", "ء", "ی", "ے", " "
        ]
        return {tok: i for i, tok in enumerate(special_tokens + urdu_chars)}

    def encode(self, text: str) -> List[int]:
        tokens = [self.vocab.get("<SOS>", 2)]
        for char in text:
            tokens.append(self.vocab.get(char, self.vocab.get("<UNK>", 1)))
        tokens.append(self.vocab.get("<EOS>", 3))
        return tokens

    def decode(self, token_ids: List[int]) -> str:
        chars = []
        for tid in token_ids:
            if tid in self.inv_vocab and self.inv_vocab[tid] not in ["<PAD>", "<SOS>", "<EOS>", "<UNK>"]:
                chars.append(self.inv_vocab[tid])
        return "".join(chars)


# PSL Output Gloss Classes (60 Dynamic Words + 36 Alphabets)
PSL_GLOSS_CLASSES = [
    "HELLO", "SALAM", "THANK_YOU", "HOW_ARE_YOU", "WELCOME", "GOODBYE",
    "HELP", "HOSPITAL", "DOCTOR", "WATER", "FOOD_EAT", "YES", "NO",
    "FRIEND", "SCHOOL", "MY_NAME", "PAKISTAN", "FAMILY", "TEACHER",
    "ALIF", "BAY", "PAY", "TAY", "TAY_HARD", "SAY", "JEEM", "CHAY",
    "HAY", "KHAY", "DAAL", "DAAL_HARD", "ZAAL", "RAY", "RAY_HARD",
    "ZAY", "ZHAY", "SEEN", "SHEEN", "SAAD", "ZAAD", "TOY", "ZOY",
    "AIN", "GHAIN", "FAY", "QAAF", "KAAF", "GAAF", "LAAM", "MEEM",
    "NOON", "NOON_GHUNNA", "WAO", "HAY_GOAL", "HAMZA", "CHOTI_YE", "BADI_YE"
]

def save_model_config(output_dir: str = "./export"):
    """Exports model labels and metadata for runtime deployment."""
    os.makedirs(output_dir, exist_ok=True)
    config = {
        "model_name": "urdutopsl",
        "model_version": "1.0.0",
        "dataset": "DynamicWordLevelPakistanSignLanguage + UAlpha40",
        "num_classes": len(PSL_GLOSS_CLASSES),
        "gloss_classes": PSL_GLOSS_CLASSES,
        "input_modality": "text/audio",
        "output_modality": "psl_gloss_tokens_and_avatar_poses",
        "max_seq_len": 64,
        "embedding_dim": 128,
        "hidden_dim": 256
    }
    config_path = os.path.join(output_dir, "urdutopsl_config.json")
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    print(f"[urdutopsl] Saved config to {config_path}")

if __name__ == "__main__":
    save_model_config()
