"use client";

import { memo, useLayoutEffect, useRef } from "react";
import { Matrix4, type InstancedMesh } from "three";
import {
  WALL_HEIGHT,
  facingAngle,
  type FurnitureItem,
} from "./floorplan";
import { getMaterials } from "./materials";
import { Box, Cyl, Soft, TilePanel } from "./primitives";

/**
 * Namještaj i oprema. Svaki komad je modeliran u lokalnim koordinatama:
 * ishodište je središte tlocrtnog otiska na podu, lice gleda prema +Z,
 * a stražnja strana (uz zid) je na z = −d/2.
 */

type Size = { w: number; d: number; h?: number; variant?: string };

const HALF_PI = Math.PI / 2;

/* ------------------------------- Spavaće sobe ------------------------------ */

function Bed({ w, d, variant }: Size) {
  const M = getMaterials();
  const throwMaterial =
    variant === "sage"
      ? M.throwSage
      : variant === "terracotta"
        ? M.throwTerracotta
        : M.throwSand;
  const back = -d / 2;
  const length = d - 0.1;
  const center = back + 0.1 + length / 2;

  return (
    <group>
      <Soft s={[w + 0.14, 1.1, 0.1]} p={[0, 0.55, back + 0.05]} m={M.headboard} radius={0.045} />
      <Soft s={[w, 0.3, length]} p={[0, 0.19, center]} m={M.headboard} radius={0.03} />
      <Soft s={[w - 0.04, 0.22, length - 0.04]} p={[0, 0.45, center]} m={M.sheet} radius={0.07} />
      <Soft
        s={[w + 0.04, 0.07, length * 0.68]}
        p={[0, 0.575, center + length * 0.16]}
        m={M.linen}
        radius={0.03}
      />
      <Soft s={[w + 0.08, 0.08, 0.5]} p={[0, 0.595, d / 2 - 0.42]} m={throwMaterial} radius={0.035} />
      {[-1, 1].map((side) => (
        <Soft
          key={side}
          s={[w / 2 - 0.1, 0.15, 0.36]}
          p={[side * (w / 4), 0.64, back + 0.32]}
          r={[-0.35, 0, 0]}
          m={M.sheet}
          radius={0.07}
        />
      ))}
      <Soft s={[0.42, 0.3, 0.12]} p={[0, 0.72, back + 0.52]} r={[-0.3, 0, 0]} m={throwMaterial} radius={0.05} />
    </group>
  );
}

function Nightstand({ w, d }: Size) {
  const M = getMaterials();
  return (
    <group>
      <Box s={[w, 0.46, d]} p={[0, 0.29, 0]} m={M.walnut} />
      <Box s={[w - 0.04, 0.006, 0.004]} p={[0, 0.33, d / 2 + 0.002]} m={M.plinth} shadow={false} />
      <Cyl r1={0.07} h={0.03} p={[0, 0.535, -0.02]} m={M.gold} />
      <Cyl r1={0.01} h={0.28} p={[0, 0.69, -0.02]} m={M.gold} />
      <Cyl r1={0.1} r2={0.14} h={0.2} p={[0, 0.88, -0.02]} m={M.lampShade} shadow={false} />
      <Box s={[0.18, 0.03, 0.13]} p={[0.06, 0.535, 0.08]} m={M.taupe} />
    </group>
  );
}

function Wardrobe({ w, d, h = 2.35 }: Size) {
  const M = getMaterials();
  const doors = Math.max(2, Math.round(w / 0.55));
  const doorWidth = w / doors;
  const front = d / 2;

  return (
    <group>
      <Box s={[w, h - 0.08, d]} p={[0, (h - 0.08) / 2 + 0.08, 0]} m={M.lacquer} />
      <Box s={[w - 0.02, 0.08, d - 0.04]} p={[0, 0.04, -0.02]} m={M.plinth} />
      {Array.from({ length: doors - 1 }, (_, i) => (
        <Box
          key={`groove-${i}`}
          s={[0.006, h - 0.12, 0.004]}
          p={[-w / 2 + (i + 1) * doorWidth, h / 2 + 0.04, front + 0.002]}
          m={M.plinth}
          shadow={false}
        />
      ))}
      {Array.from({ length: doors }, (_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <Box
            key={`handle-${i}`}
            s={[0.014, 0.5, 0.02]}
            p={[-w / 2 + (i + 0.5) * doorWidth + side * (doorWidth / 2 - 0.06), 1.1, front + 0.012]}
            m={M.gold}
          />
        );
      })}
    </group>
  );
}

