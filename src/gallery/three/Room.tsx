import { useMemo } from "react";
import * as THREE from "three";
import { CELL, STOREY, roomCenter, type Room as RoomT, type Side } from "../data/rooms";
import { plasterTexture, rugTexture, woodTexture } from "./textures";
import { Frame } from "./Frame";
import { Furniture } from "./Furniture";

const D = CELL / 2 - 0.1;
const WALL_T = 0.2;
const DOOR_W = 2.2;
const DOOR_H = 2.7;
const ROT: Record<Side, number> = { n: 0, s: Math.PI, e: -Math.PI / 2, w: Math.PI / 2 };
const POS: Record<Side, [number, number]> = { n: [0, -D], s: [0, D], e: [D, 0], w: [-D, 0] };

function Box({ x0, x1, y0, y1, mat }: { x0: number; x1: number; y0: number; y1: number; mat: THREE.Material }) {
  if (x1 - x0 <= 0 || y1 - y0 <= 0) return null;
  return (
    <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, 0]} material={mat}>
      <boxGeometry args={[x1 - x0, y1 - y0, WALL_T]} />
    </mesh>
  );
}

function Wall({ room, side, mat, trim }: { room: RoomT; side: Side; mat: THREE.Material; trim: THREE.Material }) {
  const door = room.doors.find((d) => d.side === side);
  const hasWindow = room.windows.includes(side);
  const h = room.height;
  const half = CELL / 2;
  const [px, pz] = POS[side];
  const db = door?.bottom ?? 0;
  return (
    <group position={[px, 0, pz]} rotation-y={ROT[side]}>
      {door ? (
        <>
          <Box x0={-half} x1={-DOOR_W / 2} y0={0} y1={h} mat={mat} />
          <Box x0={DOOR_W / 2} x1={half} y0={0} y1={h} mat={mat} />
          <Box x0={-DOOR_W / 2} x1={DOOR_W / 2} y0={db + DOOR_H} y1={h} mat={mat} />
          <Box x0={-DOOR_W / 2} x1={DOOR_W / 2} y0={0} y1={db} mat={mat} />
          {/* door casing */}
          <mesh position={[0, db + DOOR_H + 0.05, 0.12]} material={trim}>
            <boxGeometry args={[DOOR_W + 0.3, 0.1, 0.06]} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * (DOOR_W / 2 + 0.08), db + DOOR_H / 2, 0.12]} material={trim}>
              <boxGeometry args={[0.1, DOOR_H, 0.06]} />
            </mesh>
          ))}
        </>
      ) : (
        <Box x0={-half} x1={half} y0={0} y1={h} mat={mat} />
      )}
      {/* skirting board */}
      <mesh position={[0, 0.07, 0.11]} material={trim}>
        <boxGeometry args={[CELL - 0.2, 0.14, 0.03]} />
      </mesh>
      {hasWindow && <Window y={Math.min(h / 2 + 0.2, 2.4)} trim={trim} tall={h > STOREY} />}
      {room.slots
        .filter((s) => s.side === side)
        .map((s) => (
          <group key={s.id} position={[s.u, s.y ?? 1.75, 0.1]}>
            <Frame slot={s} roomId={room.id} />
          </group>
        ))}
    </group>
  );
}

function Window({ y, trim, tall }: { y: number; trim: THREE.Material; tall: boolean }) {
  const w = 3.4;
  const h = tall ? 5 : 2.6;
  const cy = tall ? 4.5 : y;
  return (
    <group position={[0, cy, 0.11]}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#dfeaf0" emissive="#f4efe2" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      {[-w / 2, 0, w / 2].map((x) => (
        <mesh key={x} position={[x, 0, 0.03]} material={trim}>
          <boxGeometry args={[0.07, h, 0.06]} />
        </mesh>
      ))}
      {[-h / 2, h / 6, h / 2].map((yy) => (
        <mesh key={yy} position={[0, yy, 0.03]} material={trim}>
          <boxGeometry args={[w, 0.07, 0.06]} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 1.2]} intensity={6} distance={8} color="#fff4e0" />
    </group>
  );
}

function Stairs({ wood, trim }: { wood: THREE.Material; trim: THREE.Material }) {
  const n = 15;
  const rise = STOREY / n;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const top = (i + 1) * rise;
        return (
          <mesh key={i} position={[-3.8, top / 2, 4.5 - i * 0.5 - 0.25]} material={wood}>
            <boxGeometry args={[2, top, 0.5]} />
          </mesh>
        );
      })}
      {/* landings */}
      <mesh position={[0, STOREY - 0.12, -3.95]} material={wood}>
        <boxGeometry args={[9.8, 0.25, 1.9]} />
      </mesh>
      <mesh position={[3.75, STOREY - 0.12, -0.9]} material={wood}>
        <boxGeometry args={[2.3, 0.25, 4.2]} />
      </mesh>
      {/* handrail */}
      <mesh position={[-2.8, STOREY / 2 + 0.9, 0.75]} rotation-x={Math.atan2(STOREY, 7.5)} material={trim}>
        <boxGeometry args={[0.06, 0.06, 8.8]} />
      </mesh>
      <mesh position={[-0.2, STOREY + 0.9, -3]} material={trim}>
        <boxGeometry args={[5.2, 0.06, 0.06]} />
      </mesh>
      <mesh position={[2.6, STOREY + 0.9, -0.9]} material={trim}>
        <boxGeometry args={[0.06, 0.06, 4.2]} />
      </mesh>
      {/* glass balustrade */}
      <mesh position={[-0.2, STOREY + 0.45, -3]}>
        <boxGeometry args={[5.2, 0.9, 0.02]} />
        <meshStandardMaterial color="#cfe0e0" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export function Room({ room }: { room: RoomT }) {
  const [cx, cy, cz] = roomCenter(room);
  const mats = useMemo(() => {
    const wall = new THREE.MeshStandardMaterial({ color: room.wallTone, map: plasterTexture(), roughness: 0.95 });
    const floor = new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.55 });
    const ceiling = new THREE.MeshStandardMaterial({ color: "#f7f3ec", roughness: 1 });
    const trim = new THREE.MeshStandardMaterial({ color: "#f3eee5", roughness: 0.6 });
    const rug = new THREE.MeshStandardMaterial({ map: rugTexture(), roughness: 1 });
    return { wall, floor, ceiling, trim, rug };
  }, [room.wallTone]);

  return (
    <group position={[cx, cy, cz]}>
      <mesh rotation-x={-Math.PI / 2} material={mats.floor}>
        <planeGeometry args={[CELL, CELL]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position-y={room.height} material={mats.ceiling}>
        <planeGeometry args={[CELL, CELL]} />
      </mesh>
      {(["n", "e", "s", "w"] as Side[]).map((s) => (
        <Wall key={s} room={room} side={s} mat={mats.wall} trim={mats.trim} />
      ))}
      {room.stairs && <Stairs wood={mats.floor} trim={mats.trim} />}
      <Furniture roomId={room.id} rug={mats.rug} />
      {/* pendant */}
      <group position={[0, room.height - 0.9, 0]}>
        <mesh position-y={0.45}>
          <cylinderGeometry args={[0.008, 0.008, 0.9]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.22, 24, 16]} />
          <meshStandardMaterial color="#fff6e0" emissive="#ffe2a8" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        <pointLight intensity={14} distance={13} decay={1.6} color="#ffe6c2" />
      </group>
    </group>
  );
}
