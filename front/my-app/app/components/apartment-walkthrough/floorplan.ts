/**
 * Tlocrt stana Tip 1 preveden u metre.
 *
 * Koordinatni sustav: X raste prema istoku (desno na tlocrtu), Z raste prema
 * jugu (dolje na tlocrtu), Y je visina. Ishodište je gornji lijevi vanjski kut.
 * Mjere su izvedene iz kataloškog tlocrta (bez kota) i skalirane na 93,71 m²,
 * pa su orijentacijske.
 */

export const WALL_HEIGHT = 2.65;
export const EYE_HEIGHT = 1.6;
export const PLAYER_RADIUS = 0.2;

const EXTERIOR = 0.25;
const INTERIOR = 0.12;

export type Rect = { x1: number; z1: number; x2: number; z2: number };
export type Vec3 = [number, number, number];

const rect = (x1: number, z1: number, x2: number, z2: number): Rect => ({
  x1,
  z1,
  x2,
  z2,
});

/** Unutarnji obris stana (bez terase) – koristi se za pod. */
export const floorPolygon: Array<[number, number]> = [
  [0, 0],
  [8.3, 0],
  [8.3, 3.4],
  [6.85, 3.4],
  [6.85, 9],
  [5.2, 9],
  [5.2, 18.9],
  [1.5, 18.9],
  [1.5, 9],
  [0, 9],
];

export const apartmentBounds = rect(-0.25, -0.25, 8.55, 19.15);

/* -------------------------------------------------------------------------- */
/*                                   Zidovi                                   */
/* -------------------------------------------------------------------------- */

type OpeningKind = "door" | "window" | "glass" | "passage";

type Opening = {
  from: number;
  to: number;
  bottom: number;
  top: number;
  kind: OpeningKind;
};

/** `axis: "x"` – zid se proteže po X osi na z = at; `"z"` – po Z osi na x = at. */
type WallSpec = {
  axis: "x" | "z";
  at: number;
  from: number;
  to: number;
  thickness: number;
  openings?: Opening[];
};

const door = (from: number, width = 0.9): Opening => ({
  from,
  to: from + width,
  bottom: 0,
  top: 2.1,
  kind: "door",
});

const windowOpening = (
  from: number,
  to: number,
  bottom = 0.9,
  top = 2.25,
): Opening => ({ from, to, bottom, top, kind: "window" });

const walls: WallSpec[] = [
  // Vanjski zidovi
  {
    axis: "x",
    at: 0,
    from: 0,
    to: 8.3,
    thickness: EXTERIOR,
    openings: [
      windowOpening(4.3, 4.85, 1.55, 2.2),
      windowOpening(6.05, 7.15, 1.3, 2.3),
    ],
  },
  { axis: "z", at: 8.3, from: 0, to: 3.4, thickness: EXTERIOR },
  { axis: "x", at: 3.4, from: 6.85, to: 8.3, thickness: EXTERIOR },
  {
    axis: "z",
    at: 6.85,
    from: 3.4,
    to: 9,
    thickness: EXTERIOR,
    openings: [{ from: 6.1, to: 7.1, bottom: 0, top: 2.15, kind: "door" }],
  },
  { axis: "x", at: 9, from: 5.2, to: 6.85, thickness: EXTERIOR },
  { axis: "z", at: 5.2, from: 9, to: 18.9, thickness: EXTERIOR },
  {
    axis: "x",
    at: 18.9,
    from: 1.5,
    to: 5.2,
    thickness: EXTERIOR,
    openings: [windowOpening(2.6, 4.3)],
  },
  {
    axis: "z",
    at: 1.5,
    from: 12.8,
    to: 18.9,
    thickness: EXTERIOR,
    openings: [windowOpening(14.95, 16.3)],
  },
  // Staklena stijena dnevnog boravka prema terasi (srednje krilo je otvoreno)
  {
    axis: "z",
    at: 1.5,
    from: 9,
    to: 12.8,
    thickness: EXTERIOR,
    openings: [
      { from: 9.15, to: 10.85, bottom: 0, top: 2.35, kind: "glass" },
      { from: 10.85, to: 11.8, bottom: 0, top: 2.35, kind: "passage" },
      { from: 11.8, to: 12.65, bottom: 0, top: 2.35, kind: "glass" },
    ],
  },
  {
    axis: "x",
    at: 9,
    from: 0,
    to: 1.5,
    thickness: EXTERIOR,
    openings: [windowOpening(0.3, 1.2)],
  },
  {
    axis: "z",
    at: 0,
    from: 0,
    to: 9,
    thickness: EXTERIOR,
    openings: [
      windowOpening(1.0, 2.6),
      windowOpening(4.55, 5.6, 1.1, 2.1),
      windowOpening(6.8, 8.5, 0.45, 2.35),
    ],
  },

  // Unutarnji zidovi
  { axis: "z", at: 3.1, from: 0, to: 3.7, thickness: INTERIOR, openings: [door(2.6)] },
  { axis: "x", at: 3.7, from: 0, to: 3.1, thickness: INTERIOR },
  { axis: "x", at: 2.2, from: 3.1, to: 5.4, thickness: INTERIOR, openings: [door(3.8)] },
  { axis: "z", at: 5.4, from: 0, to: 3.4, thickness: INTERIOR, openings: [door(2.4)] },
  { axis: "x", at: 3.4, from: 5.2, to: 6.85, thickness: INTERIOR },
  { axis: "z", at: 5.2, from: 3.4, to: 5.3, thickness: INTERIOR, openings: [door(3.75)] },
  { axis: "x", at: 5.3, from: 5.2, to: 6.85, thickness: INTERIOR },
  { axis: "x", at: 7.3, from: 5.2, to: 6.85, thickness: INTERIOR },
  { axis: "z", at: 5.2, from: 7.3, to: 9, thickness: INTERIOR, openings: [door(7.6, 0.8)] },
  { axis: "x", at: 12.8, from: 1.5, to: 4.1, thickness: INTERIOR },
  { axis: "z", at: 4.1, from: 12.8, to: 14.4, thickness: INTERIOR, openings: [door(13.2, 0.8)] },
  {
    axis: "x",
    at: 14.4,
    from: 1.5,
    to: 5.2,
    thickness: INTERIOR,
    openings: [{ from: 4.17, to: 5.06, bottom: 0, top: 2.1, kind: "door" }],
  },
];

