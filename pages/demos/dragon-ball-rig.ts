import { GOKU_PARTS, JIREN_PARTS, type Bounds, type PaintToken, type VectorPart, type VectorShape } from './dragon-ball-paths.ts'

export type Point = { x: number; y: number }

export type RigPhaseKind = 'transform' | 'roam' | 'approach' | 'clash' | 'separate' | 'kamehameha'

export type RigPhase = {
  kind: RigPhaseKind
}

type ArmPose = {
  upperAngle: number
  foreAngle: number
  handOpen: boolean
}

type LegPose = {
  upperAngle: number
  lowerAngle: number
  footAngle: number
}

type GokuPoseFrame = {
  drawScale: number
  bodyLean: number
  bodyOffsetY: number
  headTilt: number
  hairLift: number
  auraBoost: number
  uiProgress: number
  torsoTwist: number
  torsoShiftX: number
  torsoShiftY: number
  chestScale: number
  sashSwing: number
  leftArm: ArmPose
  rightArm: ArmPose
  leftLeg: LegPose
  rightLeg: LegPose
}

type JirenPoseFrame = {
  drawScale: number
  bodyLean: number
  bodyOffsetY: number
  headTilt: number
  auraBoost: number
  eyeGlow: number
  torsoTwist: number
  torsoShiftX: number
  torsoShiftY: number
  chestScale: number
  leftArm: ArmPose
  rightArm: ArmPose
  leftLeg: LegPose
  rightLeg: LegPose
}

export type GokuRigState = GokuPoseFrame & {
  bodyBob: number
  beamRelease: boolean
}

export type JirenRigState = JirenPoseFrame & {
  bodyBob: number
  beamRelease: boolean
}

export type CharacterRigDebugFlags = {
  showPartAnchors: boolean
}

type Placement = {
  part: VectorPart
  x: number
  y: number
  rotation?: number
  scaleX?: number
  scaleY?: number
  z: number
}

type GokuLocals = {
  placements: Placement[]
  beamOrigin: Point
}

type JirenLocals = {
  placements: Placement[]
  beamOrigin: Point
}

type CharacterPaints = Record<PaintToken, string>

type Rgb = { r: number; g: number; b: number }

type JointPlacement = {
  rotation: number
  end: Point
}

const pathCache = new Map<string, Path2D>()

const GOKU_BASE_HAIR: Rgb = { r: 28, g: 36, b: 56 }
const GOKU_UI_HAIR: Rgb = { r: 238, g: 244, b: 255 }
const GOKU_UI_SHADOW: Rgb = { r: 118, g: 142, b: 176 }
const GOKU_ORANGE: Rgb = { r: 232, g: 152, b: 34 }
const GOKU_ORANGE_LIGHT: Rgb = { r: 255, g: 206, b: 72 }
const GOKU_ORANGE_SHADOW: Rgb = { r: 134, g: 58, b: 16 }
const GOKU_BLUE: Rgb = { r: 32, g: 62, b: 176 }
const GOKU_BLUE_LIGHT: Rgb = { r: 76, g: 114, b: 238 }
const GOKU_BLUE_SHADOW: Rgb = { r: 19, g: 32, b: 90 }
const GOKU_SKIN: Rgb = { r: 242, g: 204, b: 158 }
const GOKU_SKIN_SHADOW: Rgb = { r: 196, g: 138, b: 92 }
const GOKU_AURA: Rgb = { r: 96, g: 192, b: 255 }
const GOKU_AURA_EDGE: Rgb = { r: 232, g: 246, b: 255 }

const JIREN_SKIN: Rgb = { r: 238, g: 234, b: 244 }
const JIREN_SKIN_SHADOW: Rgb = { r: 190, g: 182, b: 204 }
const JIREN_SKIN_DEEP_SHADOW: Rgb = { r: 128, g: 112, b: 140 }
const JIREN_SUIT_BLACK: Rgb = { r: 20, g: 21, b: 30 }
const JIREN_SUIT_BLACK_LIGHT: Rgb = { r: 52, g: 55, b: 74 }
const JIREN_SUIT_RED: Rgb = { r: 196, g: 20, b: 26 }
const JIREN_SUIT_RED_SHADOW: Rgb = { r: 112, g: 10, b: 14 }
const JIREN_GLOVE: Rgb = { r: 242, g: 240, b: 238 }
const JIREN_GLOVE_SHADOW: Rgb = { r: 198, g: 192, b: 196 }
const JIREN_AURA: Rgb = { r: 255, g: 78, b: 58 }
const JIREN_AURA_EDGE: Rgb = { r: 255, g: 210, b: 196 }

const GOKU_TRANSFORM_LOW: GokuPoseFrame = {
  drawScale: 0.82,
  bodyLean: 0.06,
  bodyOffsetY: 12,
  headTilt: -0.14,
  hairLift: 2,
  auraBoost: 0.6,
  uiProgress: 0,
  torsoTwist: -0.08,
  torsoShiftX: -5,
  torsoShiftY: 7,
  chestScale: 1.02,
  sashSwing: -0.18,
  leftArm: { upperAngle: 2.42, foreAngle: 2.08, handOpen: true },
  rightArm: { upperAngle: 0.72, foreAngle: 1.16, handOpen: true },
  leftLeg: { upperAngle: 2.22, lowerAngle: 1.88, footAngle: -0.18 },
  rightLeg: { upperAngle: 1.2, lowerAngle: 1.78, footAngle: 0.3 },
}

const GOKU_TRANSFORM_RISE: GokuPoseFrame = {
  drawScale: 0.88,
  bodyLean: 0.01,
  bodyOffsetY: -2,
  headTilt: -0.04,
  hairLift: 16,
  auraBoost: 1.94,
  uiProgress: 1,
  torsoTwist: 0.06,
  torsoShiftX: 0,
  torsoShiftY: 0,
  chestScale: 1.08,
  sashSwing: 0.16,
  leftArm: { upperAngle: 2.12, foreAngle: 1.92, handOpen: true },
  rightArm: { upperAngle: 1.04, foreAngle: 1.28, handOpen: true },
  leftLeg: { upperAngle: 1.94, lowerAngle: 1.74, footAngle: -0.08 },
  rightLeg: { upperAngle: 1.14, lowerAngle: 1.52, footAngle: 0.08 },
}

