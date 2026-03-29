export type PaintToken =
  | 'gokuAura'
  | 'gokuAuraCore'
  | 'gokuAuraEdge'
  | 'gokuHairShadow'
  | 'gokuHairMid'
  | 'gokuHairLight'
  | 'gokuSkin'
  | 'gokuSkinShadow'
  | 'gokuGi'
  | 'gokuGiLight'
  | 'gokuGiShadow'
  | 'gokuBlue'
  | 'gokuBlueLight'
  | 'gokuBlueShadow'
  | 'gokuBootAccent'
  | 'gokuBootTrim'
  | 'gokuEmblem'
  | 'jirenAura'
  | 'jirenAuraCore'
  | 'jirenAuraEdge'
  | 'jirenSkin'
  | 'jirenSkinShadow'
  | 'jirenSkinDeepShadow'
  | 'jirenSuitBlack'
  | 'jirenSuitBlackLight'
  | 'jirenSuitRed'
  | 'jirenSuitRedShadow'
  | 'jirenGlove'
  | 'jirenGloveShadow'
  | 'jirenEye'
  | 'ink'
  | 'inkSoft'
  | 'white'

export type Bounds = {
  left: number
  top: number
  right: number
  bottom: number
}

export type VectorShape =
  | {
      kind: 'fill'
      d: string
      fill: PaintToken
      alpha?: number
      stroke?: PaintToken
      lineWidth?: number
    }
  | {
      kind: 'stroke'
      d: string
      stroke: PaintToken
      lineWidth: number
      alpha?: number
      lineCap?: CanvasLineCap
      lineJoin?: CanvasLineJoin
    }

export type VectorPart = {
  id: string
  bounds: Bounds
  tip?: { x: number; y: number }
  shapes: VectorShape[]
}

function box(left: number, top: number, right: number, bottom: number): Bounds {
  return { left, top, right, bottom }
}

function part(id: string, bounds: Bounds, shapes: VectorShape[], tip?: { x: number; y: number }): VectorPart {
  if (tip === undefined) return { id, bounds, shapes }
  return { id, bounds, shapes, tip }
}

const GOKU_AURA_SHELL = part(
  'gokuAuraShell',
  box(-86, -138, 88, 134),
  [
    {
      kind: 'fill',
      d: [
        'M -10 -132',
        'C -44 -124 -70 -96 -76 -54',
        'C -82 -10 -80 44 -58 88',
        'C -34 126 -4 136 28 128',
        'C 58 120 80 94 82 58',
        'C 84 20 76 -22 62 -56',
        'C 48 -92 26 -118 -10 -132',
        'Z',
      ].join(' '),
      fill: 'gokuAura',
      alpha: 0.24,
    },
    {
      kind: 'fill',
      d: [
        'M -6 -120',
        'C -34 -112 -54 -88 -58 -50',
        'C -62 -12 -60 34 -40 70',
        'C -20 102 6 110 28 102',
        'C 48 94 62 72 64 42',
        'C 66 8 60 -24 48 -52',
        'C 36 -82 20 -106 -6 -120',
        'Z',
      ].join(' '),
      fill: 'gokuAuraCore',
      alpha: 0.26,
    },
    {
      kind: 'stroke',
      d: [
        'M -10 -124',
        'C -42 -114 -60 -92 -64 -54',
        'C -68 -10 -62 40 -42 76',
        'C -16 118 18 118 42 96',
        'C 60 80 72 46 72 12',
        'C 72 -28 58 -74 30 -104',
      ].join(' '),
      stroke: 'gokuAuraEdge',
      lineWidth: 3,
      alpha: 0.42,
      lineCap: 'round',
      lineJoin: 'round',
    },
  ],
)

const GOKU_BACK_HAIR = part(
  'gokuBackHair',
  box(-96, -148, 96, 18),
  [
    // Back mass shadow layer — big dramatic silhouette
    {
      kind: 'fill',
      d: [
        'M -20 14',
        'C -30 8 -44 10 -62 16',
        'L -56 4',
        'L -74 -4',
        'L -68 -22',
        'L -90 -40',
        'L -72 -52',
        'L -82 -82',
        'L -52 -72',
        'L -62 -112',
        'L -30 -98',
        'L -22 -142',
        'L 0 -108',
        'L 14 -148',
        'L 32 -112',
        'L 52 -126',
        'L 50 -94',
        'L 76 -108',
        'L 68 -72',
        'L 96 -66',
        'L 78 -38',
        'L 86 -12',
        'L 54 -4',
        'L 32 10',
        'L 10 4',
        'L -4 12',
        'C -8 6 -14 10 -20 14',
        'Z',
      ].join(' '),
      fill: 'gokuHairShadow',
      stroke: 'ink',
      lineWidth: 1.8,
    },
    // Back mass mid tone — layered spike groups
    {
      kind: 'fill',
      d: [
        'M -14 6',
        'C -24 2 -38 2 -52 6',
        'L -48 -6',
        'L -62 -14',
        'L -56 -32',
        'L -68 -48',
        'L -50 -56',
        'L -56 -86',
        'L -28 -74',
        'L -22 -104',
        'L -4 -82',
        'L 8 -116',
        'L 22 -84',
        'L 42 -96',
        'L 40 -68',
        'L 64 -72',
        'L 56 -40',
        'L 72 -18',
        'L 42 -8',
        'L 24 6',
        'L 6 -2',
        'C -2 -4 -8 2 -14 6',
        'Z',
      ].join(' '),
      fill: 'gokuHairMid',
      alpha: 0.92,
    },
    // Crown spike highlights — asymmetric UI rhythm
    {
      kind: 'fill',
      d: [
        'M -16 -92',
        'L -6 -76',
        'L 6 -102',
        'L 18 -80',
        'L 34 -88',
        'L 28 -60',
        'L 14 -44',
        'L 0 -52',
        'L -10 -66',
        'Z',
      ].join(' '),
      fill: 'gokuHairLight',
      alpha: 0.92,
    },
    // Side spike highlight left
    {
      kind: 'fill',
      d: [
        'M -48 -40',
        'L -38 -56',
        'L -28 -42',
        'L -22 -52',
        'L -18 -36',
        'L -30 -28',
        'L -44 -30',
        'Z',
      ].join(' '),
      fill: 'gokuHairLight',
      alpha: 0.78,
    },
    // Side spike highlight right
    {
      kind: 'fill',
      d: [
        'M 50 -36',
        'L 42 -54',
        'L 34 -38',
        'L 28 -48',
        'L 24 -32',
        'L 36 -24',
        'L 48 -26',
        'Z',
      ].join(' '),
      fill: 'gokuHairLight',
      alpha: 0.82,
    },
  ],
)

