import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import Flag from './Flag';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const Scene = ({ windSpeed, windDirection, textureUrl, placeholderSrc, overlayText }) => {
  const { gl, scene, camera } = useThree();
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    rendererRef.current = gl;
    sceneRef.current = scene;
    cameraRef.current = camera;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl, scene, camera]);

  const capture = () => {
    const g = rendererRef.current, s = sceneRef.current, c = cameraRef.current;
    if (!g || !s || !c) return;
    g.shadowMap.enabled = false;
    const tmp = [];
    s.traverse((o) => {
      if (o.isLight && 'castShadow' in o) {
        tmp.push({ l: o, cast: o.castShadow });
        o.castShadow = false;
      }
    });
    if (contactRef.current) contactRef.current.visible = false;
    g.render(s, c);
    const urlPNG = g.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = 'flag.png';
    a.href = urlPNG;
    a.click();
    g.shadowMap.enabled = true;
    tmp.forEach(({ l, cast }) => (l.castShadow = cast));
    if (contactRef.current) contactRef.current.visible = true;
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') capture();
    });
    return () => canvas.removeEventListener('click', capture);
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <hemisphereLight skyColor="#87ceeb" groundColor="#8b5a2b" intensity={0.4} position={[0, 10, 0]} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 3, 5]} intensity={0.6} />
      <directionalLight position={[0, 5, -5]} intensity={1} />
      <Environment preset="forest" background={false} />
      <ContactShadows
        ref={contactRef}
        position={[0, -1.5, 0]}
        opacity={0.35}
        scale={10}
        blur={2}
        far={10}
      />
      <Flag windSpeed={windSpeed} windDirection={windDirection} textureUrl={textureUrl} overlayText={overlayText} />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
      </EffectComposer>
    </>
  );
};

export default Scene; 