export type PieceKind = "wall" | "skirting" | "glass" | "frame" | "sill" | "casing";

export type WallPiece = {
  position: Vec3;
  size: Vec3;
  kind: PieceKind;
  collide: boolean;
};

/** Razlaže zid na pune dijelove, parapete, nadvoje, stakla i okvire. */
function buildWallPieces(spec: WallSpec): WallPiece[] {
  const pieces: WallPiece[] = [];
  const t = spec.thickness;

  const add = (
    u1: number,
    u2: number,
    y1: number,
    y2: number,
    depth: number,
    kind: PieceKind,
    collide: boolean,
  ) => {
    const position: Vec3 =
      spec.axis === "x"
        ? [(u1 + u2) / 2, (y1 + y2) / 2, spec.at]
        : [spec.at, (y1 + y2) / 2, (u1 + u2) / 2];
    const size: Vec3 =
      spec.axis === "x" ? [u2 - u1, y2 - y1, depth] : [depth, y2 - y1, u2 - u1];
    pieces.push({ position, size, kind, collide });
  };

  const solid = (a: number, b: number) => {
    add(a, b, 0, WALL_HEIGHT, t, "wall", true);
    add(a, b, 0, 0.08, t + 0.024, "skirting", false);
  };

  let cursor = spec.from - t / 2;
  const end = spec.to + t / 2;
  const openings = [...(spec.openings ?? [])].sort((a, b) => a.from - b.from);

  for (const opening of openings) {
    if (opening.from > cursor) solid(cursor, opening.from);
    const { from, to, bottom, top, kind } = opening;

    if (bottom > 0) {
      add(from, to, 0, bottom, t, "wall", true);
      add(from - 0.04, to + 0.04, bottom - 0.02, bottom + 0.02, t + 0.08, "sill", false);
    }
    if (top < WALL_HEIGHT) add(from, to, top, WALL_HEIGHT, t, "wall", false);

    if (kind === "door") {
      add(from - 0.07, from, 0, top + 0.07, t + 0.04, "casing", false);
      add(to, to + 0.07, 0, top + 0.07, t + 0.04, "casing", false);
      add(from - 0.07, to + 0.07, top, top + 0.07, t + 0.04, "casing", false);
    } else {
      const frame = 0.05;
      add(from, from + frame, bottom, top, 0.09, "frame", false);
      add(to - frame, to, bottom, top, 0.09, "frame", false);
      add(from, to, top - frame, top, 0.09, "frame", false);
      if (kind !== "passage") {
        add(from, to, bottom, bottom + frame, 0.09, "frame", false);
        add(
          from + frame,
          to - frame,
          bottom + frame,
          top - frame,
          0.02,
          "glass",
          kind === "glass",
        );
      }
      if (kind === "glass" && to - from > 1.2) {
        const middle = (from + to) / 2;
        add(middle - 0.025, middle + 0.025, bottom, top, 0.09, "frame", false);
      }
    }
    cursor = to;
  }

  if (cursor < end) solid(cursor, end);
  return pieces;
}

