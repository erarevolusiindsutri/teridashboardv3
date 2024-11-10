import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export function ServiceUnit({ color, isSelected }: { color: string; isSelected: boolean }) {
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

      {/* Main desk structure */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.1, 0.8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </mesh>

      {/* Desk front */}
      <mesh position={[0, 0.25, 0.35]}>
        <boxGeometry args={[1.4, 0.3, 0.05]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Monitor */}
      <mesh position={[0, 0.8, -0.1]}>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.9}
          roughness={0.1}
          emissive="#4affff"
          emissiveIntensity={isSelected ? 0.4 : 0.1}
        />
      </mesh>

      {/* Phone */}
      <mesh position={[0.5, 0.45, 0]}>
        <boxGeometry args={[0.2, 0.05, 0.2]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.9}
          roughness={0.1}
          emissive="#4affff"
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </mesh>

      {/* Active call visualization */}
      {isSelected && (
        <group position={[0.5, 0.8, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={`ring-${i}`} position={[0, i * 0.2, 0]}>
              <ringGeometry args={[0.1 + i * 0.1, 0.12 + i * 0.1, 32]} />
              <meshStandardMaterial
                color="#4affff"
                emissive="#4affff"
                emissiveIntensity={2}
                transparent
                opacity={0.5 - i * 0.15}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Side indicators */}
      {[-0.71, 0.71].map((x) => (
        <mesh key={`indicator-${x}`} position={[x, 0.4, 0]}>
          <boxGeometry args={[0.02, 0.8, 0.4]} />
          <meshStandardMaterial
            color="#4affff"
            emissive="#4affff"
            emissiveIntensity={isSelected ? 1 : 0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}