const GOKU_GUARD: GokuPoseFrame = {
  drawScale: 0.88,
  bodyLean: 0.04,
  bodyOffsetY: 0,
  headTilt: 0.04,
  hairLift: 10,
  auraBoost: 1.34,
  uiProgress: 1,
  torsoTwist: 0.12,
  torsoShiftX: 3,
  torsoShiftY: -1,
  chestScale: 1.08,
  sashSwing: 0.1,
  leftArm: { upperAngle: 2.62, foreAngle: 2.1, handOpen: true },
  rightArm: { upperAngle: 0.22, foreAngle: -0.92, handOpen: false },
  leftLeg: { upperAngle: 2.02, lowerAngle: 1.78, footAngle: -0.12 },
  rightLeg: { upperAngle: 1.04, lowerAngle: 1.42, footAngle: 0.12 },
}

const GOKU_ADVANCE: GokuPoseFrame = {
  drawScale: 0.87,
  bodyLean: 0.18,
  bodyOffsetY: 0,
  headTilt: -0.06,
  hairLift: 10,
  auraBoost: 1.56,
  uiProgress: 1,
  torsoTwist: 0.26,
  torsoShiftX: 7,
  torsoShiftY: 2,
  chestScale: 1.12,
  sashSwing: 0.24,
  leftArm: { upperAngle: 3.22, foreAngle: 3.92, handOpen: false },
  rightArm: { upperAngle: 0.06, foreAngle: -0.06, handOpen: false },
  leftLeg: { upperAngle: 2.18, lowerAngle: 1.86, footAngle: -0.12 },
  rightLeg: { upperAngle: 0.86, lowerAngle: 1.22, footAngle: 0.2 },
}

const GOKU_CLASH_A: GokuPoseFrame = {
  drawScale: 0.89,
  bodyLean: 0.1,
  bodyOffsetY: 0,
  headTilt: -0.1,
  hairLift: 12,
  auraBoost: 1.72,
  uiProgress: 1,
  torsoTwist: 0.28,
  torsoShiftX: 8,
  torsoShiftY: -2,
  chestScale: 1.13,
  sashSwing: 0.28,
  leftArm: { upperAngle: 2.88, foreAngle: 2.4, handOpen: false },
  rightArm: { upperAngle: -0.16, foreAngle: -0.22, handOpen: false },
  leftLeg: { upperAngle: 2, lowerAngle: 1.7, footAngle: -0.12 },
  rightLeg: { upperAngle: 1, lowerAngle: 1.34, footAngle: 0.18 },
}

const GOKU_CLASH_B: GokuPoseFrame = {
  drawScale: 0.9,
  bodyLean: 0.06,
  bodyOffsetY: -1,
  headTilt: -0.14,
  hairLift: 13,
  auraBoost: 1.78,
  uiProgress: 1,
  torsoTwist: 0.16,
  torsoShiftX: 5,
  torsoShiftY: 1,
  chestScale: 1.12,
  sashSwing: -0.18,
  leftArm: { upperAngle: 2.48, foreAngle: 1.92, handOpen: false },
  rightArm: { upperAngle: 0.04, foreAngle: 0.02, handOpen: false },
  leftLeg: { upperAngle: 2.06, lowerAngle: 1.74, footAngle: -0.08 },
  rightLeg: { upperAngle: 0.92, lowerAngle: 1.28, footAngle: 0.16 },
}

const GOKU_RECOVERY: GokuPoseFrame = {
  drawScale: 0.87,
  bodyLean: -0.12,
  bodyOffsetY: 2,
  headTilt: 0.1,
  hairLift: 8,
  auraBoost: 1.44,
  uiProgress: 1,
  torsoTwist: -0.16,
  torsoShiftX: -5,
  torsoShiftY: 0,
  chestScale: 1.06,
  sashSwing: -0.2,
  leftArm: { upperAngle: 2.4, foreAngle: 2.02, handOpen: false },
  rightArm: { upperAngle: 0.42, foreAngle: -0.26, handOpen: true },
  leftLeg: { upperAngle: 1.96, lowerAngle: 1.64, footAngle: -0.08 },
  rightLeg: { upperAngle: 1.12, lowerAngle: 1.46, footAngle: 0.14 },
}

const GOKU_BEAM_CHARGE: GokuPoseFrame = {
  drawScale: 0.91,
  bodyLean: 0.03,
  bodyOffsetY: 1,
  headTilt: -0.18,
  hairLift: 14,
  auraBoost: 1.9,
  uiProgress: 1,
  torsoTwist: 0.08,
  torsoShiftX: 0,
  torsoShiftY: 2,
  chestScale: 1.08,
  sashSwing: -0.2,
  leftArm: { upperAngle: 0.96, foreAngle: 1.46, handOpen: true },
  rightArm: { upperAngle: 1.42, foreAngle: 1.08, handOpen: true },
  leftLeg: { upperAngle: 2.08, lowerAngle: 1.7, footAngle: -0.18 },
  rightLeg: { upperAngle: 1.12, lowerAngle: 1.58, footAngle: 0.18 },
}

const GOKU_BEAM_FIRE: GokuPoseFrame = {
  drawScale: 0.9,
  bodyLean: 0.08,
  bodyOffsetY: -2,
  headTilt: -0.16,
  hairLift: 16,
  auraBoost: 2.02,
  uiProgress: 1,
  torsoTwist: 0.16,
  torsoShiftX: 8,
  torsoShiftY: -4,
  chestScale: 1.14,
  sashSwing: 0.24,
  leftArm: { upperAngle: 0.42, foreAngle: 0.92, handOpen: true },
  rightArm: { upperAngle: 1.08, foreAngle: 0.82, handOpen: true },
  leftLeg: { upperAngle: 2.04, lowerAngle: 1.68, footAngle: -0.18 },
  rightLeg: { upperAngle: 1.22, lowerAngle: 1.56, footAngle: 0.16 },
}

const JIREN_WATCH: JirenPoseFrame = {
  drawScale: 0.97,
  bodyLean: -0.02,
  bodyOffsetY: 0,
  headTilt: 0,
  auraBoost: 0.6,
  eyeGlow: 0.4,
  torsoTwist: 0.02,
  torsoShiftX: 0,
  torsoShiftY: 0,
  chestScale: 1.16,
  leftArm: { upperAngle: 2.16, foreAngle: 1.98, handOpen: false },
  rightArm: { upperAngle: 0.98, foreAngle: 1.18, handOpen: false },
  leftLeg: { upperAngle: 2.02, lowerAngle: 1.84, footAngle: -0.08 },
  rightLeg: { upperAngle: 1.08, lowerAngle: 1.4, footAngle: 0.1 },
}

