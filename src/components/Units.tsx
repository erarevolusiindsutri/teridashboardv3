import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import { DollarSign, Package, HeadphonesIcon } from 'lucide-react';
import { UnitProps } from '../types';
import { useDashboardStore } from '../store';
import { StockUnit } from './models/StockUnit';
import { SalesUnit } from './models/SalesUnit';
import { ServiceUnit } from './models/ServiceUnit';

const DataParticle = ({ start, end, active }: { start: number[], end: number[], active: boolean }) => {
  const particleRef = useRef();
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (active && particleRef.current) {
      progressRef.current = (progressRef.current + delta * 0.5) % 1;
      const t = progressRef.current;
      
      // Create path points for exact line following
      const path = [
        new Vector3(...start),
        new Vector3(start[0], 0, start[2]),
        new Vector3(start[0], 0, end[2]),
        new Vector3(end[0], 0, end[2]),
        new Vector3(...end)
      ];
      
      // Calculate position along the path segments
      let currentT = t * 4; // 4 segments in total
      const segmentIndex = Math.floor(currentT);
      const segmentT = currentT - segmentIndex;
      
      if (segmentIndex < path.length - 1) {
        const currentPoint = path[segmentIndex];
        const nextPoint = path[segmentIndex + 1];
        
        const x = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentT;
        const y = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentT;
        const z = currentPoint.z + (nextPoint.z - currentPoint.z) * segmentT;
        
        particleRef.current.position.set(x, y, z);
      }
    }
  });

  return active ? (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color="#4affff"
        emissive="#4affff"
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  ) : null;
};

const DataLine = ({ start, end, active }: { start: number[], end: number[], active: boolean }) => {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.dashOffset -= active ? 0.01 : 0;
    }
  });

  const points = [
    new Vector3(...start),
    new Vector3(start[0], 0, start[2]),
    new Vector3(start[0], 0, end[2]),
    new Vector3(end[0], 0, end[2]),
    new Vector3(...end)
  ];

  return (
    <>
      <Line
        ref={lineRef}
        points={points}
        color={active ? "#4affff" : "#2a2a2a"}
        lineWidth={active ? 4 : 3}
        dashed={true}
        dashScale={active ? 2 : 8}
        dashSize={0.6}
        dashOffset={0}
        transparent
        opacity={active ? 1 : 0.6}
      />
      <DataParticle start={start} end={end} active={active} />
      <DataParticle 
        start={start} 
        end={end} 
        active={active} 
      />
    </>
  );
};

const Unit = ({ position, color, type, data, onClick }: UnitProps) => {
  const selectedUnit = useDashboardStore((state) => state.selectedUnit);
  const isSelected = selectedUnit === type;

  const getIcon = () => {
    switch(type) {
      case 'sales': return <DollarSign className="w-6 h-6 text-white" />;
      case 'stock': return <Package className="w-6 h-6 text-white" />;
      case 'service': return <HeadphonesIcon className="w-6 h-6 text-white" />;
    }
  };

  const getUnitModel = () => {
    switch(type) {
      case 'stock': return <StockUnit color={color} isSelected={isSelected} />;
      case 'sales': return <SalesUnit color={color} isSelected={isSelected} />;
      case 'service': return <ServiceUnit color={color} isSelected={isSelected} />;
    }
  };

  return (
    <group position={position} onClick={onClick}>
      {getUnitModel()}
      <Html position={[0, 4, 0]} center>
        <div className="bg-black/70 backdrop-blur-sm p-2 rounded-lg">
          {getIcon()}
          <div className="text-white text-xs mt-1">
            {data.value.toFixed(0)}%
          </div>
        </div>
      </Html>
    </group>
  );
};

export function Units() {
  const { unitData, selectedUnit, setSelectedUnit } = useDashboardStore();

  const positions = {
    sales: [0, 0, -4],
    stock: [-6, 0, 4],
    service: [6, 0, 4]
  };

  const handleUnitClick = (type: UnitProps['type']) => {
    setSelectedUnit(selectedUnit === type ? null : type);
  };

  return (
    <group>
      {Object.entries(positions).map(([type, position]) => (
        <Unit
          key={type}
          position={position}
          color={type === 'stock' ? "#666666" : type === 'sales' ? "#888888" : "#777777"}
          type={type as UnitProps['type']}
          data={unitData[type as UnitProps['type']]}
          onClick={() => handleUnitClick(type as UnitProps['type'])}
        />
      ))}
      
      <DataLine 
        start={positions.stock} 
        end={positions.sales}
        active={selectedUnit === 'stock' || selectedUnit === 'sales'} 
      />
      <DataLine 
        start={positions.sales} 
        end={positions.service}
        active={selectedUnit === 'sales' || selectedUnit === 'service'} 
      />
      <DataLine 
        start={positions.service} 
        end={positions.stock}
        active={selectedUnit === 'service' || selectedUnit === 'stock'} 
      />
    </group>
  );
}