const GOKU_FRONT_BANGS = part(
  'gokuFrontBangs',
  box(-58, -128, 56, 16),
  [
    // Bang group 1 — far left swept spike
    {
      kind: 'fill',
      d: [
        'M -26 -4',
        'L -42 -12',
        'L -38 -28',
        'L -30 -38',
        'L -26 -78',
        'L -16 -52',
        'L -14 -28',
        'L -16 -8',
        'Z',
      ].join(' '),
      fill: 'gokuHairMid',
      stroke: 'ink',
      lineWidth: 1.6,
    },
    // Bang group 2 — left-center spike (taller)
    {
      kind: 'fill',
      d: [
        'M -10 -6',
        'L -18 -18',
        'L -14 -36',
        'L -10 -62',
        'L -4 -98',
        'L 2 -56',
        'L 4 -28',
        'L 2 -10',
        'Z',
      ].join(' '),
      fill: 'gokuHairMid',
      stroke: 'ink',
      lineWidth: 1.6,
    },
    // Bang group 3 — center-right hero spike (tallest, iconic)
    {
      kind: 'fill',
      d: [
        'M 4 -8',
        'L 2 -22',
        'L 6 -44',
        'L 10 -76',
        'L 14 -128',
        'L 20 -72',
        'L 22 -42',
        'L 18 -18',
        'L 12 -6',
        'Z',
      ].join(' '),
      fill: 'gokuHairMid',
      stroke: 'ink',
      lineWidth: 1.8,
    },
    // Bang group 4 — right swept spike
    {
      kind: 'fill',
      d: [
        'M 18 -4',
        'L 20 -18',
        'L 26 -48',
        'L 34 -92',
        'L 42 -62',
        'L 52 -64',
        'L 46 -32',
        'L 44 -14',
        'L 28 -2',
        'Z',
      ].join(' '),
      fill: 'gokuHairMid',
      stroke: 'ink',
      lineWidth: 1.6,
    },
    // Highlight on bang 1
    {
      kind: 'fill',
      d: [
        'M -22 -10',
        'L -30 -16',
        'L -26 -26',
        'L -20 -18',
        'L -16 -10',
        'Z',
      ].join(' '),
      fill: 'gokuHairLight',
      alpha: 0.94,
    },
    // Highlight on bang 2 (center streak)
    {
      kind: 'fill',
      d: [
        'M -6 -12',
        'L -8 -28',
        'L -4 -62',
        'L 0 -26',
        'L 0 -10',
        'Z',
      ].join(' '),
      fill: 'gokuHairLight',
      alpha: 0.96,
    },
    // Highlight on bang 3 (hero spike streak)
    {
      kind: 'fill',
      d: [
        'M 8 -12',
        'L 10 -34',
        'L 14 -80',
        'L 16 -32',
        'L 14 -10',
        'Z',
      ].join(' '),
      fill: 'gokuHairLight',
      alpha: 0.98,
    },
    // Highlight on bang 4
    {
      kind: 'fill',
      d: [
        'M 26 -8',
        'L 26 -24',
        'L 32 -58',
        'L 36 -28',
        'L 34 -10',
        'Z',
      ].join(' '),
      fill: 'gokuHairLight',
      alpha: 0.94,
    },
  ],
)