const JIREN_GUARD: JirenPoseFrame = {
  drawScale: 0.98,
  bodyLean: -0.04,
  bodyOffsetY: 0,
  headTilt: 0.03,
  auraBoost: 0.92,
  eyeGlow: 0.64,
  torsoTwist: -0.08,
  torsoShiftX: -2,
  torsoShiftY: 0,
  chestScale: 1.17,
  leftArm: { upperAngle: 2.38, foreAngle: 2.08, handOpen: false },
  rightArm: { upperAngle: 0.72, foreAngle: 0.96, handOpen: false },
  leftLeg: { upperAngle: 2.06, lowerAngle: 1.82, footAngle: -0.12 },
  rightLeg: { upperAngle: 1.02, lowerAngle: 1.36, footAngle: 0.12 },
}

const JIREN_ADVANCE: JirenPoseFrame = {
  drawScale: 0.99,
  bodyLean: -0.12,
  bodyOffsetY: 1,
  headTilt: 0.04,
  auraBoost: 1.18,
  eyeGlow: 0.78,
  torsoTwist: -0.2,
  torsoShiftX: -6,
  torsoShiftY: 1,
  chestScale: 1.2,
  leftArm: { upperAngle: 3.18, foreAngle: 3.92, handOpen: false },
  rightArm: { upperAngle: 0.08, foreAngle: 0.06, handOpen: false },
  leftLeg: { upperAngle: 2.16, lowerAngle: 1.86, footAngle: -0.12 },
  rightLeg: { upperAngle: 0.92, lowerAngle: 1.22, footAngle: 0.16 },
}

const JIREN_CLASH_A: JirenPoseFrame = {
  drawScale: 1,
  bodyLean: -0.1,
  bodyOffsetY: 0,
  headTilt: 0.06,
  auraBoost: 1.68,
  eyeGlow: 1.02,
  torsoTwist: -0.24,
  torsoShiftX: -6,
  torsoShiftY: -1,
  chestScale: 1.22,
  leftArm: { upperAngle: 2.94, foreAngle: 2.42, handOpen: false },
  rightArm: { upperAngle: 0.06, foreAngle: 0.04, handOpen: false },
  leftLeg: { upperAngle: 2.04, lowerAngle: 1.78, footAngle: -0.1 },
  rightLeg: { upperAngle: 0.98, lowerAngle: 1.26, footAngle: 0.12 },
}

const JIREN_CLASH_B: JirenPoseFrame = {
  drawScale: 1.01,
  bodyLean: -0.08,
  bodyOffsetY: -1,
  headTilt: 0.08,
  auraBoost: 1.8,
  eyeGlow: 1.12,
  torsoTwist: -0.12,
  torsoShiftX: -3,
  torsoShiftY: 1,
  chestScale: 1.2,
  leftArm: { upperAngle: 2.58, foreAngle: 2.08, handOpen: false },
  rightArm: { upperAngle: 0.18, foreAngle: 0.14, handOpen: false },
  leftLeg: { upperAngle: 2.1, lowerAngle: 1.8, footAngle: -0.08 },
  rightLeg: { upperAngle: 0.94, lowerAngle: 1.22, footAngle: 0.1 },
}

const JIREN_RECOVERY: JirenPoseFrame = {
  drawScale: 0.99,
  bodyLean: -0.04,
  bodyOffsetY: 2,
  headTilt: 0.08,
  auraBoost: 1.84,
  eyeGlow: 1.18,
  torsoTwist: -0.1,
  torsoShiftX: -2,
  torsoShiftY: 0,
  chestScale: 1.18,
  leftArm: { upperAngle: 2.38, foreAngle: 2.06, handOpen: false },
  rightArm: { upperAngle: 0.48, foreAngle: 0.68, handOpen: true },
  leftLeg: { upperAngle: 2.04, lowerAngle: 1.76, footAngle: -0.12 },
  rightLeg: { upperAngle: 1.08, lowerAngle: 1.36, footAngle: 0.12 },
}

const JIREN_BEAM: JirenPoseFrame = {
  drawScale: 1.02,
  bodyLean: -0.18,
  bodyOffsetY: -1,
  headTilt: 0.04,
  auraBoost: 1.98,
  eyeGlow: 1.28,
  torsoTwist: -0.3,
  torsoShiftX: -10,
  torsoShiftY: -2,
  chestScale: 1.22,
  leftArm: { upperAngle: 2.54, foreAngle: 2.18, handOpen: false },
  rightArm: { upperAngle: -0.02, foreAngle: -0.04, handOpen: true },
  leftLeg: { upperAngle: 2.08, lowerAngle: 1.78, footAngle: -0.16 },
  rightLeg: { upperAngle: 0.96, lowerAngle: 1.28, footAngle: 0.08 },
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function easeOutCubic(t: number): number {
  const clamped = clamp(t, 0, 1)
  return 1 - Math.pow(1 - clamped, 3)
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  }
}

function rgba(color: Rgb, alpha = 1): string {
  return `rgba(${color.r},${color.g},${color.b},${alpha})`
}

function point(x: number, y: number): Point {
  return { x, y }
}

function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y }
}

function rotatePoint(p: Point, angle: number): Point {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos,
  }
}

function placeJoint(origin: Point, part: VectorPart, targetAngle: number): JointPlacement {
  const tip = part.tip
  if (tip === undefined) throw new Error(`Part ${part.id} is missing a tip`)
  const restAngle = Math.atan2(tip.y, tip.x)
  const rotation = targetAngle - restAngle
  return {
    rotation,
    end: add(origin, rotatePoint(tip, rotation)),
  }
}

function mixArm(a: ArmPose, b: ArmPose, t: number): ArmPose {
  return {
    upperAngle: lerp(a.upperAngle, b.upperAngle, t),
    foreAngle: lerp(a.foreAngle, b.foreAngle, t),
    handOpen: t < 0.5 ? a.handOpen : b.handOpen,
  }
}

function mixLeg(a: LegPose, b: LegPose, t: number): LegPose {
  return {
    upperAngle: lerp(a.upperAngle, b.upperAngle, t),
    lowerAngle: lerp(a.lowerAngle, b.lowerAngle, t),
    footAngle: lerp(a.footAngle, b.footAngle, t),
  }
}