function SlatPanel({ w, h = 1.3, variant }: Size) {
  const M = getMaterials();
  const ref = useRef<InstancedMesh>(null);
  const spacing = 0.065;
  const count = Math.floor(w / spacing);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const matrix = new Matrix4();
    const start = -((count - 1) * spacing) / 2;
    for (let i = 0; i < count; i++) {
      matrix.makeTranslation(start + i * spacing, h / 2, 0.006);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, h]);

  return (
    <group>
      <Box s={[w, h, 0.012]} p={[0, h / 2, -0.012]} m={M.slatBack} />
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, count]}
        material={M.slat}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.036, h, 0.024]} />
      </instancedMesh>
      {variant === "tv" ? (
        <Box s={[w, 0.012, 0.02]} p={[0, h - 0.03, 0.03]} m={M.ledStrip} shadow={false} />
      ) : null}
    </group>
  );
}

function Rug({ w, d, variant }: Size) {
  const M = getMaterials();
  return (
    <Box
      s={[w, 0.012, d]}
      p={[0, 0.008, 0]}
      m={variant === "living" ? M.rugLiving : M.rugBedroom}
      shadow={false}
    />
  );
}

function Curtain({ w, variant }: Size) {
  const M = getMaterials();
  const height = WALL_HEIGHT - 0.12;
  const stacks = variant === "gathered" ? [0] : [-(w / 2 - 0.17), w / 2 - 0.17];

  return (
    <group>
      {variant === "gathered" ? null : (
        <Cyl
          r1={0.012}
          h={w + 0.2}
          p={[0, WALL_HEIGHT - 0.08, 0.02]}
          r={[0, 0, HALF_PI]}
          m={M.blackMetal}
          shadow={false}
        />
      )}
      {stacks.map((x) =>
        [0, 1, 2, 3].map((fold) => (
          <Soft
            key={`${x}-${fold}`}
            s={[0.11, height, 0.05]}
            p={[x - 0.12 + fold * 0.08, height / 2 + 0.02, 0.04 + (fold % 2) * 0.025]}
            m={M.curtain}
            radius={0.024}
          />
        )),
      )}
    </group>
  );
}

/* ------------------------------ Dnevni boravak ----------------------------- */

function Sofa({ w, d }: Size) {
  const M = getMaterials();
  const arm = 0.2;
  const inner = w - arm * 2;
  const seats = 3;
  const seatWidth = inner / seats;

  return (
    <group>
      <Soft s={[w, 0.24, d]} p={[0, 0.22, 0]} m={M.sofa} radius={0.04} />
      {Array.from({ length: seats }, (_, i) => {
        const x = -inner / 2 + seatWidth * (i + 0.5);
        return (
          <group key={i}>
            <Soft s={[seatWidth - 0.02, 0.16, d - 0.28]} p={[x, 0.42, 0.1]} m={M.sofaCushion} radius={0.06} />
            <Soft
              s={[seatWidth - 0.03, 0.42, 0.18]}
              p={[x, 0.64, -d / 2 + 0.27]}
              r={[-0.12, 0, 0]}
              m={M.sofaCushion}
              radius={0.08}
            />
          </group>
        );
      })}
      <Soft s={[inner, 0.5, 0.2]} p={[0, 0.57, -d / 2 + 0.1]} m={M.sofa} radius={0.05} />
      {[-1, 1].map((side) => (
        <Soft key={side} s={[arm, 0.6, d]} p={[side * (w / 2 - arm / 2), 0.4, 0]} m={M.sofa} radius={0.07} />
      ))}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Cyl
            key={`${sx}${sz}`}
            r1={0.02}
            h={0.1}
            p={[sx * (w / 2 - 0.1), 0.05, sz * (d / 2 - 0.1)]}
            m={M.blackMetal}
          />
        )),
      )}
      <Soft s={[0.44, 0.42, 0.13]} p={[-inner / 2 + 0.3, 0.72, -d / 2 + 0.42]} r={[-0.2, 0.25, 0]} m={M.pillowOchre} radius={0.06} />
      <Soft s={[0.42, 0.4, 0.13]} p={[-inner / 2 + 0.7, 0.71, -d / 2 + 0.42]} r={[-0.2, -0.1, 0]} m={M.pillowCream} radius={0.06} />
      <Soft s={[0.44, 0.42, 0.13]} p={[inner / 2 - 0.3, 0.72, -d / 2 + 0.42]} r={[-0.2, -0.25, 0]} m={M.pillowSage} radius={0.06} />
      <Soft s={[0.55, 0.05, 0.75]} p={[inner / 2 - 0.35, 0.53, 0.05]} r={[0, 0.2, 0]} m={M.throwSand} radius={0.02} />
    </group>
  );
}

function CoffeeTable({ w }: Size) {
  const M = getMaterials();
  return (
    <group>
      <Cyl r1={w / 2} h={0.04} p={[0, 0.41, 0]} m={M.oak} segments={48} />
      <Cyl r1={0.16} r2={0.24} h={0.39} p={[0, 0.195, 0]} m={M.blackMetal} segments={32} />
      <Box s={[0.3, 0.04, 0.22]} p={[-0.12, 0.45, -0.05]} m={M.taupe} />
      <Box s={[0.26, 0.035, 0.19]} p={[-0.12, 0.487, -0.05]} m={M.pillowCream} />
      <Cyl r1={0.05} r2={0.07} h={0.2} p={[0.2, 0.53, 0.1]} m={M.ceramic} />
      <Cyl r1={0.12} r2={0.06} h={0.05} p={[0.05, 0.455, 0.22]} m={M.potDark} />
    </group>
  );
}

