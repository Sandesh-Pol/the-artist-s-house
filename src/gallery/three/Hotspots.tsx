import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { HOTSPOTS, type Hotspot } from "../data/hotspots";
import { useGallery } from "../store";
import { dragState } from "./dragState";

// Small procedural props that open an info card when clicked.

function Vase() {
  return (
    <group>
      <mesh position-y={0.22}>
        <cylinderGeometry args={[0.13, 0.2, 0.44, 20]} />
        <meshStandardMaterial color="#7d94a0" roughness={0.35} metalness={0.1} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.sin(i * 2.1) * 0.08, 0.62, Math.cos(i * 2.1) * 0.08]} rotation-z={Math.sin(i * 2.1) * 0.4}>
          <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
          <meshStandardMaterial color="#5e7a4f" />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.sin(i * 2.1) * 0.16, 0.82, Math.cos(i * 2.1) * 0.16]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshStandardMaterial color={["#d98a8a", "#e8e0ef", "#e0b64f"][i]} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function PlantProp() {
  return (
    <group>
      <mesh position-y={0.28}>
        <cylinderGeometry args={[0.26, 0.2, 0.56, 18]} />
        <meshStandardMaterial color="#b06a4a" roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.1) * 0.22, 0.85 + i * 0.14, Math.cos(i * 1.1) * 0.22]}>
          <sphereGeometry args={[0.3 - i * 0.025, 12, 10]} />
          <meshStandardMaterial color={i % 2 ? "#4f6b45" : "#68855a"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function FloorLamp() {
  const lightsOn = useGallery((s) => s.lightsOn);
  return (
    <group>
      <mesh position-y={0.02}>
        <cylinderGeometry args={[0.22, 0.26, 0.04, 18]} />
        <meshStandardMaterial color="#3a332c" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position-y={0.85}>
        <cylinderGeometry args={[0.02, 0.02, 1.7, 8]} />
        <meshStandardMaterial color="#3a332c" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position-y={1.78}>
        <cylinderGeometry args={[0.2, 0.3, 0.34, 18, 1, true]} />
        <meshStandardMaterial
          color="#e9dcc3"
          emissive="#ffdf9e"
          emissiveIntensity={lightsOn ? 1.4 : 0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {lightsOn && <pointLight position-y={1.7} intensity={4} distance={6} color="#ffe2b0" />}
    </group>
  );
}

function BookStack() {
  const cols = ["#8a4a3a", "#2f4a52", "#c8a24a", "#5a6b48"];
  return (
    <group>
      {cols.map((c, i) => (
        <mesh key={c} position-y={0.025 + i * 0.05} rotation-y={i * 0.35}>
          <boxGeometry args={[0.34 - i * 0.03, 0.05, 0.24 - i * 0.02]} />
          <meshStandardMaterial color={c} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function TeaSet() {
  return (
    <group>
      <mesh position-y={0.02}>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 20]} />
        <meshStandardMaterial color="#d9cfbf" roughness={0.4} />
      </mesh>
      <mesh position={[-0.08, 0.11, 0]}>
        <sphereGeometry args={[0.11, 16, 12]} />
        <meshStandardMaterial color="#40525c" roughness={0.3} />
      </mesh>
      <mesh position={[0.16, 0.08, 0.08]}>
        <cylinderGeometry args={[0.05, 0.04, 0.09, 12]} />
        <meshStandardMaterial color="#e8e0d2" roughness={0.4} />
      </mesh>
      <mesh position={[0.14, 0.08, -0.12]}>
        <cylinderGeometry args={[0.05, 0.04, 0.09, 12]} />
        <meshStandardMaterial color="#e8e0d2" roughness={0.4} />
      </mesh>
    </group>
  );
}

function VinylPlayer() {
  const disc = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (disc.current) disc.current.rotation.y += dt * 1.6;
  });
  return (
    <group>
      <mesh position-y={0.35}>
        <boxGeometry args={[0.9, 0.7, 0.5]} />
        <meshStandardMaterial color="#6d4a30" roughness={0.6} />
      </mesh>
      <mesh position-y={0.72}>
        <boxGeometry args={[0.5, 0.05, 0.42]} />
        <meshStandardMaterial color="#2c2622" roughness={0.4} />
      </mesh>
      <mesh ref={disc} position-y={0.76}>
        <cylinderGeometry args={[0.17, 0.17, 0.015, 24]} />
        <meshStandardMaterial color="#141210" roughness={0.3} />
      </mesh>
      <mesh position-y={0.775}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial color="#c8a24a" roughness={0.5} />
      </mesh>
    </group>
  );
}

const KINDS = { vase: Vase, plant: PlantProp, lamp: FloorLamp, books: BookStack, tea: TeaSet, vinyl: VinylPlayer };

function HotspotProp({ h }: { h: Hotspot }) {
  const setHotspot = useGallery((s) => s.setHotspot);
  const active = useGallery((s) => s.hotspot === h.id);
  const [hover, setHover] = useState(false);
  const g = useRef<THREE.Group>(null);
  const Body = KINDS[h.kind];

  useFrame((_, dt) => {
    if (!g.current) return;
    const target = hover || active ? 1.12 : 1;
    if (Math.abs(target - g.current.scale.x) < 0.001) {
      g.current.scale.setScalar(target);
      return;
    }
    const k = 1 - Math.exp(-10 * dt);
    g.current.scale.setScalar(g.current.scale.x + (target - g.current.scale.x) * k);
  });

  const click = (e: ThreeEvent<MouseEvent>) => {
    if (dragState.moved) return;
    e.stopPropagation();
    setHotspot(active ? null : h.id);
  };

  return (
    <group position={h.pos} rotation-y={h.rotY ?? 0}>
      <group
        ref={g}
        onClick={click}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
      >
        <Body />
      </group>
      {/* invisible generous hit area so small props are easy to tap on mobile */}
      <mesh position-y={0.6} onClick={click} visible={false}>
        <sphereGeometry args={[0.55, 8, 8]} />
      </mesh>
      {(hover || active) && (
        <mesh position-y={0.02} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.4, 0.48, 32]} />
          <meshBasicMaterial color="#c8a24a" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

export function Hotspots({ roomId }: { roomId: string }) {
  return (
    <>
      {HOTSPOTS.filter((h) => h.roomId === roomId).map((h) => (
        <HotspotProp key={h.id} h={h} />
      ))}
    </>
  );
}