function mixGokuPose(a: GokuPoseFrame, b: GokuPoseFrame, t: number): GokuPoseFrame {
  return {
    drawScale: lerp(a.drawScale, b.drawScale, t),
    bodyLean: lerp(a.bodyLean, b.bodyLean, t),
    bodyOffsetY: lerp(a.bodyOffsetY, b.bodyOffsetY, t),
    headTilt: lerp(a.headTilt, b.headTilt, t),
    hairLift: lerp(a.hairLift, b.hairLift, t),
    auraBoost: lerp(a.auraBoost, b.auraBoost, t),
    uiProgress: lerp(a.uiProgress, b.uiProgress, t),
    torsoTwist: lerp(a.torsoTwist, b.torsoTwist, t),
    torsoShiftX: lerp(a.torsoShiftX, b.torsoShiftX, t),
    torsoShiftY: lerp(a.torsoShiftY, b.torsoShiftY, t),
    chestScale: lerp(a.chestScale, b.chestScale, t),
    sashSwing: lerp(a.sashSwing, b.sashSwing, t),
    leftArm: mixArm(a.leftArm, b.leftArm, t),
    rightArm: mixArm(a.rightArm, b.rightArm, t),
    leftLeg: mixLeg(a.leftLeg, b.leftLeg, t),
    rightLeg: mixLeg(a.rightLeg, b.rightLeg, t),
  }
}

function mixJirenPose(a: JirenPoseFrame, b: JirenPoseFrame, t: number): JirenPoseFrame {
  return {
    drawScale: lerp(a.drawScale, b.drawScale, t),
    bodyLean: lerp(a.bodyLean, b.bodyLean, t),
    bodyOffsetY: lerp(a.bodyOffsetY, b.bodyOffsetY, t),
    headTilt: lerp(a.headTilt, b.headTilt, t),
    auraBoost: lerp(a.auraBoost, b.auraBoost, t),
    eyeGlow: lerp(a.eyeGlow, b.eyeGlow, t),
    torsoTwist: lerp(a.torsoTwist, b.torsoTwist, t),
    torsoShiftX: lerp(a.torsoShiftX, b.torsoShiftX, t),
    torsoShiftY: lerp(a.torsoShiftY, b.torsoShiftY, t),
    chestScale: lerp(a.chestScale, b.chestScale, t),
    leftArm: mixArm(a.leftArm, b.leftArm, t),
    rightArm: mixArm(a.rightArm, b.rightArm, t),
    leftLeg: mixLeg(a.leftLeg, b.leftLeg, t),
    rightLeg: mixLeg(a.rightLeg, b.rightLeg, t),
  }
}

function cloneGokuPose(pose: GokuPoseFrame): GokuPoseFrame {
  return {
    ...pose,
    leftArm: { ...pose.leftArm },
    rightArm: { ...pose.rightArm },
    leftLeg: { ...pose.leftLeg },
    rightLeg: { ...pose.rightLeg },
  }
}

function cloneJirenPose(pose: JirenPoseFrame): JirenPoseFrame {
  return {
    ...pose,
    leftArm: { ...pose.leftArm },
    rightArm: { ...pose.rightArm },
    leftLeg: { ...pose.leftLeg },
    rightLeg: { ...pose.rightLeg },
  }
}

function buildGokuPalette(state: GokuRigState): CharacterPaints {
  const ui = clamp(state.uiProgress, 0, 1)
  const hairShadow = mixRgb({ r: 10, g: 14, b: 20 }, GOKU_UI_SHADOW, ui)
  const hairMid = mixRgb(GOKU_BASE_HAIR, { r: 188, g: 208, b: 234 }, ui)
  const hairLight = mixRgb({ r: 84, g: 102, b: 138 }, GOKU_UI_HAIR, ui)
  const aura = mixRgb({ r: 56, g: 142, b: 255 }, GOKU_AURA, ui)

  return {
    gokuAura: rgba(aura, 1),
    gokuAuraCore: rgba(mixRgb(aura, GOKU_AURA_EDGE, 0.36), 1),
    gokuAuraEdge: rgba(GOKU_AURA_EDGE, 1),
    gokuHairShadow: rgba(hairShadow, 1),
    gokuHairMid: rgba(hairMid, 1),
    gokuHairLight: rgba(hairLight, 1),
    gokuSkin: rgba(GOKU_SKIN, 1),
    gokuSkinShadow: rgba(GOKU_SKIN_SHADOW, 1),
    gokuGi: rgba(GOKU_ORANGE, 1),
    gokuGiLight: rgba(GOKU_ORANGE_LIGHT, 1),
    gokuGiShadow: rgba(GOKU_ORANGE_SHADOW, 1),
    gokuBlue: rgba(GOKU_BLUE, 1),
    gokuBlueLight: rgba(GOKU_BLUE_LIGHT, 1),
    gokuBlueShadow: rgba(GOKU_BLUE_SHADOW, 1),
    gokuBootAccent: 'rgba(212,62,46,1)',
    gokuBootTrim: 'rgba(240,198,88,1)',
    gokuEmblem: 'rgba(18,18,18,1)',
    jirenAura: 'rgba(0,0,0,0)',
    jirenAuraCore: 'rgba(0,0,0,0)',
    jirenAuraEdge: 'rgba(0,0,0,0)',
    jirenSkin: 'rgba(0,0,0,0)',
    jirenSkinShadow: 'rgba(0,0,0,0)',
    jirenSkinDeepShadow: 'rgba(0,0,0,0)',
    jirenSuitBlack: 'rgba(0,0,0,0)',
    jirenSuitBlackLight: 'rgba(0,0,0,0)',
    jirenSuitRed: 'rgba(0,0,0,0)',
    jirenSuitRedShadow: 'rgba(0,0,0,0)',
    jirenGlove: 'rgba(0,0,0,0)',
    jirenGloveShadow: 'rgba(0,0,0,0)',
    jirenEye: 'rgba(0,0,0,0)',
    ink: 'rgba(12,10,16,0.96)',
    inkSoft: 'rgba(60,38,28,0.9)',
    white: 'rgba(255,255,255,0.98)',
  }
}

