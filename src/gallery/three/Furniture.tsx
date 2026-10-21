import * as THREE from "three";

const fabric = "#b9ab94";
const oak = "#8b5e3c";
const dark = "#2c2622";

function B({ p, s, c, r = 0.8 }: { p: [number, number, number]; s: [number, number, number]; c: string; r?: number }) {
  return (
    <mesh position={p}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={r} />
    </mesh>
  );
}

function Plant({ p }: { p: [number, number, number] }) {
  return (
    <group position={p}>
      <mesh position-y={0.3}>
        <cylinderGeometry args={[0.28, 0.22, 0.6, 20]} />
        <meshStandardMaterial color="#c9b79c" roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.3) * 0.25, 1 + i * 0.18, Math.cos(i * 1.3) * 0.25]}>
          <sphereGeometry args={[0.35 - i * 0.03, 12, 10]} />
          <meshStandardMaterial color={i % 2 ? "#4f6b45" : "#5e7a4f"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// Light-weight procedural furnishing per room id; add new room ids here.
export function Furniture({ roomId, rug }: { roomId: string; rug: THREE.Material }) {
  switch (roomId) {
    case "foyer":
      return (
        <>
          <B p={[-3.6, 0.45, 0]} s={[0.6, 0.08, 3]} c={oak} />
          <B p={[-3.6, 0.2, -1.3]} s={[0.5, 0.4, 0.08]} c={dark} />
          <B p={[-3.6, 0.2, 1.3]} s={[0.5, 0.4, 0.08]} c={dark} />
          <Plant p={[3.8, 0, -3.8]} />
          <mesh rotation-x={-Math.PI / 2} position-y={0.01} material={rug}>
            <planeGeometry args={[3, 4]} />
          </mesh>
        </>
      );
    case "living":
      return (
        <>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0.5]} material={rug}>
            <planeGeometry args={[4.5, 3.4]} />
          </mesh>
          <B p={[0, 0.3, -2]} s={[3.4, 0.45, 1]} c={fabric} r={1} />
          <B p={[0, 0.75, -2.4]} s={[3.4, 0.6, 0.25]} c={fabric} r={1} />
          <B p={[-1.8, 0.55, -2]} s={[0.25, 0.55, 1]} c={fabric} r={1} />
          <B p={[1.8, 0.55, -2]} s={[0.25, 0.55, 1]} c={fabric} r={1} />
          <B p={[0, 0.38, 0.4]} s={[1.6, 0.06, 0.8]} c={oak} r={0.4} />
          <B p={[0, 0.18, 0.4]} s={[1.4, 0.32, 0.6]} c={dark} />
          <Plant p={[3.6, 0, -3.6]} />
        </>
      );
    case "studio":
      return (
        <>
          <group position={[0.5, 0, 0.5]} rotation-y={0.5}>
            <B p={[0, 1, 0]} s={[0.06, 2, 0.06]} c={oak} />
            <B p={[-0.5, 0.9, 0.3]} s={[0.05, 1.8, 0.05]} c={oak} />
            <B p={[0.5, 0.9, 0.3]} s={[0.05, 1.8, 0.05]} c={oak} />
            <B p={[0, 0.9, 0.05]} s={[1.2, 0.05, 0.15]} c={oak} />
            <B p={[0, 1.4, 0.07]} s={[1, 0.9, 0.04]} c="#f2ede3" />
          </group>
          <B p={[-3, 0.45, 3]} s={[2.4, 0.08, 1]} c={oak} r={0.5} />
          <B p={[-3, 0.22, 3]} s={[2.2, 0.44, 0.9]} c="#6d4a30" />
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-3.6 + i * 0.5, 0.6, 3]}>
              <cylinderGeometry args={[0.08, 0.08, 0.22, 12]} />
              <meshStandardMaterial color={["#b5654a", "#2f4a52", "#d8b24a"][i]} />
            </mesh>
          ))}
        </>
      );
    case "corridor":
      return (
        <>
          <B p={[0, 0.005, 0]} s={[8, 0.01, 1.6]} c="#5d3f2c" r={1} />
          <Plant p={[0, 0, 3.6]} />
        </>
      );
    case "bedroom":
      return (
        <>
          <B p={[0, 0.3, 1.8]} s={[2.2, 0.5, 2.6]} c="#efe7da" r={1} />
          <B p={[0, 0.7, 3.15]} s={[2.4, 1, 0.12]} c={oak} />
          <B p={[0, 0.58, 1.1]} s={[2.2, 0.08, 1.2]} c="#8e9d8c" r={1} />
          <B p={[-1.6, 0.3, 2.8]} s={[0.6, 0.6, 0.5]} c={oak} />
          <B p={[1.6, 0.3, 2.8]} s={[0.6, 0.6, 0.5]} c={oak} />
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} material={rug}>
            <planeGeometry args={[3.4, 2.4]} />
          </mesh>
        </>
      );
    default:
      return null;
  }
}
