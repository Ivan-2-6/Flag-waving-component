import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const createTextTexture = (text) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  // Background
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Text
  ctx.font = 'bold 80px sans-serif';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return new THREE.CanvasTexture(canvas);
};

const Flag = ({ windSpeed = 1, textureUrl = '/flag.png', overlayText }) => {
  const flagRef = useRef();
  const clock = useRef(new THREE.Clock());

  // Define plane geometry with high segmentation for smooth waving
  const geometry = useMemo(() => new THREE.PlaneGeometry(5, 3, 50, 30), []);

  // Load texture or use a solid color if no texture is provided
  const texture = useMemo(() => {
    if (overlayText) {
      return createTextTexture(overlayText);
    }
    try {
      if (textureUrl) {
        const loader = new THREE.TextureLoader();
        const tex = loader.load(textureUrl, undefined, undefined, (error) => {
          console.warn(`Failed to load texture at ${textureUrl}:`, error);
        });
        tex.colorSpace = THREE.SRGBColorSpace; // Ensure correct color rendering
        return tex;
      }
      return null;
    } catch (error) {
      console.warn('Texture loading error:', error);
      return null;
    }
  }, [textureUrl, overlayText]);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({
      map: texture,
      color: texture ? 0xffffff : 0x00ff00, // White with texture, green without
      side: THREE.DoubleSide, // Render both sides of the flag
      metalness: 0.1, // Low metalness for fabric-like appearance
      roughness: 0.8, // High roughness for non-shiny fabric
    }),
    [texture]
  );

  useFrame(() => {
    if (!flagRef.current) return;
    const t = clock.current.getElapsedTime();
    const vertices = flagRef.current.geometry.attributes.position.array;

    // Animate vertices to simulate wind
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const waveX1 = 0.3 * Math.sin(x * 2 + t * windSpeed);
      const waveX2 = 0.15 * Math.sin(x * 3 + t * windSpeed * 2);
      const waveY1 = 0.1 * Math.sin(y * 6 + t * windSpeed * 0.5);
      vertices[i + 2] = waveX1 + waveX2 + waveY1; // Update z-coordinate
    }

    flagRef.current.geometry.attributes.position.needsUpdate = true;
    flagRef.current.geometry.computeVertexNormals(); // Update normals for smooth lighting
  });

  return (
    <mesh
      ref={flagRef}
      geometry={geometry}
      material={material}
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    />
  );
};

export default Flag; 