import {
  layoutNextLine,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from '../../src/layout.ts'
import {
  getGokuBeamOrigin,
  getGokuRigState,
  getJirenBeamOrigin,
  getJirenRigState,
} from './dragon-ball-rig.ts'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import gokuModelUrl from '../assets/son-goku-fortnite/scene.gltf'
import gokuSceneBinUrl from '../assets/son-goku-fortnite/scene.bin'
import gokuBodyBaseColorUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_Body_40b7234e_baseColor.png'
import gokuBodyMetallicRoughnessUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_Body_40b7234e_metallicRoughness.png'
import gokuBodyNormalUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_Body_40b7234e_normal.png'
import gokuBodySpecularUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_Body_40b7234e_specularf0.png'
import gokuHeadBaseColorUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_Head_33411e45_baseColor.png'
import gokuHeadMetallicRoughnessUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_Head_33411e45_metallicRoughness.png'
import gokuHeadNormalUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_Head_33411e45_normal.png'
import gokuHeadSpecularUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_Head_33411e45_specularf0.png'
import gokuFaceAccBaseColorUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_FaceAcc_7f5073e0_baseColor.png'
import gokuFaceAccNormalUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_FaceAcc_7f5073e0_normal.png'
import gokuFaceAccSpecularUrl from '../assets/son-goku-fortnite/textures/M_MED_Stamina_FaceAcc_7f5073e0_specularf0.png'
import jirenModelUrl from '../assets/jiren-sparking-zero/scene.gltf'
import jirenSceneBinUrl from '../assets/jiren-sparking-zero/scene.bin'
import jiren_MI_0930_00_00_BTS000_002_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS000.002_baseColor.png'
import jiren_MI_0930_00_00_BTS000_002_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS000.002_emissive.png'
import jiren_MI_0930_00_00_BTS000_002_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS000.002_metallicRoughness.png'
import jiren_MI_0930_00_00_BTS000_002_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS000.002_normal.png'
import jiren_MI_0930_00_00_BTS001_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS001.001_baseColor.png'
import jiren_MI_0930_00_00_BTS001_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS001.001_emissive.png'
import jiren_MI_0930_00_00_BTS001_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS001.001_metallicRoughness.png'
import jiren_MI_0930_00_00_BTS001_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS001.001_normal.png'
import jiren_MI_0930_00_00_BTS010_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS010.001_baseColor.png'
import jiren_MI_0930_00_00_BTS010_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS010.001_emissive.png'
import jiren_MI_0930_00_00_BTS010_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS010.001_metallicRoughness.png'
import jiren_MI_0930_00_00_BTS010_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_BTS010.001_normal.png'
import jiren_MI_0930_00_00_EYE000_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_EYE000.001_baseColor.png'
import jiren_MI_0930_00_00_EYE000_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_EYE000.001_emissive.png'
import jiren_MI_0930_00_00_EYE000_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_EYE000.001_metallicRoughness.png'
import jiren_MI_0930_00_00_EYE000_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_EYE000.001_normal.png'
import jiren_MI_0930_00_00_EYE010_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_EYE010.001_baseColor.png'
import jiren_MI_0930_00_00_EYE010_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_EYE010.001_emissive.png'
import jiren_MI_0930_00_00_EYE010_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_EYE010.001_metallicRoughness.png'
import jiren_MI_0930_00_00_EYE010_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_EYE010.001_normal.png'
import jiren_MI_0930_00_00_FCE000_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_FCE000.001_baseColor.png'
import jiren_MI_0930_00_00_FCE000_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_FCE000.001_emissive.png'
import jiren_MI_0930_00_00_FCE000_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_FCE000.001_metallicRoughness.png'
import jiren_MI_0930_00_00_FCE000_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_FCE000.001_normal.png'
import jiren_MI_0930_00_00_FCE001_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_FCE001.001_baseColor.png'
import jiren_MI_0930_00_00_FCE001_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_FCE001.001_emissive.png'
import jiren_MI_0930_00_00_FCE001_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_FCE001.001_metallicRoughness.png'
import jiren_MI_0930_00_00_FCE001_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_FCE001.001_normal.png'
import jiren_MI_0930_00_00_INR000_002_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR000.002_baseColor.png'
import jiren_MI_0930_00_00_INR000_002_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR000.002_emissive.png'
import jiren_MI_0930_00_00_INR000_002_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR000.002_metallicRoughness.png'
import jiren_MI_0930_00_00_INR000_002_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR000.002_normal.png'
import jiren_MI_0930_00_00_INR002_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR002.001_baseColor.png'
import jiren_MI_0930_00_00_INR002_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR002.001_emissive.png'
import jiren_MI_0930_00_00_INR002_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR002.001_metallicRoughness.png'
import jiren_MI_0930_00_00_INR002_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR002.001_normal.png'
import jiren_MI_0930_00_00_INR010_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR010.001_baseColor.png'
import jiren_MI_0930_00_00_INR010_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR010.001_emissive.png'
import jiren_MI_0930_00_00_INR010_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR010.001_metallicRoughness.png'
import jiren_MI_0930_00_00_INR010_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR010.001_normal.png'
import jiren_MI_0930_00_00_INR011_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR011.001_baseColor.png'
import jiren_MI_0930_00_00_INR011_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR011.001_emissive.png'
import jiren_MI_0930_00_00_INR011_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR011.001_metallicRoughness.png'
import jiren_MI_0930_00_00_INR011_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_INR011.001_normal.png'
import jiren_MI_0930_00_00_SKN000_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN000.001_baseColor.png'
import jiren_MI_0930_00_00_SKN000_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN000.001_emissive.png'
import jiren_MI_0930_00_00_SKN000_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN000.001_metallicRoughness.png'
import jiren_MI_0930_00_00_SKN000_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN000.001_normal.png'
import jiren_MI_0930_00_00_SKN001_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN001.001_baseColor.png'
import jiren_MI_0930_00_00_SKN001_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN001.001_emissive.png'
import jiren_MI_0930_00_00_SKN001_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN001.001_metallicRoughness.png'
import jiren_MI_0930_00_00_SKN001_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN001.001_normal.png'
import jiren_MI_0930_00_00_SKN002_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN002.001_baseColor.png'
import jiren_MI_0930_00_00_SKN002_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN002.001_emissive.png'
import jiren_MI_0930_00_00_SKN002_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN002.001_metallicRoughness.png'
import jiren_MI_0930_00_00_SKN002_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_0930_00_00_SKN002.001_normal.png'
import jiren_MI_LNE000_005_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_LNE000.005_baseColor.png'
import jiren_MI_LNE000_005_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_LNE000.005_emissive.png'
import jiren_MI_LNE000_005_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_LNE000.005_metallicRoughness.png'
import jiren_MI_LNE000_005_normalUrl from '../assets/jiren-sparking-zero/textures/MI_LNE000.005_normal.png'
import jiren_MI_MTH001_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_MTH001.001_baseColor.png'
import jiren_MI_MTH001_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_MTH001.001_emissive.png'
import jiren_MI_MTH001_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_MTH001.001_metallicRoughness.png'
import jiren_MI_MTH001_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_MTH001.001_normal.png'
import jiren_MI_SWT000_001_baseColorUrl from '../assets/jiren-sparking-zero/textures/MI_SWT000.001_baseColor.png'
import jiren_MI_SWT000_001_emissiveUrl from '../assets/jiren-sparking-zero/textures/MI_SWT000.001_emissive.png'
import jiren_MI_SWT000_001_metallicRoughnessUrl from '../assets/jiren-sparking-zero/textures/MI_SWT000.001_metallicRoughness.png'
import jiren_MI_SWT000_001_normalUrl from '../assets/jiren-sparking-zero/textures/MI_SWT000.001_normal.png'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BODY_FONT = '22px "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif'
const BODY_LINE_HEIGHT = 36
const GUTTER = 40
const TOP_INSET = 100
const MIN_SLOT_WIDTH = 24

const GOKU_RADIUS = 72
const JIREN_RADIUS = 84
const TRANSFORM_DURATION = 3.5
const ROAM_DURATION = 5.4
const APPROACH_DURATION = 1.35
const CLASH_DURATION = 3.4
const SEPARATE_DURATION = 2.8
const KAMEHAMEHA_DURATION = 4.4

type EnergyColor = { r: number; g: number; b: number }

const GOKU_BASE_COLOR: EnergyColor = { r: 118, g: 176, b: 255 }
const GOKU_UI_COLOR: EnergyColor = { r: 226, g: 238, b: 255 }
const JIREN_COLOR: EnergyColor = { r: 255, g: 82, b: 58 }

// ---------------------------------------------------------------------------
// Fight narrative
// ---------------------------------------------------------------------------

type PhaseKind = 'transform' | 'roam' | 'approach' | 'clash' | 'separate' | 'kamehameha'

const STORY_BEATS: Array<{ phase: PhaseKind; text: string }> = [
  {
    phase: 'transform',
    text: 'Goku stayed low near the broken lip of the arena while Jiren held the opposite rise like a living wall. The distance between them felt ceremonial at first, but every drifting slab and spark of dust already leaned toward violence.',
  },
  {
    phase: 'transform',
    text: 'Then the temperature of the whole scene changed. Goku\'s aura thinned, sharpened, and turned unnaturally quiet before a silver current climbed through him. Hair rose. Eyes cleared. Ultra Instinct did not explode outward so much as arrive with perfect certainty.',
  },
  {
    phase: 'roam',
    text: 'They stopped respecting lanes. Goku skimmed from low ground to high in clean silver arcs, while Jiren cut back across him on harder diagonals and heavier turns. It finally looked less like circling and more like two monsters testing how much of the void they could take away from each other.',
  },
  {
    phase: 'approach',
    text: 'Jiren broke the standoff first and accelerated straight through the middle as if the page belonged to him. Goku gave him only a sliver of target, slipped off the line, then snapped back across Jiren\'s shoulder with a counter that forced both of them into a faster truth.',
  },
  {
    phase: 'clash',
    text: 'The center of the page disappeared under them. They crossed, checked, and re-entered with almost no dead air between exchanges. Goku kept turning defense into motion, while Jiren answered with compact counters that felt heavy enough to bend the arena around them.',
  },
  {
    phase: 'clash',
    text: 'Pressed for the first time, Jiren widened, anchored, and let scarlet force tear out of him in sheets. The red of the Pride Trooper suit started reading like warning signs in the dark. Every answer he threw after that looked less like a punch and more like an impact event.',
  },
  {
    phase: 'separate',
    text: 'One collision finally tore them loose and sent both fighters skidding back across opposite halves of the screen. Jiren filled the gap with red pressure immediately. Goku let the blasts pass his shoulders by inches, leaving silver afterimages behind him while he carved out the one lane he actually needed.',
  },
  {
    phase: 'kamehameha',
    text: 'Goku planted at last, drew both hands in, and let the Kamehameha gather until the space between his palms looked denser than the arena. Jiren met it with a red column fired from pure refusal. White-blue and crimson locked in the center, and the first Ultra Instinct awakening stopped being rumor and became law.',
  },
]

const FIGHT_TEXT = STORY_BEATS.map(beat => beat.text).join('\n\n')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Interval = { left: number; right: number }
type Point = { x: number; y: number }
type FighterSnapshot = { x: number; y: number; vx: number; vy: number }
type TrailPoint = { x: number; y: number; age: number; vx: number; vy: number }
type Arena = {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
  centerX: number
  centerY: number
}

type Fighter = {
  name: 'goku' | 'jiren'
  x: number
  y: number
  r: number
  vx: number
  vy: number
  drawScale: number
  trailClock: number
  trail: TrailPoint[]
}

type Beam = {
  fromX: number
  fromY: number
  toX: number
  toY: number
  width: number
  age: number
  maxAge: number
  color: EnergyColor
}

type Clash = {
  x: number
  y: number
  age: number
  maxAge: number
  radius: number
}

type PositionedLine = {
  x: number
  y: number
  width: number
  text: string
  charStart: number
  charEnd: number
}

type Phase =
  | { kind: 'transform'; timer: number }
  | { kind: 'roam'; timer: number }
  | { kind: 'approach'; timer: number }
  | { kind: 'clash'; timer: number }
  | { kind: 'separate'; timer: number }
  | { kind: 'kamehameha'; timer: number; who: 'goku' | 'both' }

type RectObstacle = { x: number; y: number; w: number; h: number }
type RigBones = {
  hips: string
  spine: string
  chest: string
  upperChest?: string
  neck?: string
  head: string
  clavicleL?: string
  upperArmL: string
  foreArmL: string
  handL?: string
  clavicleR?: string
  upperArmR: string
  foreArmR: string
  handR?: string
  thighL: string
  calfL: string
  footL?: string
  thighR: string
  calfR: string
  footR?: string
}

type BoneKey = keyof RigBones

type RigProfile = {
  bones: RigBones
  modelPixelHeight: number
  playBuiltInAnimation: boolean
  uiTintMode: 'none' | 'hair' | 'head' | 'global'
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const stageNode = document.getElementById('stage')
if (!(stageNode instanceof HTMLDivElement)) throw new Error('#stage not found')
const stage = stageNode

const canvas = document.createElement('canvas')
canvas.className = 'fx'
stage.appendChild(canvas)

const context = canvas.getContext('2d')
if (context === null) throw new Error('2D canvas not available')
const ctx = context

let prepared: PreparedTextWithSegments | null = null

const goku: Fighter = {
  name: 'goku',
  x: 0,
  y: 0,
  r: GOKU_RADIUS,
  vx: 110,
  vy: -74,
  drawScale: 1.24,
  trailClock: 0,
  trail: [],
}

const jiren: Fighter = {
  name: 'jiren',
  x: 0,
  y: 0,
  r: JIREN_RADIUS,
  vx: -92,
  vy: 58,
  drawScale: 1.36,
  trailClock: 0,
  trail: [],
}

const beams: Beam[] = []
const clashes: Clash[] = []

let phase: Phase = { kind: 'transform', timer: TRANSFORM_DURATION }
let phaseTime = 0
let lastTime: number | null = null
let phaseEntry = {
  goku: { x: 0, y: 0, vx: 0, vy: 0 },
  jiren: { x: 0, y: 0, vx: 0, vy: 0 },
}

// ---------------------------------------------------------------------------
// Scene <-> paragraph mapping
// ---------------------------------------------------------------------------

const paragraphRanges: Array<{ start: number; end: number }> = []
const PHASE_PARAGRAPHS: Record<PhaseKind, number[]> = {
  transform: [],
  roam: [],
  approach: [],
  clash: [],
  separate: [],
  kamehameha: [],
}

{
  let offset = 0
  for (let i = 0; i < STORY_BEATS.length; i++) {
    const beat = STORY_BEATS[i]!
    paragraphRanges.push({ start: offset, end: offset + beat.text.length })
    PHASE_PARAGRAPHS[beat.phase].push(i)
    offset += beat.text.length
    if (i < STORY_BEATS.length - 1) offset += 2
  }
}

function isCharInActiveScene(charIdx: number, phaseKind: PhaseKind): boolean {
  const paragraphIndices = PHASE_PARAGRAPHS[phaseKind]
  for (let i = 0; i < paragraphIndices.length; i++) {
    const range = paragraphRanges[paragraphIndices[i]!]
    if (range !== undefined && charIdx >= range.start && charIdx < range.end) return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function smoothstep01(t: number): number {
  const clamped = clamp(t, 0, 1)
  return clamped * clamped * (3 - 2 * clamped)
}

function easeInCubic(t: number): number {
  const clamped = clamp(t, 0, 1)
  return clamped * clamped * clamped
}

function easeOutCubic(t: number): number {
  const clamped = clamp(t, 0, 1)
  return 1 - Math.pow(1 - clamped, 3)
}

function easeInOutSine(t: number): number {
  const clamped = clamp(t, 0, 1)
  return -(Math.cos(Math.PI * clamped) - 1) * 0.5
}

function mixColor(a: EnergyColor, b: EnergyColor, t: number): EnergyColor {
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  }
}

function rgba(color: EnergyColor, alpha: number): string {
  return `rgba(${color.r},${color.g},${color.b},${alpha})`
}

function point(x: number, y: number): Point {
  return { x, y }
}

function getArena(w: number, h: number): Arena {
  const insetX = GUTTER + 88
  const insetTop = TOP_INSET + 44
  const insetBottom = GUTTER + 56
  const left = insetX
  const right = w - insetX
  const top = insetTop
  const bottom = h - insetBottom
  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
    centerX: (left + right) * 0.5,
    centerY: (top + bottom) * 0.5,
  }
}

function arenaPoint(arena: Arena, xT: number, yT: number): Point {
  return point(
    lerp(arena.left, arena.right, xT),
    lerp(arena.top, arena.bottom, yT),
  )
}

function snapshotFighter(fighter: Fighter): FighterSnapshot {
  return {
    x: fighter.x,
    y: fighter.y,
    vx: fighter.vx,
    vy: fighter.vy,
  }
}

function moveTowardValue(value: number, target: number, maxDelta: number): number {
  if (value < target) return Math.min(value + maxDelta, target)
  return Math.max(value - maxDelta, target)
}

function rotatePoint(p: Point, angle: number): Point {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos,
  }
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function localToWorld(
  fighter: Fighter,
  local: Point,
  facingRight: boolean,
  drawScale: number,
  bodyLean: number,
  bodyBob = 0,
): Point {
  const mirrored = facingRight ? local : point(-local.x, local.y)
  const rotated = rotatePoint(mirrored, bodyLean)
  return {
    x: fighter.x + rotated.x * drawScale,
    y: fighter.y + bodyBob + rotated.y * drawScale,
  }
}

// ---------------------------------------------------------------------------
// Circle/rect/beam -> band interval
// ---------------------------------------------------------------------------

function circleIntervalForBand(
  cx: number, cy: number, r: number,
  bandTop: number, bandBottom: number,
  hPad: number, vPad: number,
): Interval | null {
  const top = bandTop - vPad
  const bottom = bandBottom + vPad
  if (top >= cy + r || bottom <= cy - r) return null
  const minDy = cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom
  if (minDy >= r) return null
  const maxDx = Math.sqrt(r * r - minDy * minDy)
  return { left: cx - maxDx - hPad, right: cx + maxDx + hPad }
}

function rectIntervalForBand(
  rx: number, ry: number, rw: number, rh: number,
  bandTop: number, bandBottom: number,
  hPad: number, vPad: number,
): Interval | null {
  if (bandTop >= ry + rh + vPad || bandBottom <= ry - vPad) return null
  return { left: rx - hPad, right: rx + rw + hPad }
}

function beamIntervalForBand(
  beam: Beam,
  bandTop: number, bandBottom: number,
  hPad: number, vPad: number,
): Interval | null {
  const radius = beam.width * 0.5 + hPad
  const top = bandTop - vPad - radius
  const bottom = bandBottom + vPad + radius
  const y1 = beam.fromY
  const y2 = beam.toY

  if (Math.abs(y2 - y1) < 0.0001) {
    if (y1 < top || y1 > bottom) return null
    return {
      left: Math.min(beam.fromX, beam.toX) - radius,
      right: Math.max(beam.fromX, beam.toX) + radius,
    }
  }

  const tA = (top - y1) / (y2 - y1)
  const tB = (bottom - y1) / (y2 - y1)
  const tMin = Math.max(0, Math.min(tA, tB))
  const tMax = Math.min(1, Math.max(tA, tB))
  if (tMin > tMax) return null

  const xA = lerp(beam.fromX, beam.toX, tMin)
  const xB = lerp(beam.fromX, beam.toX, tMax)
  return {
    left: Math.min(xA, xB) - radius,
    right: Math.max(xA, xB) + radius,
  }
}

function carveSlots(base: Interval, blocked: Interval[]): Interval[] {
  let slots: Interval[] = [base]
  for (let i = 0; i < blocked.length; i++) {
    const block = blocked[i]!
    const next: Interval[] = []
    for (let j = 0; j < slots.length; j++) {
      const slot = slots[j]!
      if (block.right <= slot.left || block.left >= slot.right) {
        next.push(slot)
        continue
      }
      if (block.left > slot.left) next.push({ left: slot.left, right: block.left })
      if (block.right < slot.right) next.push({ left: block.right, right: slot.right })
    }
    slots = next
  }
  return slots.filter(slot => slot.right - slot.left >= MIN_SLOT_WIDTH)
}

// ---------------------------------------------------------------------------
// Text layout with obstacles
// ---------------------------------------------------------------------------

function layoutWithObstacles(
  prep: PreparedTextWithSegments,
  regionX: number, regionY: number,
  regionW: number, regionH: number,
  fighters: Fighter[],
  beamList: Beam[],
  rects: RectObstacle[],
): PositionedLine[] {
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
  let lineTop = regionY
  let charOffset = 0
  const lines: PositionedLine[] = []

  while (lineTop + BODY_LINE_HEIGHT <= regionY + regionH) {
    const bandTop = lineTop
    const bandBottom = lineTop + BODY_LINE_HEIGHT
    const blocked: Interval[] = []

    for (let i = 0; i < fighters.length; i++) {
      const fighter = fighters[i]!
      const interval = circleIntervalForBand(fighter.x, fighter.y, fighter.r + 12, bandTop, bandBottom, 14, 4)
      if (interval !== null) blocked.push(interval)
    }

    for (let i = 0; i < beamList.length; i++) {
      const beam = beamList[i]!
      if (beam.age > beam.maxAge) continue
      const interval = beamIntervalForBand(beam, bandTop, bandBottom, 18, 10)
      if (interval !== null) blocked.push(interval)
    }

    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i]!
      const interval = rectIntervalForBand(rect.x, rect.y, rect.w, rect.h, bandTop, bandBottom, 14, 4)
      if (interval !== null) blocked.push(interval)
    }

    const slots = carveSlots({ left: regionX, right: regionX + regionW }, blocked).sort((a, b) => a.left - b.left)
    if (slots.length === 0) {
      lineTop += BODY_LINE_HEIGHT
      continue
    }

    let textDone = false
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]!
      const line = layoutNextLine(prep, cursor, slot.right - slot.left)
      if (line === null) {
        textDone = true
        break
      }
      const charStart = charOffset
      charOffset += line.text.length
      lines.push({
        x: Math.round(slot.left),
        y: Math.round(lineTop),
        width: line.width,
        text: line.text,
        charStart,
        charEnd: charOffset,
      })
      cursor = line.end
    }

    if (textDone) break
    lineTop += BODY_LINE_HEIGHT
  }

  return lines
}