const GOKU_HEAD = part(
  'gokuHead',
  box(-28, -58, 28, 18),
  [
    // Face shape: angular jaw, wider cheekbones, narrow chin — DB anatomy
    {
      kind: 'fill',
      d: [
        'M -16 -44',
        'C -12 -54 12 -54 16 -44',
        'C 20 -36 22 -26 22 -16',
        'C 22 -6 18 2 12 8',
        'C 6 14 2 16 0 16',
        'C -2 16 -6 14 -12 8',
        'C -18 2 -22 -6 -22 -16',
        'C -22 -26 -20 -36 -16 -44',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.8,
    },
    // Ear left
    {
      kind: 'fill',
      d: 'M -21 -22 C -26 -24 -28 -18 -26 -12 C -24 -8 -21 -8 -21 -14 Z',
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1,
    },
    // Ear right
    {
      kind: 'fill',
      d: 'M 21 -22 C 26 -24 28 -18 26 -12 C 24 -8 21 -8 21 -14 Z',
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1,
    },
    // Cheek-to-jaw shadow left (anime plane 1)
    {
      kind: 'fill',
      d: [
        'M -18 -12',
        'C -16 -2 -12 6 -6 10',
        'C -2 8 0 4 0 -2',
        'C -4 -6 -10 -10 -18 -12',
        'Z',
      ].join(' '),
      fill: 'gokuSkinShadow',
      alpha: 0.42,
    },
    // Cheek-to-jaw shadow right (lighter, anime convention)
    {
      kind: 'fill',
      d: [
        'M 18 -12',
        'C 16 -2 12 6 6 10',
        'C 2 8 0 4 0 -2',
        'C 4 -6 10 -10 18 -12',
        'Z',
      ].join(' '),
      fill: 'gokuSkinShadow',
      alpha: 0.28,
    },
    // Eye whites — narrow, angular, UI calm
    {
      kind: 'fill',
      d: 'M -14 -24 C -10 -28 -4 -28 -2 -25 C -3 -20 -6 -18 -10 -18 C -13 -18 -15 -20 -14 -24 Z',
      fill: 'white',
    },
    {
      kind: 'fill',
      d: 'M 14 -24 C 10 -28 4 -28 2 -25 C 3 -20 6 -18 10 -18 C 13 -18 15 -20 14 -24 Z',
      fill: 'white',
    },
    // Irises — small, intense silver-dark pupils
    {
      kind: 'fill',
      d: 'M -10 -24 C -8 -26 -5 -26 -4 -24 C -4 -21 -6 -19 -9 -19 C -11 -20 -11 -22 -10 -24 Z',
      fill: 'gokuHairShadow',
    },
    {
      kind: 'fill',
      d: 'M 10 -24 C 8 -26 5 -26 4 -24 C 4 -21 6 -19 9 -19 C 11 -20 11 -22 10 -24 Z',
      fill: 'gokuHairShadow',
    },
    // Pupil highlights
    {
      kind: 'fill',
      d: 'M -8 -23 A 1.2 1.2 0 1 0 -8 -21 A 1.2 1.2 0 1 0 -8 -23 Z',
      fill: 'white',
      alpha: 0.88,
    },
    {
      kind: 'fill',
      d: 'M 8 -23 A 1.2 1.2 0 1 0 8 -21 A 1.2 1.2 0 1 0 8 -23 Z',
      fill: 'white',
      alpha: 0.88,
    },
    // Brow ridge left — heavy, stern, angular (outer contour weight)
    {
      kind: 'stroke',
      d: 'M -15 -30 C -12 -34 -6 -36 -1 -34',
      stroke: 'ink',
      lineWidth: 3.0,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Brow ridge right
    {
      kind: 'stroke',
      d: 'M 15 -30 C 12 -34 6 -36 1 -34',
      stroke: 'ink',
      lineWidth: 3.0,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Brow crease center (vertical stern line)
    {
      kind: 'stroke',
      d: 'M -1 -33 L 0 -30 L 1 -33',
      stroke: 'ink',
      lineWidth: 1.4,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Upper eyelid lines (interior form weight)
    {
      kind: 'stroke',
      d: 'M -14 -24 C -10 -27 -5 -27 -2 -25',
      stroke: 'ink',
      lineWidth: 1.8,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 14 -24 C 10 -27 5 -27 2 -25',
      stroke: 'ink',
      lineWidth: 1.8,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Lower eyelid lines (detail weight)
    {
      kind: 'stroke',
      d: 'M -13 -19 C -10 -17 -5 -17 -3 -19',
      stroke: 'inkSoft',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 13 -19 C 10 -17 5 -17 3 -19',
      stroke: 'inkSoft',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Nose bridge — longer, sharper
    {
      kind: 'stroke',
      d: 'M 1 -20 C 2 -12 1 -4 -1 0',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.4,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Nose tip
    {
      kind: 'stroke',
      d: 'M -2 0 C -1 1 1 1 2 0',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Mouth — small, stern, closed, UI calm
    {
      kind: 'stroke',
      d: 'M -5 5 C -2 7 2 7 5 5',
      stroke: 'inkSoft',
      lineWidth: 1.8,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Lower lip shadow
    {
      kind: 'stroke',
      d: 'M -3 7 C 0 9 3 7',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.0,
      alpha: 0.5,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Chin definition
    {
      kind: 'stroke',
      d: 'M -4 12 C 0 14 4 12',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.0,
      alpha: 0.44,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Jaw line left (subtle contour)
    {
      kind: 'stroke',
      d: 'M -20 -14 C -18 -4 -14 6 -10 10',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.2,
      alpha: 0.5,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Jaw line right
    {
      kind: 'stroke',
      d: 'M 20 -14 C 18 -4 14 6 10 10',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.2,
      alpha: 0.36,
      lineCap: 'round',
      lineJoin: 'round',
    },
  ],
)

const GOKU_NECK = part(
  'gokuNeck',
  box(-14, -8, 14, 18),
  [
    {
      kind: 'fill',
      d: [
        'M -9 -8',
        'C -11 0 -11 8 -9 18',
        'L 9 18',
        'C 11 8 11 0 9 -8',
        'C 5 -4 -5 -4 -9 -8',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Sternocleidomastoid shadow left
    {
      kind: 'fill',
      d: 'M -7 2 L -2 18 L 0 18 L -1 0 Z',
      fill: 'gokuSkinShadow',
      alpha: 0.48,
    },
    // SCM shadow right
    {
      kind: 'fill',
      d: 'M 7 2 L 2 18 L 0 18 L 1 0 Z',
      fill: 'gokuSkinShadow',
      alpha: 0.36,
    },
  ],
)

const GOKU_CHEST = part(
  'gokuChest',
  box(-62, -62, 62, 64),
  [
    // Gi torso — stronger V-chest, wider shoulders, DB proportions
    {
      kind: 'fill',
      d: [
        'M -54 -54',
        'C -64 -36 -64 -10 -56 18',
        'C -48 44 -36 60 -22 62',
        'C -10 60 -3 50 0 36',
        'C 3 50 10 60 22 62',
        'C 36 60 48 44 56 18',
        'C 64 -10 64 -36 54 -54',
        'C 38 -62 16 -62 4 -50',
        'L 0 -14',
        'L -4 -50',
        'C -16 -62 -38 -62 -54 -54',
        'Z',
      ].join(' '),
      fill: 'gokuGi',
      stroke: 'ink',
      lineWidth: 2.0,
    },
    // V-chest light plane — clean anime highlight
    {
      kind: 'fill',
      d: [
        'M -38 -50',
        'L -6 -12',
        'L 0 24',
        'L 6 -12',
        'L 38 -50',
        'C 28 -46 16 -42 10 -36',
        'L 0 -10',
        'L -10 -36',
        'C -16 -42 -28 -46 -38 -50',
        'Z',
      ].join(' '),
      fill: 'gokuGiLight',
      alpha: 0.44,
    },
    // Center fold shadow — deep V from collar to waist
    {
      kind: 'fill',
      d: [
        'M -20 -58',
        'L 0 -14',
        'L 20 -58',
        'L 30 -58',
        'C 18 -32 12 -8 6 24',
        'C 4 34 2 42 0 50',
        'C -2 42 -4 34 -6 24',
        'C -12 -8 -18 -32 -30 -58',
        'Z',
      ].join(' '),
      fill: 'gokuGiShadow',
      alpha: 0.58,
    },
    // Left pec fold line
    {
      kind: 'stroke',
      d: 'M -40 -16 C -36 6 -30 28 -22 42',
      stroke: 'gokuGiShadow',
      lineWidth: 1.4,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.7,
    },
    // Right pec fold line
    {
      kind: 'stroke',
      d: 'M 40 -16 C 36 6 30 28 22 42',
      stroke: 'gokuGiShadow',
      lineWidth: 1.4,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.7,
    },
    // Shoulder crease left
    {
      kind: 'stroke',
      d: 'M -48 -42 C -42 -32 -36 -22 -32 -10',
      stroke: 'gokuGiShadow',
      lineWidth: 1.1,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.56,
    },
    // Shoulder crease right
    {
      kind: 'stroke',
      d: 'M 48 -42 C 42 -32 36 -22 32 -10',
      stroke: 'gokuGiShadow',
      lineWidth: 1.1,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.56,
    },
    // Emblem circle — Whis symbol area
    {
      kind: 'fill',
      d: 'M 25 -8 A 10 10 0 1 1 24.99 -8 Z',
      fill: 'white',
      alpha: 0.9,
      stroke: 'ink',
      lineWidth: 1.0,
    },
    // Emblem mark
    {
      kind: 'stroke',
      d: 'M 21 -10 Q 25 -14 29 -10 Q 27 -3 23 -3',
      stroke: 'gokuEmblem',
      lineWidth: 1.6,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 25 -15 L 25 -1',
      stroke: 'gokuEmblem',
      lineWidth: 1.6,
      lineCap: 'round',
      lineJoin: 'round',
    },
  ],
)

const GOKU_UNDERSHIRT = part(
  'gokuUndershirt',
  box(-32, -58, 32, 14),
  [
    {
      kind: 'fill',
      d: [
        'M -26 -54',
        'L -12 -4',
        'L 0 -16',
        'L 12 -4',
        'L 26 -54',
        'C 16 -58 6 -60 0 -50',
        'C -6 -60 -16 -58 -26 -54',
        'Z',
      ].join(' '),
      fill: 'gokuBlue',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: 'M -16 -46 L -5 -10 L 0 -16 L -6 -42 Z',
      fill: 'gokuBlueLight',
      alpha: 0.7,
    },
    {
      kind: 'fill',
      d: 'M 16 -46 L 5 -10 L 0 -16 L 6 -42 Z',
      fill: 'gokuBlueShadow',
      alpha: 0.68,
    },
    {
      kind: 'stroke',
      d: 'M -10 -30 Q 0 -24 10 -30',
      stroke: 'gokuBlueLight',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.7,
    },
  ],
)

const GOKU_BELT = part(
  'gokuBeltSash',
  box(-44, -18, 42, 82),
  [
    {
      kind: 'fill',
      d: 'M -36 -10 C -18 -18 18 -18 36 -10 L 36 12 C 18 18 -18 18 -36 12 Z',
      fill: 'gokuBlue',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: [
        'M -10 -10',
        'C -20 2 -20 18 -10 28',
        'C -2 34 2 34 10 28',
        'C 20 18 20 2 10 -10',
        'C 4 -2 -4 -2 -10 -10',
        'Z',
      ].join(' '),
      fill: 'gokuBlueLight',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: 'M -4 20 C -18 30 -26 46 -28 74 C -14 68 -6 58 -2 24 Z',
      fill: 'gokuBlue',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: 'M 4 18 C 16 28 28 44 24 82 C 10 70 4 58 2 22 Z',
      fill: 'gokuBlueShadow',
      stroke: 'ink',
      lineWidth: 1.2,
    },
  ],
)

const GOKU_PELVIS = part(
  'gokuPelvisCloth',
  box(-48, -8, 48, 56),
  [
    {
      kind: 'fill',
      d: [
        'M -42 -2',
        'C -40 18 -30 38 -14 52',
        'C -6 40 0 34 8 44',
        'C 24 36 36 18 42 -2',
        'C 26 2 10 8 0 8',
        'C -10 8 -26 4 -42 -2',
        'Z',
      ].join(' '),
      fill: 'gokuGi',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: 'M -16 4 C -10 28 -2 42 12 46 C 4 24 4 12 0 2 Z',
      fill: 'gokuGiShadow',
      alpha: 0.64,
    },
    {
      kind: 'stroke',
      d: 'M -4 6 Q -2 28 0 46',
      stroke: 'gokuGiShadow',
      lineWidth: 1.1,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.72,
    },
  ],
)

const GOKU_UPPER_ARM = part(
  'gokuUpperArm',
  box(-18, -8, 18, 48),
  [
    // Upper arm — broader at shoulder, tapering to elbow, DB proportion
    {
      kind: 'fill',
      d: [
        'M -13 -2',
        'C -18 6 -20 20 -16 34',
        'C -10 44 4 48 12 42',
        'C 20 34 20 14 14 0',
        'C 10 -4 -4 -6 -13 -2',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.4,
    },
    // Bicep shadow plane
    {
      kind: 'fill',
      d: 'M 2 0 C 10 10 12 26 8 38 C 4 42 -2 42 -6 36 C -2 24 -2 10 2 0 Z',
      fill: 'gokuSkinShadow',
      alpha: 0.46,
    },
    // Deltoid cap highlight
    {
      kind: 'fill',
      d: 'M -6 -2 C -2 -6 6 -4 10 0 C 8 6 2 8 -4 6 C -8 4 -8 0 -6 -2 Z',
      fill: 'gokuSkin',
      alpha: 0.6,
    },
  ],
  { x: 0, y: 40 },
)

const GOKU_FOREARM_OPEN = part(
  'gokuForearmOpen',
  box(-18, -6, 22, 68),
  [
    // Forearm — DB tapering: thinner at wrist, wider at elbow
    {
      kind: 'fill',
      d: [
        'M -10 0',
        'C -16 12 -16 28 -12 40',
        'C -6 52 10 56 16 48',
        'C 20 40 20 22 14 6',
        'C 10 -2 -2 -4 -10 0',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Forearm shadow plane
    {
      kind: 'fill',
      d: 'M 2 4 C 10 14 12 28 8 40 C 4 44 0 42 -2 36 C 0 22 0 10 2 4 Z',
      fill: 'gokuSkinShadow',
      alpha: 0.44,
    },
    // Wristband
    {
      kind: 'fill',
      d: 'M -14 32 L 16 32 L 16 40 L -14 40 Z',
      fill: 'gokuBlue',
      stroke: 'ink',
      lineWidth: 1.1,
    },
    // Open hand — larger, splayed fingers, DB style
    {
      kind: 'fill',
      d: [
        'M -12 40',
        'C -18 44 -18 56 -10 62',
        'C -4 66 0 58 2 50',
        'C 3 58 6 66 12 64',
        'C 18 62 20 52 18 44',
        'C 22 50 22 60 16 66',
        'C 10 68 4 66 2 62',
        'C 0 66 -4 68 -10 66',
        'C -16 64 -20 52 -12 40',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Finger separation lines
    {
      kind: 'stroke',
      d: 'M -4 48 L -2 56',
      stroke: 'gokuSkinShadow',
      lineWidth: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.6,
    },
    {
      kind: 'stroke',
      d: 'M 6 48 L 8 56',
      stroke: 'gokuSkinShadow',
      lineWidth: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.6,
    },
  ],
  { x: 4, y: 52 },
)

const GOKU_FOREARM_FIST = part(
  'gokuForearmFist',
  box(-18, -6, 20, 64),
  [
    // Forearm — DB tapering
    {
      kind: 'fill',
      d: [
        'M -12 0',
        'C -18 12 -16 28 -12 40',
        'C -6 50 10 52 14 44',
        'C 18 36 18 20 12 4',
        'C 8 -2 -4 -4 -12 0',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Forearm shadow
    {
      kind: 'fill',
      d: 'M 2 4 C 10 14 12 28 8 38 C 4 42 0 40 -2 34 C 0 22 0 10 2 4 Z',
      fill: 'gokuSkinShadow',
      alpha: 0.44,
    },
    // Wristband
    {
      kind: 'fill',
      d: 'M -14 30 L 14 30 L 14 38 L -14 38 Z',
      fill: 'gokuBlue',
      stroke: 'ink',
      lineWidth: 1.1,
    },
    // Fist — larger, chunkier, more defined knuckle ridge
    {
      kind: 'fill',
      d: [
        'M -10 38',
        'C -16 42 -16 54 -8 60',
        'C 0 64 10 62 16 54',
        'C 18 46 14 38 -10 38',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Knuckle shadow
    {
      kind: 'stroke',
      d: 'M -6 46 C 0 44 6 44 12 46',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.1,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.56,
    },
    // Thumb
    {
      kind: 'fill',
      d: 'M -10 38 C -14 44 -12 52 -8 54 C -4 52 -6 44 -8 40 Z',
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 0.9,
    },
  ],
  { x: 4, y: 48 },
)

const GOKU_THIGH = part(
  'gokuThigh',
  box(-20, -8, 22, 62),
  [
    {
      kind: 'fill',
      d: [
        'M -14 -2',
        'C -22 10 -22 26 -18 40',
        'C -12 54 6 62 18 56',
        'C 24 42 22 18 12 2',
        'C 6 -6 -6 -8 -14 -2',
        'Z',
      ].join(' '),
      fill: 'gokuGi',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: 'M -8 6 C -10 24 -6 40 4 54 C 12 52 16 44 14 30 C 12 18 6 6 -8 6 Z',
      fill: 'gokuGiLight',
      alpha: 0.48,
    },
    {
      kind: 'fill',
      d: 'M 0 2 C 10 16 14 36 10 50 C 2 56 -6 54 -10 46 C -6 28 -4 14 0 2 Z',
      fill: 'gokuGiShadow',
      alpha: 0.62,
    },
  ],
  { x: 2, y: 54 },
)

const GOKU_CALF = part(
  'gokuCalf',
  box(-18, -8, 20, 54),
  [
    {
      kind: 'fill',
      d: [
        'M -12 -2',
        'C -18 10 -18 24 -14 36',
        'C -8 48 6 54 16 46',
        'C 20 34 18 12 10 0',
        'C 4 -6 -6 -6 -12 -2',
        'Z',
      ].join(' '),
      fill: 'gokuGi',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: 'M -6 2 C -8 16 -4 30 4 42 C 10 40 14 34 12 22 C 10 10 6 2 -6 2 Z',
      fill: 'gokuGiLight',
      alpha: 0.46,
    },
    {
      kind: 'fill',
      d: 'M 0 0 C 8 10 12 22 12 34 C 8 42 2 46 -6 42 C -2 26 -2 12 0 0 Z',
      fill: 'gokuGiShadow',
      alpha: 0.58,
    },
  ],
  { x: 4, y: 46 },
)

const GOKU_BOOT = part(
  'gokuBoot',
  box(-18, -12, 30, 28),
  [
    {
      kind: 'fill',
      d: [
        'M -10 -6',
        'L 12 -8',
        'C 22 -8 28 -2 30 8',
        'L 26 18',
        'C 18 24 2 26 -10 22',
        'C -16 18 -18 8 -16 -2',
        'Z',
      ].join(' '),
      fill: 'gokuBlue',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: 'M -12 -12 L 10 -12 L 12 -6 L -10 -6 Z',
      fill: 'gokuBootTrim',
      stroke: 'ink',
      lineWidth: 0.8,
    },
    {
      kind: 'fill',
      d: 'M -4 -6 L 18 -6 L 22 6 L 0 8 Z',
      fill: 'gokuBootAccent',
      alpha: 0.84,
    },
    {
      kind: 'fill',
      d: 'M 8 22 L 20 22 L 16 28 L 0 28 Z',
      fill: 'gokuBlueShadow',
      alpha: 0.92,
    },
  ],
)

const JIREN_AURA_SHELL = part(
  'jirenAuraShell',
  box(-96, -144, 98, 148),
  [
    {
      kind: 'fill',
      d: [
        'M -18 -138',
        'C -58 -130 -88 -92 -92 -42',
        'C -96 8 -88 70 -58 112',
        'C -28 140 18 150 54 132',
        'C 82 116 98 82 98 44',
        'C 98 -6 88 -58 62 -96',
        'C 38 -126 12 -140 -18 -138',
        'Z',
      ].join(' '),
      fill: 'jirenAura',
      alpha: 0.2,
    },
    {
      kind: 'fill',
      d: [
        'M -16 -122',
        'C -46 -114 -70 -84 -72 -40',
        'C -74 0 -66 46 -40 82',
        'C -16 110 18 118 46 106',
        'C 70 92 82 62 82 28',
        'C 82 -16 72 -60 50 -92',
        'C 32 -112 10 -124 -16 -122',
        'Z',
      ].join(' '),
      fill: 'jirenAuraCore',
      alpha: 0.22,
    },
    {
      kind: 'stroke',
      d: [
        'M -14 -126',
        'C -42 -116 -60 -94 -66 -54',
        'C -72 -8 -64 44 -36 86',
        'C -8 124 34 120 62 90',
        'C 80 70 88 40 88 6',
        'C 88 -36 74 -84 44 -112',
      ].join(' '),
      stroke: 'jirenAuraEdge',
      lineWidth: 3.2,
      alpha: 0.48,
      lineCap: 'round',
      lineJoin: 'round',
    },
  ],
)

const JIREN_HEAD = part(
  'jirenHead',
  box(-30, -76, 30, 16),
  [
    // Cranium — tall dome, wider at top, narrowing to a strong jaw
    {
      kind: 'fill',
      d: [
        'M -18 -36',
        'C -18 -58 -12 -72 0 -76',
        'C 12 -72 18 -58 18 -36',
        'C 20 -24 20 -12 14 2',
        'C 8 12 2 14 0 14',
        'C -2 14 -8 12 -14 2',
        'C -20 -12 -20 -24 -18 -36',
        'Z',
      ].join(' '),
      fill: 'jirenSkin',
      stroke: 'ink',
      lineWidth: 2.0,
    },
    // Ear left — prominent, alien-like
    {
      kind: 'fill',
      d: 'M -19 -32 C -26 -36 -30 -28 -28 -20 C -26 -14 -20 -12 -19 -18 Z',
      fill: 'jirenSkin',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Ear inner shadow left
    {
      kind: 'fill',
      d: 'M -20 -28 C -24 -30 -26 -24 -24 -18 C -22 -16 -20 -16 -20 -22 Z',
      fill: 'jirenSkinDeepShadow',
      alpha: 0.3,
    },
    // Ear right
    {
      kind: 'fill',
      d: 'M 19 -32 C 26 -36 30 -28 28 -20 C 26 -14 20 -12 19 -18 Z',
      fill: 'jirenSkin',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Ear inner shadow right
    {
      kind: 'fill',
      d: 'M 20 -28 C 24 -30 26 -24 24 -18 C 22 -16 20 -16 20 -22 Z',
      fill: 'jirenSkinDeepShadow',
      alpha: 0.3,
    },
    // Dome shadow plane — top cranium
    {
      kind: 'fill',
      d: [
        'M -12 -68',
        'C -6 -72 6 -72 12 -68',
        'C 14 -58 12 -48 8 -42',
        'C 2 -44 -2 -44 -8 -42',
        'C -12 -48 -14 -58 -12 -68',
        'Z',
      ].join(' '),
      fill: 'jirenSkinShadow',
      alpha: 0.24,
    },
    // Mid-face shadow plane (cheek-to-jaw)
    {
      kind: 'fill',
      d: 'M -16 -22 C -12 -14 -8 -8 0 -6 C 8 -8 12 -14 16 -22 C 12 -4 6 4 0 6 C -6 4 -12 -4 -16 -22 Z',
      fill: 'jirenSkinShadow',
      alpha: 0.44,
    },
    // Brow shelf left — heavy, oppressive (outer contour weight)
    {
      kind: 'stroke',
      d: 'M -16 -30 C -12 -36 -6 -38 -1 -36',
      stroke: 'ink',
      lineWidth: 3.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Brow shelf right
    {
      kind: 'stroke',
      d: 'M 16 -30 C 12 -36 6 -38 1 -36',
      stroke: 'ink',
      lineWidth: 3.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Brow crease — deep vertical furrow
    {
      kind: 'stroke',
      d: 'M -2 -36 L 0 -32 L 2 -36',
      stroke: 'ink',
      lineWidth: 1.6,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Eyes — small, wide-set, intense red/orange
    {
      kind: 'fill',
      d: 'M -12 -26 C -9 -30 -4 -30 -2 -27 C -3 -22 -6 -20 -10 -20 C -13 -21 -13 -23 -12 -26 Z',
      fill: 'jirenEye',
    },
    {
      kind: 'fill',
      d: 'M 12 -26 C 9 -30 4 -30 2 -27 C 3 -22 6 -20 10 -20 C 13 -21 13 -23 12 -26 Z',
      fill: 'jirenEye',
    },
    // Pupil highlights
    {
      kind: 'fill',
      d: 'M -8 -25 A 1.1 1.1 0 1 0 -8 -23 A 1.1 1.1 0 1 0 -8 -25 Z',
      fill: 'white',
      alpha: 0.78,
    },
    {
      kind: 'fill',
      d: 'M 8 -25 A 1.1 1.1 0 1 0 8 -23 A 1.1 1.1 0 1 0 8 -25 Z',
      fill: 'white',
      alpha: 0.78,
    },
    // Upper eyelid lines (interior form)
    {
      kind: 'stroke',
      d: 'M -14 -25 C -10 -29 -5 -29 -2 -27',
      stroke: 'ink',
      lineWidth: 1.8,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 14 -25 C 10 -29 5 -29 2 -27',
      stroke: 'ink',
      lineWidth: 1.8,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Lower eyelid lines (detail weight)
    {
      kind: 'stroke',
      d: 'M -12 -21 C -9 -19 -5 -19 -3 -21',
      stroke: 'ink',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 12 -21 C 9 -19 5 -19 3 -21',
      stroke: 'ink',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Nose — short, strong
    {
      kind: 'stroke',
      d: 'M 0 -18 C 1 -12 1 -4 -1 0',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.3,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Nose tip
    {
      kind: 'stroke',
      d: 'M -2 0 C 0 1 2 0',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.1,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Mouth — thin, stern, downturned
    {
      kind: 'stroke',
      d: 'M -5 6 C -2 5 2 5 5 6',
      stroke: 'inkSoft',
      lineWidth: 1.8,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Chin shadow
    {
      kind: 'stroke',
      d: 'M -4 10 C 0 12 4 10',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.0,
      alpha: 0.38,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Dome ridge lines (cranium detail)
    {
      kind: 'stroke',
      d: 'M -6 -64 C -4 -56 -4 -48 -6 -42',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.0,
      alpha: 0.22,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 0 -68 C 2 -58 2 -48 0 -44',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.0,
      alpha: 0.22,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 6 -64 C 4 -56 4 -48 6 -42',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.0,
      alpha: 0.22,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Jaw line definition
    {
      kind: 'stroke',
      d: 'M -18 -16 C -16 -4 -12 6 -8 10',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.2,
      alpha: 0.4,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 18 -16 C 16 -4 12 6 8 10',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.2,
      alpha: 0.4,
      lineCap: 'round',
      lineJoin: 'round',
    },
  ],
)

const JIREN_NECK = part(
  'jirenNeck',
  box(-18, -8, 18, 20),
  [
    // Thicker neck — Jiren is a tank
    {
      kind: 'fill',
      d: 'M -12 -8 C -14 0 -14 10 -10 20 L 10 20 C 14 10 14 0 12 -8 C 6 -4 -6 -4 -12 -8 Z',
      fill: 'jirenSkin',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Neck shadow
    {
      kind: 'fill',
      d: 'M -10 2 L -2 20 L 2 20 L 0 0 Z',
      fill: 'jirenSkinShadow',
      alpha: 0.42,
    },
    // Trapezius hint
    {
      kind: 'stroke',
      d: 'M -12 8 C -14 12 -16 16 -16 20',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 0.9,
      alpha: 0.36,
      lineCap: 'round',
      lineJoin: 'round',
    },
    {
      kind: 'stroke',
      d: 'M 12 8 C 14 12 16 16 16 20',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 0.9,
      alpha: 0.36,
      lineCap: 'round',
      lineJoin: 'round',
    },
  ],
)

const JIREN_UPPER_CHEST = part(
  'jirenUpperChest',
  box(-92, -68, 92, 32),
  [
    // Massive pec/shoulder shell — broader, denser than Goku
    {
      kind: 'fill',
      d: [
        'M -82 -36',
        'C -92 -14 -86 8 -66 22',
        'C -48 30 -22 22 -8 4',
        'L 0 -12',
        'L 8 4',
        'C 22 22 48 30 66 22',
        'C 86 8 92 -14 82 -36',
        'C 64 -58 32 -66 0 -64',
        'C -32 -66 -64 -58 -82 -36',
        'Z',
      ].join(' '),
      fill: 'jirenSkin',
      stroke: 'ink',
      lineWidth: 2.0,
    },
    // Pec shadow plane — clean anime two-tone
    {
      kind: 'fill',
      d: 'M -64 -20 C -46 -6 -22 -2 0 -2 C 22 -2 46 -6 64 -20 C 50 8 22 16 0 14 C -22 16 -50 8 -64 -20 Z',
      fill: 'jirenSkinShadow',
      alpha: 0.42,
    },
    // Pec center line
    {
      kind: 'stroke',
      d: 'M -26 10 Q 0 20 26 10',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.4,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Left pec definition
    {
      kind: 'stroke',
      d: 'M -56 -12 Q -34 6 -10 4',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.62,
    },
    // Right pec definition
    {
      kind: 'stroke',
      d: 'M 56 -12 Q 34 6 10 4',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.62,
    },
    // Shoulder cap definition left
    {
      kind: 'stroke',
      d: 'M -76 -28 C -72 -40 -60 -50 -48 -52',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.0,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.48,
    },
    // Shoulder cap definition right
    {
      kind: 'stroke',
      d: 'M 76 -28 C 72 -40 60 -50 48 -52',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.0,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.48,
    },
  ],
)

const JIREN_CORE_TORSO = part(
  'jirenCoreTorso',
  box(-42, -18, 42, 94),
  [
    // Core torso — wider, denser, more imposing
    {
      kind: 'fill',
      d: [
        'M -34 -10',
        'C -40 12 -40 36 -34 64',
        'C -26 84 -10 92 0 92',
        'C 10 92 26 84 34 64',
        'C 40 36 40 12 34 -10',
        'C 22 -18 -22 -18 -34 -10',
        'Z',
      ].join(' '),
      fill: 'jirenSkin',
      stroke: 'ink',
      lineWidth: 1.8,
    },
    // Left oblique shadow plane
    {
      kind: 'fill',
      d: 'M -22 0 C -16 20 -14 40 -14 78 C -22 72 -28 60 -28 42 C -28 24 -26 10 -22 0 Z',
      fill: 'jirenSkinShadow',
      alpha: 0.48,
    },
    // Right oblique shadow plane
    {
      kind: 'fill',
      d: 'M 22 0 C 16 20 14 40 14 78 C 22 72 28 60 28 42 C 28 24 26 10 22 0 Z',
      fill: 'jirenSkinShadow',
      alpha: 0.48,
    },
    // Center line (linea alba)
    {
      kind: 'stroke',
      d: 'M 0 -2 L 0 80',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.4,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Ab row 1 — top
    {
      kind: 'stroke',
      d: 'M -20 14 Q 0 22 20 14',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Ab row 2
    {
      kind: 'stroke',
      d: 'M -18 34 Q 0 44 18 34',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Ab row 3
    {
      kind: 'stroke',
      d: 'M -16 52 Q 0 62 16 52',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.2,
      lineCap: 'round',
      lineJoin: 'round',
    },
    // Ab row 4 (lower)
    {
      kind: 'stroke',
      d: 'M -12 68 Q 0 76 12 68',
      stroke: 'jirenSkinDeepShadow',
      lineWidth: 1.0,
      lineCap: 'round',
      lineJoin: 'round',
    },
  ],
)

const JIREN_WAIST_CLOTH = part(
  'jirenWaistCloth',
  box(-36, -8, 36, 28),
  [
    {
      kind: 'fill',
      d: 'M -32 -2 L -22 8 L -12 12 L -2 8 L 0 10 L 6 8 L 18 12 L 30 2 L 28 10 L 16 22 L 0 26 L -18 22 L -30 10 Z',
      fill: 'jirenSuitRed',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    {
      kind: 'fill',
      d: 'M -18 2 L -10 10 L 0 14 L 10 10 L 18 2 L 14 14 L 0 22 L -14 14 Z',
      fill: 'jirenSuitRedShadow',
      alpha: 0.64,
    },
  ],
)

const JIREN_UPPER_ARM = part(
  'jirenUpperArm',
  box(-34, -20, 34, 62),
  [
    // Massive upper arm — much bigger than Goku's, Pride Trooper red
    {
      kind: 'fill',
      d: 'M -26 -10 C -36 10 -34 34 -24 50 C -10 62 16 64 28 50 C 34 32 32 10 22 -8 C 12 -18 -14 -20 -26 -10 Z',
      fill: 'jirenSuitRed',
      stroke: 'ink',
      lineWidth: 1.6,
    },
    // Suit shadow plane
    {
      kind: 'fill',
      d: 'M -14 0 C -4 14 8 32 10 44 C 6 54 -6 56 -16 50 C -14 32 -12 12 -14 0 Z',
      fill: 'jirenSuitRedShadow',
      alpha: 0.56,
    },
    // Black sleeve transition — lower arm
    {
      kind: 'fill',
      d: 'M -16 36 C -10 24 2 22 14 24 C 22 30 24 42 22 52 C 12 62 -10 62 -16 52 Z',
      fill: 'jirenSuitBlack',
      alpha: 0.88,
    },
    // Deltoid mass highlight
    {
      kind: 'fill',
      d: 'M -10 -6 C 0 -12 14 -10 22 -2 C 18 8 8 12 -4 8 C -12 4 -14 -2 -10 -6 Z',
      fill: 'jirenSuitRed',
      alpha: 0.4,
    },
  ],
  { x: 0, y: 50 },
)

const JIREN_FOREARM_OPEN = part(
  'jirenForearmOpen',
  box(-20, -6, 24, 70),
  [
    // Forearm — thick, suited
    {
      kind: 'fill',
      d: 'M -14 0 C -20 12 -20 30 -14 42 C -6 54 14 56 20 48 C 24 36 22 16 14 2 C 8 -4 -6 -4 -14 0 Z',
      fill: 'jirenSuitBlack',
      stroke: 'ink',
      lineWidth: 1.4,
    },
    // Suit highlight
    {
      kind: 'fill',
      d: 'M -8 4 C -4 18 0 32 2 42 C 6 40 8 32 6 18 C 4 8 0 2 -8 4 Z',
      fill: 'jirenSuitBlackLight',
      alpha: 0.38,
    },
    // Glove — larger, open palm with splayed fingers
    {
      kind: 'fill',
      d: [
        'M -16 40',
        'C -20 46 -18 60 -6 66',
        'C 2 68 6 60 8 52',
        'C 10 60 14 68 20 66',
        'C 24 62 24 50 18 42',
        'C 12 38 -4 38 -16 40',
        'Z',
      ].join(' '),
      fill: 'jirenGlove',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Glove shadow
    {
      kind: 'fill',
      d: 'M -12 44 C -8 54 2 60 12 58 C 16 52 16 46 12 42 C 4 40 -4 40 -12 44 Z',
      fill: 'jirenGloveShadow',
      alpha: 0.42,
    },
    // Finger lines
    {
      kind: 'stroke',
      d: 'M 0 50 L 2 58',
      stroke: 'jirenGloveShadow',
      lineWidth: 0.8,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.5,
    },
    {
      kind: 'stroke',
      d: 'M 8 48 L 10 56',
      stroke: 'jirenGloveShadow',
      lineWidth: 0.8,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.5,
    },
  ],
  { x: 4, y: 52 },
)

const JIREN_FOREARM_FIST = part(
  'jirenForearmFist',
  box(-20, -6, 22, 64),
  [
    // Forearm
    {
      kind: 'fill',
      d: 'M -14 0 C -20 12 -20 30 -14 40 C -6 50 12 52 18 44 C 22 34 22 16 14 2 C 8 -4 -6 -4 -14 0 Z',
      fill: 'jirenSuitBlack',
      stroke: 'ink',
      lineWidth: 1.4,
    },
    // Suit highlight
    {
      kind: 'fill',
      d: 'M -8 4 C -4 18 0 30 2 40 C 6 38 8 30 6 18 C 4 8 0 2 -8 4 Z',
      fill: 'jirenSuitBlackLight',
      alpha: 0.38,
    },
    // Fist — chunky, powerful, gloved
    {
      kind: 'fill',
      d: 'M -12 38 C -18 42 -16 56 -4 62 C 8 66 20 60 22 48 C 20 40 12 36 -12 38 Z',
      fill: 'jirenGlove',
      stroke: 'ink',
      lineWidth: 1.2,
    },
    // Knuckle ridge shadow
    {
      kind: 'fill',
      d: 'M -8 42 C 0 48 10 50 18 46 C 16 40 8 38 -8 42 Z',
      fill: 'jirenGloveShadow',
      alpha: 0.42,
    },
    // Thumb
    {
      kind: 'fill',
      d: 'M -12 38 C -16 46 -14 56 -8 58 C -4 56 -6 46 -10 40 Z',
      fill: 'jirenGlove',
      stroke: 'ink',
      lineWidth: 0.9,
    },
  ],
  { x: 4, y: 48 },
)

const JIREN_THIGH = part(
  'jirenThigh',
  box(-28, -10, 30, 76),
  [
    // Thigh — wider, more powerful than Goku's
    {
      kind: 'fill',
      d: 'M -22 -4 C -30 16 -30 38 -22 60 C -10 74 14 76 26 64 C 32 46 30 16 20 -2 C 12 -10 -10 -10 -22 -4 Z',
      fill: 'jirenSuitBlack',
      stroke: 'ink',
      lineWidth: 1.6,
    },
    // Quad highlight
    {
      kind: 'fill',
      d: 'M -12 6 C -16 26 -14 46 -4 64 C 12 62 18 50 18 34 C 16 18 8 6 -12 6 Z',
      fill: 'jirenSuitBlackLight',
      alpha: 0.44,
    },
  ],
  { x: 2, y: 68 },
)

const JIREN_CALF = part(
  'jirenCalf',
  box(-22, -8, 24, 68),
  [
    // Calf — heavier
    {
      kind: 'fill',
      d: 'M -16 -2 C -22 14 -22 34 -14 52 C -6 64 14 68 22 58 C 26 42 24 16 14 0 C 8 -6 -8 -8 -16 -2 Z',
      fill: 'jirenSuitBlack',
      stroke: 'ink',
      lineWidth: 1.6,
    },
    // Shin highlight
    {
      kind: 'fill',
      d: 'M -10 2 C -12 22 -6 42 8 56 C 16 54 18 40 16 24 C 14 10 8 2 -10 2 Z',
      fill: 'jirenSuitBlackLight',
      alpha: 0.38,
    },
  ],
  { x: 2, y: 58 },
)

const JIREN_BOOT = part(
  'jirenBoot',
  box(-18, -12, 30, 32),
  [
    // Boot — heavier contour
    {
      kind: 'fill',
      d: 'M -12 -10 L 12 -10 C 24 -10 30 -2 30 10 L 26 22 C 16 30 0 32 -14 26 C -18 16 -18 2 -12 -10 Z',
      fill: 'jirenGlove',
      stroke: 'ink',
      lineWidth: 1.6,
    },
    // Boot shadow
    {
      kind: 'fill',
      d: 'M -6 -10 L 20 -10 L 22 10 C 16 16 8 18 -6 16 Z',
      fill: 'jirenGloveShadow',
      alpha: 0.34,
    },
    // Sole accent
    {
      kind: 'fill',
      d: 'M 8 26 L 22 26 L 18 32 L 2 32 Z',
      fill: 'white',
      alpha: 0.9,
    },
  ],
)

// --- Beam-release forearm variants ---

const GOKU_FOREARM_BEAM = part(
  'gokuForearmBeam',
  box(-20, -6, 22, 72),
  [
    // Forearm — tensed, beam-firing
    {
      kind: 'fill',
      d: [
        'M -12 0',
        'C -18 12 -18 28 -14 42',
        'C -8 54 10 56 16 48',
        'C 20 40 20 22 14 6',
        'C 10 -2 -4 -4 -12 0',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.4,
    },
    // Wristband
    {
      kind: 'fill',
      d: 'M -16 34 L 16 34 L 16 42 L -16 42 Z',
      fill: 'gokuBlue',
      stroke: 'ink',
      lineWidth: 1.1,
    },
    // Cupped Kamehameha hand — overlapping, energy-gathering pose
    {
      kind: 'fill',
      d: [
        'M -14 42',
        'C -20 46 -20 58 -12 64',
        'C -6 68 -2 64 0 56',
        'C 2 64 6 68 12 64',
        'C 20 58 20 46 14 42',
        'C 8 44 -6 44 -14 42',
        'Z',
      ].join(' '),
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 1.4,
    },
    // Palm cup shadow (energy focus)
    {
      kind: 'fill',
      d: 'M -8 48 C -4 54 4 54 8 48 C 6 52 2 56 -2 56 C -6 56 -8 52 -8 48 Z',
      fill: 'gokuSkinShadow',
      alpha: 0.62,
    },
    // Thumb
    {
      kind: 'fill',
      d: 'M -14 42 C -18 48 -16 56 -12 58 C -8 56 -10 48 -12 44 Z',
      fill: 'gokuSkin',
      stroke: 'ink',
      lineWidth: 0.9,
    },
    // Finger tension lines
    {
      kind: 'stroke',
      d: 'M -4 50 L -2 58',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.0,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.56,
    },
    {
      kind: 'stroke',
      d: 'M 6 50 L 8 58',
      stroke: 'gokuSkinShadow',
      lineWidth: 1.0,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.56,
    },
  ],
  { x: 2, y: 54 },
)

const JIREN_FOREARM_BEAM = part(
  'jirenForearmBeam',
  box(-22, -6, 26, 68),
  [
    // Forearm — extended, power blast
    {
      kind: 'fill',
      d: 'M -16 0 C -22 12 -22 30 -16 44 C -8 56 14 58 20 50 C 24 38 24 16 16 2 C 10 -4 -8 -4 -16 0 Z',
      fill: 'jirenSuitBlack',
      stroke: 'ink',
      lineWidth: 1.6,
    },
    // Blast-firing open palm — larger, fingers splayed
    {
      kind: 'fill',
      d: [
        'M -18 42',
        'C -22 48 -20 62 -8 68',
        'C 2 70 8 62 10 54',
        'C 12 62 16 70 22 68',
        'C 26 62 26 50 20 44',
        'C 14 40 -4 40 -18 42',
        'Z',
      ].join(' '),
      fill: 'jirenGlove',
      stroke: 'ink',
      lineWidth: 1.4,
    },
    // Palm glow center
    {
      kind: 'fill',
      d: 'M -8 48 C -4 54 6 56 12 50 C 10 46 2 44 -8 48 Z',
      fill: 'jirenGloveShadow',
      alpha: 0.38,
    },
    // Finger lines
    {
      kind: 'stroke',
      d: 'M 2 52 L 4 60',
      stroke: 'jirenGloveShadow',
      lineWidth: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.48,
    },
    {
      kind: 'stroke',
      d: 'M 10 50 L 14 58',
      stroke: 'jirenGloveShadow',
      lineWidth: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      alpha: 0.48,
    },
  ],
  { x: 4, y: 54 },
)

export const GOKU_PARTS = {
  auraShell: GOKU_AURA_SHELL,
  backHair: GOKU_BACK_HAIR,
  frontBangs: GOKU_FRONT_BANGS,
  head: GOKU_HEAD,
  neck: GOKU_NECK,
  chest: GOKU_CHEST,
  undershirt: GOKU_UNDERSHIRT,
  belt: GOKU_BELT,
  pelvis: GOKU_PELVIS,
  upperArm: GOKU_UPPER_ARM,
  forearmOpen: GOKU_FOREARM_OPEN,
  forearmFist: GOKU_FOREARM_FIST,
  forearmBeam: GOKU_FOREARM_BEAM,
  thigh: GOKU_THIGH,
  calf: GOKU_CALF,
  boot: GOKU_BOOT,
} as const

export const JIREN_PARTS = {
  auraShell: JIREN_AURA_SHELL,
  head: JIREN_HEAD,
  neck: JIREN_NECK,
  upperChest: JIREN_UPPER_CHEST,
  coreTorso: JIREN_CORE_TORSO,
  waistCloth: JIREN_WAIST_CLOTH,
  upperArm: JIREN_UPPER_ARM,
  forearmOpen: JIREN_FOREARM_OPEN,
  forearmFist: JIREN_FOREARM_FIST,
  forearmBeam: JIREN_FOREARM_BEAM,
  thigh: JIREN_THIGH,
  calf: JIREN_CALF,
  boot: JIREN_BOOT,
} as const
