"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { PlaneGeometry, type BufferGeometry, type Material } from "three";
import { getMaterials } from "./materials";
import { TEXTURE_SCALE } from "./textures";

/** Osnovni gradivni blokovi scene – kraći JSX i dosljedne sjene. */

export type V3 = [number, number, number];

type PrimitiveProps = {
  s: V3;
  p: V3;
  m: Material;
  r?: V3;
  shadow?: boolean;
};

export function Box({ s, p, m, r, shadow = true }: PrimitiveProps) {
  return (
    <mesh position={p} rotation={r} material={m} castShadow={shadow} receiveShadow>
      <boxGeometry args={s} />
    </mesh>
  );
}

/** Zaobljena kutija – za tekstil, keramiku i mekane rubove. */
export function Soft({ s, p, m, r, radius = 0.04 }: PrimitiveProps & { radius?: number }) {
  const safeRadius = Math.max(0.002, Math.min(radius, Math.min(...s) / 2 - 0.002));
  return (
    <RoundedBox
      args={s}
      radius={safeRadius}
      smoothness={3}
      position={p}
      rotation={r}
      material={m}
      castShadow
      receiveShadow
    />
  );
}

type CylinderProps = {
  r1: number;
  r2?: number;
  h: number;
  p: V3;
  m: Material;
  r?: V3;
  segments?: number;
  shadow?: boolean;
};

export function Cyl({ r1, r2 = r1, h, p, m, r, segments = 24, shadow = true }: CylinderProps) {
  return (
    <mesh position={p} rotation={r} material={m} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={[r1, r2, h, segments]} />
    </mesh>
  );
}

/** Mijenja UV koordinate tako da tekstura zadrži stvarnu veličinu u metrima. */
export function scaleUv(geometry: BufferGeometry, scaleX: number, scaleY: number) {
  const uv = geometry.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, uv.getX(i) * scaleX, uv.getY(i) * scaleY);
  }
  uv.needsUpdate = true;
  return geometry;
}

/** Ravnina s keramičkim pločicama u stvarnom mjerilu (gleda prema +Z). */
export function TilePanel({ w, h, p, r }: { w: number; h: number; p: V3; r?: V3 }) {
  const geometry = useMemo(
    () =>
      scaleUv(
        new PlaneGeometry(w, h),
        w / TEXTURE_SCALE.wallTile,
        h / TEXTURE_SCALE.wallTile,
      ),
    [w, h],
  );
  return (
    <mesh
      geometry={geometry}
      material={getMaterials().wallTile}
      position={p}
      rotation={r}
      receiveShadow
    />
  );
}
