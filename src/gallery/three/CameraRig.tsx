import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { DIR, HEADINGS, ROOMS, roomCenter } from "../data/rooms";
import { useGallery } from "../store";

const tmpPos = new THREE.Vector3();

export function CameraRig() {
  const { camera, size } = useThree();
  const yaw = useRef(Math.PI / 2);
  const pitch = useRef(0);
  const init = useRef(false);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const { roomIndex, heading, look, entered } = useGallery.getState();
    const room = ROOMS[roomIndex]!;
    const [cx, cy, cz] = roomCenter(room);
    const side = HEADINGS[heading]!;
    const [dx, dz] = DIR[side];
    const back = size.width < size.height ? 3 : 2.2;
    tmpPos.set(cx - dx * back, cy + (room.eye ?? 1.65), cz - dz * back);
    if (!entered) tmpPos.set(cx - dx * 4.2, cy + 2.3, cz - dz * 4.2);

    let targetYaw = Math.atan2(-dx, -dz) + look[0];
    // shortest path
    while (targetYaw - yaw.current > Math.PI) targetYaw -= Math.PI * 2;
    while (targetYaw - yaw.current < -Math.PI) targetYaw += Math.PI * 2;
    const targetPitch = look[1] + (room.stairs ? 0.08 : 0) - (entered ? 0 : 0.12);

    if (!init.current) {
      camera.position.copy(tmpPos);
      yaw.current = targetYaw;
      init.current = true;
    }
    const k = 1 - Math.exp(-2.6 * dt);
    camera.position.lerp(tmpPos, k);
    yaw.current += (targetYaw - yaw.current) * (1 - Math.exp(-4 * dt));
    pitch.current += (targetPitch - pitch.current) * (1 - Math.exp(-4 * dt));
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

    const persp = camera as THREE.PerspectiveCamera;
    const fov = size.width < size.height ? 74 : 60;
    if (Math.abs(persp.fov - fov) > 0.1) {
      persp.fov += (fov - persp.fov) * k;
      persp.updateProjectionMatrix();
    }
  });
  return null;
}