function SideTable() {
  const M = getMaterials();
  return (
    <group>
      <Cyl r1={0.21} h={0.03} p={[0, 0.56, 0]} m={M.oak} segments={36} />
      <Cyl r1={0.018} h={0.54} p={[0, 0.28, 0]} m={M.blackMetal} />
      <Cyl r1={0.15} h={0.02} p={[0, 0.01, 0]} m={M.blackMetal} />
      <Cyl r1={0.05} h={0.06} p={[0.05, 0.605, 0]} m={M.ceramic} />
      <Cyl r1={0.06} r2={0.09} h={0.13} p={[-0.07, 0.64, 0.03]} m={M.lampShade} shadow={false} />
    </group>
  );
}

function TvConsole({ w, d }: Size) {
  const M = getMaterials();
  const tvZ = -d / 2 + 0.04;
  return (
    <group>
      <Box s={[w, 0.38, d]} p={[0, 0.31, 0]} m={M.walnut} />
      <Box s={[w - 0.2, 0.12, d - 0.1]} p={[0, 0.06, -0.03]} m={M.plinth} />
      {[-1, 1].map((side) => (
        <Box
          key={side}
          s={[0.006, 0.34, 0.004]}
          p={[(side * w) / 6, 0.31, d / 2 + 0.002]}
          m={M.plinth}
          shadow={false}
        />
      ))}
      <Box s={[0.9, 0.06, 0.08]} p={[0, 0.53, -0.05]} m={M.plinth} />
      <Box s={[1.46, 0.84, 0.035]} p={[0, 1.32, tvZ]} m={M.plinth} />
      <Box s={[1.42, 0.8, 0.002]} p={[0, 1.32, tvZ + 0.0185]} m={M.tvScreen} shadow={false} />
      <Cyl r1={0.06} r2={0.08} h={0.22} p={[w / 2 - 0.2, 0.61, 0]} m={M.ceramic} />
      <Box s={[0.24, 0.05, 0.17]} p={[-w / 2 + 0.25, 0.525, 0]} m={M.pillowCream} />
    </group>
  );
}

function FloorLamp() {
  const M = getMaterials();
  return (
    <group>
      <Cyl r1={0.16} h={0.025} p={[0, 0.0125, 0]} m={M.blackMetal} />
      <Cyl r1={0.012} h={1.45} p={[0, 0.74, 0]} m={M.blackMetal} />
      <Cyl r1={0.17} r2={0.22} h={0.32} p={[0, 1.58, 0]} m={M.lampShade} shadow={false} />
    </group>
  );
}

function Art({ w, h = 0.6, variant }: Size & { y?: number }) {
  const M = getMaterials();
  const material = variant === "2" ? M.art2 : variant === "3" ? M.art3 : M.art1;
  return (
    <group>
      <Box s={[w + 0.04, h + 0.04, 0.03]} p={[0, 0, 0.015]} m={M.blackMetal} />
      <Box s={[w, h, 0.004]} p={[0, 0, 0.032]} m={material} shadow={false} />
    </group>
  );
}

