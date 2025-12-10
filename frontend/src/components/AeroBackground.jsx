import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Shader Code (Tidak diubah)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
  float noise (in vec2 st) {
      vec2 i = floor(st); vec2 f = fract(st);
      float a = random(i); float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;
    vec2 mouse = uMouse;
    mouse.x *= uResolution.x / uResolution.y;

    float d = distance(st, mouse);
    float repel = smoothstep(1.0, 0.0, d); 
    vec2 dir = normalize(st - mouse);
    
    vec2 uv = vUv;
    uv.x += uTime * 0.05; 
    uv += dir * repel * 0.4; 

    float lines = sin(uv.y * 40.0 + noise(uv * 5.0) * 2.0);
    lines = smoothstep(0.3, 0.4, lines) - smoothstep(0.4, 0.5, lines);

    vec3 colorBg = vec3(0.05, 0.05, 0.1); 
    vec3 colorWind = vec3(0.0, 0.8, 1.0) * 0.6; 
    vec3 colorHot = vec3(1.0, 0.3, 0.0); 

    vec3 finalColor = colorBg;
    finalColor += lines * colorWind;
    finalColor = mix(finalColor, colorHot, repel * lines * 5.0); 

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const Simulation = ({ globalMouse }) => {
  const meshRef = useRef();
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size]
  );

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();

      // Ambil dimensi dari viewport (karena Canvas memenuhinya)
      const vpWidth = viewport.width;
      const vpHeight = viewport.height;

      // Hitung posisi mouse dari pixel ke normalized coordinates (-1 ke 1)
      // X: Map globalMouse.x (0 to width) ke (-vpWidth/2) ke (+vpWidth/2)
      // Y: Map globalMouse.y (0 to height) ke (+vpHeight/2) ke (-vpHeight/2)

      // Konversi pixel mouse (globalMouse) ke WebGL Normalized Coordinates (-1.0 hingga 1.0)
      const normalizedX = (globalMouse.x / size.width) * 2 - 1;
      const normalizedY = 1 - (globalMouse.y / size.height) * 2; // Y dibalik

      // Konversi Normalized X/Y ke format yang dibutuhkan Shader (0.0 hingga 1.0, disesuaikan aspek rasio)
      const mappedX = (normalizedX + 1) * 0.5; // Konversi -1 ke 1 menjadi 0 ke 1
      const mappedY = (normalizedY + 1) * 0.5; // Konversi -1 ke 1 menjadi 0 ke 1

      // PENTING: Untuk shader ini, kita butuh koordinat 0.0 hingga 1.0 yang disesuaikan aspek rasio,
      // sehingga kita harus menggunakannya secara langsung:
      const shaderX = globalMouse.x / size.width;
      const shaderY = 1.0 - globalMouse.y / size.height;

      // Update uniform dengan kecepatan tracking 0.3
      // Kita langsung suntikkan nilai 0.0-1.0 yang sudah dikoreksi.
      meshRef.current.material.uniforms.uMouse.value.x += (shaderX - meshRef.current.material.uniforms.uMouse.value.x) * 0.3;
      meshRef.current.material.uniforms.uMouse.value.y += (shaderY - meshRef.current.material.uniforms.uMouse.value.y) * 0.3;

      meshRef.current.material.uniforms.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
};

export default function AeroBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -50,
        background: 'transparent',
        // HAPUS pointerEvents: 'none'
      }}
    >
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <Simulation globalMouse={mousePos} />
      </Canvas>
    </div>
  );
}
