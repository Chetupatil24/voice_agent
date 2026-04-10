"""
Silero VAD wrapper — thin factory around Pipecat's built-in SileroVADAnalyzer.

Silero VAD detects when the caller starts / stops speaking, enabling:
  - Interruption handling (caller can cut in while agent is talking)
  - Efficient STT triggering (only transcribe actual speech, not silence)
"""
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.audio.vad.vad_analyzer import VADParams


def create_silero_vad(
    stop_secs: float = 0.5,   # seconds of silence before end-of-utterance
    start_secs: float = 0.2,  # seconds of speech before triggering start
) -> SileroVADAnalyzer:
    """
    Returns a configured SileroVADAnalyzer.
    stop_secs=0.5 balances responsiveness vs. cutting off mid-sentence.
    """
    return SileroVADAnalyzer(
        params=VADParams(
            stop_secs=stop_secs,
            start_secs=start_secs,
        )
    )
