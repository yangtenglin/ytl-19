export type Station = '北京' | '上海' | '广州' | '成都' | '武汉' | '深圳';

export type CarriageType = '硬座' | '硬卧' | '软卧' | '货运' | '冷藏';

export interface Carriage {
  id: string;
  type: CarriageType;
  capacity: number;
  maxWeight: number;
  color: string;
  icon: string;
}

export interface Cargo {
  id: string;
  name: string;
  weight: number;
  destination: Station;
  deadline: number;
  emoji: string;
}

export interface DepartureTime {
  id: string;
  label: string;
  hoursFromNow: number;
  urgency: '紧急' | '正常' | '宽松';
}

export interface MarshalledCarriage {
  instanceId: string;
  carriage: Carriage;
  cargos: Cargo[];
}

export interface SchedulePlan {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  departure: DepartureTime | null;
  marshalling: MarshalledCarriage[];
}

export interface ValidationResult {
  totalWeight: number;
  totalMaxWeight: number;
  totalCapacity: number;
  usedCapacity: number;
  overloadedCarriages: Array<{ instanceId: string; overBy: number }>;
  misroutedCargos: Array<{ cargoId: string; cargoName: string; expectedStation: Station; actualStation: Station }>;
  delayedCargos: Array<{ cargoId: string; cargoName: string; delayedBy: number }>;
  overweightPenalty: number;
  misroutePenalty: number;
  delayPenalty: number;
  totalPenalty: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export type DraggableType = 'carriage' | 'cargo' | 'departure';

export interface DragPayload {
  type: DraggableType;
  data: Carriage | Cargo | DepartureTime;
}

export type ResourceTab = 'carriages' | 'cargos' | 'departures';
