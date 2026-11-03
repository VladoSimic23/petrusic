import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

/**
 * Proceduralne teksture crtane na <canvas> elementu – nema preuzimanja slika,
 * a izgled je deterministički zahvaljujući fiksnom seedu.
 */

/** Koliko metara pokriva jedno ponavljanje teksture. */
export const TEXTURE_SCALE = {
  wood: 2.4,
  floorTile: 1.2,
  wallTile: 1.2,
  deck: 1.2,
} as const;

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createCanvas(width: number, height = width) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas nije dostupan.");
  return { canvas, context };
}

function toTexture(canvas: HTMLCanvasElement, repeat = true) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  if (repeat) {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
  }
  return texture;
}

const cache = new Map<string, Texture>();

function cached(key: string, create: () => Texture) {
  const existing = cache.get(key);
  if (existing) return existing;
  const texture = create();
  cache.set(key, texture);
  return texture;
}

function speckle(
  context: CanvasRenderingContext2D,
  size: number,
  random: () => number,
  count: number,
  alpha: number,
) {
  for (let i = 0; i < count; i++) {
    const shade = random() > 0.5 ? 255 : 0;
    context.fillStyle = `rgba(${shade},${shade},${shade},${random() * alpha})`;
    context.fillRect(random() * size, random() * size, 1 + random() * 2, 1 + random() * 2);
  }
}

/** Hrastov parket – daske različitih duljina, godovi i fuge. */
export function woodTexture() {
  return cached("wood", () => {
    const size = 1024;
    const { canvas, context } = createCanvas(size);
    const random = seeded(11);
    const columns = 13;
    const columnWidth = size / columns;

    for (let column = 0; column < columns; column++) {
      const x = column * columnWidth;
      const offset = random() * size;
      let y = 0;

      while (y < size) {
        const length = Math.min(size * (0.32 + random() * 0.32), size - y);
        const hue = 29 + random() * 6;
        const saturation = 34 + random() * 12;
        const lightness = 54 + random() * 11;

        for (const shift of [offset, offset - size]) {
          const top = y + shift;
          const gradient = context.createLinearGradient(x, 0, x + columnWidth, 0);
          gradient.addColorStop(0, `hsl(${hue} ${saturation}% ${lightness - 3}%)`);
          gradient.addColorStop(0.5, `hsl(${hue} ${saturation}% ${lightness + 2}%)`);
          gradient.addColorStop(1, `hsl(${hue} ${saturation}% ${lightness - 4}%)`);
          context.fillStyle = gradient;
          context.fillRect(x, top, columnWidth, length);

          const grainRandom = seeded(column * 1000 + Math.round(y));
          for (let g = 0; g < 22; g++) {
            const gx = x + grainRandom() * columnWidth;
            const amplitude = 1 + grainRandom() * 3;
            const frequency = 0.004 + grainRandom() * 0.01;
            const phase = grainRandom() * Math.PI * 2;
            context.strokeStyle =
              grainRandom() > 0.75
                ? `rgba(255,240,220,${0.05 + grainRandom() * 0.06})`
                : `rgba(80,48,24,${0.05 + grainRandom() * 0.09})`;
            context.lineWidth = 0.6 + grainRandom() * 1.6;
            context.beginPath();
            for (let step = 0; step <= length; step += 24) {
              const px = gx + Math.sin(step * frequency + phase) * amplitude;
              if (step === 0) context.moveTo(px, top + step);
              else context.lineTo(px, top + step);
            }
            context.stroke();
          }

          context.fillStyle = "rgba(55,32,16,0.45)";
          context.fillRect(x, top, columnWidth, 1.5);
        }
        y += length;
      }

      context.fillStyle = "rgba(50,30,15,0.5)";
      context.fillRect(x, 0, 1.5, size);
    }

    speckle(context, size, random, 9000, 0.05);
    return toTexture(canvas);
  });
}

/** Velikoformatna keramika 60×60 cm s fugama. */
export function floorTileTexture() {
  return cached("floor-tile", () => {
    const size = 512;
    const { canvas, context } = createCanvas(size);
    const random = seeded(23);
    const tile = size / 2;
    context.fillStyle = "#b9b1a5";
    context.fillRect(0, 0, size, size);

    for (let row = 0; row < 2; row++) {
      for (let column = 0; column < 2; column++) {
        const tone = 205 + random() * 10;
        context.fillStyle = `rgb(${tone},${tone - 5},${tone - 13})`;
        context.fillRect(column * tile + 2, row * tile + 2, tile - 4, tile - 4);
        for (let v = 0; v < 6; v++) {
          context.strokeStyle = `rgba(255,255,255,${0.05 + random() * 0.05})`;
          context.lineWidth = 6 + random() * 10;
          context.beginPath();
          context.moveTo(column * tile + random() * tile, row * tile);
          context.bezierCurveTo(
            column * tile + random() * tile,
            row * tile + tile * 0.4,
            column * tile + random() * tile,
            row * tile + tile * 0.6,
            column * tile + random() * tile,
            row * tile + tile,
          );
          context.stroke();
        }
      }
    }
    speckle(context, size, random, 5000, 0.06);
    return toTexture(canvas);
  });
}

