import logging

logger = logging.getLogger(__name__)

class TTSService:
    def __init__(self):
        self.is_ready = True

    def synthesize_speech(self, text: str, language: str = "ur") -> bytes:
        """
        Mock implementation of Text-to-Speech.
        Returns empty WAV file bytes for now.
        """
        logger.info(f"Synthesizing speech for text: '{text}' (lang: {language})")
        
        # A minimal 44-byte valid WAV file header with no audio data
        dummy_wav = bytes([
            0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 
            0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20, 
            0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 
            0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 
            0x02, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61, 
            0x00, 0x00, 0x00, 0x00
        ])
        
        return dummy_wav

tts_service = TTSService()
