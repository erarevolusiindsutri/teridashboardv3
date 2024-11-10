import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export function SalesUnit({ color, isSelected }: { color: string; isSelected: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      const targetScale = isSelected ? 1.2 : 1;
      groupRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base platform */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          emissive={color}
          emissiveIntensity={isSelected ? 1 : 0.2}
        />
      </mesh>

      {/* Main structure - simplified building */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </mesh>

      {/* Top accent */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={isSelected ? 0.4 : 0.2}
        />
      </mesh>

      {/* Glowing line accents */}
      {[-0.41, 0.41].map((x) => (
        <mesh key={`accent-${x}`} position={[x, 1, 0.41]}>
          <boxGeometry args={[0.02, 1.8, 0.02]} />
          <meshStandardMaterial
            color="#4affff"
            emissive="#4affff"
            emissiveIntensity={isSelected ? 2 : 0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Data indicator */}
      {isSelected && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#4affff"
            emissive="#4affff"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}