/** Zidne pločice 30×60 cm u svijetlom tonu. */
export function wallTileTexture() {
  return cached("wall-tile", () => {
    const size = 512;
    const { canvas, context } = createCanvas(size);
    const random = seeded(31);
    const tileWidth = size / 4;
    const tileHeight = size / 2;
    context.fillStyle = "#cfc8bc";
    context.fillRect(0, 0, size, size);

    for (let row = 0; row < 2; row++) {
      for (let column = 0; column < 4; column++) {
        const tone = 226 + random() * 10;
        context.fillStyle = `rgb(${tone},${tone - 3},${tone - 9})`;
        context.fillRect(
          column * tileWidth + 1.5,
          row * tileHeight + 1.5,
          tileWidth - 3,
          tileHeight - 3,
        );
      }
    }
    speckle(context, size, random, 2500, 0.04);
    return toTexture(canvas);
  });
}

/** WPC deking za terasu. */
export function deckTexture() {
  return cached("deck", () => {
    const size = 512;
    const { canvas, context } = createCanvas(size);
    const random = seeded(41);
    const boards = 8;
    const boardHeight = size / boards;

    for (let board = 0; board < boards; board++) {
      const tone = 112 + random() * 18;
      context.fillStyle = `rgb(${tone + 14},${tone},${tone - 14})`;
      context.fillRect(0, board * boardHeight, size, boardHeight - 4);
      for (let line = 0; line < 9; line++) {
        context.fillStyle = `rgba(0,0,0,${0.04 + random() * 0.05})`;
        context.fillRect(0, board * boardHeight + 4 + random() * (boardHeight - 10), size, 1);
      }
      context.fillStyle = "rgba(30,24,18,0.85)";
      context.fillRect(0, board * boardHeight + boardHeight - 4, size, 4);
    }
    return toTexture(canvas);
  });
}

/** Tepisi s rubom i diskretnim uzorkom. */
export function rugTexture(variant: "living" | "bedroom") {
  return cached(`rug-${variant}`, () => {
    const size = 512;
    const { canvas, context } = createCanvas(size);
    const random = seeded(variant === "living" ? 51 : 57);
    const base = variant === "living" ? "#d8cdbb" : "#cfc4b4";
    const accent = variant === "living" ? "#a88a62" : "#9a8c7a";
    context.fillStyle = base;
    context.fillRect(0, 0, size, size);

    if (variant === "living") {
      context.strokeStyle = "rgba(140,112,78,0.35)";
      context.lineWidth = 3;
      for (let i = 0; i < 7; i++) {
        context.beginPath();
        context.arc(size / 2, size / 2, 40 + i * 30, 0, Math.PI * 2);
        context.stroke();
      }
    } else {
      for (let stripe = 0; stripe < size; stripe += 18) {
        context.fillStyle = "rgba(120,104,88,0.12)";
        context.fillRect(stripe, 0, 6, size);
      }
    }

    context.strokeStyle = accent;
    context.lineWidth = 14;
    context.strokeRect(22, 22, size - 44, size - 44);
    speckle(context, size, random, 16000, 0.08);
    return toTexture(canvas, false);
  });
}

/** Apstraktne umjetničke slike za zidove. */
export function artTexture(variant: string) {
  return cached(`art-${variant}`, () => {
    const { canvas, context } = createCanvas(512, 384);
    const palettes: Record<string, string[]> = {
      "1": ["#efe6d6", "#c08a5b", "#8d9a86", "#3f3a35", "#d9b77a"],
      "2": ["#e9e1d3", "#b56f4f", "#d6b98c", "#4a4540", "#9aa596"],
      "3": ["#ece5da", "#7f8f9a", "#c9a46e", "#383532", "#d7c4a6"],
    };
    const [background, a, b, c, d] = palettes[variant] ?? palettes["1"];
    context.fillStyle = background;
    context.fillRect(0, 0, 512, 384);

    context.fillStyle = a;
    context.beginPath();
    context.arc(170, 220, 120, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = b;
    context.fillRect(260, 60, 170, 240);
    context.fillStyle = d;
    context.beginPath();
    context.arc(350, 120, 60, Math.PI, Math.PI * 2);
    context.fill();
    context.strokeStyle = c;
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(60, 320);
    context.bezierCurveTo(180, 220, 300, 360, 460, 250);
    context.stroke();
    return toTexture(canvas, false);
  });
}

/** Sadržaj TV ekrana – pejzaž u sumrak. */
export function tvTexture() {
  return cached("tv", () => {
    const { canvas, context } = createCanvas(512, 288);
    const sky = context.createLinearGradient(0, 0, 0, 288);
    sky.addColorStop(0, "#28374d");
    sky.addColorStop(0.55, "#c98b5e");
    sky.addColorStop(1, "#2b2621");
    context.fillStyle = sky;
    context.fillRect(0, 0, 512, 288);
    context.fillStyle = "#f3c98a";
    context.beginPath();
    context.arc(330, 170, 26, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#3a3330";
    context.beginPath();
    context.moveTo(0, 210);
    context.lineTo(120, 150);
    context.lineTo(220, 200);
    context.lineTo(340, 140);
    context.lineTo(512, 205);
    context.lineTo(512, 288);
    context.lineTo(0, 288);
    context.fill();
    context.fillStyle = "#1f1b19";
    context.fillRect(0, 240, 512, 48);
    return toTexture(canvas, false);
  });
}