export const wallPieces: WallPiece[] = walls.flatMap(buildWallPieces);

/* -------------------------------------------------------------------------- */
/*                                 Prostorije                                 */
/* -------------------------------------------------------------------------- */

export type RoomSpawn = { x: number; z: number; yaw: number };

export type Room = {
  id: string;
  label: string;
  rects: Rect[];
  spawn?: RoomSpawn;
  /** Prikazuje se kao brzi odabir prostorije. */
  featured?: boolean;
};

/** Smjer gledanja: yaw 0 = sjever (−Z), π/2 = zapad (−X), π = jug, −π/2 = istok. */
export const rooms: Room[] = [
  {
    id: "ulaz",
    label: "Ulaz",
    rects: [rect(5.2, 5.3, 6.85, 7.3)],
    spawn: { x: 6.35, z: 6.55, yaw: Math.PI / 2 },
    featured: true,
  },
  {
    id: "dnevni",
    label: "Dnevni boravak",
    rects: [rect(1.5, 9, 5.2, 12.8)],
    spawn: { x: 4.6, z: 9.35, yaw: 2.36 },
    featured: true,
  },
  {
    id: "kuhinja",
    label: "Kuhinja i blagovaonica",
    rects: [rect(0, 3.7, 3.1, 9)],
    spawn: { x: 2.6, z: 6.3, yaw: 0.64 },
    featured: true,
  },
  {
    id: "spavaca-1",
    label: "Spavaća soba 1",
    rects: [rect(5.4, 0, 8.3, 3.4)],
    spawn: { x: 6.0, z: 2.95, yaw: -0.42 },
    featured: true,
  },
  {
    id: "spavaca-2",
    label: "Spavaća soba 2",
    rects: [rect(0, 0, 3.1, 3.7)],
    spawn: { x: 2.55, z: 2.95, yaw: 0.53 },
    featured: true,
  },
  {
    id: "spavaca-3",
    label: "Spavaća soba 3",
    rects: [rect(1.5, 14.4, 5.2, 18.9)],
    spawn: { x: 4.6, z: 15.0, yaw: 2.5 },
    featured: true,
  },
  {
    id: "kupaonica-1",
    label: "Kupaonica 1",
    rects: [rect(3.1, 0, 5.4, 2.2)],
    spawn: { x: 4.2, z: 1.7, yaw: -0.35 },
    featured: true,
  },
  {
    id: "kupaonica-2",
    label: "Kupaonica 2",
    rects: [rect(1.5, 12.8, 4.1, 14.4)],
    spawn: { x: 3.82, z: 13.6, yaw: 1.85 },
    featured: true,
  },
  {
    id: "terasa",
    label: "Terasa",
    rects: [rect(0, 9, 1.5, 13.4)],
    spawn: { x: 0.75, z: 9.8, yaw: Math.PI },
    featured: true,
  },
  {
    id: "wc",
    label: "WC",
    rects: [rect(5.2, 7.3, 6.85, 9)],
    spawn: { x: 5.5, z: 8.0, yaw: -Math.PI / 2 },
  },
  {
    id: "veseraj",
    label: "Vešeraj",
    rects: [rect(5.2, 3.4, 6.85, 5.3)],
    spawn: { x: 5.5, z: 4.2, yaw: -Math.PI / 2 },
  },
  {
    id: "hodnik",
    label: "Hodnik",
    rects: [rect(3.1, 2.2, 5.4, 9), rect(4.1, 12.8, 5.2, 14.4)],
  },
];

export const startRoom = rooms[0];

export function findRoom(x: number, z: number) {
  return rooms.find((room) =>
    room.rects.some((r) => x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2),
  );
}

