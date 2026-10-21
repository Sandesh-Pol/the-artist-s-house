import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import { CELL, ROOMS, STOREY } from "../data/rooms";
import { Room } from "./Room";
import { CameraRig } from "./CameraRig";

export function House() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 60, near: 0.05, far: 80 }}
    >
      <color attach="background" args={["#e9e1d3"]} />
      <fog attach="fog" args={["#e9e1d3", 14, 40]} />
      <hemisphereLight args={["#fff7ea", "#8a6a4a", 0.9]} />
      <ambientLight intensity={0.25} />
      <Environment resolution={64}>
        <Lightformer intensity={1.4} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} color="#fff3df" />
        <Lightformer intensity={0.8} position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[20, 4, 1]} color="#dfe9ee" />
      </Environment>
      {ROOMS.map((r) => (
        <Room key={r.id} room={r} />
      ))}
      {/* mass beneath upper-floor rooms */}
      <mesh position={[1.5 * CELL, STOREY / 2 - 0.01, CELL]}>
        <boxGeometry args={[2 * CELL - 0.4, STOREY - 0.05, CELL - 0.4]} />
        <meshStandardMaterial color="#d9cfbf" />
      </mesh>
      <CameraRig />
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
