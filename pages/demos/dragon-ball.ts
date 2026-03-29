import {
  layoutNextLine,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from '../../src/layout.ts'
import {
  drawGokuVector,
  drawJirenVector,
  getGokuBeamOrigin,
  getGokuRigState,
  getJirenBeamOrigin,
  getJirenRigState,
  type CharacterRigDebugFlags,
} from './dragon-ball-rig.ts'

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
const TRANSFORM_DURATION = 3.2
const ROAM_DURATION = 4.8
const CLASH_DURATION = 2.8
const SEPARATE_DURATION = 2.5
const KAMEHAMEHA_DURATION = 4.0

type EnergyColor = { r: number; g: number; b: number }

const GOKU_BASE_COLOR: EnergyColor = { r: 118, g: 176, b: 255 }
const GOKU_UI_COLOR: EnergyColor = { r: 226, g: 238, b: 255 }
const JIREN_COLOR: EnergyColor = { r: 255, g: 82, b: 58 }

// ---------------------------------------------------------------------------
// Fight narrative
// ---------------------------------------------------------------------------

type PhaseKind = 'transform' | 'roam' | 'approach' | 'clash' | 'separate' | 'kamehameha'

type DemoDebugFlags = {
  showPartAnchors: boolean
  showObstacleGeometry: boolean
  frozenPhase: PhaseKind | null
}

const DEBUG_FLAGS: DemoDebugFlags = (() => {
  const params = new URLSearchParams(window.location.search)
  const freeze = params.get('freeze')
  const frozenPhase = freeze === null || !isPhaseKind(freeze) ? null : freeze
  return {
    showPartAnchors: params.has('debugParts') || params.get('debug') === 'parts',
    showObstacleGeometry: params.has('debugObstacles') || params.get('debug') === 'obstacles',
    frozenPhase,
  }
})()

const RIG_DEBUG_FLAGS: CharacterRigDebugFlags = {
  showPartAnchors: DEBUG_FLAGS.showPartAnchors,
}

const FROZEN_PHASE_TIME: Record<PhaseKind, number> = {
  transform: 2.2,
  roam: 1.8,
  approach: 0.92,
  clash: 1.1,
  separate: 1.1,
  kamehameha: 1.3,
}

function isPhaseKind(value: string): value is PhaseKind {
  return value === 'transform'
    || value === 'roam'
    || value === 'approach'
    || value === 'clash'
    || value === 'separate'
    || value === 'kamehameha'
}

const STORY_BEATS: Array<{ phase: PhaseKind; text: string }> = [
  {
    phase: 'transform',
    text: 'Goku dropped to one knee on the shattered arena while Jiren watched from across the void without pity or panic. Even the drifting debris seemed to pause, as if the World of Void itself knew the next heartbeat would matter.',
  },
  {
    phase: 'transform',
    text: 'Then the heat around Goku changed. Blue fire thinned into silence. A silver current climbed his body for the first time, lifting every strand of hair before it flashed pale. His eyes went calm. Ultra Instinct had awakened.',
  },
  {
    phase: 'roam',
    text: 'They circled through broken stone and cold light. Goku moved with an eerie guard and almost no wasted motion. Jiren answered with sheer presence, shoulders square and wider than ever, certain that greater force would still decide the fight.',
  },
  {
    phase: 'approach',
    text: 'Jiren attacked first. He drove straight through the center with a finishing punch. Goku slipped outside the line, turned with it, and snapped back in with a counter sharp enough to make Jiren reset his stance.',
  },
  {
    phase: 'clash',
    text: 'The pace broke open. Fists, knees, and vanished steps collided in the middle of the page. Goku flowed from defense to offense without hesitation, while Jiren met him with brutal, deliberate counters.',
  },
  {
    phase: 'clash',
    text: 'Pressed for the first time, Jiren erupted into scarlet force. The Pride Trooper suit cut hard red panels through the glow as his brow lowered and his aura tore sparks across the arena. He widened his stance and hit back like a falling planet.',
  },
  {
    phase: 'separate',
    text: 'The impact split them apart. Jiren hurled dense red blasts through the debris field. Goku drifted around them with silver afterimages and open palms, creating just enough space for one clean answer.',
  },
  {
    phase: 'kamehameha',
    text: 'Goku set his feet, drew both hands to his side, and let the Kamehameha ignite. Jiren answered with a red column of force. White-blue and crimson locked together, and the first Ultra Instinct transformation became undeniable in the light between them.',
  },
]

const FIGHT_TEXT = STORY_BEATS.map(beat => beat.text).join('\n\n')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Interval = { left: number; right: number }
type Point = { x: number; y: number }

type Fighter = {
  name: 'goku' | 'jiren'
  x: number
  y: number
  r: number
  vx: number
  vy: number
  drawScale: number
  trail: Array<{ x: number; y: number; age: number }>
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
  | { kind: 'approach' }
  | { kind: 'clash'; timer: number }
  | { kind: 'separate'; timer: number }
  | { kind: 'kamehameha'; timer: number; who: 'goku' | 'both' }

type RectObstacle = { x: number; y: number; w: number; h: number }

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
  trail: [],
}

const beams: Beam[] = []
const clashes: Clash[] = []

let phase: Phase = { kind: 'transform', timer: TRANSFORM_DURATION }
let phaseTime = 0
let lastTime: number | null = null

// ---------------------------------------------------------------------------
// Scene ↔ paragraph mapping
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
// Circle → band interval
// ---------------------------------------------------------------------------

function circleIntervalForBand(
  cx: number,
  cy: number,
  r: number,
  bandTop: number,
  bandBottom: number,
  hPad: number,
  vPad: number,
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
  rx: number,
  ry: number,
  rw: number,
  rh: number,
  bandTop: number,
  bandBottom: number,
  hPad: number,
  vPad: number,
): Interval | null {
  if (bandTop >= ry + rh + vPad || bandBottom <= ry - vPad) return null
  return { left: rx - hPad, right: rx + rw + hPad }
}

function beamIntervalForBand(
  beam: Beam,
  bandTop: number,
  bandBottom: number,
  hPad: number,
  vPad: number,
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
  regionX: number,
  regionY: number,
  regionW: number,
  regionH: number,
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
// FX rendering
// ---------------------------------------------------------------------------

function drawAura(fighter: Fighter, color: EnergyColor, time: number, boost: number): void {
  const pulseRadius = fighter.r + 10 + Math.sin(time * 4 + boost) * (5 + boost * 2)
  const outerRadius = pulseRadius + 26 + boost * 12
  const gradient = ctx.createRadialGradient(fighter.x, fighter.y, fighter.r * 0.25, fighter.x, fighter.y, outerRadius)
  gradient.addColorStop(0, rgba(color, 0.22 + boost * 0.06))
  gradient.addColorStop(0.45, rgba(color, 0.08 + boost * 0.04))
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(fighter.x, fighter.y, outerRadius, 0, Math.PI * 2)
  ctx.fill()

  const flameCount = fighter.name === 'goku' ? 10 : 9
  for (let i = 0; i < flameCount; i++) {
    const angle = (i / flameCount) * Math.PI * 2 + time * (fighter.name === 'goku' ? 1.8 : 1.35)
    const stretch = fighter.name === 'goku' ? 0.85 : 0.7
    const flameRadius = pulseRadius + 7 + Math.sin(time * 7 + i * 1.3) * (6 + boost * 2)
    const flameX = fighter.x + Math.cos(angle) * flameRadius * stretch
    const flameY = fighter.y + Math.sin(angle) * flameRadius * 0.72 - Math.abs(Math.sin(time * 5 + i)) * (6 + boost * 3)
    const flameGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 12 + boost * 4)
    flameGradient.addColorStop(0, rgba(color, 0.3 + boost * 0.05))
    flameGradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = flameGradient
    ctx.beginPath()
    ctx.arc(flameX, flameY, 12 + boost * 3, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawTrail(fighter: Fighter, color: EnergyColor): void {
  for (let i = 0; i < fighter.trail.length; i++) {
    const trailPoint = fighter.trail[i]!
    const life = clamp(1 - trailPoint.age / 0.46, 0, 1)
    const size = (fighter.r * 0.17) * life
    ctx.fillStyle = rgba(color, 0.32 * life)
    ctx.beginPath()
    ctx.arc(trailPoint.x, trailPoint.y, size, 0, Math.PI * 2)
    ctx.fill()
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
// Fight choreography
// ---------------------------------------------------------------------------

function setPhase(nextPhase: Phase): void {
  phase = nextPhase
  phaseTime = 0
}

function resetScene(w: number, h: number): void {
  goku.x = w * 0.28
  goku.y = h * 0.66
  goku.vx = 112
  goku.vy = -70

  jiren.x = w * 0.72
  jiren.y = h * 0.34
  jiren.vx = -96
  jiren.vy = 56

  beams.length = 0
  clashes.length = 0
  goku.trail.length = 0
  jiren.trail.length = 0
}

function clampFighterToBounds(fighter: Fighter, w: number, h: number, reflectVelocity: boolean): void {
  const minX = GUTTER + fighter.r + 12
  const maxX = w - GUTTER - fighter.r - 12
  const minY = TOP_INSET + fighter.r * 0.62
  const maxY = h - GUTTER - fighter.r * 0.56

  if (fighter.x < minX) {
    fighter.x = minX
    if (reflectVelocity) fighter.vx = Math.abs(fighter.vx)
  }
  if (fighter.x > maxX) {
    fighter.x = maxX
    if (reflectVelocity) fighter.vx = -Math.abs(fighter.vx)
  }
  if (fighter.y < minY) {
    fighter.y = minY
    if (reflectVelocity) fighter.vy = Math.abs(fighter.vy)
  }
  if (fighter.y > maxY) {
    fighter.y = maxY
    if (reflectVelocity) fighter.vy = -Math.abs(fighter.vy)
  }
}

function moveToward(fighter: Fighter, tx: number, ty: number, speed: number, dt: number, w: number, h: number): void {
  const dx = tx - fighter.x
  const dy = ty - fighter.y
  const d = Math.hypot(dx, dy)
  if (d > 0.001) {
    const step = Math.min(speed * dt, d)
    fighter.x += (dx / d) * step
    fighter.y += (dy / d) * step
  }
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

  switch (phase.kind) {
    case 'transform': {
      phase.timer -= dt

      moveToward(goku, w * 0.28, h * 0.66, 96, dt, w, h)
      moveToward(jiren, w * 0.72, h * 0.34, 80, dt, w, h)

      goku.x += Math.sin(phaseTime * 17) * 0.35
      goku.y += Math.sin(phaseTime * 19) * 0.4
      jiren.x += Math.sin(phaseTime * 2.4) * 0.08

      if (phase.timer <= 0) {
        goku.vx = 118
        goku.vy = -76
        jiren.vx = -96
        jiren.vy = 58
        setPhase({ kind: 'roam', timer: ROAM_DURATION })
      }
      break
    }

    case 'roam': {
      phase.timer -= dt
      const orbit = phaseTime * 0.92
      goku.x = w * 0.35 + Math.sin(orbit) * 42
      goku.y = h * 0.62 + Math.cos(orbit * 1.75) * 16 + Math.sin(orbit * 0.6) * 4
      jiren.x = w * 0.69 + Math.sin(orbit + 1.1) * 26
      jiren.y = h * 0.38 + Math.cos(orbit * 1.5 + 0.8) * 18
      enforceMinimumSeparation(goku, jiren, 246)
      clampFighterToBounds(goku, w, h, false)
      clampFighterToBounds(jiren, w, h, false)

      if (phase.timer <= 0) setPhase({ kind: 'approach' })
      break
    }

    case 'approach': {
      const t = smoothstep01(phaseTime / 1.05)
      goku.x = lerp(w * 0.38, w * 0.46, t)
      goku.y = lerp(h * 0.6, h * 0.51, t) + Math.sin(phaseTime * 10) * (1 - t) * 4
      jiren.x = lerp(w * 0.66, w * 0.55, t)
      jiren.y = lerp(h * 0.4, h * 0.48, t) + Math.cos(phaseTime * 9) * (1 - t) * 3

      if (t >= 1 || distance(goku, jiren) < 188) {
        setPhase({ kind: 'clash', timer: CLASH_DURATION })
        pushClashBurst(88)
      }
      break
    }

    case 'clash': {
      const previousTimer = phase.timer
      phase.timer -= dt

      const midX = w * 0.5
      const midY = h * 0.48
      const exchange = Math.sin(phaseTime * 6.6)
      const compression = 84 - Math.abs(exchange) * 10
      const gokuLead = Math.max(0, exchange)
      const jirenLead = Math.max(0, -exchange)
      goku.x = midX - compression + Math.sin(phaseTime * 7.2) * 3 + gokuLead * 20 - jirenLead * 6
      goku.y = midY + 12 - gokuLead * 16 + jirenLead * 4 + Math.sin(phaseTime * 11.2) * 2
      jiren.x = midX + compression + Math.cos(phaseTime * 6.8) * 3 - jirenLead * 22 + gokuLead * 8
      jiren.y = midY - 10 - jirenLead * 14 + gokuLead * 5 + Math.cos(phaseTime * 10.4) * 1.8

      if (Math.floor(previousTimer * 3) !== Math.floor(phase.timer * 3)) {
        pushClashBurst(64 + Math.random() * 26)
      }

      if (phase.timer <= 0) {
        setPhase({ kind: 'separate', timer: SEPARATE_DURATION })
      }
      break
    }

    case 'separate': {
      phase.timer -= dt
      const t = smoothstep01(1 - phase.timer / SEPARATE_DURATION)
      goku.x = lerp(w * 0.46, w * 0.28, t)
      goku.y = lerp(h * 0.5, h * 0.64, t) + Math.sin(phaseTime * 9.2) * (1 - t) * 10
      jiren.x = lerp(w * 0.54, w * 0.74, t)
      jiren.y = lerp(h * 0.46, h * 0.36, t) + Math.cos(phaseTime * 8.6) * (1 - t) * 8
      enforceMinimumSeparation(goku, jiren, 252)
      clampFighterToBounds(goku, w, h, false)
      clampFighterToBounds(jiren, w, h, false)

      if (phase.timer <= 0) {
        goku.vx = 0
        goku.vy = 0
        jiren.vx = 0
        jiren.vy = 0
        setPhase({ kind: 'kamehameha', timer: KAMEHAMEHA_DURATION, who: 'both' })
      }
      break
    }

    case 'kamehameha': {
      phase.timer -= dt
      const t = smoothstep01(phaseTime / 0.6)
      goku.x = lerp(w * 0.28, w * 0.31, t)
      goku.y = lerp(h * 0.64, h * 0.58, t) + Math.sin(phaseTime * 8.2) * 1.8
      jiren.x = lerp(w * 0.74, w * 0.7, t)
      jiren.y = lerp(h * 0.36, h * 0.42, t) + Math.cos(phaseTime * 6.8) * 1.2
      enforceMinimumSeparation(goku, jiren, 278)

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
  fighter.trail.push({ x: fighter.x, y: fighter.y, age: 0 })
  for (let i = fighter.trail.length - 1; i >= 0; i--) {
    fighter.trail[i]!.age += dt
    if (fighter.trail[i]!.age > 0.46) fighter.trail.splice(i, 1)
  }
}

function makePhase(kind: PhaseKind): Phase {
  switch (kind) {
    case 'transform':
      return { kind, timer: TRANSFORM_DURATION }
    case 'roam':
      return { kind, timer: ROAM_DURATION }
    case 'approach':
      return { kind }
    case 'clash':
      return { kind, timer: CLASH_DURATION }
    case 'separate':
      return { kind, timer: SEPARATE_DURATION }
    case 'kamehameha':
      return { kind, timer: KAMEHAMEHA_DURATION, who: 'both' }
  }
}

function cloneDisplayFighter(source: Fighter, x: number, y: number): Fighter {
  return {
    ...source,
    x,
    y,
    vx: 0,
    vy: 0,
    trail: [],
  }
}

function getFrozenScene(
  phaseKind: PhaseKind,
  w: number,
  h: number,
): {
  displayPhase: Phase
  displayPhaseTime: number
  displayGoku: Fighter
  displayJiren: Fighter
  displayBeams: Beam[]
  displayClashes: Clash[]
} {
  const displayPhase = makePhase(phaseKind)
  const displayPhaseTime = FROZEN_PHASE_TIME[phaseKind]

  let displayGoku = cloneDisplayFighter(goku, w * 0.32, h * 0.62)
  let displayJiren = cloneDisplayFighter(jiren, w * 0.68, h * 0.4)

  switch (phaseKind) {
    case 'transform':
      displayGoku = cloneDisplayFighter(goku, w * 0.3, h * 0.68)
      displayJiren = cloneDisplayFighter(jiren, w * 0.72, h * 0.36)
      break
    case 'roam':
      displayGoku = cloneDisplayFighter(goku, w * 0.36, h * 0.62)
      displayJiren = cloneDisplayFighter(jiren, w * 0.66, h * 0.38)
      break
    case 'approach':
      displayGoku = cloneDisplayFighter(goku, w * 0.44, h * 0.53)
      displayJiren = cloneDisplayFighter(jiren, w * 0.58, h * 0.47)
      break
    case 'clash':
      displayGoku = cloneDisplayFighter(goku, w * 0.445, h * 0.5)
      displayJiren = cloneDisplayFighter(jiren, w * 0.57, h * 0.455)
      break
    case 'separate':
      displayGoku = cloneDisplayFighter(goku, w * 0.28, h * 0.64)
      displayJiren = cloneDisplayFighter(jiren, w * 0.74, h * 0.36)
      break
    case 'kamehameha':
      displayGoku = cloneDisplayFighter(goku, w * 0.31, h * 0.58)
      displayJiren = cloneDisplayFighter(jiren, w * 0.7, h * 0.42)
      break
  }

  const displayBeams: Beam[] = []
  const displayClashes: Clash[] = []
  if (phaseKind === 'clash') {
    displayClashes.push({
      x: (displayGoku.x + displayJiren.x) * 0.5,
      y: (displayGoku.y + displayJiren.y) * 0.5,
      age: 0.12,
      maxAge: 0.8,
      radius: 78,
    })
  }

  if (phaseKind === 'kamehameha') {
    const gokuState = getGokuRigState(displayPhase, displayPhaseTime)
    const jirenState = getJirenRigState(displayPhase, displayPhaseTime)
    const gokuFacesRight = displayGoku.x < displayJiren.x
    const jirenFacesRight = !gokuFacesRight
    const gokuOrigin = localToWorld(
      displayGoku,
      getGokuBeamOrigin(gokuState, displayPhaseTime),
      gokuFacesRight,
      gokuState.drawScale,
      gokuState.bodyLean,
      gokuState.bodyBob,
    )
    const jirenOrigin = localToWorld(
      displayJiren,
      getJirenBeamOrigin(jirenState, displayPhaseTime),
      jirenFacesRight,
      jirenState.drawScale,
      jirenState.bodyLean,
      jirenState.bodyBob,
    )
    displayBeams.push({
      fromX: gokuOrigin.x,
      fromY: gokuOrigin.y,
      toX: jirenOrigin.x,
      toY: jirenOrigin.y,
      width: 18,
      age: 0.5,
      maxAge: 3.2,
      color: getGokuEnergyColor(displayPhase, displayPhaseTime),
    })
    displayBeams.push({
      fromX: jirenOrigin.x,
      fromY: jirenOrigin.y,
      toX: gokuOrigin.x,
      toY: gokuOrigin.y,
      width: 17,
      age: 0.5,
      maxAge: 3.2,
      color: JIREN_COLOR,
    })
  }

  return { displayPhase, displayPhaseTime, displayGoku, displayJiren, displayBeams, displayClashes }
}

function drawObstacleDebug(fighters: Fighter[], beamList: Beam[], rects: RectObstacle[]): void {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,214,88,0.82)'
  ctx.lineWidth = 1.25
  for (let i = 0; i < fighters.length; i++) {
    const fighter = fighters[i]!
    ctx.beginPath()
    ctx.arc(fighter.x, fighter.y, fighter.r + 12, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(140,220,255,0.8)'
  for (let i = 0; i < beamList.length; i++) {
    const beam = beamList[i]!
    ctx.lineWidth = beam.width + 34
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(beam.fromX, beam.fromY)
    ctx.lineTo(beam.toX, beam.toY)
    ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.42)'
  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i]!
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
  }

  ctx.restore()
}

// ---------------------------------------------------------------------------
// Main render
// ---------------------------------------------------------------------------

function render(now: number): boolean {
  const dt = lastTime === null ? 0.016 : Math.min((now - lastTime) / 1000, 0.05)
  lastTime = now

  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight

  if (canvas.width !== w * devicePixelRatio || canvas.height !== h * devicePixelRatio) {
    canvas.width = w * devicePixelRatio
    canvas.height = h * devicePixelRatio
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  }

  if (prepared === null) return true

  let displayPhase = phase
  let displayPhaseTime = phaseTime
  let displayGoku = goku
  let displayJiren = jiren
  let displayBeams = beams
  let displayClashes = clashes

  if (DEBUG_FLAGS.frozenPhase === null) {
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
  } else {
    const frozen = getFrozenScene(DEBUG_FLAGS.frozenPhase, w, h)
    displayPhase = frozen.displayPhase
    displayPhaseTime = frozen.displayPhaseTime
    displayGoku = frozen.displayGoku
    displayJiren = frozen.displayJiren
    displayBeams = frozen.displayBeams
    displayClashes = frozen.displayClashes
  }

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
    [displayGoku, displayJiren],
    displayBeams,
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
    if (isCharInActiveScene(midChar, displayPhase.kind)) {
      element.style.background = 'rgba(255,220,50,0.18)'
      element.style.color = '#ece6d8'
    } else {
      element.style.background = 'none'
      element.style.color = '#8a8480'
    }
    element.textContent = line.text
  }

  ctx.clearRect(0, 0, w, h)

  const timeSeconds = now / 1000
  const gokuState = getGokuRigState(displayPhase, displayPhaseTime)
  const jirenState = getJirenRigState(displayPhase, displayPhaseTime)
  const gokuColor = getGokuEnergyColor(displayPhase, displayPhaseTime)

  if (DEBUG_FLAGS.frozenPhase === null) {
    drawTrail(displayGoku, gokuColor)
    drawTrail(displayJiren, JIREN_COLOR)
  }

  for (let i = 0; i < displayBeams.length; i++) drawBeam(displayBeams[i]!)
  for (let i = 0; i < displayClashes.length; i++) drawClash(displayClashes[i]!)

  drawAura(displayGoku, gokuColor, timeSeconds, gokuState.auraBoost)
  drawAura(displayJiren, JIREN_COLOR, timeSeconds, jirenState.auraBoost)

  const gokuFacesRight = displayGoku.x < displayJiren.x
  drawGokuVector(ctx, displayGoku, gokuFacesRight, timeSeconds, gokuState, RIG_DEBUG_FLAGS)
  drawJirenVector(ctx, displayJiren, !gokuFacesRight, timeSeconds, jirenState, RIG_DEBUG_FLAGS)

  if (DEBUG_FLAGS.showObstacleGeometry) {
    drawObstacleDebug([displayGoku, displayJiren], displayBeams, logoRects)
  }

  return true
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

document.fonts.ready.then(() => {
  prepared = prepareWithSegments(FIGHT_TEXT, BODY_FONT)

  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight
  resetScene(w, h)

  const loop = (now: number): void => {
    render(now)
    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
})