function buildJirenPalette(state: JirenRigState): CharacterPaints {
  const eye = mixRgb({ r: 255, g: 116, b: 92 }, { r: 255, g: 230, b: 224 }, clamp(state.eyeGlow * 0.26, 0, 1))

  return {
    gokuAura: 'rgba(0,0,0,0)',
    gokuAuraCore: 'rgba(0,0,0,0)',
    gokuAuraEdge: 'rgba(0,0,0,0)',
    gokuHairShadow: 'rgba(0,0,0,0)',
    gokuHairMid: 'rgba(0,0,0,0)',
    gokuHairLight: 'rgba(0,0,0,0)',
    gokuSkin: 'rgba(0,0,0,0)',
    gokuSkinShadow: 'rgba(0,0,0,0)',
    gokuGi: 'rgba(0,0,0,0)',
    gokuGiLight: 'rgba(0,0,0,0)',
    gokuGiShadow: 'rgba(0,0,0,0)',
    gokuBlue: 'rgba(0,0,0,0)',
    gokuBlueLight: 'rgba(0,0,0,0)',
    gokuBlueShadow: 'rgba(0,0,0,0)',
    gokuBootAccent: 'rgba(0,0,0,0)',
    gokuBootTrim: 'rgba(0,0,0,0)',
    gokuEmblem: 'rgba(0,0,0,0)',
    jirenAura: rgba(JIREN_AURA, 1),
    jirenAuraCore: rgba(mixRgb(JIREN_AURA, { r: 255, g: 188, b: 160 }, 0.36), 1),
    jirenAuraEdge: rgba(JIREN_AURA_EDGE, 1),
    jirenSkin: rgba(JIREN_SKIN, 1),
    jirenSkinShadow: rgba(JIREN_SKIN_SHADOW, 1),
    jirenSkinDeepShadow: rgba(JIREN_SKIN_DEEP_SHADOW, 1),
    jirenSuitBlack: rgba(JIREN_SUIT_BLACK, 1),
    jirenSuitBlackLight: rgba(JIREN_SUIT_BLACK_LIGHT, 1),
    jirenSuitRed: rgba(JIREN_SUIT_RED, 1),
    jirenSuitRedShadow: rgba(JIREN_SUIT_RED_SHADOW, 1),
    jirenGlove: rgba(JIREN_GLOVE, 1),
    jirenGloveShadow: rgba(JIREN_GLOVE_SHADOW, 1),
    jirenEye: rgba(eye, 1),
    ink: 'rgba(10,10,14,0.96)',
    inkSoft: 'rgba(54,36,46,0.84)',
    white: 'rgba(255,255,255,0.98)',
  }
}

function getPath(d: string): Path2D {
  const cached = pathCache.get(d)
  if (cached !== undefined) return cached
  const path = new Path2D(d)
  pathCache.set(d, path)
  return path
}

function drawShape(ctx: CanvasRenderingContext2D, shape: VectorShape, paints: CharacterPaints): void {
  ctx.save()
  if (shape.alpha !== undefined) ctx.globalAlpha *= shape.alpha

  if (shape.kind === 'fill') {
    const path = getPath(shape.d)
    ctx.fillStyle = paints[shape.fill]
    ctx.fill(path)
    if (shape.stroke !== undefined) {
      ctx.strokeStyle = paints[shape.stroke]
      ctx.lineWidth = shape.lineWidth ?? 1
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke(path)
    }
  } else {
    const path = getPath(shape.d)
    ctx.strokeStyle = paints[shape.stroke]
    ctx.lineWidth = shape.lineWidth
    ctx.lineCap = shape.lineCap ?? 'round'
    ctx.lineJoin = shape.lineJoin ?? 'round'
    ctx.stroke(path)
  }

  ctx.restore()
}

function drawPart(
  ctx: CanvasRenderingContext2D,
  placement: Placement,
  paints: CharacterPaints,
  debug: CharacterRigDebugFlags,
): void {
  ctx.save()
  ctx.translate(placement.x, placement.y)
  ctx.rotate(placement.rotation ?? 0)
  ctx.scale(placement.scaleX ?? 1, placement.scaleY ?? 1)

  for (let i = 0; i < placement.part.shapes.length; i++) {
    drawShape(ctx, placement.part.shapes[i]!, paints)
  }

  if (debug.showPartAnchors) {
    drawDebugBounds(ctx, placement.part.bounds)
  }

  ctx.restore()
}

function drawDebugBounds(ctx: CanvasRenderingContext2D, bounds: Bounds): void {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 0.9
  ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top)

  ctx.strokeStyle = 'rgba(255,214,120,0.65)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-4, 0)
  ctx.lineTo(4, 0)
  ctx.moveTo(0, -4)
  ctx.lineTo(0, 4)
  ctx.stroke()
  ctx.restore()
}

