import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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
    float repel = smoothstep(0.5, 0.0, d);
    vec2 dir = normalize(st - mouse);
    
    vec2 uv = vUv;
    uv.x += uTime * 0.05; 
    uv += dir * repel * 0.2; 

    float lines = sin(uv.y * 40.0 + noise(uv * 5.0) * 2.0);
    lines = smoothstep(0.3, 0.4, lines) - smoothstep(0.4, 0.5, lines);

    vec3 colorBg = vec3(0.02, 0.02, 0.05); /* Hitam Gelap */
    vec3 colorWind = vec3(0.0, 0.8, 1.0) * 0.5; /* Cyan */
    vec3 colorHot = vec3(1.0, 0.3, 0.0); /* Merah/Orange */

    vec3 finalColor = colorBg;
    finalColor += lines * colorWind;
    finalColor = mix(finalColor, colorHot, repel * lines * 3.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const Simulation = () => {
  const meshRef = useRef();
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    []
  );

  useFrame((state) => {
    const { clock, pointer } = state;
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();

      const targetX = (pointer.x * 0.5 + 0.5) * (size.width / size.height);
      const targetY = pointer.y * 0.5 + 0.5;

      meshRef.current.material.uniforms.uMouse.value.x += (targetX - meshRef.current.material.uniforms.uMouse.value.x) * 0.1;
      meshRef.current.material.uniforms.uMouse.value.y += (targetY - meshRef.current.material.uniforms.uMouse.value.y) * 0.1;

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
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -50 /* Paling Belakang */,
        background: '#050508',
        pointerEvents: 'none' /* PENTING: Biar bisa klik navbar */,
      }}
    >
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <Simulation />
      </Canvas>
    </div>
  );
}
