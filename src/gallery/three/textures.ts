import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

function canvasTex(key: string, size: number, draw: (c: CanvasRenderingContext2D, s: number) => void, repeat: [number, number]) {
  const k = `${key}-${repeat.join("x")}`;
  if (cache.has(k)) return cache.get(k)!;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  draw(cv.getContext("2d")!, size);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  cache.set(k, t);
  return t;
}

// Deterministic PRNG so textures are stable
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

export function woodTexture() {
  return canvasTex("wood", 1024, (c, s) => {
    const r = rng(7);
    const planks = 8;
    const ph = s / planks;
    for (let i = 0; i < planks; i++) {
      const offset = r() * s;
      for (let j = -1; j < 2; j++) {
        const x = offset + j * s * 0.7;
        const l = 30 + r() * 8;
        c.fillStyle = `hsl(${24 + r() * 6}, ${38 + r() * 10}%, ${l}%)`;
        c.fillRect(x, i * ph, s * 0.7, ph);
        for (let g = 0; g < 26; g++) {
          c.strokeStyle = `hsla(25, 40%, ${l - 12}%, ${0.08 + r() * 0.12})`;
          c.lineWidth = 1 + r() * 2;
          c.beginPath();
          const y = i * ph + r() * ph;
          c.moveTo(x, y);
          c.bezierCurveTo(x + s * 0.2, y + (r() - 0.5) * 8, x + s * 0.5, y + (r() - 0.5) * 8, x + s * 0.7, y);
          c.stroke();
        }
        c.fillStyle = "rgba(40,22,10,0.55)";
        c.fillRect(x, i * ph, 2, ph);
      }
      c.fillStyle = "rgba(40,22,10,0.5)";
      c.fillRect(0, i * ph, s, 2);
    }
  }, [3, 3]);
}

export function plasterTexture() {
  return canvasTex("plaster", 512, (c, s) => {
    const r = rng(3);
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 4000; i++) {
      c.fillStyle = `rgba(${r() > 0.5 ? "0,0,0" : "255,255,255"},${r() * 0.04})`;
      const z = 2 + r() * 14;
      c.fillRect(r() * s, r() * s, z, z);
    }
  }, [2, 1]);
}

export function rugTexture() {
  return canvasTex("rug", 512, (c, s) => {
    c.fillStyle = "#b5654a";
    c.fillRect(0, 0, s, s);
    c.strokeStyle = "#ead9bf";
    c.lineWidth = 14;
    c.strokeRect(30, 30, s - 60, s - 60);
    c.lineWidth = 4;
    c.strokeRect(60, 60, s - 120, s - 120);
    c.fillStyle = "#2f4a52";
    for (let i = 0; i < 5; i++) {
      c.save();
      c.translate(s / 2, s / 2);
      c.rotate((i * Math.PI) / 5);
      c.fillRect(-120, -8, 240, 16);
      c.restore();
    }
  }, [1, 1]);
}

const labels = new Map<string, THREE.Texture>();
export function labelTexture(text: string) {
  if (labels.has(text)) return labels.get(text)!;
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 512;
  const c = cv.getContext("2d")!;
  c.fillStyle = "#efe8db";
  c.fillRect(0, 0, 512, 512);
  c.strokeStyle = "#bfae94";
  c.setLineDash([14, 10]);
  c.lineWidth = 4;
  c.strokeRect(40, 40, 432, 432);
  c.fillStyle = "#8a7a66";
  c.font = "italic 44px Georgia, serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(text, 256, 256);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  labels.set(text, t);
  return t;
}
