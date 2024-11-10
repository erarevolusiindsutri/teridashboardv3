import { create } from 'zustand';
import { UnitData } from '../types';

interface DashboardState {
  selectedUnit: UnitData['type'] | null;
  unitData: Record<UnitData['type'], UnitData>;
  setSelectedUnit: (unit: UnitData['type'] | null) => void;
  updateUnitData: (type: UnitData['type'], data: Partial<UnitData>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedUnit: null,
  unitData: {
    stock: {
      type: 'stock',
      value: 85,
      trend: 0.12,
      lastUpdated: new Date().toISOString(),
      description: 'Current stock efficiency'
    },
    sales: {
      type: 'sales',
      value: 92,
      trend: 0.15,
      lastUpdated: new Date().toISOString(),
      description: 'Sales performance today'
    },
    service: {
      type: 'service',
      value: 23,
      trend: -0.05,
      lastUpdated: new Date().toISOString(),
      description: 'Customer complaints today'
    },
  },
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),
  updateUnitData: (type, data) =>
    set((state) => ({
      unitData: {
        ...state.unitData,
        [type]: { ...state.unitData[type], ...data },
      },
    })),
}));