/** Mokri čvorovi i ulaz dobivaju keramiku umjesto parketa. */
export const tiledFloors: Rect[] = [
  rect(3.1, 0, 5.4, 2.2),
  rect(5.2, 3.4, 6.85, 5.3),
  rect(5.2, 5.3, 6.85, 7.3),
  rect(5.2, 7.3, 6.85, 9),
  rect(1.5, 12.8, 4.1, 14.4),
];

export const terrace = rect(0, 9, 1.5, 13.4);

/* -------------------------------------------------------------------------- */
/*                                  Namještaj                                 */
/* -------------------------------------------------------------------------- */

/** Smjer u koji je okrenuto lice komada namještaja. */
export type Facing = "n" | "s" | "e" | "w";

export type FurnitureType =
  | "bed"
  | "nightstand"
  | "wardrobe"
  | "sofa"
  | "coffeeTable"
  | "sideTable"
  | "rug"
  | "tvConsole"
  | "slatPanel"
  | "kitchenRun"
  | "upperCabinets"
  | "tallUnit"
  | "diningTable"
  | "chair"
  | "pendant"
  | "shower"
  | "toilet"
  | "vanity"
  | "bathtub"
  | "smallSink"
  | "towelRail"
  | "washerStack"
  | "utility"
  | "shoeCabinet"
  | "coatRack"
  | "plant"
  | "floorLamp"
  | "desk"
  | "deskChair"
  | "art"
  | "curtain"
  | "bistroTable"
  | "bistroChair"
  | "planter"
  | "doormat";

export type FurnitureItem = {
  type: FurnitureType;
  x: number;
  z: number;
  /** Širina (lokalna X os – uz lice). */
  w: number;
  /** Dubina (lokalna Z os – od zida prema licu). */
  d: number;
  h?: number;
  y?: number;
  facing?: Facing;
  variant?: string;
};

const NON_COLLIDING = new Set<FurnitureType>([
  "rug",
  "pendant",
  "art",
  "slatPanel",
  "curtain",
  "doormat",
  "upperCabinets",
  "towelRail",
]);

export const facingAngle: Record<Facing, number> = {
  s: 0,
  e: Math.PI / 2,
  n: Math.PI,
  w: -Math.PI / 2,
};