// ---------------------------------------------------------------------------
// DOM line pool
// ---------------------------------------------------------------------------

const linePool: HTMLDivElement[] = []

function syncLinePool(count: number): void {
  while (linePool.length < count) {
    const element = document.createElement('div')
    element.className = 'line'
    stage.appendChild(element)
    linePool.push(element)
  }
  for (let i = 0; i < linePool.length; i++) {
    linePool[i]!.style.display = i < count ? '' : 'none'
  }
}

// ---------------------------------------------------------------------------
// Visual states
// ---------------------------------------------------------------------------

function getGokuEnergyColor(currentPhase: Phase, currentPhaseTime: number): EnergyColor {
  const state = getGokuRigState(currentPhase, currentPhaseTime)
  return mixColor(GOKU_BASE_COLOR, GOKU_UI_COLOR, state.uiProgress)
}

// ---------------------------------------------------------------------------
// FX rendering (2D canvas)
// ---------------------------------------------------------------------------

function drawAura(fighter: Fighter, color: EnergyColor, time: number, boost: number): void {
  if (boost < 1.0) return

  ctx.save()
  ctx.globalCompositeOperation = 'screen'

  const intensity = clamp(boost - 0.8, 0, 2.0)
  const baseR = fighter.r * 1.1

  // --- Rising flame pillars (the DB aura look) ---
  const pillarCount = fighter.name === 'goku' ? 14 : 12
  for (let i = 0; i < pillarCount; i++) {
    const baseAngle = (i / pillarCount) * Math.PI * 2
    // Flames rise upward — bias toward top half
    const riseAngle = baseAngle * 0.6 + (-Math.PI / 2) * 0.4
    const phase = time * 6 + i * 2.1
    const flicker = Math.sin(phase) * 0.3 + Math.sin(phase * 1.7) * 0.2
    const pillarLen = (20 + intensity * 18 + flicker * 12) * (0.7 + 0.3 * Math.abs(Math.sin(baseAngle - Math.PI / 2)))

    const bx = fighter.x + Math.cos(baseAngle) * (baseR * 0.7)
    const by = fighter.y + Math.sin(baseAngle) * (baseR * 0.7)
    const tx = bx + Math.cos(riseAngle) * pillarLen
    const ty = by + Math.sin(riseAngle) * pillarLen

    // Tapered flame shape
    const perpX = -Math.sin(riseAngle)
    const perpY = Math.cos(riseAngle)
    const halfW = 5 + intensity * 3 + flicker * 2

    ctx.beginPath()
    ctx.moveTo(bx + perpX * halfW, by + perpY * halfW)
    ctx.quadraticCurveTo(
      (bx + tx) / 2 + perpX * halfW * 0.4 + Math.sin(phase * 2.3) * 3,
      (by + ty) / 2 + perpY * halfW * 0.4,
      tx, ty,
    )
    ctx.quadraticCurveTo(
      (bx + tx) / 2 - perpX * halfW * 0.4 + Math.sin(phase * 1.9) * 3,
      (by + ty) / 2 - perpY * halfW * 0.4,
      bx - perpX * halfW, by - perpY * halfW,
    )
    ctx.closePath()

    const alpha = (0.12 + intensity * 0.06) * (0.6 + 0.4 * Math.abs(Math.sin(phase * 0.8)))
    ctx.fillStyle = rgba(color, alpha)
    ctx.fill()
  }

  // --- Bright edge wisps that rise and fade ---
  const wispCount = 6 + Math.floor(intensity * 3)
  for (let i = 0; i < wispCount; i++) {
    const seed = i * 137.508 // golden angle spread
    const wispPhase = time * 4 + seed
    const life = (wispPhase % 2) / 2 // 0..1 repeating
    const wispAngle = -Math.PI / 2 + Math.sin(seed) * 0.8 // mostly upward
    const dist = baseR * 0.5 + life * (40 + intensity * 20)
    const wx = fighter.x + Math.cos(seed + time * 0.5) * baseR * 0.4 + Math.cos(wispAngle) * dist
    const wy = fighter.y + Math.sin(seed + time * 0.5) * baseR * 0.3 + Math.sin(wispAngle) * dist
    const wispAlpha = (1 - life) * 0.2 * intensity
    const wispR = 4 + (1 - life) * 6

    const wGrad = ctx.createRadialGradient(wx, wy, 0, wx, wy, wispR)
    wGrad.addColorStop(0, rgba({ r: Math.min(255, color.r + 60), g: Math.min(255, color.g + 60), b: Math.min(255, color.b + 60) }, wispAlpha))
    wGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = wGrad
    ctx.beginPath()
    ctx.arc(wx, wy, wispR, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function drawTrail(fighter: Fighter, color: EnergyColor): void {
  for (let i = 0; i < fighter.trail.length; i++) {
    const trailPoint = fighter.trail[i]!
    const life = clamp(1 - trailPoint.age / 0.34, 0, 1)
    const speed = Math.hypot(trailPoint.vx, trailPoint.vy)
    const angle = Math.atan2(trailPoint.vy, trailPoint.vx)
    const major = fighter.r * (0.12 + speed / 2400) * life
    const minor = fighter.r * 0.08 * life
    ctx.save()
    ctx.translate(trailPoint.x, trailPoint.y)
    ctx.rotate(angle)
    ctx.fillStyle = rgba(color, 0.24 * life)
    ctx.beginPath()
    ctx.ellipse(-major * 0.35, 0, major, minor, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function drawBeam(beam: Beam): void {
  const progress = Math.min(beam.age / (beam.maxAge * 0.18), 1)
  const fade = beam.age > beam.maxAge * 0.72
    ? Math.max(0, 1 - (beam.age - beam.maxAge * 0.72) / (beam.maxAge * 0.28))
    : 1
  const ex = beam.fromX + (beam.toX - beam.fromX) * progress
  const ey = beam.fromY + (beam.toY - beam.fromY) * progress

  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalCompositeOperation = 'screen'
  ctx.shadowColor = rgba(beam.color, 0.76 * fade)
  ctx.shadowBlur = beam.width * 1.5

  ctx.strokeStyle = rgba(beam.color, 0.28 * fade)
  ctx.lineWidth = beam.width + 22
  ctx.beginPath()
  ctx.moveTo(beam.fromX, beam.fromY)
  ctx.lineTo(ex, ey)
  ctx.stroke()

  ctx.shadowBlur = beam.width * 0.85
  ctx.strokeStyle = rgba(beam.color, 0.92 * fade)
  ctx.lineWidth = beam.width
  ctx.beginPath()
  ctx.moveTo(beam.fromX, beam.fromY)
  ctx.lineTo(ex, ey)
  ctx.stroke()

  ctx.strokeStyle = `rgba(255,255,255,${0.68 * fade})`
  ctx.lineWidth = beam.width * 0.34
  ctx.beginPath()
  ctx.moveTo(beam.fromX, beam.fromY)
  ctx.lineTo(ex, ey)
  ctx.stroke()
  ctx.restore()
}

function drawClash(clash: Clash): void {
  const progress = clash.age / clash.maxAge
  const fade = progress > 0.55 ? Math.max(0, 1 - (progress - 0.55) * 2.25) : 1
  const radius = clash.radius * (0.58 + progress * 1.55)

  const gradient = ctx.createRadialGradient(clash.x, clash.y, 0, clash.x, clash.y, radius)
  gradient.addColorStop(0, `rgba(255,255,255,${0.92 * fade})`)
  gradient.addColorStop(0.32, `rgba(255,220,188,${0.52 * fade})`)
  gradient.addColorStop(0.68, `rgba(255,104,62,${0.18 * fade})`)
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(clash.x, clash.y, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = `rgba(255,255,255,${0.42 * fade})`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(clash.x, clash.y, radius * 0.78, 0, Math.PI * 2)
  ctx.stroke()

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + progress * 2.4
    const inner = radius * 0.26
    const outer = radius * (0.68 + progress * 0.28)
    ctx.strokeStyle = `rgba(255,238,214,${0.52 * fade})`
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(clash.x + Math.cos(angle) * inner, clash.y + Math.sin(angle) * inner)
    ctx.lineTo(clash.x + Math.cos(angle) * outer, clash.y + Math.sin(angle) * outer)
    ctx.stroke()
  }
}

// ---------------------------------------------------------------------------
// Three.js setup
// ---------------------------------------------------------------------------

const threeCanvas = document.createElement('canvas')
threeCanvas.className = 'three'
stage.appendChild(threeCanvas)

const threeRenderer = new THREE.WebGLRenderer({
  canvas: threeCanvas,
  alpha: true,
  antialias: true,
})
threeRenderer.setClearColor(0x000000, 0)
threeRenderer.outputColorSpace = THREE.SRGBColorSpace

const threeScene = new THREE.Scene()

// Orthographic camera: 1 unit = 1 pixel, origin at center
const threeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000)
threeCamera.position.set(0, 0, 500)
threeCamera.lookAt(0, 0, 0)

// Anime-style lighting
const ambientLight = new THREE.AmbientLight(0x8888aa, 0.6)
threeScene.add(ambientLight)

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
mainLight.position.set(100, -200, 400)
threeScene.add(mainLight)

const rimLight = new THREE.DirectionalLight(0x4488ff, 0.4)
rimLight.position.set(-100, 0, -200)
threeScene.add(rimLight)

// Toon gradient texture for cel shading
function createToonGradient(): THREE.DataTexture {
  const colors = new Uint8Array([80, 160, 255])
  const tex = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat)
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter
  tex.needsUpdate = true
  return tex
}

const toonGradient = createToonGradient()

const GOKU_RIG_PROFILE: RigProfile = {
  bones: {
    hips: 'pelvis',
    spine: 'spine_01',
    chest: 'spine_03',
    upperChest: 'spine_05',
    neck: 'neck_02',
    head: 'head',
    clavicleL: 'clavicle_l',
    upperArmL: 'upperarm_l',
    foreArmL: 'lowerarm_l',
    handL: 'hand_l',
    clavicleR: 'clavicle_r',
    upperArmR: 'upperarm_r',
    foreArmR: 'lowerarm_r',
    handR: 'hand_r',
    thighL: 'thigh_l',
    calfL: 'calf_l',
    footL: 'foot_l',
    thighR: 'thigh_r',
    calfR: 'calf_r',
    footR: 'foot_r',
  },
  modelPixelHeight: 170,
  playBuiltInAnimation: false,
  uiTintMode: 'global',
}

const JIREN_RIG_PROFILE: RigProfile = {
  bones: {
    hips: 'WAIST',
    spine: 'SPINE1',
    chest: 'SPINE2',
    upperChest: 'SPINE3',
    neck: 'NECK',
    head: 'HEAD',
    clavicleL: 'CLAVICLE_L',
    upperArmL: 'SHOULDER_L',
    foreArmL: 'ELBOW_L',
    handL: 'WRIST_L',
    clavicleR: 'CLAVICLE_R',
    upperArmR: 'SHOULDER_R',
    foreArmR: 'ELBOW_R',
    handR: 'WRIST_R',
    thighL: 'THIGH_L',
    calfL: 'CLANK_L',
    footL: 'CLANKROLL_L',
    thighR: 'THIGH_R',
    calfR: 'CLANK_R',
    footR: 'CLANKROLL_R',
  },
  modelPixelHeight: 160,
  playBuiltInAnimation: false,
  uiTintMode: 'none',
}

const GOKU_MODEL_ASSETS: Record<string, string> = {
  'scene.bin': gokuSceneBinUrl,
  'textures/M_MED_Stamina_Body_40b7234e_baseColor.png': gokuBodyBaseColorUrl,
  'textures/M_MED_Stamina_Body_40b7234e_metallicRoughness.png': gokuBodyMetallicRoughnessUrl,
  'textures/M_MED_Stamina_Body_40b7234e_normal.png': gokuBodyNormalUrl,
  'textures/M_MED_Stamina_Body_40b7234e_specularf0.png': gokuBodySpecularUrl,
  'textures/M_MED_Stamina_Head_33411e45_baseColor.png': gokuHeadBaseColorUrl,
  'textures/M_MED_Stamina_Head_33411e45_metallicRoughness.png': gokuHeadMetallicRoughnessUrl,
  'textures/M_MED_Stamina_Head_33411e45_normal.png': gokuHeadNormalUrl,
  'textures/M_MED_Stamina_Head_33411e45_specularf0.png': gokuHeadSpecularUrl,
  'textures/M_MED_Stamina_FaceAcc_7f5073e0_baseColor.png': gokuFaceAccBaseColorUrl,
  'textures/M_MED_Stamina_FaceAcc_7f5073e0_normal.png': gokuFaceAccNormalUrl,
  'textures/M_MED_Stamina_FaceAcc_7f5073e0_specularf0.png': gokuFaceAccSpecularUrl,
  'M_MED_Stamina_Body_40b7234e_baseColor.png': gokuBodyBaseColorUrl,
  'M_MED_Stamina_Body_40b7234e_metallicRoughness.png': gokuBodyMetallicRoughnessUrl,
  'M_MED_Stamina_Body_40b7234e_normal.png': gokuBodyNormalUrl,
  'M_MED_Stamina_Body_40b7234e_specularf0.png': gokuBodySpecularUrl,
  'M_MED_Stamina_Head_33411e45_baseColor.png': gokuHeadBaseColorUrl,
  'M_MED_Stamina_Head_33411e45_metallicRoughness.png': gokuHeadMetallicRoughnessUrl,
  'M_MED_Stamina_Head_33411e45_normal.png': gokuHeadNormalUrl,
  'M_MED_Stamina_Head_33411e45_specularf0.png': gokuHeadSpecularUrl,
  'M_MED_Stamina_FaceAcc_7f5073e0_baseColor.png': gokuFaceAccBaseColorUrl,
  'M_MED_Stamina_FaceAcc_7f5073e0_normal.png': gokuFaceAccNormalUrl,
  'M_MED_Stamina_FaceAcc_7f5073e0_specularf0.png': gokuFaceAccSpecularUrl,
}

const JIREN_MODEL_ASSETS: Record<string, string> = {
  'scene.bin': jirenSceneBinUrl,
  'textures/MI_0930_00_00_BTS000.002_baseColor.png': jiren_MI_0930_00_00_BTS000_002_baseColorUrl,
  'textures/MI_0930_00_00_BTS000.002_emissive.png': jiren_MI_0930_00_00_BTS000_002_emissiveUrl,
  'textures/MI_0930_00_00_BTS000.002_metallicRoughness.png': jiren_MI_0930_00_00_BTS000_002_metallicRoughnessUrl,
  'textures/MI_0930_00_00_BTS000.002_normal.png': jiren_MI_0930_00_00_BTS000_002_normalUrl,
  'textures/MI_0930_00_00_BTS001.001_baseColor.png': jiren_MI_0930_00_00_BTS001_001_baseColorUrl,
  'textures/MI_0930_00_00_BTS001.001_emissive.png': jiren_MI_0930_00_00_BTS001_001_emissiveUrl,
  'textures/MI_0930_00_00_BTS001.001_metallicRoughness.png': jiren_MI_0930_00_00_BTS001_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_BTS001.001_normal.png': jiren_MI_0930_00_00_BTS001_001_normalUrl,
  'textures/MI_0930_00_00_BTS010.001_baseColor.png': jiren_MI_0930_00_00_BTS010_001_baseColorUrl,
  'textures/MI_0930_00_00_BTS010.001_emissive.png': jiren_MI_0930_00_00_BTS010_001_emissiveUrl,
  'textures/MI_0930_00_00_BTS010.001_metallicRoughness.png': jiren_MI_0930_00_00_BTS010_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_BTS010.001_normal.png': jiren_MI_0930_00_00_BTS010_001_normalUrl,
  'textures/MI_0930_00_00_EYE000.001_baseColor.png': jiren_MI_0930_00_00_EYE000_001_baseColorUrl,
  'textures/MI_0930_00_00_EYE000.001_emissive.png': jiren_MI_0930_00_00_EYE000_001_emissiveUrl,
  'textures/MI_0930_00_00_EYE000.001_metallicRoughness.png': jiren_MI_0930_00_00_EYE000_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_EYE000.001_normal.png': jiren_MI_0930_00_00_EYE000_001_normalUrl,
  'textures/MI_0930_00_00_EYE010.001_baseColor.png': jiren_MI_0930_00_00_EYE010_001_baseColorUrl,
  'textures/MI_0930_00_00_EYE010.001_emissive.png': jiren_MI_0930_00_00_EYE010_001_emissiveUrl,
  'textures/MI_0930_00_00_EYE010.001_metallicRoughness.png': jiren_MI_0930_00_00_EYE010_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_EYE010.001_normal.png': jiren_MI_0930_00_00_EYE010_001_normalUrl,
  'textures/MI_0930_00_00_FCE000.001_baseColor.png': jiren_MI_0930_00_00_FCE000_001_baseColorUrl,
  'textures/MI_0930_00_00_FCE000.001_emissive.png': jiren_MI_0930_00_00_FCE000_001_emissiveUrl,
  'textures/MI_0930_00_00_FCE000.001_metallicRoughness.png': jiren_MI_0930_00_00_FCE000_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_FCE000.001_normal.png': jiren_MI_0930_00_00_FCE000_001_normalUrl,
  'textures/MI_0930_00_00_FCE001.001_baseColor.png': jiren_MI_0930_00_00_FCE001_001_baseColorUrl,
  'textures/MI_0930_00_00_FCE001.001_emissive.png': jiren_MI_0930_00_00_FCE001_001_emissiveUrl,
  'textures/MI_0930_00_00_FCE001.001_metallicRoughness.png': jiren_MI_0930_00_00_FCE001_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_FCE001.001_normal.png': jiren_MI_0930_00_00_FCE001_001_normalUrl,
  'textures/MI_0930_00_00_INR000.002_baseColor.png': jiren_MI_0930_00_00_INR000_002_baseColorUrl,
  'textures/MI_0930_00_00_INR000.002_emissive.png': jiren_MI_0930_00_00_INR000_002_emissiveUrl,
  'textures/MI_0930_00_00_INR000.002_metallicRoughness.png': jiren_MI_0930_00_00_INR000_002_metallicRoughnessUrl,
  'textures/MI_0930_00_00_INR000.002_normal.png': jiren_MI_0930_00_00_INR000_002_normalUrl,
  'textures/MI_0930_00_00_INR002.001_baseColor.png': jiren_MI_0930_00_00_INR002_001_baseColorUrl,
  'textures/MI_0930_00_00_INR002.001_emissive.png': jiren_MI_0930_00_00_INR002_001_emissiveUrl,
  'textures/MI_0930_00_00_INR002.001_metallicRoughness.png': jiren_MI_0930_00_00_INR002_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_INR002.001_normal.png': jiren_MI_0930_00_00_INR002_001_normalUrl,
  'textures/MI_0930_00_00_INR010.001_baseColor.png': jiren_MI_0930_00_00_INR010_001_baseColorUrl,
  'textures/MI_0930_00_00_INR010.001_emissive.png': jiren_MI_0930_00_00_INR010_001_emissiveUrl,
  'textures/MI_0930_00_00_INR010.001_metallicRoughness.png': jiren_MI_0930_00_00_INR010_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_INR010.001_normal.png': jiren_MI_0930_00_00_INR010_001_normalUrl,
  'textures/MI_0930_00_00_INR011.001_baseColor.png': jiren_MI_0930_00_00_INR011_001_baseColorUrl,
  'textures/MI_0930_00_00_INR011.001_emissive.png': jiren_MI_0930_00_00_INR011_001_emissiveUrl,
  'textures/MI_0930_00_00_INR011.001_metallicRoughness.png': jiren_MI_0930_00_00_INR011_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_INR011.001_normal.png': jiren_MI_0930_00_00_INR011_001_normalUrl,
  'textures/MI_0930_00_00_SKN000.001_baseColor.png': jiren_MI_0930_00_00_SKN000_001_baseColorUrl,
  'textures/MI_0930_00_00_SKN000.001_emissive.png': jiren_MI_0930_00_00_SKN000_001_emissiveUrl,
  'textures/MI_0930_00_00_SKN000.001_metallicRoughness.png': jiren_MI_0930_00_00_SKN000_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_SKN000.001_normal.png': jiren_MI_0930_00_00_SKN000_001_normalUrl,
  'textures/MI_0930_00_00_SKN001.001_baseColor.png': jiren_MI_0930_00_00_SKN001_001_baseColorUrl,
  'textures/MI_0930_00_00_SKN001.001_emissive.png': jiren_MI_0930_00_00_SKN001_001_emissiveUrl,
  'textures/MI_0930_00_00_SKN001.001_metallicRoughness.png': jiren_MI_0930_00_00_SKN001_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_SKN001.001_normal.png': jiren_MI_0930_00_00_SKN001_001_normalUrl,
  'textures/MI_0930_00_00_SKN002.001_baseColor.png': jiren_MI_0930_00_00_SKN002_001_baseColorUrl,
  'textures/MI_0930_00_00_SKN002.001_emissive.png': jiren_MI_0930_00_00_SKN002_001_emissiveUrl,
  'textures/MI_0930_00_00_SKN002.001_metallicRoughness.png': jiren_MI_0930_00_00_SKN002_001_metallicRoughnessUrl,
  'textures/MI_0930_00_00_SKN002.001_normal.png': jiren_MI_0930_00_00_SKN002_001_normalUrl,
  'textures/MI_LNE000.005_baseColor.png': jiren_MI_LNE000_005_baseColorUrl,
  'textures/MI_LNE000.005_emissive.png': jiren_MI_LNE000_005_emissiveUrl,
  'textures/MI_LNE000.005_metallicRoughness.png': jiren_MI_LNE000_005_metallicRoughnessUrl,
  'textures/MI_LNE000.005_normal.png': jiren_MI_LNE000_005_normalUrl,
  'textures/MI_MTH001.001_baseColor.png': jiren_MI_MTH001_001_baseColorUrl,
  'textures/MI_MTH001.001_emissive.png': jiren_MI_MTH001_001_emissiveUrl,
  'textures/MI_MTH001.001_metallicRoughness.png': jiren_MI_MTH001_001_metallicRoughnessUrl,
  'textures/MI_MTH001.001_normal.png': jiren_MI_MTH001_001_normalUrl,
  'textures/MI_SWT000.001_baseColor.png': jiren_MI_SWT000_001_baseColorUrl,
  'textures/MI_SWT000.001_emissive.png': jiren_MI_SWT000_001_emissiveUrl,
  'textures/MI_SWT000.001_metallicRoughness.png': jiren_MI_SWT000_001_metallicRoughnessUrl,
  'textures/MI_SWT000.001_normal.png': jiren_MI_SWT000_001_normalUrl,
}

// ---------------------------------------------------------------------------
// Bone-driven fight poses
// ---------------------------------------------------------------------------

const _deltaQ = new THREE.Quaternion()
const _targetQ = new THREE.Quaternion()
const _e = new THREE.Euler()

function setRigBone(model: LoadedModel, key: BoneKey, x: number, y: number, z: number, blend: number): void {
  const name = model.rig.bones[key]
  if (name === undefined) return
  const targets = model.rigTargets[name]
  if (targets === undefined || targets.length === 0) return
  _e.set(x, y, z)
  _deltaQ.setFromEuler(_e)
  for (const target of targets) {
    _targetQ.copy(target.rest).multiply(_deltaQ)
    if (blend >= 1) {
      target.bone.quaternion.copy(_targetQ)
    } else {
      target.bone.quaternion.slerp(_targetQ, blend)
    }
  }
}

function animateGokuBones(
  model: LoadedModel,
  time: number,
  phaseKind: PhaseKind,
  phaseClock: number,
): void {
  const pose = (key: BoneKey, x: number, y: number, z: number): void => {
    setRigBone(model, key, x, y, z, 1)
  }

  const breathe = Math.sin(time * 2.1) * 0.03
  pose('hips', 0.02 + breathe * 0.5, 0, 0)
  pose('spine', 0.06 + breathe, 0, 0)
  pose('chest', 0.05 + breathe * 0.6, 0, 0)
  pose('upperChest', 0.03, 0, 0)
  pose('neck', 0.01, 0, 0)
  pose('head', -0.04 + Math.sin(time * 1.7) * 0.03, Math.sin(time * 1.2) * 0.03, 0)
  pose('clavicleL', 0.02, 0.02, 0.1)
  pose('clavicleR', 0.02, -0.02, -0.1)
  pose('handL', 0.08, 0.04, 0.08)
  pose('handR', 0.08, -0.04, -0.08)
  pose('footL', -0.04, 0, 0.03)
  pose('footR', -0.04, 0, -0.03)

  switch (phaseKind) {
    case 'transform': {
      const rise = easeOutCubic(phaseClock / TRANSFORM_DURATION)
      const auraQuiver = Math.sin(time * 12.6) * (0.05 + rise * 0.04)
      pose('hips', -0.18 + rise * 0.14 + auraQuiver * 0.2, 0, 0)
      pose('spine', -0.08 + rise * 0.34 + auraQuiver * 0.8, 0, 0)
      pose('chest', -0.04 + rise * 0.24 + auraQuiver * 0.5, 0, 0)
      pose('upperChest', rise * 0.16, 0, 0)
      pose('neck', -0.02 + rise * 0.08, 0, 0)
      pose('head', 0.2 - rise * 0.34, Math.sin(time * 1.5) * 0.04, 0)
      pose('clavicleL', 0.1, 0.1, 0.4 + rise * 0.14)
      pose('clavicleR', 0.1, -0.1, -0.4 - rise * 0.14)
      pose('upperArmL', 0.82 - rise * 0.24, 0.18, 0.78 + rise * 0.52)
      pose('foreArmL', 0.36, 1.08 - rise * 0.16, 0.08)
      pose('handL', 0.26, 0.14, 0.2 + rise * 0.16)
      pose('upperArmR', 0.74 - rise * 0.18, -0.2, -0.72 - rise * 0.58)
      pose('foreArmR', 0.3, -1.02 - rise * 0.18, -0.08)
      pose('handR', 0.26, -0.14, -0.2 - rise * 0.16)
      pose('thighL', -0.42 + rise * 0.24, 0, 0.14)
      pose('calfL', 0.9 - rise * 0.48, 0, 0)
      pose('footL', 0.14 - rise * 0.12, 0, 0.08)
      pose('thighR', -0.18 + rise * 0.1, 0, -0.1)
      pose('calfR', 0.5 - rise * 0.16, 0, 0)
      pose('footR', 0.08 - rise * 0.08, 0, -0.08)
      break
    }
    case 'roam': {
      const weave = Math.sin(phaseClock * 4.2)
      const glide = Math.sin(phaseClock * 2.6 + 0.4) * 0.08
      pose('hips', 0.04, weave * 0.08, 0)
      pose('spine', 0.12 + glide, weave * 0.16, 0)
      pose('chest', 0.08, weave * 0.12, 0)
      pose('upperChest', 0.04, weave * 0.08, 0)
      pose('neck', 0.01, weave * 0.04, 0)
      pose('head', -0.08 + Math.sin(phaseClock * 2.2) * 0.04, weave * 0.06, 0)
      pose('clavicleL', 0.08, 0.02, 0.22 + glide * 0.18)
      pose('clavicleR', 0.04, -0.02, -0.2 - glide * 0.18)
      pose('upperArmL', 0.42 - weave * 0.08, 0.14, 1.16 + glide * 0.22)
      pose('foreArmL', 0.16, 1.04 + Math.max(0, -weave) * 0.26, 0.08)
      pose('handL', 0.18, 0.08, 0.18 + Math.max(0, -weave) * 0.18)
      pose('upperArmR', 0.3 + weave * 0.1, -0.26, -0.98 - glide * 0.26)
      pose('foreArmR', 0.14, -0.84 - Math.max(0, weave) * 0.22, -0.1)
      pose('handR', 0.16, -0.08, -0.18 - Math.max(0, weave) * 0.16)
      pose('thighL', -0.24 + weave * 0.18, 0, 0.16)
      pose('calfL', 0.36 + Math.max(0, -weave) * 0.28, 0, 0)
      pose('footL', -0.12 + Math.max(0, -weave) * 0.24, 0, 0.1)
      pose('thighR', -0.14 - weave * 0.18, 0, -0.14)
      pose('calfR', 0.3 + Math.max(0, weave) * 0.28, 0, 0)
      pose('footR', -0.1 + Math.max(0, weave) * 0.24, 0, -0.1)
      break
    }
    case 'approach': {
      const rush = easeInCubic(phaseClock / APPROACH_DURATION)
      const stride = Math.sin(phaseClock * 10.8)
      pose('hips', -0.04 + rush * 0.14, 0.1, 0)
      pose('spine', 0.18 + rush * 0.22, 0.12 + stride * 0.04, 0)
      pose('chest', 0.14 + rush * 0.16, 0.1 + stride * 0.06, 0)
      pose('upperChest', 0.08 + rush * 0.08, 0.08, 0)
      pose('neck', 0.02, 0.05, 0)
      pose('head', -0.14, 0.06 + stride * 0.04, 0)
      pose('clavicleL', 0.08, 0.04, 0.34)
      pose('clavicleR', 0.04, -0.04, -0.26)
      pose('upperArmL', 0.64, 0.04, 1.24 - Math.max(0, stride) * 0.4)
      pose('foreArmL', 0.16, 1.04, 0.08)
      pose('handL', 0.18, 0.08, 0.22)
      pose('upperArmR', 0.22 - Math.max(0, -stride) * 0.18, -0.24, -1.08 - Math.max(0, -stride) * 0.46)
      pose('foreArmR', 0.1, -0.62 - Math.max(0, -stride) * 0.32, -0.06)
      pose('handR', 0.14, -0.08, -0.2)
      pose('thighL', -0.24 + stride * 0.3, 0, 0.18)
      pose('calfL', 0.38 + Math.max(0, -stride) * 0.32, 0, 0)
      pose('footL', -0.16 + Math.max(0, -stride) * 0.3, 0, 0.12)
      pose('thighR', -0.08 - stride * 0.3, 0, -0.18)
      pose('calfR', 0.34 + Math.max(0, stride) * 0.3, 0, 0)
      pose('footR', -0.14 + Math.max(0, stride) * 0.28, 0, -0.12)
      break
    }
    case 'clash': {
      const exchange = Math.sin(phaseClock * 12.2)
      const slip = Math.sin(phaseClock * 6.4 + 0.6)
      pose('hips', 0.04, slip * 0.14, 0)
      pose('spine', 0.24, slip * 0.24, 0)
      pose('chest', 0.16, slip * 0.22, 0)
      pose('upperChest', 0.1, slip * 0.18, 0)
      pose('neck', 0.02, slip * 0.08, 0)
      pose('head', -0.16 + Math.abs(exchange) * 0.06, slip * 0.12, 0)
      pose('clavicleL', 0.12, 0.06, 0.28 + Math.max(0, -exchange) * 0.24)
      pose('clavicleR', 0.08, -0.06, -0.26 - Math.max(0, exchange) * 0.26)
      pose('upperArmR', 0.14 - Math.max(0, exchange) * 0.5, -0.22 + slip * 0.08, -1.12 - Math.max(0, exchange) * 0.52)
      pose('foreArmR', 0.06, -0.58 - Math.max(0, exchange) * 0.72, -0.08)
      pose('handR', 0.14, -0.1, -0.28 - Math.max(0, exchange) * 0.2)
      pose('upperArmL', 0.32 - Math.max(0, -exchange) * 0.44, 0.16 + slip * 0.08, 1.08 + Math.max(0, -exchange) * 0.54)
      pose('foreArmL', 0.1, 0.9 + Math.max(0, -exchange) * 0.68, 0.1)
      pose('handL', 0.16, 0.1, 0.28 + Math.max(0, -exchange) * 0.2)
      pose('thighL', -0.24 + exchange * 0.2, 0, 0.18)
      pose('calfL', 0.34 + Math.max(0, -exchange) * 0.22, 0, 0)
      pose('footL', -0.16 + Math.max(0, -exchange) * 0.2, 0, 0.1)
      pose('thighR', -0.14 - exchange * 0.2, 0, -0.18)
      pose('calfR', 0.3 + Math.max(0, exchange) * 0.22, 0, 0)
      pose('footR', -0.14 + Math.max(0, exchange) * 0.2, 0, -0.1)
      break
    }
    case 'separate': {
      const recoil = 1 - easeOutCubic(phaseClock / SEPARATE_DURATION)
      const drift = Math.sin(phaseClock * 7.4) * recoil * 0.08
      pose('hips', -0.12, -0.08, 0)
      pose('spine', -0.06 + drift, -0.04, 0)
      pose('chest', 0 + drift * 0.6, -0.04, 0)
      pose('upperChest', 0.02 + drift * 0.3, -0.02, 0)
      pose('neck', 0.02, 0, 0)
      pose('head', 0.12, -0.02, 0)
      pose('clavicleL', 0.04, 0.04, 0.18)
      pose('clavicleR', 0.02, -0.04, -0.16)
      pose('upperArmL', -0.08, 0.08, 0.82)
      pose('foreArmL', 0.04, 0.34, 0.04)
      pose('handL', 0.08, 0.04, 0.12)
      pose('upperArmR', -0.04, -0.14, -0.7)
      pose('foreArmR', 0.04, -0.26, -0.04)
      pose('handR', 0.08, -0.04, -0.12)
      pose('thighL', -0.12, 0, 0.18)
      pose('calfL', 0.22, 0, 0)
      pose('footL', -0.08, 0, 0.08)
      pose('thighR', -0.02, 0, -0.12)
      pose('calfR', 0.18, 0, 0)
      pose('footR', -0.08, 0, -0.08)
      break
    }
    case 'kamehameha': {
      const charge = easeOutCubic(clamp(phaseClock / 0.55, 0, 1))
      const tremor = Math.sin(time * 13.2) * (0.03 + charge * 0.04)
      pose('hips', -0.08 + tremor * 0.2, 0, 0)
      pose('spine', 0.12 + charge * 0.24 + tremor, 0.04, 0)
      pose('chest', 0.12 + charge * 0.2, 0.08, 0)
      pose('upperChest', 0.08 + charge * 0.12, 0.1, 0)
      pose('neck', 0.04, 0.08, 0)
      pose('head', -0.12, 0.12, 0)
      pose('clavicleL', 0.18, 0.16, 0.6 - charge * 0.24)
      pose('clavicleR', 0.18, -0.16, -0.6 + charge * 0.24)
      pose('upperArmL', 1.02 - charge * 0.5, 0.38, 1.28 - charge * 0.58)
      pose('foreArmL', 0.16, 1.1 - charge * 0.46, 0.1)
      pose('handL', 0.28, 0.18, 0.4 - charge * 0.12)
      pose('upperArmR', 1.02 - charge * 0.5, -0.38, -1.28 + charge * 0.58)
      pose('foreArmR', 0.16, -1.1 + charge * 0.46, -0.1)
      pose('handR', 0.28, -0.18, -0.4 + charge * 0.12)
      pose('thighL', -0.28, 0, 0.24)
      pose('calfL', 0.42, 0, 0)
      pose('footL', -0.16, 0, 0.14)
      pose('thighR', -0.2, 0, -0.18)
      pose('calfR', 0.32, 0, 0)
      pose('footR', -0.14, 0, -0.12)
      break
    }
  }
}

function animateJirenBones(
  model: LoadedModel,
  time: number,
  phaseKind: PhaseKind,
  phaseClock: number,
): void {
  const pose = (key: BoneKey, x: number, y: number, z: number): void => {
    setRigBone(model, key, x, y, z, 1)
  }

  const breathe = Math.sin(time * 2.4) * 0.04
  const chestDrift = Math.sin(time * 4.6 + 0.4) * 0.04
  const shoulderRoll = Math.sin(time * 5.8 + 0.9) * 0.06
  const wristPulse = Math.sin(time * 8.8 + 0.3) * 0.08
  const anklePulse = Math.sin(time * 6.2 + 1.1) * 0.06
  pose('hips', 0.03 + chestDrift * 0.18, chestDrift * 0.16, chestDrift * 0.1)
  pose('spine', 0.1 + breathe, chestDrift * 0.34, 0)
  pose('chest', 0.08 + breathe * 0.6, chestDrift * 0.28, 0)
  pose('upperChest', 0.06 + shoulderRoll * 0.14, chestDrift * 0.18, 0)
  pose('neck', 0.03 + shoulderRoll * 0.05, chestDrift * 0.12, 0)
  pose('head', -0.1 + Math.sin(time * 1.8) * 0.05, Math.sin(time * 1.2) * 0.05 + chestDrift * 0.18, shoulderRoll * 0.08)
  pose('clavicleL', 0.03, 0.03, 0.12 + shoulderRoll * 0.24)
  pose('clavicleR', 0.03, -0.03, -0.12 - shoulderRoll * 0.24)
  pose('handL', 0.1, 0.04, 0.08 + wristPulse * 0.3)
  pose('handR', 0.1, -0.04, -0.08 - wristPulse * 0.3)
  pose('footL', -0.04 + anklePulse * 0.18, 0, 0.04)
  pose('footR', -0.04 - anklePulse * 0.18, 0, -0.04)

  switch (phaseKind) {
    case 'transform': {
      const menace = Math.sin(phaseClock * 2.2) * 0.04
      pose('hips', -0.04, 0, menace * 0.2)
      pose('spine', 0.04 + breathe * 0.7, menace * 0.12, 0)
      pose('chest', 0.07, menace * 0.1, 0)
      pose('upperChest', 0.08, menace * 0.08, 0)
      pose('neck', 0.04, menace * 0.06, 0)
      pose('head', -0.04 + Math.sin(time * 1.1) * 0.03, menace * 0.1, menace * 0.08)
      pose('clavicleL', 0.06, 0.1, 0.24)
      pose('clavicleR', 0.06, -0.1, -0.24)
      pose('upperArmL', 0.52, 0.24, 1.08)
      pose('foreArmL', 0.22, 1.72, 0.14)
      pose('handL', 0.18, 0.12, 0.22 + menace * 0.2)
      pose('upperArmR', 0.52, -0.24, -1.08)
      pose('foreArmR', 0.22, -1.72, -0.14)
      pose('handR', 0.18, -0.12, -0.22 - menace * 0.2)
      pose('thighL', -0.16, 0, 0.14)
      pose('calfL', 0.18, 0, 0)
      pose('footL', -0.04, 0, 0.1)
      pose('thighR', -0.16, 0, -0.14)
      pose('calfR', 0.18, 0, 0)
      pose('footR', -0.04, 0, -0.1)
      break
    }
    case 'roam': {
      const stalk = Math.sin(phaseClock * 3.6)
      const shoulderSet = Math.sin(phaseClock * 2.1 + 0.7) * 0.06
      const elbowSnap = Math.sin(phaseClock * 7.4 + 0.3) * 0.08
      pose('hips', 0.04, -stalk * 0.1, stalk * 0.06)
      pose('spine', 0.16 + breathe + shoulderSet, -stalk * 0.18, 0)
      pose('chest', 0.16, -stalk * 0.16, 0)
      pose('upperChest', 0.12, -stalk * 0.12, 0)
      pose('neck', 0.05, -stalk * 0.06, 0)
      pose('head', -0.1, -stalk * 0.1, shoulderSet * 0.18)
      pose('clavicleL', 0.1, 0.1, 0.2 + Math.max(0, -stalk) * 0.18)
      pose('clavicleR', 0.08, -0.1, -0.22 - Math.max(0, stalk) * 0.18)
      pose('upperArmL', 0.38 + shoulderSet * 0.5, 0.36, 1.26 + Math.max(0, -stalk) * 0.24)
      pose('foreArmL', 0.18, 1.34 + elbowSnap, 0.3)
      pose('handL', 0.22, 0.12, 0.24 + elbowSnap * 0.5)
      pose('upperArmR', 0.54 - shoulderSet * 0.5, -0.28, -1.42 - Math.max(0, stalk) * 0.28)
      pose('foreArmR', 0.14, -1.04 - elbowSnap * 0.8, -0.2)
      pose('handR', 0.2, -0.12, -0.24 - elbowSnap * 0.5)
      pose('thighL', -0.3 + stalk * 0.2, 0, 0.18)
      pose('calfL', 0.34 + Math.max(0, -stalk) * 0.3, 0, 0)
      pose('footL', -0.18 + Math.max(0, -stalk) * 0.26, 0, 0.12)
      pose('thighR', -0.24 - stalk * 0.2, 0, -0.18)
      pose('calfR', 0.34 + Math.max(0, stalk) * 0.3, 0, 0)
      pose('footR', -0.18 + Math.max(0, stalk) * 0.26, 0, -0.12)
      break
    }
    case 'approach': {
      const drive = easeInCubic(phaseClock / APPROACH_DURATION)
      const stride = Math.sin(phaseClock * 9.8)
      const crush = Math.sin(phaseClock * 13.4) * 0.06
      pose('hips', -0.04 + drive * 0.2, -0.1, stride * 0.06)
      pose('spine', 0.22 + breathe + drive * 0.18, -0.18 + stride * 0.08, 0)
      pose('chest', 0.22, -0.16 + stride * 0.08, 0)
      pose('upperChest', 0.16, -0.12 + stride * 0.04, 0)
      pose('neck', 0.06, -0.08, 0)
      pose('head', -0.04, -0.12 + crush, crush * 0.4)
      pose('clavicleL', 0.14, 0.06, 0.28)
      pose('clavicleR', 0.12, -0.06, -0.22)
      pose('upperArmL', 0.82 - Math.max(0, stride) * 0.34, 0.18, 1.54 - Math.max(0, stride) * 0.34)
      pose('foreArmL', 0.12, 0.84 + crush, 0.12)
      pose('handL', 0.18, 0.08, 0.18 + crush * 0.5)
      pose('upperArmR', 0.26, -0.26, -1.54 - Math.max(0, -stride) * 0.42)
      pose('foreArmR', 0.06, -0.36 - Math.max(0, -stride) * 0.3, -0.08)
      pose('handR', 0.16, -0.08, -0.18 - crush * 0.5)
      pose('thighL', -0.3 + stride * 0.24, 0, 0.18)
      pose('calfL', 0.42 + Math.max(0, -stride) * 0.3, 0, 0)
      pose('footL', -0.22 + Math.max(0, -stride) * 0.3, 0, 0.12)
      pose('thighR', -0.18 - stride * 0.24, 0, -0.18)
      pose('calfR', 0.36 + Math.max(0, stride) * 0.3, 0, 0)
      pose('footR', -0.2 + Math.max(0, stride) * 0.28, 0, -0.12)
      break
    }
    case 'clash': {
      const punch = Math.sin(phaseClock * 11.2)
      const torque = Math.sin(phaseClock * 5.6 + 0.8)
      const recoil = Math.sin(phaseClock * 18.4 + 0.2) * 0.08
      pose('hips', 0.06, -torque * 0.16, punch * 0.06)
      pose('spine', 0.32, 0.28 * punch, 0)
      pose('chest', 0.3, 0.26 * punch, 0)
      pose('upperChest', 0.22, 0.24 * punch, 0)
      pose('neck', 0.08, 0.12 * punch, 0)
      pose('head', 0.04, 0.14 * punch + recoil * 0.4, recoil * 0.4)
      pose('clavicleL', 0.16, 0.1, 0.26 + Math.max(0, -punch) * 0.18)
      pose('clavicleR', 0.16, -0.1, -0.26 - Math.max(0, punch) * 0.18)
      pose('upperArmR', 0.22 - Math.max(0, punch) * 0.84, -0.26 * punch, -1.66)
      pose('foreArmR', 0.02, -0.42 - Math.max(0, punch) * 0.94, -0.04)
      pose('handR', 0.18, -0.1, -0.28 - Math.max(0, punch) * 0.18)
      pose('upperArmL', 0.46 - Math.max(0, -punch) * 0.86, 0.22 * punch, 1.62)
      pose('foreArmL', 0.02, 0.58 + Math.max(0, -punch) * 0.88, 0.04)
      pose('handL', 0.18, 0.1, 0.28 + Math.max(0, -punch) * 0.18)
      pose('thighL', -0.34 + punch * 0.18, 0, 0.2)
      pose('calfL', 0.44 + Math.max(0, punch) * 0.2, 0, 0)
      pose('footL', -0.22 + Math.max(0, punch) * 0.16, 0, 0.14)
      pose('thighR', -0.28 - punch * 0.18, 0, -0.2)
      pose('calfR', 0.44 + Math.max(0, -punch) * 0.2, 0, 0)
      pose('footR', -0.22 + Math.max(0, -punch) * 0.16, 0, -0.14)
      break
    }
    case 'separate': {
      const recover = 1 - easeOutCubic(phaseClock / SEPARATE_DURATION)
      const shake = Math.sin(phaseClock * 11.6) * recover * 0.08
      pose('hips', -0.14, shake * 0.2, shake * 0.2)
      pose('spine', -0.16 + breathe * 0.8, shake * 0.18, 0)
      pose('chest', -0.1 + recover * 0.06, shake * 0.14, 0)
      pose('upperChest', -0.04 + recover * 0.04, shake * 0.1, 0)
      pose('neck', 0.06, shake * 0.06, 0)
      pose('head', 0.1, shake * 0.08, shake * 0.2)
      pose('clavicleL', 0.06, 0.06, 0.18)
      pose('clavicleR', 0.06, -0.06, -0.18)
      pose('upperArmL', -0.12, 0.1, 1)
      pose('foreArmL', 0.04, 0.58, 0.02)
      pose('handL', 0.12, 0.08, 0.18 + shake * 0.3)
      pose('upperArmR', -0.12, -0.1, -1)
      pose('foreArmR', 0.04, -0.58, -0.02)
      pose('handR', 0.12, -0.08, -0.18 - shake * 0.3)
      pose('thighL', -0.2, 0, 0.22)
      pose('calfL', 0.28, 0, 0)
      pose('footL', -0.12, 0, 0.1)
      pose('thighR', -0.2, 0, -0.22)
      pose('calfR', 0.28, 0, 0)
      pose('footR', -0.12, 0, -0.1)
      break
    }
    case 'kamehameha': {
      const charge = smoothstep01(phaseClock / 0.5)
      const recoil = Math.sin(time * 8.2) * 0.05
      const surge = Math.sin(time * 14.4) * (0.04 + charge * 0.05)
      pose('hips', -0.16, -0.06, surge * 0.3)
      pose('spine', 0.3 + recoil, -0.2, 0)
      pose('chest', 0.28 + recoil * 0.7, -0.16, 0)
      pose('upperChest', 0.18, -0.12, 0)
      pose('neck', 0.08, -0.06, 0)
      pose('head', -0.06, -0.12 + surge * 0.4, surge * 0.2)
      pose('clavicleL', 0.14, 0.06, 0.18)
      pose('clavicleR', 0.24, -0.14, -0.32)
      pose('upperArmR', 1.08 + recoil, -0.42, -1.78 + charge * 0.1)
      pose('foreArmR', 0.06, -0.24 + charge * 0.18, 0)
      pose('handR', 0.2, -0.12, -0.24 - surge * 0.3)
      pose('upperArmL', 0.34, 0.26, 1.18)
      pose('foreArmL', 0.04, 1.02, 0.28)
      pose('handL', 0.16, 0.12, 0.2 + surge * 0.2)
      pose('thighL', -0.34, 0, 0.24)
      pose('calfL', 0.48, 0, 0)
      pose('footL', -0.18, 0, 0.14)
      pose('thighR', -0.26, 0, -0.2)
      pose('calfR', 0.38, 0, 0)
      pose('footR', -0.16, 0, -0.12)
      break
    }
  }
}

// ---------------------------------------------------------------------------
// Model loading and setup
// ---------------------------------------------------------------------------

type LoadedModel = {
  scene: THREE.Group
  mixer: THREE.AnimationMixer
  rigTargets: Record<string, Array<{ bone: THREE.Bone; rest: THREE.Quaternion }>>
  rig: RigProfile
  normScale: number
  modelPixelHeight: number
  idleAction: THREE.AnimationAction | null
  tintMeshes: THREE.Mesh[]
  allMeshes: THREE.Mesh[]
}

const gokuWrapper = new THREE.Group()
const jirenWrapper = new THREE.Group()
threeScene.add(gokuWrapper)
threeScene.add(jirenWrapper)

let gokuModel: LoadedModel | null = null
let jirenModel: LoadedModel | null = null
let modelsLoaded = false

function resolveBundledAssetUrl(requestedUrl: string, assetMap: Record<string, string>): string {
  const cleaned = requestedUrl.split('#')[0]!.split('?')[0]!
  if (assetMap[cleaned] !== undefined) return assetMap[cleaned]!

  let pathname = cleaned
  try {
    pathname = new URL(cleaned, window.location.href).pathname
  } catch {
    pathname = cleaned
  }

  if (assetMap[pathname] !== undefined) return assetMap[pathname]!

  for (const [key, bundledUrl] of Object.entries(assetMap)) {
    if (cleaned.endsWith(key) || pathname.endsWith(key)) return bundledUrl
  }

  return requestedUrl
}

async function loadModel(url: string, rig: RigProfile, assetMap?: Record<string, string>): Promise<LoadedModel> {
  let manager: THREE.LoadingManager | undefined
  if (assetMap !== undefined) {
    manager = new THREE.LoadingManager()
    manager.setURLModifier((requestedUrl) => resolveBundledAssetUrl(requestedUrl, assetMap))
  }
  const loader = new GLTFLoader(manager)
  const gltf = await loader.loadAsync(url)
  const modelScene = gltf.scene

  // Compute bounding box for centering and scaling
  const box = new THREE.Box3().setFromObject(modelScene)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const normScale = 1 / maxDim

  // IMPORTANT: Do NOT modify modelScene.position directly — that breaks
  // skinned mesh binding. Instead, wrap in a pivot group for centering.
  const pivot = new THREE.Group()
  pivot.add(modelScene)
  // Offset the model inside the pivot so its center is at the pivot origin
  modelScene.position.set(-center.x, -center.y, -center.z)

  // Build bone lookup — some game exports duplicate the same skeleton per mesh group,
  // so each semantic bone key can fan out to multiple bone/rest pairs.
  const rigTargets: Record<string, Array<{ bone: THREE.Bone; rest: THREE.Quaternion }>> = {}
  modelScene.traverse((child) => {
    if (child instanceof THREE.Bone) {
      const registerBone = (key: string): void => {
        const targets = rigTargets[key] ?? []
        targets.push({ bone: child, rest: child.quaternion.clone() })
        rigTargets[key] = targets
      }
      registerBone(child.name)
      const base = child.name.replace(/_0?\d+$/, '')
      if (base !== child.name) {
        registerBone(base)
      }
    }
  })

  // Setup animation mixer on the model scene (not pivot)
  const mixer = new THREE.AnimationMixer(modelScene)

  // Start playing the baked animation immediately — this is the only
  // reliable way to get the model moving. We keep it running always.
  let idleAction: THREE.AnimationAction | null = null
  if (rig.playBuiltInAnimation && gltf.animations.length > 0) {
    const clip = gltf.animations[0]!
    idleAction = mixer.clipAction(clip)
    idleAction.setLoop(THREE.LoopRepeat, Infinity)
    idleAction.play()
  }

  // Apply toon shading and collect meshes used for UI tinting.
  const tintMeshes: THREE.Mesh[] = []
  const allMeshes: THREE.Mesh[] = []
  modelScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const oldMat = child.material as THREE.MeshStandardMaterial
      const toonMat = new THREE.MeshToonMaterial({
        gradientMap: toonGradient,
      })
      if (oldMat.map) toonMat.map = oldMat.map
      if (oldMat.color) toonMat.color.copy(oldMat.color)
      toonMat.userData['baseColor'] = toonMat.color.clone()
      child.material = toonMat
      child.castShadow = false
      child.receiveShadow = false
      allMeshes.push(child)
      const name = (child.name || '').toLowerCase()
      const parentName = (child.parent?.name || '').toLowerCase()
      if (
        rig.uiTintMode === 'global' ||
        (rig.uiTintMode === 'hair' && (name.includes('hair') || parentName.includes('hair'))) ||
        (rig.uiTintMode === 'head' && (name.includes('head') || parentName.includes('head')))
      ) {
        tintMeshes.push(child)
      }
    }
  })

  if (rig.uiTintMode !== 'none' && tintMeshes.length === 0) {
    tintMeshes.push(...allMeshes)
  }

  return {
    scene: pivot,
    mixer,
    rigTargets,
    rig,
    normScale,
    modelPixelHeight: rig.modelPixelHeight,
    idleAction,
    tintMeshes,
    allMeshes,
  }
}

async function loadModels(): Promise<void> {
  const [gokuLoaded, jirenLoaded] = await Promise.all([
    loadModel(gokuModelUrl, GOKU_RIG_PROFILE, GOKU_MODEL_ASSETS),
    loadModel(jirenModelUrl, JIREN_RIG_PROFILE, JIREN_MODEL_ASSETS),
  ])

  gokuModel = gokuLoaded
  jirenModel = jirenLoaded

  gokuWrapper.add(gokuModel.scene)
  jirenWrapper.add(jirenModel.scene)

  modelsLoaded = true
}

const modelsPromise = loadModels()

// ---------------------------------------------------------------------------
// Three.js model positioning
// ---------------------------------------------------------------------------

function updateModelTransform(
  wrapper: THREE.Group,
  fighter: Fighter,
  normScale: number,
  modelPixelHeight: number,
  facingRight: boolean,
  drawScale: number,
  bodyLean: number,
  bodyBob: number,
  w: number,
  h: number,
): void {
  // Map screen coordinates to orthographic world coordinates
  // Screen x -> world x, screen y -> world -y (Three.js Y is up)
  const worldX = fighter.x - w / 2
  const worldY = -(fighter.y + bodyBob - h / 2)

  wrapper.position.set(worldX, worldY, 0)

  // Scale: normalized model size * desired on-screen pixel height * pose scale.
  const s = normScale * modelPixelHeight * drawScale
  const flipX = facingRight ? 1 : -1
  wrapper.scale.set(s * flipX, s, s)

  const bank = clamp(fighter.vy / 2600, -0.12, 0.12)
  const yaw = clamp(fighter.vx / 1800, -0.16, 0.16) * flipX
  wrapper.rotation.set(bank, yaw, -bodyLean * flipX + yaw * 0.2)
}

// ---------------------------------------------------------------------------
// Fight choreography
// ---------------------------------------------------------------------------

function setPhase(nextPhase: Phase): void {
  phaseEntry = {
    goku: snapshotFighter(goku),
    jiren: snapshotFighter(jiren),
  }
  phase = nextPhase
  phaseTime = 0
}

function resetScene(w: number, h: number): void {
  goku.x = w * 0.16
  goku.y = h * 0.78
  goku.vx = 0
  goku.vy = 0

  jiren.x = w * 0.84
  jiren.y = h * 0.22
  jiren.vx = 0
  jiren.vy = 0

  beams.length = 0
  clashes.length = 0
  goku.trailClock = 0
  jiren.trailClock = 0
  goku.trail.length = 0
  jiren.trail.length = 0
  phaseEntry = {
    goku: snapshotFighter(goku),
    jiren: snapshotFighter(jiren),
  }
}

function clampFighterToBounds(fighter: Fighter, w: number, h: number, reflectVelocity: boolean): void {
  const minX = GUTTER + fighter.r + 12
  const maxX = w - GUTTER - fighter.r - 12
  const minY = TOP_INSET + fighter.r * 0.62
  const maxY = h - GUTTER - fighter.r * 0.56

  if (fighter.x < minX) {
    fighter.x = minX
    if (reflectVelocity) fighter.vx = Math.abs(fighter.vx)
    else fighter.vx = 0
  }
  if (fighter.x > maxX) {
    fighter.x = maxX
    if (reflectVelocity) fighter.vx = -Math.abs(fighter.vx)
    else fighter.vx = 0
  }
  if (fighter.y < minY) {
    fighter.y = minY
    if (reflectVelocity) fighter.vy = Math.abs(fighter.vy)
    else fighter.vy = 0
  }
  if (fighter.y > maxY) {
    fighter.y = maxY
    if (reflectVelocity) fighter.vy = -Math.abs(fighter.vy)
    else fighter.vy = 0
  }
}

type SteeringOptions = {
  maxSpeed: number
  acceleration: number
  drag: number
  arriveRadius: number
}

function steerFighter(
  fighter: Fighter,
  target: Point,
  dt: number,
  w: number,
  h: number,
  options: SteeringOptions,
): void {
  const dx = target.x - fighter.x
  const dy = target.y - fighter.y
  const distanceToTarget = Math.hypot(dx, dy)

  let desiredVx = 0
  let desiredVy = 0
  if (distanceToTarget > 0.001) {
    const normalizedX = dx / distanceToTarget
    const normalizedY = dy / distanceToTarget
    const speedScale = distanceToTarget >= options.arriveRadius
      ? 1
      : easeInOutSine(distanceToTarget / options.arriveRadius)
    const desiredSpeed = options.maxSpeed * speedScale
    desiredVx = normalizedX * desiredSpeed
    desiredVy = normalizedY * desiredSpeed
  }

  const accelerationStep = options.acceleration * dt
  fighter.vx = moveTowardValue(fighter.vx, desiredVx, accelerationStep)
  fighter.vy = moveTowardValue(fighter.vy, desiredVy, accelerationStep)

  const damping = 1 / (1 + options.drag * dt)
  fighter.vx *= damping
  fighter.vy *= damping

  fighter.x += fighter.vx * dt
  fighter.y += fighter.vy * dt
  clampFighterToBounds(fighter, w, h, false)
}

function enforceMinimumSeparation(a: Fighter, b: Fighter, minDistance: number): void {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const d = Math.hypot(dx, dy)
  if (d >= minDistance || d < 0.001) return
  const push = (minDistance - d) * 0.5
  const nx = dx / d
  const ny = dy / d
  a.x -= nx * push
  a.y -= ny * push
  b.x += nx * push
  b.y += ny * push
}

function pushClashBurst(radius: number): void {
  clashes.push({
    x: (goku.x + jiren.x) * 0.5,
    y: (goku.y + jiren.y) * 0.5,
    age: 0,
    maxAge: 0.8,
    radius,
  })
}

function launchFightersApart(speed: number): void {
  const dx = goku.x - jiren.x
  const dy = goku.y - jiren.y
  const distanceBetween = Math.max(Math.hypot(dx, dy), 0.001)
  const nx = dx / distanceBetween
  const ny = dy / distanceBetween

  goku.vx = nx * speed
  goku.vy = ny * speed * 0.72 + speed * 0.06
  jiren.vx = -nx * speed * 0.94
  jiren.vy = -ny * speed * 0.72 - speed * 0.04
}

function setSustainedBeam(origin: Point, target: Point, width: number, maxAge: number, color: EnergyColor): void {
  beams.push({
    fromX: origin.x,
    fromY: origin.y,
    toX: target.x,
    toY: target.y,
    width,
    age: maxAge * 0.22,
    maxAge,
    color,
  })
}

function updatePhase(dt: number, w: number, h: number): void {
  phaseTime += dt
  const arena = getArena(w, h)

  switch (phase.kind) {
    case 'transform': {
      phase.timer -= dt
      const rise = easeOutCubic(phaseTime / TRANSFORM_DURATION)
      const gokuAnchor = arenaPoint(arena, 0.18, 0.78)
      const jirenAnchor = arenaPoint(arena, 0.84, 0.2)
      const gokuTarget = point(
        gokuAnchor.x + Math.sin(phaseTime * 1.8) * 22,
        gokuAnchor.y - rise * 24 + Math.sin(phaseTime * 5.6) * 10,
      )
      const jirenTarget = point(
        jirenAnchor.x + Math.sin(phaseTime * 1.2 + 1.1) * 12,
        jirenAnchor.y + Math.cos(phaseTime * 1.1) * 8,
      )
      steerFighter(goku, gokuTarget, dt, w, h, {
        maxSpeed: 240,
        acceleration: 780,
        drag: 3.6,
        arriveRadius: 180,
      })
      steerFighter(jiren, jirenTarget, dt, w, h, {
        maxSpeed: 180,
        acceleration: 460,
        drag: 4.4,
        arriveRadius: 220,
      })

      if (phase.timer <= 0) {
        setPhase({ kind: 'roam', timer: ROAM_DURATION })
      }
      break
    }

    case 'roam': {
      phase.timer -= dt
      const progress = smoothstep01(phaseTime / ROAM_DURATION)
      const gokuPath = arenaPoint(arena, lerp(0.18, 0.76, progress), lerp(0.76, 0.24, progress))
      const jirenPath = arenaPoint(arena, lerp(0.84, 0.24, progress), lerp(0.22, 0.74, progress))
      const gokuTarget = point(
        gokuPath.x + Math.sin(phaseTime * 2.8) * 76,
        gokuPath.y + Math.cos(phaseTime * 4.4) * 34,
      )
      const jirenTarget = point(
        jirenPath.x + Math.cos(phaseTime * 2.2 + 0.7) * 68,
        jirenPath.y + Math.sin(phaseTime * 3.8 + 0.4) * 30,
      )
      steerFighter(goku, gokuTarget, dt, w, h, {
        maxSpeed: 330,
        acceleration: 940,
        drag: 1.8,
        arriveRadius: 200,
      })
      steerFighter(jiren, jirenTarget, dt, w, h, {
        maxSpeed: 300,
        acceleration: 880,
        drag: 1.9,
        arriveRadius: 200,
      })
      enforceMinimumSeparation(goku, jiren, 236)

      if (phase.timer <= 0) setPhase({ kind: 'approach', timer: APPROACH_DURATION })
      break
    }

    case 'approach': {
      phase.timer -= dt
      const rush = easeInCubic(phaseTime / APPROACH_DURATION)
      const intercept = arenaPoint(arena, 0.52, 0.48)
      const gokuTarget = point(
        lerp(phaseEntry.goku.x, intercept.x - 84, rush) + Math.sin(phaseTime * 10.8) * (1 - rush) * 20,
        lerp(phaseEntry.goku.y, intercept.y + 24, rush) + Math.sin(phaseTime * 13.2 + 0.6) * (1 - rush) * 12,
      )
      const jirenTarget = point(
        lerp(phaseEntry.jiren.x, intercept.x + 92, rush) + Math.cos(phaseTime * 9.8 + 0.3) * (1 - rush) * 16,
        lerp(phaseEntry.jiren.y, intercept.y - 28, rush) + Math.cos(phaseTime * 12.4 + 0.8) * (1 - rush) * 10,
      )
      const burstSpeed = lerp(320, 980, rush)
      steerFighter(goku, gokuTarget, dt, w, h, {
        maxSpeed: burstSpeed,
        acceleration: 1550,
        drag: 0.72,
        arriveRadius: 220,
      })
      steerFighter(jiren, jirenTarget, dt, w, h, {
        maxSpeed: burstSpeed * 0.94,
        acceleration: 1480,
        drag: 0.7,
        arriveRadius: 220,
      })

      if (phase.timer <= 0 || (phaseTime > APPROACH_DURATION * 0.55 && distance(goku, jiren) < 216)) {
        setPhase({ kind: 'clash', timer: CLASH_DURATION })
        pushClashBurst(96)
      }
      break
    }

    case 'clash': {
      const previousTimer = phase.timer
      phase.timer -= dt
      const clashProgress = 1 - phase.timer / CLASH_DURATION
      const exchange = Math.sin(phaseTime * 8.2)
      const slip = Math.sin(phaseTime * 13.6 + 0.4)
      const center = arenaPoint(
        arena,
        0.5 + Math.sin(clashProgress * Math.PI * 1.6) * 0.08,
        0.48 + Math.sin(clashProgress * Math.PI * 2.4 + 0.6) * 0.05,
      )
      const pocket = 104 - Math.abs(exchange) * 28
      const gokuTarget = point(
        center.x - pocket + exchange * 42 + slip * 14,
        center.y + 18 - Math.max(0, exchange) * 34 + Math.max(0, -exchange) * 10 + Math.sin(phaseTime * 14.4) * 8,
      )
      const jirenTarget = point(
        center.x + pocket + exchange * 30 - slip * 12,
        center.y - 18 - Math.max(0, -exchange) * 32 + Math.max(0, exchange) * 12 + Math.cos(phaseTime * 13.8) * 8,
      )
      steerFighter(goku, gokuTarget, dt, w, h, {
        maxSpeed: 780 + Math.abs(exchange) * 220,
        acceleration: 1900,
        drag: 0.42,
        arriveRadius: 160,
      })
      steerFighter(jiren, jirenTarget, dt, w, h, {
        maxSpeed: 740 + Math.abs(exchange) * 210,
        acceleration: 1820,
        drag: 0.42,
        arriveRadius: 160,
      })
      enforceMinimumSeparation(goku, jiren, 172)

      if (Math.floor(previousTimer * 3.8) !== Math.floor(phase.timer * 3.8)) {
        pushClashBurst(70 + Math.abs(exchange) * 28)
      }

      if (phase.timer <= 0) {
        launchFightersApart(640)
        setPhase({ kind: 'separate', timer: SEPARATE_DURATION })
      }
      break
    }

    case 'separate': {
      phase.timer -= dt
      const scatter = easeOutCubic(1 - phase.timer / SEPARATE_DURATION)
      const gokuFallback = arenaPoint(arena, 0.14, 0.82)
      const jirenFallback = arenaPoint(arena, 0.86, 0.2)
      const gokuTarget = point(
        lerp(phaseEntry.goku.x, gokuFallback.x, scatter) + Math.sin(phaseTime * 6.4) * (1 - scatter) * 24,
        lerp(phaseEntry.goku.y, gokuFallback.y, scatter) + Math.sin(phaseTime * 9.6) * (1 - scatter) * 14,
      )
      const jirenTarget = point(
        lerp(phaseEntry.jiren.x, jirenFallback.x, scatter) + Math.cos(phaseTime * 5.8 + 0.4) * (1 - scatter) * 22,
        lerp(phaseEntry.jiren.y, jirenFallback.y, scatter) + Math.cos(phaseTime * 8.4 + 0.6) * (1 - scatter) * 12,
      )
      steerFighter(goku, gokuTarget, dt, w, h, {
        maxSpeed: lerp(720, 280, scatter),
        acceleration: 1280,
        drag: 2.4,
        arriveRadius: 240,
      })
      steerFighter(jiren, jirenTarget, dt, w, h, {
        maxSpeed: lerp(680, 260, scatter),
        acceleration: 1220,
        drag: 2.5,
        arriveRadius: 240,
      })
      enforceMinimumSeparation(goku, jiren, 254)

      if (phase.timer <= 0) {
        goku.vx *= 0.2
        goku.vy *= 0.2
        jiren.vx *= 0.2
        jiren.vy *= 0.2
        setPhase({ kind: 'kamehameha', timer: KAMEHAMEHA_DURATION, who: 'both' })
      }
      break
    }

    case 'kamehameha': {
      phase.timer -= dt
      const settle = easeOutCubic(clamp(phaseTime / 0.9, 0, 1))
      const beamCenter = arenaPoint(arena, 0.5, 0.5)
      const gokuBrace = point(beamCenter.x - arena.width * 0.24, beamCenter.y + arena.height * 0.18)
      const jirenBrace = point(beamCenter.x + arena.width * 0.22, beamCenter.y - arena.height * 0.12)
      const gokuTarget = point(
        lerp(phaseEntry.goku.x, gokuBrace.x, settle),
        lerp(phaseEntry.goku.y, gokuBrace.y, settle) + Math.sin(phaseTime * 7.4) * (1 - settle) * 10,
      )
      const jirenTarget = point(
        lerp(phaseEntry.jiren.x, jirenBrace.x, settle),
        lerp(phaseEntry.jiren.y, jirenBrace.y, settle) + Math.cos(phaseTime * 6.2) * (1 - settle) * 8,
      )
      steerFighter(goku, gokuTarget, dt, w, h, {
        maxSpeed: lerp(520, 220, settle),
        acceleration: 1180,
        drag: 2.8,
        arriveRadius: 220,
      })
      steerFighter(jiren, jirenTarget, dt, w, h, {
        maxSpeed: lerp(500, 220, settle),
        acceleration: 1120,
        drag: 2.8,
        arriveRadius: 220,
      })
      enforceMinimumSeparation(goku, jiren, 292)

      if (phaseTime >= 0.45) {
        const gokuState = getGokuRigState(phase, phaseTime)
        const jirenState = getJirenRigState(phase, phaseTime)
        const gokuFacesRight = goku.x < jiren.x
        const jirenFacesRight = !gokuFacesRight
        const gokuOrigin = localToWorld(
          goku,
          getGokuBeamOrigin(gokuState, phaseTime),
          gokuFacesRight,
          gokuState.drawScale,
          gokuState.bodyLean,
          gokuState.bodyBob,
        )
        const jirenOrigin = localToWorld(
          jiren,
          getJirenBeamOrigin(jirenState, phaseTime),
          jirenFacesRight,
          jirenState.drawScale,
          jirenState.bodyLean,
          jirenState.bodyBob,
        )

        beams.length = 0
        setSustainedBeam(gokuOrigin, jirenOrigin, 18, 3.2, getGokuEnergyColor(phase, phaseTime))
        if (phase.who === 'both') {
          setSustainedBeam(jirenOrigin, gokuOrigin, 17, 3.2, JIREN_COLOR)
        }
        if (phaseTime - dt < 0.45) {
          pushClashBurst(74)
        }
      }

      if (phase.timer <= 0) {
        resetScene(w, h)
        setPhase({ kind: 'transform', timer: TRANSFORM_DURATION })
      }
      break
    }
  }
}

function updateTrail(fighter: Fighter, dt: number): void {
  fighter.trailClock += dt
  const speed = Math.hypot(fighter.vx, fighter.vy)
  const emitInterval = speed > 860 ? 0.016
    : speed > 520 ? 0.024
      : speed > 260 ? 0.045
        : 0.08
  if (speed > 90 && fighter.trailClock >= emitInterval) {
    fighter.trail.push({
      x: fighter.x,
      y: fighter.y,
      age: 0,
      vx: fighter.vx,
      vy: fighter.vy,
    })
    fighter.trailClock = 0
  }
  for (let i = fighter.trail.length - 1; i >= 0; i--) {
    fighter.trail[i]!.age += dt
    if (fighter.trail[i]!.age > 0.34) fighter.trail.splice(i, 1)
  }
}

// ---------------------------------------------------------------------------
// Main render
// ---------------------------------------------------------------------------

function render(now: number): boolean {
  const dt = lastTime === null ? 0.016 : Math.min((now - lastTime) / 1000, 0.05)
  lastTime = now

  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight
  const dpr = devicePixelRatio

  // Resize 2D canvas
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  // Resize Three.js renderer
  threeRenderer.setSize(w, h)
  threeRenderer.setPixelRatio(dpr)

  // Update orthographic camera to match screen
  threeCamera.left = -w / 2
  threeCamera.right = w / 2
  threeCamera.top = h / 2
  threeCamera.bottom = -h / 2
  threeCamera.updateProjectionMatrix()

  if (prepared === null) return true

  // Update fight choreography
  updatePhase(dt, w, h)
  updateTrail(goku, dt)
  updateTrail(jiren, dt)

  for (let i = beams.length - 1; i >= 0; i--) {
    beams[i]!.age += dt
    if (beams[i]!.age > beams[i]!.maxAge) beams.splice(i, 1)
  }
  for (let i = clashes.length - 1; i >= 0; i--) {
    clashes[i]!.age += dt
    if (clashes[i]!.age > clashes[i]!.maxAge) clashes.splice(i, 1)
  }

  // Layout text
  const logoRects: RectObstacle[] = []
  const logoElement = document.querySelector<HTMLImageElement>('.dbs-logo')
  if (logoElement !== null) {
    const rect = logoElement.getBoundingClientRect()
    logoRects.push({ x: rect.left, y: rect.top, w: rect.width, h: rect.height })
  }

  const lines = layoutWithObstacles(
    prepared,
    GUTTER,
    TOP_INSET,
    w - GUTTER * 2,
    h - TOP_INSET - GUTTER,
    [goku, jiren],
    beams,
    logoRects,
  )

  syncLinePool(lines.length)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const element = linePool[i]!
    element.style.left = `${line.x}px`
    element.style.top = `${line.y}px`
    element.style.font = BODY_FONT

    const midChar = Math.floor((line.charStart + line.charEnd) * 0.5)
    if (isCharInActiveScene(midChar, phase.kind)) {
      element.style.background = 'rgba(255,220,50,0.18)'
      element.style.color = '#ece6d8'
    } else {
      element.style.background = 'none'
      element.style.color = '#8a8480'
    }
    element.textContent = line.text
  }

  // --- Draw 2D FX ---
  ctx.clearRect(0, 0, w, h)

  const timeSeconds = now / 1000
  const gokuState = getGokuRigState(phase, phaseTime)
  const jirenState = getJirenRigState(phase, phaseTime)
  const gokuColor = getGokuEnergyColor(phase, phaseTime)

  drawTrail(goku, gokuColor)
  drawTrail(jiren, JIREN_COLOR)

  for (let i = 0; i < beams.length; i++) drawBeam(beams[i]!)
  for (let i = 0; i < clashes.length; i++) drawClash(clashes[i]!)

  drawAura(goku, gokuColor, timeSeconds, gokuState.auraBoost)
  drawAura(jiren, JIREN_COLOR, timeSeconds, jirenState.auraBoost)

  // --- Render 3D models ---
  if (modelsLoaded && gokuModel !== null && jirenModel !== null) {
    const gokuFacesRight = goku.x < jiren.x

    gokuModel.mixer.update(dt)
    if (gokuModel.idleAction !== null) {
      const speed = phase.kind === 'clash' ? 0.7
        : phase.kind === 'kamehameha' ? 0.16
        : phase.kind === 'transform' ? 0.28
        : phase.kind === 'approach' ? 0.52
        : 0.4
      gokuModel.idleAction.timeScale = speed
    }

    animateGokuBones(gokuModel, timeSeconds, phase.kind, phaseTime)
    animateJirenBones(jirenModel, timeSeconds, phase.kind, phaseTime)

    // --- Ultra Instinct hair transform ---
    const uiProgress = clamp(gokuState.uiProgress, 0, 1)
    const uiTint = new THREE.Color().lerpColors(
      new THREE.Color(0x1c2438), // dark base hair
      new THREE.Color(0xdce8ff), // silver UI hair
      uiProgress,
    )
    const tintStrength = gokuModel.rig.uiTintMode === 'global' ? uiProgress * 0.22 : uiProgress
    for (const tintMesh of gokuModel.tintMeshes) {
      const mat = tintMesh.material as THREE.MeshToonMaterial
      const baseColor = mat.userData['baseColor'] instanceof THREE.Color
        ? mat.userData['baseColor']
        : new THREE.Color(0xffffff)
      mat.color.copy(baseColor).lerp(uiTint, tintStrength)
      if (uiProgress > 0.5) {
        mat.emissive = new THREE.Color(0x6688bb)
        mat.emissiveIntensity = (uiProgress - 0.5) * (gokuModel.rig.uiTintMode === 'global' ? 0.22 : 0.4)
      } else {
        mat.emissiveIntensity = 0
      }
    }

    // Position 3D models to match 2D fighter positions
    updateModelTransform(
      gokuWrapper,
      goku,
      gokuModel.normScale,
      gokuModel.modelPixelHeight,
      gokuFacesRight,
      gokuState.drawScale,
      gokuState.bodyLean,
      gokuState.bodyBob,
      w,
      h,
    )

    updateModelTransform(
      jirenWrapper,
      jiren,
      jirenModel.normScale,
      jirenModel.modelPixelHeight,
      !gokuFacesRight,
      jirenState.drawScale,
      jirenState.bodyLean,
      jirenState.bodyBob,
      w,
      h,
    )

    threeRenderer.render(threeScene, threeCamera)
  }

  return true
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

document.fonts.ready.then(async () => {
  prepared = prepareWithSegments(FIGHT_TEXT, BODY_FONT)

  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight
  resetScene(w, h)
  setPhase({ kind: 'transform', timer: TRANSFORM_DURATION })

  // Wait for models (non-blocking -- animation starts immediately)
  await modelsPromise.catch((err) => {
    console.warn('3D model loading failed:', err)
  })

  const loop = (now: number): void => {
    render(now)
    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
})