function composeGokuLocals(state: GokuRigState, time: number): GokuLocals {
  const auraFlutter = 1 + Math.sin(time * 8.2) * 0.04 + state.auraBoost * 0.015
  const auraTall = 1.02 + Math.sin(time * 6.8 + 0.7) * 0.05 + state.auraBoost * 0.05
  const torso = point(state.torsoShiftX, -16 + state.torsoShiftY)
  const chestRotation = state.torsoTwist + Math.sin(time * 3.6) * 0.02
  const headBase = add(torso, rotatePoint(point(0, -60), chestRotation))
  const neckBase = add(torso, rotatePoint(point(0, -46), chestRotation))
  const shoulderRight = add(torso, rotatePoint(point(38 * state.chestScale, -42), chestRotation))
  const shoulderLeft = add(torso, rotatePoint(point(-38 * state.chestScale, -40), chestRotation))
  const hipRight = point(14, 34)
  const hipLeft = point(-14, 32)

  const leftUpperArm = placeJoint(shoulderLeft, GOKU_PARTS.upperArm, state.leftArm.upperAngle)
  const rightUpperArm = placeJoint(shoulderRight, GOKU_PARTS.upperArm, state.rightArm.upperAngle)
  const leftForearmPart = state.beamRelease ? GOKU_PARTS.forearmBeam : state.leftArm.handOpen ? GOKU_PARTS.forearmOpen : GOKU_PARTS.forearmFist
  const rightForearmPart = state.beamRelease ? GOKU_PARTS.forearmBeam : state.rightArm.handOpen ? GOKU_PARTS.forearmOpen : GOKU_PARTS.forearmFist
  const leftForearm = placeJoint(leftUpperArm.end, leftForearmPart, state.leftArm.foreAngle)
  const rightForearm = placeJoint(rightUpperArm.end, rightForearmPart, state.rightArm.foreAngle)
  const leftThigh = placeJoint(hipLeft, GOKU_PARTS.thigh, state.leftLeg.upperAngle)
  const rightThigh = placeJoint(hipRight, GOKU_PARTS.thigh, state.rightLeg.upperAngle)
  const leftCalf = placeJoint(leftThigh.end, GOKU_PARTS.calf, state.leftLeg.lowerAngle)
  const rightCalf = placeJoint(rightThigh.end, GOKU_PARTS.calf, state.rightLeg.lowerAngle)

  const sashSwing = state.sashSwing + Math.sin(time * 7.6) * 0.14
  const hairDrift = Math.sin(time * 10.8) * 1.4
  const bothHandsOpen = state.leftArm.handOpen && state.rightArm.handOpen
  const leftArmFront = bothHandsOpen || state.leftArm.upperAngle < 0.9
  const sharedHands = bothHandsOpen
    ? point((leftForearm.end.x + rightForearm.end.x) * 0.5 + 1, (leftForearm.end.y + rightForearm.end.y) * 0.5)
    : point(rightForearm.end.x + 10, rightForearm.end.y + 2)

  return {
    beamOrigin: sharedHands,
    placements: [
      {
        part: GOKU_PARTS.auraShell,
        x: 2,
        y: -2,
        rotation: Math.sin(time * 4.6) * 0.02,
        scaleX: auraFlutter,
        scaleY: auraTall,
        z: -30,
      },
      { part: GOKU_PARTS.thigh, x: hipLeft.x, y: hipLeft.y, rotation: leftThigh.rotation, scaleX: 0.98, scaleY: 1.18, z: -20 },
      { part: GOKU_PARTS.calf, x: leftThigh.end.x, y: leftThigh.end.y, rotation: leftCalf.rotation, scaleX: 0.98, scaleY: 1.14, z: -19 },
      { part: GOKU_PARTS.boot, x: leftCalf.end.x, y: leftCalf.end.y, rotation: state.leftLeg.footAngle, scaleX: 1, scaleY: 1, z: -18 },
      { part: GOKU_PARTS.thigh, x: hipRight.x, y: hipRight.y, rotation: rightThigh.rotation, scaleX: 0.98, scaleY: 1.18, z: -17 },
      { part: GOKU_PARTS.calf, x: rightThigh.end.x, y: rightThigh.end.y, rotation: rightCalf.rotation, scaleX: 0.98, scaleY: 1.14, z: -16 },
      { part: GOKU_PARTS.boot, x: rightCalf.end.x, y: rightCalf.end.y, rotation: state.rightLeg.footAngle, scaleX: 1, scaleY: 1, z: -15 },
      { part: GOKU_PARTS.pelvis, x: 0, y: 26, rotation: state.bodyLean * 0.18, scaleX: 1.02, scaleY: 1.12, z: -10 },
      {
        part: GOKU_PARTS.upperArm,
        x: shoulderLeft.x,
        y: shoulderLeft.y,
        rotation: leftUpperArm.rotation,
        scaleX: 0.94,
        scaleY: 1.06,
        z: leftArmFront ? 5.4 : -8,
      },
      {
        part: leftForearmPart,
        x: leftUpperArm.end.x,
        y: leftUpperArm.end.y,
        rotation: leftForearm.rotation,
        scaleX: 0.94,
        scaleY: 1.06,
        z: leftArmFront ? 6.4 : -7,
      },
      {
        part: GOKU_PARTS.chest,
        x: torso.x,
        y: torso.y,
        rotation: chestRotation,
        scaleX: state.chestScale * 0.94,
        scaleY: 1.08 - Math.abs(state.torsoTwist) * 0.03,
        z: -4,
      },
      {
        part: GOKU_PARTS.undershirt,
        x: torso.x,
        y: torso.y - 2,
        rotation: chestRotation,
        scaleX: state.chestScale * 0.96,
        scaleY: 1.04,
        z: -3,
      },
      { part: GOKU_PARTS.belt, x: 0, y: 14, rotation: sashSwing * 0.32, scaleX: 1.02, scaleY: 1.08, z: -2 },
      { part: GOKU_PARTS.neck, x: neckBase.x, y: neckBase.y, rotation: state.headTilt * 0.28 + chestRotation * 0.24, scaleY: 1.08, z: 1 },
      { part: GOKU_PARTS.backHair, x: headBase.x - 1, y: headBase.y - 8 - state.hairLift * 0.18, rotation: state.headTilt * 0.55 - 0.03, scaleX: 0.88, scaleY: 0.92, z: 2 },
      { part: GOKU_PARTS.head, x: headBase.x, y: headBase.y + Math.sin(time * 4.4) * 1.1, rotation: state.headTilt, scaleX: 1, scaleY: 1.04, z: 3 },
      {
        part: GOKU_PARTS.frontBangs,
        x: headBase.x + hairDrift * 0.18,
        y: headBase.y - 16 - state.hairLift * 0.16,
        rotation: state.headTilt * 0.72 + Math.sin(time * 9.4) * 0.03,
        scaleX: 0.78,
        scaleY: 0.82,
        z: 3.1,
      },
      { part: GOKU_PARTS.upperArm, x: shoulderRight.x, y: shoulderRight.y, rotation: rightUpperArm.rotation, scaleX: 0.94, scaleY: 1.06, z: 6.8 },
      {
        part: rightForearmPart,
        x: rightUpperArm.end.x,
        y: rightUpperArm.end.y,
        rotation: rightForearm.rotation,
        scaleX: 0.94,
        scaleY: 1.06,
        z: 7.2,
      },
    ].sort((a, b) => a.z - b.z),
  }
}

