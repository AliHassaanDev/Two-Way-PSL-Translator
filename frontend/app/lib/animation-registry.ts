/**
 * Sign Animation Registry
 * Fulfills Blueprint Section 12 & Functional Requirement FR-13
 */

export interface AnimationEntry {
  token: string;
  type: "word" | "fingerspelling";
  asset?: string;
  durationMs: number;
  motionType: "wave" | "chestTouch" | "forwardPush" | "circle" | "pointForward" | "handsTogether" | "sideToSide" | "nod" | "none";
  armAngles: {
    leftShoulder: number;
    leftElbow: number;
    rightShoulder: number;
    rightElbow: number;
  };
}

export const ANIMATION_REGISTRY: Record<string, AnimationEntry> = {
  HELLO: {
    token: "HELLO",
    type: "word",
    durationMs: 1800,
    motionType: "wave",
    armAngles: { leftShoulder: 20, leftElbow: 45, rightShoulder: 65, rightElbow: 85 },
  },
  HOW_ARE_YOU: {
    token: "HOW_ARE_YOU",
    type: "word",
    durationMs: 2000,
    motionType: "pointForward",
    armAngles: { leftShoulder: 40, leftElbow: 75, rightShoulder: 45, rightElbow: 75 },
  },
  THANK_YOU: {
    token: "THANK_YOU",
    type: "word",
    durationMs: 1600,
    motionType: "forwardPush",
    armAngles: { leftShoulder: 15, leftElbow: 30, rightShoulder: 55, rightElbow: 90 },
  },
  HELP: {
    token: "HELP",
    type: "word",
    durationMs: 1700,
    motionType: "handsTogether",
    armAngles: { leftShoulder: 45, leftElbow: 70, rightShoulder: 50, rightElbow: 75 },
  },
  WATER: {
    token: "WATER",
    type: "word",
    durationMs: 1500,
    motionType: "forwardPush",
    armAngles: { leftShoulder: 15, leftElbow: 30, rightShoulder: 50, rightElbow: 85 },
  },
  DOCTOR: {
    token: "DOCTOR",
    type: "word",
    durationMs: 1800,
    motionType: "chestTouch",
    armAngles: { leftShoulder: 30, leftElbow: 60, rightShoulder: 35, rightElbow: 70 },
  },
  PAKISTAN: {
    token: "PAKISTAN",
    type: "word",
    durationMs: 2000,
    motionType: "wave",
    armAngles: { leftShoulder: 20, leftElbow: 30, rightShoulder: 65, rightElbow: 80 },
  },
  YES: {
    token: "YES",
    type: "word",
    durationMs: 1300,
    motionType: "nod",
    armAngles: { leftShoulder: 15, leftElbow: 30, rightShoulder: 40, rightElbow: 60 },
  },
  NO: {
    token: "NO",
    type: "word",
    durationMs: 1300,
    motionType: "sideToSide",
    armAngles: { leftShoulder: 15, leftElbow: 30, rightShoulder: 45, rightElbow: 70 },
  },
  MY_NAME: {
    token: "MY_NAME",
    type: "word",
    durationMs: 1600,
    motionType: "chestTouch",
    armAngles: { leftShoulder: 20, leftElbow: 40, rightShoulder: 45, rightElbow: 85 },
  },
};

/**
 * Returns registered animation metadata or fallback pose for any PSL token
 */
export function getAnimationMetadata(gloss: string): AnimationEntry {
  if (ANIMATION_REGISTRY[gloss]) {
    return ANIMATION_REGISTRY[gloss];
  }

  // Fingerspelling alphabet token
  if (gloss.startsWith("SPELL_") || gloss.length <= 4) {
    return {
      token: gloss,
      type: "fingerspelling",
      durationMs: 900,
      motionType: "forwardPush",
      armAngles: { leftShoulder: 15, leftElbow: 25, rightShoulder: 45, rightElbow: 80 },
    };
  }

  return {
    token: gloss,
    type: "word",
    durationMs: 1500,
    motionType: "forwardPush",
    armAngles: { leftShoulder: 25, leftElbow: 45, rightShoulder: 45, rightElbow: 60 },
  };
}
