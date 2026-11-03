"use client";

import { Environment, Lightformer, Sky } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import { BackSide, Object3D } from "three";
import { ApartmentModel } from "./apartment-model";
import { EYE_HEIGHT, findRoom, isBlocked, roomLights } from "./floorplan";
import type { WalkInput } from "./walk-input";

const WALK_SPEED = 1.9;
const RUN_SPEED = 3.4;

type SceneProps = {
  inputRef: RefObject<WalkInput>;
  active: boolean;
  markerRef: RefObject<SVGGElement | null>;
  roomLabelRef: RefObject<HTMLSpanElement | null>;
};

/** Čita ulaz (tipkovnica, joystick, miš) i pomiče kameru uz kolizije. */
function Player({ inputRef, markerRef, roomLabelRef }: Omit<SceneProps, "active">) {
  const velocity = useRef({ x: 0, z: 0 });
  const stepPhase = useRef(0);
  const lastRoom = useRef("");

  useFrame((state, delta) => {
    const input = inputRef.current;
    const dt = Math.min(delta, 0.05);
    let forward = 0;
    let strafe = 0;

    if (input.active) {
      const keys = input.keys;
      forward =
        Number(keys.has("w") || keys.has("arrowup")) -
        Number(keys.has("s") || keys.has("arrowdown")) -
        input.move.y;
      strafe =
        Number(keys.has("d") || keys.has("arrowright")) -
        Number(keys.has("a") || keys.has("arrowleft")) +
        input.move.x;
      const length = Math.hypot(forward, strafe);
      if (length > 1) {
        forward /= length;
        strafe /= length;
      }
    }

    // Glatko ubrzanje/usporavanje umjesto trenutnog starta i stopa.
    const speed = input.keys.has("shift") ? RUN_SPEED : WALK_SPEED;
    const sin = Math.sin(input.yaw);
    const cos = Math.cos(input.yaw);
    const targetX = (-sin * forward + cos * strafe) * speed;
    const targetZ = (-cos * forward - sin * strafe) * speed;
    const v = velocity.current;
    const blend = Math.min(1, dt * 9);
    v.x += (targetX - v.x) * blend;
    v.z += (targetZ - v.z) * blend;

    // Kretanje po osima zasebno omogućuje klizanje uz zidove.
    const nextX = input.x + v.x * dt;
    if (!isBlocked(nextX, input.z)) input.x = nextX;
    else v.x = 0;
    const nextZ = input.z + v.z * dt;
    if (!isBlocked(input.x, nextZ)) input.z = nextZ;
    else v.z = 0;

    const moving = Math.hypot(v.x, v.z);
    stepPhase.current += moving * dt * 3.4;
    const bob = Math.sin(stepPhase.current * Math.PI * 2) * 0.018 * Math.min(1, moving / WALK_SPEED);

    const camera = state.camera;
    camera.rotation.order = "YXZ";
    camera.rotation.set(input.pitch, input.yaw, 0);
    camera.position.set(input.x, EYE_HEIGHT + bob, input.z);

    markerRef.current?.setAttribute(
      "transform",
      `translate(${input.x.toFixed(2)} ${input.z.toFixed(2)}) rotate(${((-input.yaw * 180) / Math.PI).toFixed(1)})`,
    );

    const room = findRoom(input.x, input.z);
    if (room && room.label !== lastRoom.current) {
      lastRoom.current = room.label;
      if (roomLabelRef.current) roomLabelRef.current.textContent = room.label;
    }
  });

  return null;
}

/** Omogućuje vanjskom UI-ju da zatraži novi kadar dok je scena pauzirana. */
function InvalidateBridge({ inputRef }: { inputRef: RefObject<WalkInput> }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const input = inputRef.current;
    input.invalidate = () => invalidate();
    return () => {
      input.invalidate = undefined;
    };
  }, [inputRef, invalidate]);
  return null;
}

function Sun() {
  const [target] = useState(() => new Object3D());
  return (
    <>
      <primitive object={target} position={[4.15, 0, 9.45]} />
      <directionalLight
        target={target}
        position={[-6.5, 9.5, 15]}
        intensity={3.2}
        color="#fff0da"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-camera-near={1}
        shadow-camera-far={45}
      />
    </>
  );
}

function Lighting() {
  return (
    <>
      <Sky
        distance={450}
        sunPosition={[-60, 32, 45]}
        turbidity={5}
        rayleigh={1.1}
        mieCoefficient={0.004}
        mieDirectionalG={0.82}
      />
      <fog attach="fog" args={["#dde4e8", 90, 420]} />
      <hemisphereLight args={["#fffaf1", "#d9cab4", 0.9]} />
      <ambientLight intensity={0.18} />
      <Sun />
      {roomLights.map((position) => (
        <pointLight
          key={position.join("-")}
          position={position}
          intensity={5}
          distance={7}
          decay={2}
          color="#ffe2bd"
        />
      ))}
      {/* Statično okruženje (bez preuzimanja HDR-a) za meke refleksije i difuzno svjetlo. */}
      <Environment resolution={128} frames={1}>
        {/* Svijetla "soba" oko izvora svjetla – metal i zrcala ne reflektiraju crnu prazninu. */}
        <mesh scale={40}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color="#cfc5b7" side={BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={1.6} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} color="#fff6ea" />
        <Lightformer form="rect" intensity={1.4} position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[20, 4, 1]} color="#dfeaf2" />
        <Lightformer form="rect" intensity={0.8} position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[20, 4, 1]} color="#ffe6c9" />
        <Lightformer form="rect" intensity={0.5} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} color="#c9ab86" />
      </Environment>
    </>
  );
}

export default function WalkthroughScene({
  inputRef,
  active,
  markerRef,
  roomLabelRef,
}: SceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "demand"}
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ fov: 70, near: 0.05, far: 1000 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        // Scena je statična: sjene se računaju jednom, ne u svakom kadru.
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Lighting />
      <ApartmentModel />
      <Player inputRef={inputRef} markerRef={markerRef} roomLabelRef={roomLabelRef} />
      <InvalidateBridge inputRef={inputRef} />
    </Canvas>
  );
}
