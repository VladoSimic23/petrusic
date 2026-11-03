"use client";

import { useRef, type RefObject } from "react";
import { floorPolygon, rooms, startRoom, terrace, type RoomSpawn } from "./floorplan";
import type { WalkInput } from "./walk-input";

const spawn = startRoom.spawn as RoomSpawn;
const outline = floorPolygon.map(([x, z]) => `${x},${z}`).join(" ");

/** Tlocrt u kutu ekrana s pozicijom i smjerom gledanja posjetitelja. */
export function Minimap({ markerRef }: { markerRef: RefObject<SVGGElement | null> }) {
  return (
    <svg
      aria-hidden="true"
      className="fpw__minimap"
      viewBox="-0.6 -0.6 9.5 20.1"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x={terrace.x1}
        y={terrace.z1}
        width={terrace.x2 - terrace.x1}
        height={terrace.z2 - terrace.z1}
        className="fpw__minimap-terrace"
      />
      {rooms
        .filter((room) => room.id !== "hodnik" && room.id !== "terasa")
        .flatMap((room) =>
          room.rects.map((area) => (
            <rect
              key={`${room.id}-${area.x1}-${area.z1}`}
              x={area.x1}
              y={area.z1}
              width={area.x2 - area.x1}
              height={area.z2 - area.z1}
              className="fpw__minimap-room"
            />
          )),
        )}
      <polygon points={outline} className="fpw__minimap-outline" />
      <g
        ref={markerRef}
        transform={`translate(${spawn.x} ${spawn.z}) rotate(${(-spawn.yaw * 180) / Math.PI})`}
      >
        <path d="M0 -1.1 L0.55 -0.1 L-0.55 -0.1 Z" className="fpw__minimap-view" />
        <circle r="0.3" className="fpw__minimap-dot" />
      </g>
    </svg>
  );
}

/** Virtualni joystick za kretanje na dodirnim ekranima. */
export function Joystick({ inputRef }: { inputRef: RefObject<WalkInput> }) {
  const knobRef = useRef<HTMLSpanElement>(null);
  const origin = useRef<{ x: number; y: number; id: number } | null>(null);
  const maxDistance = 42;

  const update = (deltaX: number, deltaY: number) => {
    const length = Math.hypot(deltaX, deltaY);
    const factor = length > maxDistance ? maxDistance / length : 1;
    const x = deltaX * factor;
    const y = deltaY * factor;
    inputRef.current.move.x = x / maxDistance;
    inputRef.current.move.y = y / maxDistance;
    if (knobRef.current) knobRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const release = () => {
    origin.current = null;
    update(0, 0);
  };

  return (
    <div
      aria-label="Joystick za kretanje"
      className="fpw__joystick"
      data-fpw-control=""
      role="presentation"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        const bounds = event.currentTarget.getBoundingClientRect();
        origin.current = {
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
          id: event.pointerId,
        };
        update(event.clientX - origin.current.x, event.clientY - origin.current.y);
      }}
      onPointerMove={(event) => {
        if (!origin.current || origin.current.id !== event.pointerId) return;
        update(event.clientX - origin.current.x, event.clientY - origin.current.y);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span ref={knobRef} />
    </div>
  );
}
