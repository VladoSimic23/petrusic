"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Joystick, Minimap } from "./apartment-walkthrough/hud";
import { rooms, startRoom } from "./apartment-walkthrough/floorplan";
import {
  createWalkInput,
  look,
  teleport,
} from "./apartment-walkthrough/walk-input";

/**
 * Virtualna šetnja kroz stan Tip 1 u prvom licu.
 *
 * - 3D scena (Three.js) učitava se tek kad se sekcija približi ekranu.
 * - Desktop: W/A/S/D ili strelice, Shift za brži hod, miš (Pointer Lock) za pogled.
 * - Mobitel/tablet: joystick za kretanje, povlačenje prstom za pogled.
 */
const WalkthroughScene = dynamic(
  () => import("./apartment-walkthrough/walkthrough-scene"),
  {
    ssr: false,
    loading: () => <div className="fpw__loading">Pripremamo 3D prikaz stana…</div>,
  },
);

const MOVE_KEYS = new Set([
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "shift",
]);
const MOUSE_SENSITIVITY = 0.0022;
const DRAG_SENSITIVITY = 0.0042;
const TOUCH_SENSITIVITY = 0.0058;

const featuredRooms = rooms.filter((room) => room.featured);

export default function FirstPersonApartmentWalkthrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const roomLabelRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef(createWalkInput());
  const lockedRef = useRef(false);

  const [shouldLoad, setShouldLoad] = useState(false);
  const [active, setActive] = useState(false);
  const [started, setStarted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Lijeno učitavanje teške 3D scene.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const pause = useCallback(() => {
    const input = inputRef.current;
    input.active = false;
    input.keys.clear();
    input.move.x = 0;
    input.move.y = 0;
    setActive(false);
    if (document.pointerLockElement) {
      lockedRef.current = false;
      document.exitPointerLock();
    }
  }, []);

  const start = useCallback((roomId?: string) => {
    const input = inputRef.current;
    if (roomId) teleport(input, roomId);
    const touch = window.matchMedia("(pointer: coarse)").matches;
    input.active = true;
    setIsTouch(touch);
    setActive(true);
    setStarted(true);
    setShouldLoad(true);

    if (!touch && viewportRef.current) {
      try {
        // Ako preglednik odbije Pointer Lock, pogled radi povlačenjem miša.
        Promise.resolve(viewportRef.current.requestPointerLock()).catch(() => undefined);
      } catch {
        /* povlačenje mišem ostaje dostupno */
      }
    }
  }, []);

  const jumpTo = useCallback(
    (roomId: string) => {
      if (active) {
        teleport(inputRef.current, roomId);
        return;
      }
      start(roomId);
    },
    [active, start],
  );

  // Unos dok je šetnja aktivna.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!active || !viewport) return;
    const input = inputRef.current;
    let drag: { id: number; x: number; y: number; touch: boolean } | null = null;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "escape") {
        pause();
        return;
      }
      if (MOVE_KEYS.has(key)) {
        event.preventDefault();
        input.keys.add(key);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      input.keys.delete(event.key.toLowerCase());
    };
    const handleBlur = () => input.keys.clear();

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === viewport) {
        look(input, event.movementX, event.movementY, MOUSE_SENSITIVITY);
      }
    };

    const handleLockChange = () => {
      if (document.pointerLockElement === viewport) {
        lockedRef.current = true;
      } else if (lockedRef.current) {
        lockedRef.current = false;
        pause();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (document.pointerLockElement === viewport) return;
      if ((event.target as HTMLElement).closest("[data-fpw-control]")) return;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        touch: event.pointerType !== "mouse",
      };
      viewport.setPointerCapture(event.pointerId);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      look(
        input,
        event.clientX - drag.x,
        event.clientY - drag.y,
        drag.touch ? TOUCH_SENSITIVITY : DRAG_SENSITIVITY,
      );
      drag.x = event.clientX;
      drag.y = event.clientY;
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (drag?.id === event.pointerId) drag = null;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handleLockChange);
    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", handlePointerUp);
    viewport.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", handleLockChange);
      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerup", handlePointerUp);
      viewport.removeEventListener("pointercancel", handlePointerUp);
      input.keys.clear();
    };
  }, [active, pause]);

  return (
    <section
      ref={sectionRef}
      className="fpw"
      aria-labelledby="fpw-title"
    >
      <header className="fpw__header">
        <div>
          <p className="fpw__eyebrow">Stan Tip 1 · trosoban · 93,71 m²</p>
          <h2 id="fpw-title">Virtualna šetnja kroz stan</h2>
        </div>
        <p className="fpw__intro">
          Prošećite prostorom u prvom licu – od ulaza, kroz dnevni boravak i
          kuhinju, do spavaćih soba i terase.
        </p>
      </header>

      <div
        ref={viewportRef}
        className="fpw__viewport"
        data-active={active ? "true" : "false"}
      >
        {shouldLoad ? (
          <WalkthroughScene
            inputRef={inputRef}
            active={active}
            markerRef={markerRef}
            roomLabelRef={roomLabelRef}
          />
        ) : (
          <div className="fpw__loading">Pripremamo 3D prikaz stana…</div>
        )}

        <div className="fpw__room" aria-live="polite">
          <span aria-hidden="true" className="fpw__room-dot" />
          <span ref={roomLabelRef}>{startRoom.label}</span>
        </div>

        <Minimap markerRef={markerRef} />

        {active ? (
          <>
            <div aria-hidden="true" className="fpw__crosshair" />
            {isTouch ? (
              <>
                <Joystick inputRef={inputRef} />
                <button
                  className="fpw__exit"
                  data-fpw-control=""
                  onClick={pause}
                  type="button"
                >
                  Pauza
                </button>
                <p className="fpw__hint">Joystick za hod · povucite prstom za pogled</p>
              </>
            ) : (
              <p className="fpw__hint">
                <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd> kretanje · <kbd>Shift</kbd> brže · miš pogled ·{" "}
                <kbd>Esc</kbd> pauza
              </p>
            )}
          </>
        ) : (
          <div className="fpw__overlay">
            <p className="fpw__overlay-title">
              {started ? "Šetnja je pauzirana" : "Zakoračite u svoj novi dom"}
            </p>
            <p className="fpw__overlay-text">
              Koristi W, A, S, D za kretanje, miš za pogled. Na mobitelu koristite
              joystick i povlačenje prstom.
            </p>
            <button className="fpw__start" onClick={() => start()} type="button">
              {started ? "Nastavi šetnju" : "Započni šetnju"}
              <span aria-hidden="true">→</span>
            </button>
            <div className="fpw__rooms" role="group" aria-label="Kreni iz prostorije">
              {featuredRooms.map((room) => (
                <button key={room.id} onClick={() => jumpTo(room.id)} type="button">
                  {room.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="fpw__note">
        Orijentacijski 3D prikaz izrađen prema kataloškom tlocrtu. Namještaj je
        ilustrativan; za točne mjere mjerodavna je projektna dokumentacija.
      </p>
    </section>
  );
}