function Plant({ w, variant }: Size) {
  const M = getMaterials();
  const tall = variant === "tall";
  const potHeight = tall ? 0.45 : 0.36;
  const foliage: Array<[number, number, number, number]> = tall
    ? [
        [0, potHeight + 1.15, 0, 0.26],
        [0.16, potHeight + 1.0, 0.05, 0.2],
        [-0.15, potHeight + 1.32, -0.04, 0.2],
        [0.05, potHeight + 1.45, 0.1, 0.17],
        [-0.08, potHeight + 0.92, -0.1, 0.16],
      ]
    : [
        [0, potHeight + 0.22, 0, w * 0.42],
        [w * 0.22, potHeight + 0.4, 0.04, w * 0.32],
        [-w * 0.2, potHeight + 0.46, -0.03, w * 0.3],
        [0.02, potHeight + 0.6, 0.02, w * 0.26],
      ];

  return (
    <group>
      <Cyl r1={w * 0.42} r2={w * 0.32} h={potHeight} p={[0, potHeight / 2, 0]} m={tall ? M.potDark : M.pot} />
      <Cyl r1={w * 0.4} h={0.01} p={[0, potHeight, 0]} m={M.soil} />
      {tall ? <Cyl r1={0.022} r2={0.03} h={1.0} p={[0, potHeight + 0.5, 0]} m={M.walnut} /> : null}
      {foliage.map(([x, y, z, radius], index) => (
        <mesh
          key={index}
          position={[x, y, z]}
          scale={[1, tall ? 1.15 : 0.9, 1]}
          material={index % 2 ? M.leafLight : M.leaf}
          castShadow
        >
          <icosahedronGeometry args={[radius, 1]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------- Kuhinja i blagovaonica ---------------------------- */

function KitchenRun({ w, d, variant }: Size) {
  const M = getMaterials();
  const doors = Math.max(1, Math.round(w / 0.6));
  const doorWidth = w / doors;
  const front = d / 2 - 0.03;

  return (
    <group>
      <Box s={[w - 0.02, 0.1, d - 0.08]} p={[0, 0.05, -0.04]} m={M.plinth} />
      <Box s={[w, 0.78, d - 0.03]} p={[0, 0.49, -0.015]} m={M.greige} />
      {Array.from({ length: doors - 1 }, (_, i) => (
        <Box
          key={i}
          s={[0.005, 0.76, 0.004]}
          p={[-w / 2 + (i + 1) * doorWidth, 0.49, front + 0.002]}
          m={M.plinth}
          shadow={false}
        />
      ))}
      <Box s={[w - 0.04, 0.005, 0.004]} p={[0, 0.66, front + 0.002]} m={M.plinth} shadow={false} />
      <Box s={[w - 0.04, 0.012, 0.02]} p={[0, 0.84, front + 0.01]} m={M.gold} />
      <Box s={[w + 0.01, 0.04, d]} p={[0, 0.9, 0]} m={M.stone} />
      <Box s={[w, 0.6, 0.015]} p={[0, 1.22, -d / 2 + 0.008]} m={M.stone} />

      {variant === "cooktop" ? (
        <group position={[0.24, 0, 0.02]}>
          <Box s={[0.6, 0.008, 0.5]} p={[0, 0.924, 0]} m={M.darkGlass} />
          {[
            [-0.15, -0.12],
            [0.15, -0.12],
            [-0.15, 0.12],
            [0.15, 0.12],
          ].map(([x, z]) => (
            <Cyl key={`${x}${z}`} r1={0.085} h={0.002} p={[x, 0.929, z]} m={M.stoneDark} shadow={false} />
          ))}
          <Cyl r1={0.12} r2={0.11} h={0.12} p={[-0.15, 0.99, -0.12]} m={M.chrome} />
        </group>
      ) : null}

      {variant === "sink" ? (
        <group>
          <Box s={[0.55, 0.012, 0.42]} p={[0, 0.921, 0.04]} m={M.stoneDark} shadow={false} />
          <Cyl r1={0.018} h={0.3} p={[0, 1.07, -d / 2 + 0.12]} m={M.chrome} />
          <Box s={[0.02, 0.02, 0.2]} p={[0, 1.21, -d / 2 + 0.21]} m={M.chrome} />
          <Box s={[0.38, 0.02, 0.26]} p={[0, 0.93, 0.38]} r={[0, 0.1, 0]} m={M.oakLight} />
          <Cyl r1={0.13} r2={0.08} h={0.09} p={[0.05, 0.965, -0.55]} m={M.ceramic} />
        </group>
      ) : null}
    </group>
  );
}

function UpperCabinets({ w, d }: Size) {
  const M = getMaterials();
  const doors = Math.max(1, Math.round(w / 0.6));
  const doorWidth = w / doors;
  return (
    <group>
      <Box s={[w, 0.72, d]} p={[0, 1.84, 0]} m={M.oakLight} />
      {Array.from({ length: doors - 1 }, (_, i) => (
        <Box
          key={i}
          s={[0.005, 0.7, 0.004]}
          p={[-w / 2 + (i + 1) * doorWidth, 1.84, d / 2 + 0.002]}
          m={M.walnut}
          shadow={false}
        />
      ))}
      <Box s={[w - 0.06, 0.01, 0.03]} p={[0, 1.475, d / 2 - 0.06]} m={M.ledStrip} shadow={false} />
    </group>
  );
}

function TallUnit({ w, d }: Size) {
  const M = getMaterials();
  const front = d / 2;
  return (
    <group>
      <Box s={[w, 2.25, d]} p={[0, 1.125, 0]} m={M.greige} />
      <Box s={[w - 0.08, 0.5, 0.01]} p={[0, 1.02, front + 0.005]} m={M.darkGlass} />
      <Box s={[w - 0.16, 0.015, 0.02]} p={[0, 1.3, front + 0.02]} m={M.gold} />
      <Box s={[w - 0.02, 0.005, 0.004]} p={[0, 1.4, front + 0.002]} m={M.plinth} shadow={false} />
      <Box s={[w - 0.02, 0.005, 0.004]} p={[0, 0.72, front + 0.002]} m={M.plinth} shadow={false} />
      <Box s={[0.014, 0.5, 0.02]} p={[w / 2 - 0.06, 1.75, front + 0.012]} m={M.gold} />
      <Box s={[0.014, 0.35, 0.02]} p={[w / 2 - 0.06, 0.45, front + 0.012]} m={M.gold} />
    </group>
  );
}

function DiningTable({ w, d }: Size) {
  const M = getMaterials();
  return (
    <group>
      <Soft s={[w, 0.045, d]} p={[0, 0.745, 0]} m={M.oak} radius={0.012} />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Box
            key={`${sx}${sz}`}
            s={[0.05, 0.72, 0.05]}
            p={[sx * (w / 2 - 0.12), 0.36, sz * (d / 2 - 0.1)]}
            m={M.blackMetal}
          />
        )),
      )}
      <Cyl r1={0.17} r2={0.08} h={0.08} p={[-0.1, 0.81, 0]} m={M.ceramic} />
      <Cyl r1={0.05} r2={0.07} h={0.24} p={[0.45, 0.89, 0.05]} m={M.potDark} />
      <mesh position={[0.45, 1.1, 0.05]} material={M.leafLight} castShadow>
        <icosahedronGeometry args={[0.12, 1]} />
      </mesh>
    </group>
  );
}

function Chair() {
  const M = getMaterials();
  return (
    <group>
      <Soft s={[0.44, 0.06, 0.42]} p={[0, 0.46, 0]} m={M.chairFabric} radius={0.025} />
      <Soft s={[0.44, 0.38, 0.05]} p={[0, 0.74, -0.2]} r={[-0.1, 0, 0]} m={M.chairFabric} radius={0.022} />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Cyl key={`${sx}${sz}`} r1={0.016} h={0.45} p={[sx * 0.18, 0.225, sz * 0.17]} m={M.oak} />
        )),
      )}
    </group>
  );
}