function composeJirenLocals(state: JirenRigState, time: number): JirenLocals {
  const auraFlutter = 1 + Math.sin(time * 6.4) * 0.04 + state.auraBoost * 0.02
  const auraTall = 1.02 + Math.sin(time * 5.8 + 0.6) * 0.04 + state.auraBoost * 0.06
  const torso = point(state.torsoShiftX, -10 + state.torsoShiftY)
  const chestRotation = state.torsoTwist + Math.sin(time * 2.8) * 0.014
  const headBase = add(torso, rotatePoint(point(0, -78), chestRotation))
  const neckBase = add(torso, rotatePoint(point(0, -56), chestRotation))
  const shoulderRight = add(torso, rotatePoint(point(48 * state.chestScale, -52), chestRotation))
  const shoulderLeft = add(torso, rotatePoint(point(-48 * state.chestScale, -52), chestRotation))
  const hipRight = point(16, 48)
  const hipLeft = point(-16, 46)

  const leftUpperArm = placeJoint(shoulderLeft, JIREN_PARTS.upperArm, state.leftArm.upperAngle)
  const rightUpperArm = placeJoint(shoulderRight, JIREN_PARTS.upperArm, state.rightArm.upperAngle)
  const leftForearmPart = state.beamRelease ? JIREN_PARTS.forearmBeam : state.leftArm.handOpen ? JIREN_PARTS.forearmOpen : JIREN_PARTS.forearmFist
  const rightForearmPart = state.beamRelease ? JIREN_PARTS.forearmBeam : state.rightArm.handOpen ? JIREN_PARTS.forearmOpen : JIREN_PARTS.forearmFist
  const leftForearm = placeJoint(leftUpperArm.end, leftForearmPart, state.leftArm.foreAngle)
  const rightForearm = placeJoint(rightUpperArm.end, rightForearmPart, state.rightArm.foreAngle)
  const leftThigh = placeJoint(hipLeft, JIREN_PARTS.thigh, state.leftLeg.upperAngle)
  const rightThigh = placeJoint(hipRight, JIREN_PARTS.thigh, state.rightLeg.upperAngle)
  const leftCalf = placeJoint(leftThigh.end, JIREN_PARTS.calf, state.leftLeg.lowerAngle)
  const rightCalf = placeJoint(rightThigh.end, JIREN_PARTS.calf, state.rightLeg.lowerAngle)

  return {
    beamOrigin: state.rightArm.handOpen
      ? point(rightForearm.end.x + 12, rightForearm.end.y + 2)
      : point((leftForearm.end.x + rightForearm.end.x) * 0.5 + 10, (leftForearm.end.y + rightForearm.end.y) * 0.5 + 2),
    placements: [
      {
        part: JIREN_PARTS.auraShell,
        x: 0,
        y: -4,
        rotation: Math.sin(time * 3.8) * 0.02,
        scaleX: auraFlutter,
        scaleY: auraTall,
        z: -30,
      },
      { part: JIREN_PARTS.thigh, x: hipLeft.x, y: hipLeft.y, rotation: leftThigh.rotation, scaleX: 1.02, scaleY: 1.12, z: -20 },
      { part: JIREN_PARTS.calf, x: leftThigh.end.x, y: leftThigh.end.y, rotation: leftCalf.rotation, scaleX: 1, scaleY: 1.1, z: -19 },
      { part: JIREN_PARTS.boot, x: leftCalf.end.x, y: leftCalf.end.y, rotation: state.leftLeg.footAngle, scaleX: 1, scaleY: 1.02, z: -18 },
      { part: JIREN_PARTS.thigh, x: hipRight.x, y: hipRight.y, rotation: rightThigh.rotation, scaleX: 1.02, scaleY: 1.12, z: -17 },
      { part: JIREN_PARTS.calf, x: rightThigh.end.x, y: rightThigh.end.y, rotation: rightCalf.rotation, scaleX: 1, scaleY: 1.1, z: -16 },
      { part: JIREN_PARTS.boot, x: rightCalf.end.x, y: rightCalf.end.y, rotation: state.rightLeg.footAngle, scaleX: 1, scaleY: 1.02, z: -15 },
      { part: JIREN_PARTS.waistCloth, x: 0, y: 44, rotation: Math.sin(time * 6 + 0.4) * 0.04, scaleX: 1.02, scaleY: 1.08, z: -10 },
      { part: JIREN_PARTS.upperArm, x: shoulderLeft.x, y: shoulderLeft.y, rotation: leftUpperArm.rotation, scaleX: 1.04, scaleY: 1.08, z: -7 },
      {
        part: leftForearmPart,
        x: leftUpperArm.end.x,
        y: leftUpperArm.end.y,
        rotation: leftForearm.rotation,
        scaleX: 1.02,
        scaleY: 1.06,
        z: -6,
      },
      {
        part: JIREN_PARTS.upperChest,
        x: torso.x,
        y: torso.y - 18,
        rotation: chestRotation,
        scaleX: state.chestScale * 0.94,
        scaleY: 1.02,
        z: -4,
      },
      {
        part: JIREN_PARTS.coreTorso,
        x: torso.x,
        y: torso.y + 20,
        rotation: chestRotation * 0.72,
        scaleX: 0.96 + (state.chestScale - 1) * 0.36,
        scaleY: 1.06,
        z: -3,
      },
      { part: JIREN_PARTS.neck, x: neckBase.x, y: neckBase.y, rotation: state.headTilt * 0.18 + chestRotation * 0.2, scaleY: 1.08, z: 1 },
      { part: JIREN_PARTS.head, x: headBase.x, y: headBase.y + Math.sin(time * 3.6) * 0.8, rotation: state.headTilt, scaleX: 1.1, scaleY: 1.12, z: 2 },
      { part: JIREN_PARTS.upperArm, x: shoulderRight.x, y: shoulderRight.y, rotation: rightUpperArm.rotation, scaleX: 1.04, scaleY: 1.08, z: 5 },
      {
        part: rightForearmPart,
        x: rightUpperArm.end.x,
        y: rightUpperArm.end.y,
        rotation: rightForearm.rotation,
        scaleX: 1.02,
        scaleY: 1.06,
        z: 6,
      },
    ].sort((a, b) => a.z - b.z),
  }
}

export function getGokuRigState(phase: RigPhase, phaseTime: number): GokuRigState {
  let frame: GokuPoseFrame
  let bob = 0

  switch (phase.kind) {
    case 'transform': {
      const t = easeOutCubic(clamp(phaseTime / 3.2, 0, 1))
      frame = mixGokuPose(GOKU_TRANSFORM_LOW, GOKU_TRANSFORM_RISE, t)
      const ui = easeOutCubic(clamp((phaseTime / 3.2 - 0.15) / 0.85, 0, 1))
      frame.uiProgress = ui
      frame.hairLift = lerp(2, 18, ui) + Math.sin(phaseTime * 10.4) * 1.8
      frame.auraBoost = lerp(0.6, 2.02, ui)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 12) * (1.2 + ui * 1.8)
      break
    }
    case 'roam':
      frame = cloneGokuPose(GOKU_GUARD)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 5.2) * 1.8
      {
        const step = Math.sin(phaseTime * 4.4)
        frame.torsoTwist += step * 0.08
        frame.headTilt += Math.sin(phaseTime * 2.8 + 0.4) * 0.05
        frame.leftLeg.upperAngle += step * 0.12
        frame.rightLeg.upperAngle -= step * 0.12
        frame.leftLeg.lowerAngle += Math.max(0, -step) * 0.1
        frame.rightLeg.lowerAngle += Math.max(0, step) * 0.1
        frame.leftArm.upperAngle -= step * 0.08
        frame.rightArm.upperAngle += step * 0.06
      }
      frame.bodyLean += Math.sin(phaseTime * 2.6) * 0.03
      frame.sashSwing += Math.sin(phaseTime * 6.6) * 0.08
      break
    case 'approach':
      frame = cloneGokuPose(GOKU_ADVANCE)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 12.8) * 1.2
      {
        const drive = Math.sin(phaseTime * 8.6)
        frame.torsoTwist += 0.04 + drive * 0.06
        frame.leftLeg.upperAngle += drive * 0.12
        frame.rightLeg.upperAngle -= drive * 0.12
        frame.leftArm.upperAngle += drive * 0.08
        frame.rightArm.upperAngle -= drive * 0.08
      }
      frame.headTilt += Math.sin(phaseTime * 5.2) * 0.03
      break
    case 'clash': {
      const t = (Math.sin(phaseTime * 10) + 1) * 0.5
      frame = mixGokuPose(GOKU_CLASH_A, GOKU_CLASH_B, t)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 24) * 1.4
      {
        const exchange = Math.sin(phaseTime * 6.6)
        frame.torsoTwist += exchange * 0.08
        frame.rightArm.upperAngle -= Math.max(0, exchange) * 0.18
        frame.rightArm.foreAngle -= Math.max(0, exchange) * 0.16
        frame.leftArm.upperAngle += Math.max(0, -exchange) * 0.12
        frame.leftLeg.upperAngle += exchange * 0.08
        frame.rightLeg.upperAngle -= exchange * 0.08
      }
      frame.hairLift += Math.sin(phaseTime * 15) * 1.4
      break
    }
    case 'separate':
      frame = cloneGokuPose(GOKU_RECOVERY)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 8) * 1.4
      frame.torsoTwist += Math.sin(phaseTime * 5.2) * 0.06
      frame.headTilt += Math.sin(phaseTime * 4.2) * 0.04
      break
    case 'kamehameha':
      frame = mixGokuPose(GOKU_BEAM_CHARGE, GOKU_BEAM_FIRE, easeOutCubic(clamp(phaseTime / 0.48, 0, 1)))
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 10) * 0.9
      frame.torsoTwist += Math.sin(phaseTime * 4.2) * 0.03
      frame.leftArm.upperAngle += Math.sin(phaseTime * 5.4) * 0.02
      frame.leftArm.foreAngle += Math.sin(phaseTime * 6.2) * 0.03
      frame.rightArm.foreAngle += Math.sin(phaseTime * 6.2 + 0.6) * 0.03
      frame.hairLift += Math.sin(phaseTime * 14) * 1.8
      frame.sashSwing += Math.sin(phaseTime * 8.4) * 0.16
      break
  }

  return { ...frame, bodyBob: bob, beamRelease: phase.kind === 'kamehameha' }
}

