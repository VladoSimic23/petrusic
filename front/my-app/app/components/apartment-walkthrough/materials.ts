import {
  DoubleSide,
  MeshStandardMaterial,
  type MeshStandardMaterialParameters,
} from "three";
import {
  artTexture,
  deckTexture,
  floorTileTexture,
  rugTexture,
  tvTexture,
  wallTileTexture,
  woodTexture,
} from "./textures";

/**
 * Zajednički materijali scene. Dijeljenjem instanci izbjegavamo stotine
 * zasebnih materijala i nepotrebne promjene stanja na GPU-u.
 */
function createMaterials() {
  const std = (
    color: string,
    roughness = 0.8,
    metalness = 0,
    extra: MeshStandardMaterialParameters = {},
  ) => new MeshStandardMaterial({ color, roughness, metalness, ...extra });

  const glow = (color: string, emissive: string, intensity: number) =>
    std(color, 0.9, 0, { emissive, emissiveIntensity: intensity, toneMapped: false });

  return {
    // Gradnja
    wall: std("#eee8de", 0.94),
    ceiling: std("#f6f3ee", 0.96, 0, { side: DoubleSide }),
    skirting: std("#f7f4ee", 0.55),
    casing: std("#f4f1ea", 0.45),
    sill: std("#e4dfd5", 0.35),
    windowFrame: std("#3b3732", 0.45, 0.35),
    glass: std("#d6e6ec", 0.04, 0.2, {
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    }),
    slab: std("#d9d4cb", 0.9),
    exterior: std("#e8e4dc", 0.9),

    // Podovi i obloge
    wood: new MeshStandardMaterial({ map: woodTexture(), roughness: 0.58 }),
    floorTile: new MeshStandardMaterial({ map: floorTileTexture(), roughness: 0.32 }),
    wallTile: new MeshStandardMaterial({ map: wallTileTexture(), roughness: 0.22 }),
    deck: new MeshStandardMaterial({ map: deckTexture(), roughness: 0.82 }),
    rugLiving: new MeshStandardMaterial({ map: rugTexture("living"), roughness: 1 }),
    rugBedroom: new MeshStandardMaterial({ map: rugTexture("bedroom"), roughness: 1 }),

    // Drvo i lakovi
    walnut: std("#5f4230", 0.55),
    oak: std("#b98c5f", 0.6),
    oakLight: std("#cfac83", 0.62),
    slat: std("#8a6446", 0.6),
    slatBack: std("#2f2722", 0.85),
    lacquer: std("#ece6dc", 0.5),
    greige: std("#cbc1b2", 0.62),
    taupe: std("#8f7f6d", 0.7),
    plinth: std("#2b2622", 0.7),

    // Kamen, metal, keramika
    stone: std("#e7e2d9", 0.28),
    stoneDark: std("#3a3633", 0.3),
    blackMetal: std("#24211e", 0.42, 0.65),
    gold: std("#c9a861", 0.28, 0.9),
    chrome: std("#dfe3e6", 0.22, 0.9),
    ceramic: std("#f7f6f2", 0.16),
    ceramicShade: std("#e6e9ea", 0.2),
    mirror: std("#e9eff1", 0.02, 1),
    darkGlass: std("#141618", 0.08, 0.5),
    appliance: std("#f1f1ee", 0.35, 0.05),

    // Tekstil
    sofa: std("#8c8378", 1),
    sofaCushion: std("#958b80", 1),
    pillowOchre: std("#b88a4f", 1),
    pillowCream: std("#e4dbcd", 1),
    pillowSage: std("#8e9a87", 1),
    linen: std("#ebe5da", 1),
    sheet: std("#f4f1ec", 1),
    headboard: std("#c2b5a3", 1),
    throwSand: std("#c5a882", 1),
    throwSage: std("#8b9884", 1),
    throwTerracotta: std("#a8694a", 1),
    chairFabric: std("#d7cdbf", 1),
    curtain: std("#efe9df", 1, 0, { side: DoubleSide }),
    coatA: std("#6f655b", 1),
    coatB: std("#b29b7b", 1),
    doormat: std("#4a433c", 1),

    // Biljke
    leaf: std("#4f6a3e", 0.75, 0, { flatShading: true }),
    leafLight: std("#6f8a52", 0.75, 0, { flatShading: true }),
    pot: std("#cfc6b6", 0.85),
    potDark: std("#3d3833", 0.75),
    soil: std("#3a2c21", 1),

    // Rasvjeta i ekrani
    lampShade: glow("#f6e8cc", "#ffd8a0", 0.75),
    bulb: glow("#fff3dc", "#ffe0b0", 2.2),
    downlight: glow("#ffffff", "#fff2dc", 1.6),
    ledStrip: glow("#fff2d6", "#ffcf8a", 2.4),
    mirrorGlow: glow("#fffaf0", "#ffe8c4", 1.4),
    tvScreen: new MeshStandardMaterial({
      map: tvTexture(),
      emissiveMap: tvTexture(),
      emissive: "#ffffff",
      emissiveIntensity: 0.55,
      roughness: 0.25,
    }),

    // Umjetnine
    art1: new MeshStandardMaterial({ map: artTexture("1"), roughness: 0.9 }),
    art2: new MeshStandardMaterial({ map: artTexture("2"), roughness: 0.9 }),
    art3: new MeshStandardMaterial({ map: artTexture("3"), roughness: 0.9 }),

    // Okoliš
    ground: std("#8d9479", 1),
    hill: std("#7d8a72", 1, 0, { flatShading: true }),
    building: std("#d8d2c8", 0.9),
    buildingAccent: std("#9c8064", 0.85),
  };
}

export type Materials = ReturnType<typeof createMaterials>;

let materials: Materials | null = null;

export function getMaterials(): Materials {
  if (!materials) materials = createMaterials();
  return materials;
}