function Pendant() {
  const M = getMaterials();
  return (
    <group>
      <Cyl r1={0.05} h={0.02} p={[0, WALL_HEIGHT - 0.01, 0]} m={M.blackMetal} shadow={false} />
      <Cyl r1={0.003} h={0.7} p={[0, WALL_HEIGHT - 0.35, 0]} m={M.blackMetal} shadow={false} />
      <Cyl r1={0.06} r2={0.16} h={0.2} p={[0, WALL_HEIGHT - 0.8, 0]} m={M.gold} shadow={false} />
      <mesh position={[0, WALL_HEIGHT - 0.9, 0]} material={M.bulb}>
        <sphereGeometry args={[0.05, 16, 12]} />
      </mesh>
    </group>
  );
}

/* ------------------------------- Kupaonice -------------------------------- */

function Shower({ w, d }: Size) {
  const M = getMaterials();
  return (
    <group>
      <TilePanel w={w} h={2.2} p={[0, 1.1, -d / 2 + 0.003]} />
      <TilePanel w={d} h={2.2} p={[-w / 2 + 0.003, 1.1, 0]} r={[0, HALF_PI, 0]} />
      <Soft s={[w, 0.05, d]} p={[0, 0.025, 0]} m={M.ceramic} radius={0.01} />
      <Box s={[0.5, 0.002, 0.06]} p={[0, 0.051, -d / 2 + 0.12]} m={M.chrome} shadow={false} />
      <Box s={[0.01, 2.0, d - 0.02]} p={[w / 2 - 0.005, 1.05, 0]} m={M.glass} shadow={false} />
      <Box s={[w / 2, 2.0, 0.01]} p={[w / 4, 1.05, d / 2 - 0.005]} m={M.glass} shadow={false} />
      <Box s={[0.02, 0.02, d]} p={[w / 2 - 0.005, 2.05, 0]} m={M.chrome} />
      <Box s={[w / 2, 0.02, 0.02]} p={[w / 4, 2.05, d / 2 - 0.005]} m={M.chrome} />
      <Box s={[0.02, 2.0, 0.02]} p={[0, 1.05, d / 2 - 0.005]} m={M.chrome} />
      <Cyl r1={0.11} h={0.012} p={[0, 2.1, -d / 2 + 0.24]} m={M.chrome} />
      <Box s={[0.02, 0.02, 0.24]} p={[0, 2.12, -d / 2 + 0.12]} m={M.chrome} />
      <Cyl r1={0.035} h={0.05} p={[0, 1.1, -d / 2 + 0.03]} r={[HALF_PI, 0, 0]} m={M.chrome} />
    </group>
  );
}

function Toilet({ w, d }: Size) {
  const M = getMaterials();
  return (
    <group>
      <TilePanel w={0.8} h={1.2} p={[0, 0.6, -d / 2 + 0.004]} />
      <Box s={[0.22, 0.15, 0.012]} p={[0, 1.0, -d / 2 + 0.01]} m={M.chrome} />
      <Soft s={[w, 0.3, d - 0.06]} p={[0, 0.4, 0.03]} m={M.ceramic} radius={0.12} />
      <Soft s={[w + 0.01, 0.025, d - 0.08]} p={[0, 0.565, 0.04]} m={M.ceramic} radius={0.012} />
    </group>
  );
}

