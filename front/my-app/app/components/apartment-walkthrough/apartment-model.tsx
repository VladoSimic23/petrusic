"use client";

import { memo, useMemo } from "react";
import { PlaneGeometry, Shape, ShapeGeometry, type Material } from "three";
import { FurnitureMesh } from "./furniture";
import {
  WALL_HEIGHT,
  apartmentBounds,
  ceilingLights,
  floorPolygon,
  furniture,
  terrace,
  tiledFloors,
  wallPieces,
  type PieceKind,
  type Rect,
} from "./floorplan";
import { getMaterials, type Materials } from "./materials";
import { Box, Cyl, scaleUv } from "./primitives";
import { TEXTURE_SCALE } from "./textures";

function pieceMaterial(kind: PieceKind, M: Materials): Material {
  switch (kind) {
    case "skirting":
      return M.skirting;
    case "glass":
      return M.glass;
    case "frame":
      return M.windowFrame;
    case "sill":
      return M.sill;
    case "casing":
      return M.casing;
    default:
      return M.wall;
  }
}

/** Parket prati stvarni obris stana; UV koordinate su u metrima. */
function WoodFloor() {
  const geometry = useMemo(() => {
    const shape = new Shape();
    floorPolygon.forEach(([x, z], index) => {
      if (index === 0) shape.moveTo(x, -z);
      else shape.lineTo(x, -z);
    });
    const scale = 1 / TEXTURE_SCALE.wood;
    return scaleUv(new ShapeGeometry(shape), scale, scale);
  }, []);

  return (
    <mesh
      geometry={geometry}
      material={getMaterials().wood}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.002, 0]}
      receiveShadow
    />
  );
}

function FloorPatch({
  area,
  material,
  tileSize,
  y = 0.004,
}: {
  area: Rect;
  material: Material;
  tileSize: number;
  y?: number;
}) {
  const width = area.x2 - area.x1;
  const depth = area.z2 - area.z1;
  const geometry = useMemo(
    () => scaleUv(new PlaneGeometry(width, depth), width / tileSize, depth / tileSize),
    [width, depth, tileSize],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[(area.x1 + area.x2) / 2, y, (area.z1 + area.z2) / 2]}
      receiveShadow
    />
  );
}

function Walls() {
  const M = getMaterials();
  return (
    <group>
      {wallPieces.map((piece, index) => (
        <mesh
          key={index}
          position={piece.position}
          material={pieceMaterial(piece.kind, M)}
          castShadow={piece.kind !== "glass"}
          receiveShadow={piece.kind !== "glass"}
        >
          <boxGeometry args={piece.size} />
        </mesh>
      ))}
    </group>
  );
}

/** Ploče iznad i ispod stana te zgrada ispod (vidljiva s terase). */
function Structure() {
  const M = getMaterials();
  const width = apartmentBounds.x2 - apartmentBounds.x1;
  const depth = apartmentBounds.z2 - apartmentBounds.z1;
  const centerX = (apartmentBounds.x1 + apartmentBounds.x2) / 2;
  const centerZ = (apartmentBounds.z1 + apartmentBounds.z2) / 2;

  return (
    <group>
      <Box s={[width, 0.3, depth]} p={[centerX, -0.15, centerZ]} m={M.slab} />
      <Box s={[width, 0.3, depth]} p={[centerX, WALL_HEIGHT + 0.15, centerZ]} m={M.ceiling} />
      <Box s={[width - 0.4, 14, depth - 0.4]} p={[centerX, -7.3, centerZ]} m={M.exterior} shadow={false} />
    </group>
  );
}

function EntryDoor() {
  const M = getMaterials();
  return (
    <group position={[6.85, 0, 6.6]}>
      <Box s={[0.055, 2.13, 0.98]} p={[0, 1.075, 0]} m={M.walnut} />
      <Box s={[0.05, 0.02, 0.14]} p={[-0.05, 1.05, -0.36]} m={M.gold} />
      <Cyl r1={0.03} h={0.02} p={[-0.035, 1.05, -0.42]} r={[0, 0, Math.PI / 2]} m={M.gold} />
      <Cyl r1={0.012} h={0.02} p={[-0.035, 1.55, 0]} r={[0, 0, Math.PI / 2]} m={M.chrome} />
    </group>
  );
}