export function getJirenRigState(phase: RigPhase, phaseTime: number): JirenRigState {
  let frame: JirenPoseFrame
  let bob = 0

  switch (phase.kind) {
    case 'transform':
      frame = cloneJirenPose(JIREN_WATCH)
      bob = Math.sin(phaseTime * 3.6) * 0.5
      frame.eyeGlow += Math.sin(phaseTime * 4.2) * 0.06
      break
    case 'roam':
      frame = cloneJirenPose(JIREN_GUARD)
      bob = Math.sin(phaseTime * 3.8) * 0.7
      {
        const step = Math.sin(phaseTime * 3.4)
        frame.torsoTwist -= step * 0.06
        frame.leftLeg.upperAngle += step * 0.08
        frame.rightLeg.upperAngle -= step * 0.08
        frame.leftArm.upperAngle += step * 0.04
        frame.rightArm.upperAngle -= step * 0.04
      }
      frame.bodyLean += Math.sin(phaseTime * 1.8) * 0.02
      break
    case 'approach':
      frame = cloneJirenPose(JIREN_ADVANCE)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 12.2) * 1.1
      {
        const drive = Math.sin(phaseTime * 7.8)
        frame.torsoTwist -= 0.04 + drive * 0.05
        frame.leftLeg.upperAngle += drive * 0.1
        frame.rightLeg.upperAngle -= drive * 0.1
        frame.leftArm.upperAngle += drive * 0.08
        frame.rightArm.upperAngle -= drive * 0.08
      }
      break
    case 'clash': {
      const t = (Math.sin(phaseTime * 9.4) + 1) * 0.5
      frame = mixJirenPose(JIREN_CLASH_A, JIREN_CLASH_B, t)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 20) * 1.2
      {
        const exchange = Math.sin(phaseTime * 6.6)
        frame.torsoTwist -= exchange * 0.06
        frame.leftArm.upperAngle += Math.max(0, -exchange) * 0.16
        frame.leftArm.foreAngle += Math.max(0, -exchange) * 0.14
        frame.rightArm.upperAngle -= Math.max(0, exchange) * 0.1
        frame.leftLeg.upperAngle -= exchange * 0.06
        frame.rightLeg.upperAngle += exchange * 0.06
      }
      break
    }
    case 'separate':
      frame = cloneJirenPose(JIREN_RECOVERY)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 7) * 1.1
      frame.torsoTwist += Math.sin(phaseTime * 4.8) * 0.04
      break
    case 'kamehameha':
      frame = cloneJirenPose(JIREN_BEAM)
      bob = frame.bodyOffsetY + Math.sin(phaseTime * 8) * 0.7
      frame.rightArm.foreAngle += Math.sin(phaseTime * 5.4) * 0.03
      frame.leftArm.upperAngle += Math.sin(phaseTime * 4.4 + 0.2) * 0.03
      frame.headTilt += Math.sin(phaseTime * 3.8) * 0.02
      break
  }

  return { ...frame, bodyBob: bob, beamRelease: phase.kind === 'kamehameha' }
}

export function getGokuBeamOrigin(state: GokuRigState, time: number): Point {
  return composeGokuLocals(state, time).beamOrigin
}

export function getJirenBeamOrigin(state: JirenRigState, time: number): Point {
  return composeJirenLocals(state, time).beamOrigin
}

export function drawGokuVector(
  ctx: CanvasRenderingContext2D,
  fighter: { x: number; y: number },
  facingRight: boolean,
  time: number,
  state: GokuRigState,
  debug: CharacterRigDebugFlags,
): void {
  const paints = buildGokuPalette(state)
  const locals = composeGokuLocals(state, time)

  ctx.save()
  ctx.translate(fighter.x, fighter.y + state.bodyBob)
  if (!facingRight) ctx.scale(-1, 1)
  ctx.rotate(state.bodyLean)
  ctx.scale(state.drawScale, state.drawScale)

  for (let i = 0; i < locals.placements.length; i++) {
    drawPart(ctx, locals.placements[i]!, paints, debug)
  }

  ctx.restore()
}

export function drawJirenVector(
  ctx: CanvasRenderingContext2D,
  fighter: { x: number; y: number },
  facingRight: boolean,
  time: number,
  state: JirenRigState,
  debug: CharacterRigDebugFlags,
): void {
  const paints = buildJirenPalette(state)
  const locals = composeJirenLocals(state, time)

  ctx.save()
  ctx.translate(fighter.x, fighter.y + state.bodyBob)
  if (!facingRight) ctx.scale(-1, 1)
  ctx.rotate(state.bodyLean)
  ctx.scale(state.drawScale, state.drawScale)

  for (let i = 0; i < locals.placements.length; i++) {
    drawPart(ctx, locals.placements[i]!, paints, debug)
  }

  ctx.restore()
}