export const furniture: FurnitureItem[] = [
  /* Spavaća soba 2 */
  { type: "rug", x: 1.45, z: 1.75, w: 2.3, d: 1.7, variant: "bedroom" },
  { type: "slatPanel", x: 1.45, z: 0.145, w: 2.7, d: 0.04, h: 1.35, facing: "s" },
  { type: "bed", x: 1.45, z: 1.19, w: 1.6, d: 2.05, facing: "s", variant: "sand" },
  { type: "nightstand", x: 0.4, z: 0.38, w: 0.45, d: 0.4, facing: "s" },
  { type: "nightstand", x: 2.5, z: 0.38, w: 0.45, d: 0.4, facing: "s" },
  { type: "wardrobe", x: 1.26, z: 3.34, w: 2.2, d: 0.6, facing: "n" },
  { type: "curtain", x: 0.17, z: 1.8, w: 1.9, d: 0.06, facing: "e" },

  /* Kupaonica 1 */
  { type: "shower", x: 3.61, z: 0.58, w: 0.9, d: 0.9, facing: "s" },
  { type: "toilet", x: 4.55, z: 0.4, w: 0.38, d: 0.55, facing: "s" },
  { type: "vanity", x: 5.1, z: 0.95, w: 0.9, d: 0.48, facing: "w" },
  { type: "towelRail", x: 3.19, z: 1.65, w: 0.5, d: 0.05, facing: "e" },

  /* Spavaća soba 1 */
  { type: "rug", x: 6.55, z: 1.7, w: 2.0, d: 1.6, variant: "bedroom" },
  { type: "slatPanel", x: 6.55, z: 0.145, w: 2.2, d: 0.04, h: 1.25, facing: "s" },
  { type: "bed", x: 6.55, z: 1.19, w: 1.4, d: 2.05, facing: "s", variant: "sage" },
  { type: "nightstand", x: 5.65, z: 0.38, w: 0.36, d: 0.38, facing: "s" },
  { type: "wardrobe", x: 7.885, z: 1.5, w: 2.4, d: 0.58, facing: "w" },

  /* Kuhinja i blagovaonica */
  { type: "kitchenRun", x: 1.2625, z: 4.07, w: 2.275, d: 0.62, facing: "s", variant: "cooktop" },
  { type: "upperCabinets", x: 1.2625, z: 3.94, w: 2.275, d: 0.35, facing: "s" },
  { type: "tallUnit", x: 2.72, z: 4.07, w: 0.64, d: 0.62, facing: "s" },
  { type: "kitchenRun", x: 0.435, z: 5.34, w: 1.92, d: 0.62, facing: "e", variant: "sink" },
  { type: "diningTable", x: 1.5, z: 7.65, w: 1.7, d: 0.9 },
  { type: "chair", x: 0.95, z: 6.95, w: 0.46, d: 0.46, facing: "s" },
  { type: "chair", x: 1.5, z: 6.95, w: 0.46, d: 0.46, facing: "s" },
  { type: "chair", x: 2.05, z: 6.95, w: 0.46, d: 0.46, facing: "s" },
  { type: "chair", x: 0.95, z: 8.35, w: 0.46, d: 0.46, facing: "n" },
  { type: "chair", x: 1.5, z: 8.35, w: 0.46, d: 0.46, facing: "n" },
  { type: "chair", x: 2.05, z: 8.35, w: 0.46, d: 0.46, facing: "n" },
  { type: "pendant", x: 1.0, z: 7.65, w: 0.3, d: 0.3 },
  { type: "pendant", x: 1.5, z: 7.65, w: 0.3, d: 0.3 },
  { type: "pendant", x: 2.0, z: 7.65, w: 0.3, d: 0.3 },
  { type: "plant", x: 2.75, z: 8.65, w: 0.45, d: 0.45, variant: "tall" },
  { type: "curtain", x: 0.17, z: 7.65, w: 1.9, d: 0.06, facing: "e" },

  /* Hodnik i ulaz */
  { type: "plant", x: 4.85, z: 8.7, w: 0.4, d: 0.4 },
  { type: "art", x: 3.45, z: 2.26, w: 0.5, d: 0.03, h: 0.7, y: 1.5, facing: "s", variant: "2" },
  { type: "shoeCabinet", x: 5.85, z: 5.55, w: 1.1, d: 0.38, facing: "s" },
  { type: "coatRack", x: 6.15, z: 7.1, w: 0.8, d: 0.28, facing: "n" },
  { type: "doormat", x: 6.45, z: 6.6, w: 0.9, d: 0.6, facing: "w" },

  /* Vešeraj */
  { type: "washerStack", x: 6.42, z: 3.82, w: 0.6, d: 0.6, facing: "w" },
  { type: "utility", x: 6.42, z: 4.75, w: 0.8, d: 0.6, facing: "w" },

  /* WC */
  { type: "toilet", x: 6.45, z: 8.15, w: 0.38, d: 0.55, facing: "w" },
  { type: "smallSink", x: 6.3, z: 7.53, w: 0.45, d: 0.34, facing: "s" },

  /* Dnevni boravak */
  { type: "rug", x: 3.0, z: 11.0, w: 2.7, d: 2.0, variant: "living" },
  { type: "sofa", x: 3.0, z: 10.05, w: 2.4, d: 0.95, facing: "s" },
  { type: "coffeeTable", x: 3.0, z: 11.2, w: 0.9, d: 0.9 },
  { type: "sideTable", x: 4.45, z: 10.05, w: 0.42, d: 0.42 },
  { type: "slatPanel", x: 3.0, z: 12.72, w: 2.6, d: 0.04, h: WALL_HEIGHT, facing: "n", variant: "tv" },
  { type: "tvConsole", x: 3.0, z: 12.5, w: 1.7, d: 0.42, facing: "n" },
  { type: "plant", x: 4.0, z: 12.5, w: 0.36, d: 0.36 },
  { type: "floorLamp", x: 1.98, z: 12.45, w: 0.36, d: 0.36 },
  { type: "art", x: 5.075, z: 10.9, w: 1.3, d: 0.03, h: 0.85, y: 1.5, facing: "w", variant: "1" },
  { type: "curtain", x: 1.7, z: 9.35, w: 0.4, d: 0.08, facing: "e", variant: "gathered" },
  { type: "curtain", x: 1.7, z: 12.55, w: 0.4, d: 0.08, facing: "e", variant: "gathered" },

  /* Terasa */
  { type: "planter", x: 0.24, z: 9.9, w: 1.2, d: 0.32, facing: "e" },
  { type: "bistroTable", x: 0.7, z: 12.45, w: 0.6, d: 0.6 },
  { type: "bistroChair", x: 0.7, z: 11.92, w: 0.44, d: 0.44, facing: "s" },
  { type: "bistroChair", x: 0.7, z: 12.98, w: 0.44, d: 0.44, facing: "n" },

  /* Kupaonica 2 */
  { type: "bathtub", x: 2.475, z: 13.965, w: 1.7, d: 0.75, facing: "n" },
  { type: "toilet", x: 1.9, z: 13.2, w: 0.38, d: 0.55, facing: "e" },
  { type: "vanity", x: 3.2, z: 13.1, w: 0.9, d: 0.48, facing: "s" },

  /* Spavaća soba 3 */
  { type: "rug", x: 3.0, z: 16.1, w: 2.4, d: 1.8, variant: "bedroom" },
  { type: "slatPanel", x: 3.0, z: 14.48, w: 2.7, d: 0.04, h: 1.35, facing: "s" },
  { type: "bed", x: 3.0, z: 15.52, w: 1.6, d: 2.05, facing: "s", variant: "terracotta" },
  { type: "nightstand", x: 1.95, z: 14.7, w: 0.45, d: 0.4, facing: "s" },
  { type: "nightstand", x: 4.05, z: 14.7, w: 0.45, d: 0.4, facing: "s" },
  { type: "wardrobe", x: 1.925, z: 17.6, w: 2.0, d: 0.6, facing: "e" },
  { type: "desk", x: 4.8, z: 17.4, w: 1.2, d: 0.55, facing: "w" },
  { type: "deskChair", x: 4.25, z: 17.4, w: 0.5, d: 0.5, facing: "e" },
  { type: "art", x: 5.075, z: 17.4, w: 0.8, d: 0.03, h: 0.55, y: 1.6, facing: "w", variant: "3" },
  { type: "curtain", x: 3.45, z: 18.72, w: 1.9, d: 0.06, facing: "n" },
];