function Vanity({ w, d }: Size) {
  const M = getMaterials();
  const back = -d / 2;
  return (
    <group>
      <TilePanel w={w + 0.3} h={2.2} p={[0, 1.1, back + 0.003]} />
      <Box s={[w, 0.4, d - 0.02]} p={[0, 0.62, -0.01]} m={M.oak} />
      <Box s={[w - 0.04, 0.005, 0.004]} p={[0, 0.62, d / 2 - 0.018]} m={M.walnut} shadow={false} />
      <Box s={[w, 0.03, d]} p={[0, 0.835, 0]} m={M.stone} />
      <Soft s={[0.48, 0.13, 0.36]} p={[0, 0.915, 0.02]} m={M.ceramic} radius={0.06} />
      <Box s={[0.4, 0.002, 0.28]} p={[0, 0.981, 0.02]} m={M.ceramicShade} shadow={false} />
      <Cyl r1={0.015} h={0.28} p={[0, 0.99, back + 0.06]} m={M.chrome} />
      <Box s={[0.02, 0.02, 0.14]} p={[0, 1.12, back + 0.12]} m={M.chrome} />
      <Box s={[w * 0.82 + 0.04, 0.84, 0.01]} p={[0, 1.58, back + 0.01]} m={M.mirrorGlow} shadow={false} />
      <Box s={[w * 0.82, 0.8, 0.012]} p={[0, 1.58, back + 0.018]} m={M.mirror} shadow={false} />
      <Soft s={[0.22, 0.1, 0.12]} p={[w / 2 - 0.16, 0.9, -0.06]} m={M.pillowCream} radius={0.03} />
    </group>
  );
}

function Bathtub({ w, d }: Size) {
  const M = getMaterials();
  return (
    <group>
      <TilePanel w={w} h={2.2} p={[0, 1.1, -d / 2 + 0.003]} />
      <Soft s={[w, 0.55, d]} p={[0, 0.275, 0]} m={M.ceramic} radius={0.05} />
      <Box s={[w - 0.16, 0.004, d - 0.16]} p={[0, 0.552, 0]} m={M.ceramicShade} shadow={false} />
      <Box s={[0.03, 0.03, 0.18]} p={[0, 0.78, -d / 2 + 0.09]} m={M.chrome} />
      <Cyl r1={0.035} h={0.05} p={[0.2, 0.8, -d / 2 + 0.03]} r={[HALF_PI, 0, 0]} m={M.chrome} />
      <Soft s={[0.45, 0.08, 0.22]} p={[-w / 2 + 0.35, 0.6, d / 2 - 0.12]} m={M.pillowCream} radius={0.03} />
    </group>
  );
}

function SmallSink({ w, d }: Size) {
  const M = getMaterials();
  const back = -d / 2;
  return (
    <group>
      <TilePanel w={w + 0.3} h={1.3} p={[0, 0.65, back + 0.003]} />
      <Soft s={[w, 0.14, d]} p={[0, 0.82, 0]} m={M.ceramic} radius={0.05} />
      <Cyl r1={0.013} h={0.18} p={[0, 0.96, back + 0.05]} m={M.chrome} />
      <Box s={[0.018, 0.018, 0.1]} p={[0, 1.04, back + 0.1]} m={M.chrome} />
      <Cyl r1={0.27} h={0.01} p={[0, 1.5, back + 0.008]} r={[HALF_PI, 0, 0]} m={M.gold} shadow={false} />
      <Cyl r1={0.25} h={0.012} p={[0, 1.5, back + 0.016]} r={[HALF_PI, 0, 0]} m={M.mirror} shadow={false} />
    </group>
  );
}

function TowelRail({ w }: Size) {
  const M = getMaterials();
  return (
    <group>
      {[-1, 1].map((side) => (
        <Box key={side} s={[0.02, 0.9, 0.02]} p={[(side * w) / 2, 1.05, 0.02]} m={M.chrome} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} s={[w, 0.015, 0.015]} p={[0, 0.65 + i * 0.15, 0.02]} m={M.chrome} />
      ))}
      <Soft s={[w * 0.8, 0.55, 0.03]} p={[0, 1.15, 0.045]} m={M.pillowCream} radius={0.012} />
    </group>
  );
}

/* --------------------------- Vešeraj, ulaz, ostalo --------------------------- */

function Appliance({ w, d, y }: { w: number; d: number; y: number }) {
  const M = getMaterials();
  return (
    <group position={[0, y, 0]}>
      <Box s={[w, 0.84, d]} p={[0, 0.42, 0]} m={M.appliance} />
      <Box s={[w - 0.04, 0.07, 0.005]} p={[0, 0.77, d / 2 + 0.003]} m={M.ceramicShade} shadow={false} />
      <mesh position={[0, 0.4, d / 2 + 0.012]} material={M.chrome}>
        <torusGeometry args={[0.19, 0.022, 12, 40]} />
      </mesh>
      <Cyl r1={0.17} h={0.012} p={[0, 0.4, d / 2 + 0.004]} r={[HALF_PI, 0, 0]} m={M.darkGlass} shadow={false} />
    </group>
  );
}

