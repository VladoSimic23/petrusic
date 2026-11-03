import { rooms, startRoom, type RoomSpawn } from "./floorplan";

/**
 * Zajedničko, promjenjivo stanje igrača. Drži se u `useRef` kako unos
 * (tipkovnica, miš, dodir) ne bi izazivao React re-render u svakom kadru.
 */
export type WalkInput = {
  active: boolean;
  keys: Set<string>;
  /** Vektor virtualnog joysticka: x desno, y prema natrag (−1…1). */
  move: { x: number; y: number };
  x: number;
  z: number;
  yaw: number;
  pitch: number;
  invalidate?: () => void;
};

export const MAX_PITCH = 1.35;

export function createWalkInput(): WalkInput {
  const spawn = startRoom.spawn as RoomSpawn;
  return {
    active: false,
    keys: new Set(),
    move: { x: 0, y: 0 },
    x: spawn.x,
    z: spawn.z,
    yaw: spawn.yaw,
    pitch: 0,
  };
}

export function teleport(input: WalkInput, roomId: string) {
  const spawn = rooms.find((room) => room.id === roomId)?.spawn;
  if (!spawn) return;
  input.x = spawn.x;
  input.z = spawn.z;
  input.yaw = spawn.yaw;
  input.pitch = -0.05;
  input.invalidate?.();
}

export function look(input: WalkInput, deltaX: number, deltaY: number, sensitivity: number) {
  input.yaw -= deltaX * sensitivity;
  input.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, input.pitch - deltaY * sensitivity));
}