/** Stropne rasvjetne točke (ugradbeni downlighti). */
export const ceilingLights: Array<[number, number]> = [
  [1.45, 2.4],
  [4.25, 1.2],
  [6.6, 2.3],
  [4.15, 3.2],
  [4.15, 5.6],
  [6.0, 4.35],
  [6.0, 6.3],
  [6.0, 8.15],
  [1.2, 4.9],
  [2.2, 4.9],
  [2.0, 10.1],
  [4.0, 10.1],
  [2.0, 11.9],
  [4.0, 11.9],
  [4.65, 13.6],
  [2.8, 13.6],
  [3.3, 16.9],
];

/** Toplo svjetlo po zonama (bez sjena zbog performansi). */
export const roomLights: Vec3[] = [
  [3.1, 2.35, 11.0],
  [1.5, 2.2, 7.4],
  [4.2, 2.35, 5.4],
  [3.3, 2.35, 16.6],
  [1.5, 2.35, 2.4],
  [6.6, 2.35, 2.2],
];

/* -------------------------------------------------------------------------- */
/*                                   Kolizije                                 */
/* -------------------------------------------------------------------------- */

export function footprint(item: FurnitureItem): Rect {
  const rotated = item.facing === "e" || item.facing === "w";
  const width = rotated ? item.d : item.w;
  const depth = rotated ? item.w : item.d;
  return rect(
    item.x - width / 2,
    item.z - depth / 2,
    item.x + width / 2,
    item.z + depth / 2,
  );
}

const wallColliders = wallPieces
  .filter((piece) => piece.collide)
  .map((piece) =>
    rect(
      piece.position[0] - piece.size[0] / 2,
      piece.position[2] - piece.size[2] / 2,
      piece.position[0] + piece.size[0] / 2,
      piece.position[2] + piece.size[2] / 2,
    ),
  );

export const colliders: Rect[] = [
  ...wallColliders,
  ...furniture.filter((item) => !NON_COLLIDING.has(item.type)).map(footprint),
  // Zatvorena ulazna vrata
  rect(6.72, 6.1, 6.98, 7.1),
  // Ograda terase
  rect(-0.05, 9, 0.05, 13.45),
  rect(-0.05, 13.35, 1.5, 13.45),
];

/** AABB provjera kružnice igrača (aproksimirane kvadratom) protiv prepreka. */
export function isBlocked(x: number, z: number, radius = PLAYER_RADIUS) {
  return colliders.some(
    (box) =>
      x + radius > box.x1 &&
      x - radius < box.x2 &&
      z + radius > box.z1 &&
      z - radius < box.z2,
  );
}
