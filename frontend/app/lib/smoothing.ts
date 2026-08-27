/**
 * Temporal Stabilization & Smoothing for Real-time Sign Recognition
 * Fulfills Blueprint Section 10.2 & Functional Requirement FR-05
 */

export interface RawPrediction {
  id: string;
  urdu: string;
  english: string;
  gloss: string;
  confidence: number;
  type: "word" | "alphabet";
  timestamp: number;
}

export class TemporalStabilizer {
  private windowSize: number;
  private confidenceThreshold: number;
  private cooldownMs: number;
  private history: RawPrediction[] = [];
  private lastCommittedId: string | null = null;
  private lastCommitTime = 0;

  constructor(options?: {
    windowSize?: number;
    confidenceThreshold?: number;
    cooldownMs?: number;
  }) {
    this.windowSize = options?.windowSize ?? 4;
    this.confidenceThreshold = options?.confidenceThreshold ?? 0.75;
    this.cooldownMs = options?.cooldownMs ?? 700;
  }

  /**
   * Push a candidate prediction frame and determine if a stable sign should be committed.
   * Returns the stable prediction if consensus and debounce criteria are met, else null.
   */
  public processFrame(prediction: Omit<RawPrediction, "timestamp"> | null): RawPrediction | null {
    const now = Date.now();

    if (!prediction || prediction.id === "none" || prediction.confidence < this.confidenceThreshold) {
      // If idle/none, clear recent volatile window gradually
      if (this.history.length > 0) {
        this.history.shift();
      }
      return null;
    }

    const frame: RawPrediction = {
      ...prediction,
      timestamp: now,
    };

    this.history.push(frame);
    if (this.history.length > this.windowSize) {
      this.history.shift();
    }

    // Check if cooldown has elapsed since last committed sign
    if (now - this.lastCommitTime < this.cooldownMs) {
      return null;
    }

    // Count frequency and weighted confidence in current window
    const voteMap: Record<string, { count: number; totalConf: number; sample: RawPrediction }> = {};
    for (const item of this.history) {
      if (!voteMap[item.id]) {
        voteMap[item.id] = { count: 0, totalConf: 0, sample: item };
      }
      voteMap[item.id].count += 1;
      voteMap[item.id].totalConf += item.confidence;
    }

    // Find majority candidate
    let bestCandidate: RawPrediction | null = null;
    let maxVotes = 0;
    const requiredConsensus = Math.max(2, Math.floor(this.windowSize * 0.6));

    for (const key of Object.keys(voteMap)) {
      const data = voteMap[key];
      if (data.count >= requiredConsensus && data.count > maxVotes) {
        maxVotes = data.count;
        bestCandidate = {
          ...data.sample,
          confidence: Number((data.totalConf / data.count).toFixed(2)),
        };
      }
    }

    if (!bestCandidate) {
      return null;
    }

    // Avoid immediate duplicate commits for word signs (alphabets can be repeated if user holds across distinct turns)
    if (bestCandidate.id === this.lastCommittedId && bestCandidate.type !== "alphabet") {
      return null;
    }

    // Consensus reached! Commit token
    this.lastCommittedId = bestCandidate.id;
    this.lastCommitTime = now;
    this.history = []; // reset window after commit

    return bestCandidate;
  }

  /**
   * Reset stabilizer state
   */
  public reset(): void {
    this.history = [];
    this.lastCommittedId = null;
    this.lastCommitTime = 0;
  }
}
