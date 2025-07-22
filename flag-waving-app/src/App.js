import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { motion } from 'framer-motion';
import './App.css';

const textureOptions = [
  { name: 'Default Flag', value: '/flag.png' },
  { name: 'Green (No Texture)', value: '' },
  { name: 'Sample External', value: 'https://example.com/flag.png' },
];

function App() {
  const [windSpeed, setWindSpeed] = useState(1);
  const [textureUrl, setTextureUrl] = useState('/flag.png');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col items-center justify-center p-6">
      <motion.h1
        className="text-4xl font-extrabold text-gray-800 mb-6 drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        3D Flag Waving Animation
      </motion.h1>
      <motion.div
        className="w-full max-w-lg bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-200 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Wind Speed: {windSpeed.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Texture</label>
          <select
            value={textureUrl}
            onChange={(e) => setTextureUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {textureOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl items-center justify-center">
        <div className="flex-1 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center">
          <span className="mb-2 text-lg font-semibold text-gray-700">Flag with Text</span>
          <Canvas
            style={{ width: '100%', maxWidth: '400px', height: '300px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
            shadows
            gl={{ preserveDrawingBuffer: true }}
          >
            <Scene windSpeed={windSpeed} textureUrl={textureUrl} overlayText="HANUMATRIX" />
          </Canvas>
        </div>
        <div className="flex-1 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center">
          <span className="mb-2 text-lg font-semibold text-gray-700">Flag without Text</span>
          <Canvas
            style={{ width: '100%', maxWidth: '400px', height: '300px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
            shadows
            gl={{ preserveDrawingBuffer: true }}
          >
            <Scene windSpeed={windSpeed} textureUrl={textureUrl} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