function WasherStack({ w, d }: Size) {
  return (
    <group>
      <Appliance w={w} d={d} y={0} />
      <Appliance w={w} d={d} y={0.86} />
    </group>
  );
}

function Utility({ w, d }: Size) {
  const M = getMaterials();
  const back = -d / 2;
  return (
    <group>
      <Box s={[w, 0.86, d]} p={[0, 0.43, 0]} m={M.greige} />
      <Box s={[w + 0.01, 0.03, d]} p={[0, 0.875, 0]} m={M.stone} />
      <Box s={[0.4, 0.005, 0.34]} p={[0, 0.892, 0.04]} m={M.stoneDark} shadow={false} />
      <Cyl r1={0.014} h={0.22} p={[0, 1.0, back + 0.08]} m={M.chrome} />
      <Box s={[w, 0.025, 0.28]} p={[0, 1.65, back + 0.14]} m={M.oak} />
      <Soft s={[0.3, 0.2, 0.24]} p={[-0.18, 1.765, back + 0.15]} m={M.pillowCream} radius={0.03} />
      <Soft s={[0.3, 0.2, 0.24]} p={[0.18, 1.765, back + 0.15]} m={M.taupe} radius={0.03} />
    </group>
  );
}

function ShoeCabinet({ w, d }: Size) {
  const M = getMaterials();
  const back = -d / 2;
  return (
    <group>
      <Box s={[w, 0.45, d]} p={[0, 0.55, 0]} m={M.walnut} />
      <Box s={[0.005, 0.43, 0.004]} p={[0, 0.55, d / 2 + 0.002]} m={M.plinth} shadow={false} />
      <Box s={[w - 0.06, 0.01, 0.02]} p={[0, 0.32, 0]} m={M.ledStrip} shadow={false} />
      <Cyl r1={0.12} r2={0.07} h={0.06} p={[-0.25, 0.805, 0]} m={M.ceramic} />
      <Cyl r1={0.05} r2={0.07} h={0.3} p={[0.3, 0.925, 0]} m={M.potDark} />
      <Cyl r1={0.4} h={0.01} p={[0, 1.5, back + 0.006]} r={[HALF_PI, 0, 0]} m={M.gold} shadow={false} />
      <Cyl r1={0.38} h={0.012} p={[0, 1.5, back + 0.014]} r={[HALF_PI, 0, 0]} m={M.mirror} shadow={false} />
    </group>
  );
}

function CoatRack({ w, d }: Size) {
  const M = getMaterials();
  const back = -d / 2;
  return (
    <group>
      <Box s={[w, 0.1, 0.03]} p={[0, 1.75, back + 0.015]} m={M.oak} />
      {[-0.3, -0.1, 0.1, 0.3].map((x) => (
        <Cyl key={x} r1={0.012} h={0.08} p={[x, 1.72, back + 0.07]} r={[HALF_PI, 0, 0]} m={M.gold} />
      ))}
      <Soft s={[0.42, 0.85, 0.14]} p={[-0.2, 1.28, back + 0.11]} m={M.coatA} radius={0.06} />
      <Soft s={[0.38, 0.75, 0.12]} p={[0.18, 1.33, back + 0.1]} m={M.coatB} radius={0.05} />
    </group>
  );
}

function Doormat({ w, d }: Size) {
  return <Box s={[w, 0.012, d]} p={[0, 0.008, 0]} m={getMaterials().doormat} shadow={false} />;
}

function Desk({ w, d }: Size) {
  const M = getMaterials();
  return (
    <group>
      <Box s={[w, 0.03, d]} p={[0, 0.745, 0]} m={M.oak} />
      {[-1, 1].map((side) => (
        <Box key={side} s={[0.03, 0.73, d - 0.06]} p={[side * (w / 2 - 0.04), 0.365, 0]} m={M.blackMetal} />
      ))}
      <Box s={[0.33, 0.015, 0.23]} p={[0, 0.768, 0.05]} m={M.taupe} />
      <Box s={[0.33, 0.22, 0.008]} p={[0, 0.88, -0.07]} r={[-0.25, 0, 0]} m={M.darkGlass} />
      <Cyl r1={0.06} h={0.02} p={[w / 2 - 0.15, 0.77, -0.12]} m={M.blackMetal} />
      <Cyl r1={0.01} h={0.4} p={[w / 2 - 0.15, 0.97, -0.12]} m={M.blackMetal} />
      <Cyl r1={0.05} r2={0.09} h={0.12} p={[w / 2 - 0.15, 1.17, -0.08]} m={M.lampShade} shadow={false} />
      <Box s={[0.22, 0.06, 0.16]} p={[-w / 2 + 0.2, 0.79, -0.1]} m={M.pillowSage} />
    </group>
  );
}

