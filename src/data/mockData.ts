import type { Carriage, Cargo, DepartureTime } from '../types';

export const CARRIAGES: Carriage[] = [
  { id: 'car-yz-1', type: '硬座', capacity: 118, maxWeight: 15, color: '#5d8a66', icon: '💺' },
  { id: 'car-yz-2', type: '硬座', capacity: 118, maxWeight: 15, color: '#5d8a66', icon: '💺' },
  { id: 'car-yw-1', type: '硬卧', capacity: 66, maxWeight: 20, color: '#8b6914', icon: '🛏️' },
  { id: 'car-rw-1', type: '软卧', capacity: 36, maxWeight: 18, color: '#7a3f3f', icon: '🛋️' },
  { id: 'car-hy-1', type: '货运', capacity: 40, maxWeight: 60, color: '#4a5568', icon: '📦' },
  { id: 'car-hy-2', type: '货运', capacity: 40, maxWeight: 60, color: '#4a5568', icon: '📦' },
  { id: 'car-hy-3', type: '货运', capacity: 40, maxWeight: 60, color: '#4a5568', icon: '📦' },
  { id: 'car-lc-1', type: '冷藏', capacity: 30, maxWeight: 45, color: '#3a7ca5', icon: '❄️' },
];

export const CARGOS: Cargo[] = [
  { id: 'cgo-01', name: '特快包裹', weight: 0.5, destination: '北京', deadline: 3, emoji: '📮' },
  { id: 'cgo-02', name: '生鲜水果', weight: 12, destination: '上海', deadline: 6, emoji: '🍎' },
  { id: 'cgo-03', name: '医疗物资', weight: 5, destination: '广州', deadline: 2, emoji: '💊' },
  { id: 'cgo-04', name: '电子元件', weight: 2, destination: '深圳', deadline: 5, emoji: '💻' },
  { id: 'cgo-05', name: '冻肉', weight: 25, destination: '北京', deadline: 8, emoji: '🥩' },
  { id: 'cgo-06', name: '钢材', weight: 45, destination: '武汉', deadline: 20, emoji: '🔩' },
  { id: 'cgo-07', name: '服装', weight: 3, destination: '成都', deadline: 10, emoji: '👕' },
  { id: 'cgo-08', name: '家具', weight: 18, destination: '上海', deadline: 15, emoji: '🪑' },
  { id: 'cgo-09', name: '乳制品', weight: 15, destination: '广州', deadline: 4, emoji: '🥛' },
  { id: 'cgo-10', name: '书籍', weight: 8, destination: '北京', deadline: 18, emoji: '📚' },
  { id: 'cgo-11', name: '精密仪器', weight: 6, destination: '成都', deadline: 7, emoji: '🔬' },
  { id: 'cgo-12', name: '海鲜', weight: 20, destination: '武汉', deadline: 3, emoji: '🦐' },
  { id: 'cgo-13', name: '化工原料', weight: 35, destination: '上海', deadline: 24, emoji: '🧪' },
  { id: 'cgo-14', name: '快递小包', weight: 1, destination: '北京', deadline: 4, emoji: '📦' },
  { id: 'cgo-15', name: '汽车配件', weight: 30, destination: '广州', deadline: 12, emoji: '🔧' },
];

export const DEPARTURE_TIMES: DepartureTime[] = [
  { id: 'dep-01', label: '10:00', hoursFromNow: 2, urgency: '紧急' },
  { id: 'dep-02', label: '12:00', hoursFromNow: 4, urgency: '紧急' },
  { id: 'dep-03', label: '16:00', hoursFromNow: 8, urgency: '正常' },
  { id: 'dep-04', label: '20:00', hoursFromNow: 12, urgency: '正常' },
  { id: 'dep-05', label: '次日08:00', hoursFromNow: 24, urgency: '宽松' },
];

export const STATION_ORDER: string[] = ['北京', '武汉', '上海', '广州', '成都', '深圳'];