function TerraceRailing() {
  const M = getMaterials();
  const length = terrace.z2 - terrace.z1;
  const width = terrace.x2 - terrace.x1;
  const midZ = (terrace.z1 + terrace.z2) / 2;
  return (
    <group>
      <Box s={[0.014, 1.0, length]} p={[terrace.x1, 0.55, midZ]} m={M.glass} shadow={false} />
      <Box s={[0.05, 0.04, length + 0.05]} p={[terrace.x1, 1.07, midZ]} m={M.blackMetal} />
      <Box s={[width, 1.0, 0.014]} p={[width / 2, 0.55, terrace.z2]} m={M.glass} shadow={false} />
      <Box s={[width + 0.05, 0.04, 0.05]} p={[width / 2, 1.07, terrace.z2]} m={M.blackMetal} />
      {[terrace.z1 + 0.15, midZ, terrace.z2].map((z) => (
        <Box key={z} s={[0.04, 1.07, 0.04]} p={[terrace.x1, 0.535, z]} m={M.blackMetal} />
      ))}
    </group>
  );
}

function CeilingLights() {
  const M = getMaterials();
  return (
    <group>
      {ceilingLights.map(([x, z]) => (
        <Cyl
          key={`${x}-${z}`}
          r1={0.07}
          h={0.012}
          p={[x, WALL_HEIGHT - 0.006, z]}
          m={M.downlight}
          shadow={false}
        />
      ))}
    </group>
  );
}

/** Udaljeni brežuljci i zgrade – daju dubinu pogledu kroz prozore. */
function Surroundings() {
  const M = getMaterials();
  const hills: Array<[number, number, number, number]> = [
    [-170, -10, -40, 80],
    [-210, -10, 90, 95],
    [-120, -10, 210, 70],
    [140, -10, -170, 90],
    [60, -10, 260, 85],
    [210, -10, 60, 75],
  ];
  const buildings: Array<[number, number, number, number, number]> = [
    [-45, -3, -18, 14, 26],
    [-55, -6, 26, 18, 20],
    [42, -4, -30, 16, 24],
    [36, -7, 44, 12, 18],
    [-30, -8, 58, 20, 14],
  ];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, -14.3, 9]} material={M.ground}>
        <planeGeometry args={[900, 900]} />
      </mesh>
      {hills.map(([x, y, z, radius]) => (
        <mesh key={`${x}${z}`} position={[x, y, z]} scale={[1, 0.32, 1]} material={M.hill}>
          <icosahedronGeometry args={[radius, 2]} />
        </mesh>
      ))}
      {buildings.map(([x, y, z, width, height]) => (
        <group key={`${x}${z}`} position={[x, y, z]}>
          <mesh material={M.building}>
            <boxGeometry args={[width, height, width * 0.8]} />
          </mesh>
          <mesh position={[0, 0, width * 0.4 + 0.05]} material={M.buildingAccent}>
            <boxGeometry args={[width * 0.25, height * 0.9, 0.1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export const ApartmentModel = memo(function ApartmentModel() {
  const M = getMaterials();
  return (
    <group>
      <WoodFloor />
      {tiledFloors.map((area) => (
        <FloorPatch
          key={`${area.x1}-${area.z1}`}
          area={area}
          material={M.floorTile}
          tileSize={TEXTURE_SCALE.floorTile}
        />
      ))}
      <FloorPatch
        area={{ x1: terrace.x1, z1: terrace.z1 + 0.125, x2: terrace.x2 - 0.125, z2: terrace.z2 }}
        material={M.deck}
        tileSize={TEXTURE_SCALE.deck}
      />
      <Walls />
      <Structure />
      <EntryDoor />
      <TerraceRailing />
      <CeilingLights />
      {furniture.map((item, index) => (
        <FurnitureMesh key={`${item.type}-${index}`} item={item} />
      ))}
      <Surroundings />
    </group>
  );
});
