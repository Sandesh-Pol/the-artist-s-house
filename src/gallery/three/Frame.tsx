import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { FrameSlot } from "../data/rooms";
import { useGallery, artworkFor } from "../store";
import { dragState } from "./dragState";

function useImageTexture(url?: string) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!url) return setTex(null);
    let alive = true;
    new THREE.TextureLoader().load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      if (alive) setTex(t);
    });
    return () => {
      alive = false;
    };
  }, [url]);
  return tex;
}

export function Frame({ slot, roomId }: { slot: FrameSlot; roomId: string }) {
  const art = useGallery((s) => artworkFor(s.uploads, slot.id));
  const curate = useGallery((s) => s.curate);
  const tex = useImageTexture(art?.image);
  const [hover, setHover] = useState(false);
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const target = hover ? 0.12 : 0;
    g.position.z += (target - g.position.z) * (1 - Math.exp(-10 * dt));
  });

  // fit image inside the slot preserving aspect
  let iw = slot.w * 0.78;
  let ih = slot.h * 0.78;
  if (tex?.image) {
    const img = tex.image as { width: number; height: number };
    const a = img.width / img.height;
    if (a > iw / ih) ih = iw / a;
    else iw = ih * a;
  }
  const fw = iw / 0.78 + 0.02;
  const fh = ih / 0.78 + 0.02;
  const filled = !!art;

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (dragState.moved) return;
        const st = useGallery.getState();
        st.face(roomId, slot.side);
        if (!filled || st.curate) st.edit(slot.id);
        else st.select(slot.id);
      }}
    >
      {/* frame moulding */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[fw + 0.12, fh + 0.12, 0.06]} />
        <meshStandardMaterial color={filled ? "#2b2018" : "#8a6a48"} roughness={0.45} metalness={0.15} />
      </mesh>
      {/* mat */}
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[fw, fh]} />
        <meshStandardMaterial color="#f6f1e7" roughness={0.95} />
      </mesh>
      {tex ? (
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[iw, ih]} />
          <meshStandardMaterial map={tex} roughness={0.7} />
        </mesh>
      ) : (
        <Text position={[0, 0, 0.075]} fontSize={0.09} color="#8a7a66" anchorX="center" anchorY="middle" maxWidth={fw * 0.8} textAlign="center">
          {curate || hover ? "+ Add artwork" : "Empty frame"}
        </Text>
      )}
      {/* picture light */}
      <mesh position={[0, fh / 2 + 0.22, 0.12]}>
        <boxGeometry args={[Math.min(fw * 0.5, 0.8), 0.04, 0.12]} />
        <meshStandardMaterial color="#b89a5e" metalness={0.7} roughness={0.3} emissive="#fff1cc" emissiveIntensity={hover ? 0.6 : 0.25} />
      </mesh>
    </group>
  );
}