function DeskChair() {
  const M = getMaterials();
  return (
    <group>
      <Soft s={[0.46, 0.08, 0.44]} p={[0, 0.47, 0]} m={M.taupe} radius={0.03} />
      <Soft s={[0.44, 0.45, 0.06]} p={[0, 0.8, -0.2]} r={[-0.08, 0, 0]} m={M.taupe} radius={0.025} />
      <Cyl r1={0.025} h={0.35} p={[0, 0.25, 0]} m={M.chrome} />
      <Cyl r1={0.27} h={0.03} p={[0, 0.05, 0]} m={M.blackMetal} />
    </group>
  );
}

/* --------------------------------- Terasa --------------------------------- */

function BistroTable({ w }: Size) {
  const M = getMaterials();
  return (
    <group>
      <Cyl r1={w / 2} h={0.025} p={[0, 0.72, 0]} m={M.stone} segments={36} />
      <Cyl r1={0.025} h={0.7} p={[0, 0.36, 0]} m={M.blackMetal} />
      <Cyl r1={0.2} h={0.02} p={[0, 0.01, 0]} m={M.blackMetal} />
      <Cyl r1={0.05} r2={0.06} h={0.12} p={[0.08, 0.79, 0]} m={M.ceramic} />
    </group>
  );
}

function BistroChair() {
  const M = getMaterials();
  return (
    <group>
      <Soft s={[0.42, 0.04, 0.42]} p={[0, 0.45, 0]} m={M.blackMetal} radius={0.015} />
      <Soft s={[0.38, 0.04, 0.38]} p={[0, 0.49, 0]} m={M.pillowCream} radius={0.015} />
      <Box s={[0.4, 0.32, 0.02]} p={[0, 0.68, -0.2]} m={M.blackMetal} />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Cyl key={`${sx}${sz}`} r1={0.012} h={0.45} p={[sx * 0.17, 0.225, sz * 0.17]} m={M.blackMetal} />
        )),
      )}
    </group>
  );
}

function Planter({ w, d }: Size) {
  const M = getMaterials();
  return (
    <group>
      <Box s={[w, 0.45, d]} p={[0, 0.225, 0]} m={M.potDark} />
      <Box s={[w - 0.04, 0.01, d - 0.04]} p={[0, 0.45, 0]} m={M.soil} />
      {[-0.42, -0.14, 0.14, 0.42].map((x, index) => (
        <mesh
          key={x}
          position={[x * (w / 1.2), 0.62, 0]}
          scale={[1, 1.4, 1]}
          material={index % 2 ? M.leaf : M.leafLight}
          castShadow
        >
          <icosahedronGeometry args={[0.16, 1]} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------- Raspoređivač ------------------------------ */

function renderItem(item: FurnitureItem) {
  const size: Size = { w: item.w, d: item.d, h: item.h, variant: item.variant };
  switch (item.type) {
    case "bed":
      return <Bed {...size} />;
    case "nightstand":
      return <Nightstand {...size} />;
    case "wardrobe":
      return <Wardrobe {...size} />;
    case "slatPanel":
      return <SlatPanel {...size} />;
    case "rug":
      return <Rug {...size} />;
    case "curtain":
      return <Curtain {...size} />;
    case "sofa":
      return <Sofa {...size} />;
    case "coffeeTable":
      return <CoffeeTable {...size} />;
    case "sideTable":
      return <SideTable />;
    case "tvConsole":
      return <TvConsole {...size} />;
    case "floorLamp":
      return <FloorLamp />;
    case "art":
      return (
        <group position={[0, item.y ?? 1.5, 0]}>
          <Art {...size} />
        </group>
      );
    case "plant":
      return <Plant {...size} />;
    case "kitchenRun":
      return <KitchenRun {...size} />;
    case "upperCabinets":
      return <UpperCabinets {...size} />;
    case "tallUnit":
      return <TallUnit {...size} />;
    case "diningTable":
      return <DiningTable {...size} />;
    case "chair":
      return <Chair />;
    case "pendant":
      return <Pendant />;
    case "shower":
      return <Shower {...size} />;
    case "toilet":
      return <Toilet {...size} />;
    case "vanity":
      return <Vanity {...size} />;
    case "bathtub":
      return <Bathtub {...size} />;
    case "smallSink":
      return <SmallSink {...size} />;
    case "towelRail":
      return <TowelRail {...size} />;
    case "washerStack":
      return <WasherStack {...size} />;
    case "utility":
      return <Utility {...size} />;
    case "shoeCabinet":
      return <ShoeCabinet {...size} />;
    case "coatRack":
      return <CoatRack {...size} />;
    case "doormat":
      return <Doormat {...size} />;
    case "desk":
      return <Desk {...size} />;
    case "deskChair":
      return <DeskChair />;
    case "bistroTable":
      return <BistroTable {...size} />;
    case "bistroChair":
      return <BistroChair />;
    case "planter":
      return <Planter {...size} />;
  }
}

export const FurnitureMesh = memo(function FurnitureMesh({
  item,
}: {
  item: FurnitureItem;
}) {
  return (
    <group
      position={[item.x, 0, item.z]}
      rotation={[0, facingAngle[item.facing ?? "s"], 0]}
    >
      {renderItem(item)}
    </group>
  );
});
