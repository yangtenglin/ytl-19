import { create } from 'zustand';
import type { SchedulePlan, MarshalledCarriage, DepartureTime, Carriage, Cargo, ResourceTab } from '../types';
import {
  loadPlans,
  savePlan as persistSavePlan,
  deletePlan as persistDeletePlan,
  loadDraft,
  saveDraft,
  clearDraft,
  getLastOpenPlanId,
  loadPlan,
  setLastOpenPlanId,
  generatePlanId,
  generateInstanceId,
} from '../storage/planStore';
import { validatePlan } from '../engine/validation';
import type { ValidationResult } from '../types';

interface AppState {
  currentPlan: SchedulePlan;
  savedPlans: SchedulePlan[];
  validation: ValidationResult;
  activeResourceTab: ResourceTab;
  planDrawerOpen: boolean;
  showNameDialog: boolean;

  addCarriage: (carriage: Carriage, insertAtIndex?: number) => void;
  removeCarriage: (instanceId: string) => void;
  reorderCarriage: (fromIdx: number, toIdx: number) => void;
  addCargoToCarriage: (instanceId: string, cargo: Cargo) => void;
  removeCargoFromCarriage: (instanceId: string, cargoId: string) => void;
  setDeparture: (departure: DepartureTime | null) => void;

  setActiveResourceTab: (tab: ResourceTab) => void;
  setPlanDrawerOpen: (open: boolean) => void;
  setShowNameDialog: (show: boolean) => void;

  saveCurrentPlan: (name: string) => void;
  loadPlanById: (id: string) => void;
  deletePlanById: (id: string) => void;
  resetCurrentPlan: () => void;
  duplicatePlan: (id: string) => void;
}

const emptyPlan = (): SchedulePlan => ({
  id: generatePlanId(),
  name: '未命名方案',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  departure: null,
  marshalling: [],
});

function recompute(plan: SchedulePlan): ValidationResult {
  return validatePlan(plan);
}

const initialPlan = (): SchedulePlan => {
  const lastId = getLastOpenPlanId();
  if (lastId) {
    const saved = loadPlan(lastId);
    if (saved) return saved;
  }
  const draft = loadDraft();
  return draft || emptyPlan();
};

const initPlan = initialPlan();

export const useAppStore = create<AppState>((set, get) => ({
  currentPlan: initPlan,
  savedPlans: loadPlans(),
  validation: recompute(initPlan),
  activeResourceTab: 'carriages',
  planDrawerOpen: false,
  showNameDialog: false,

  addCarriage: (carriage, insertAtIndex) => {
    const newMc: MarshalledCarriage = {
      instanceId: generateInstanceId(),
      carriage,
      cargos: [],
    };
    set((state) => {
      const m = [...state.currentPlan.marshalling];
      if (typeof insertAtIndex === 'number' && insertAtIndex >= 0) {
        m.splice(insertAtIndex, 0, newMc);
      } else {
        m.push(newMc);
      }
      const plan = { ...state.currentPlan, marshalling: m };
      saveDraft(plan);
      return { currentPlan: plan, validation: recompute(plan) };
    });
  },

  removeCarriage: (instanceId) => {
    set((state) => {
      const m = state.currentPlan.marshalling.filter((mc) => mc.instanceId !== instanceId);
      const plan = { ...state.currentPlan, marshalling: m };
      saveDraft(plan);
      return { currentPlan: plan, validation: recompute(plan) };
    });
  },

  reorderCarriage: (fromIdx, toIdx) => {
    set((state) => {
      const m = [...state.currentPlan.marshalling];
      const [item] = m.splice(fromIdx, 1);
      m.splice(toIdx, 0, item);
      const plan = { ...state.currentPlan, marshalling: m };
      saveDraft(plan);
      return { currentPlan: plan, validation: recompute(plan) };
    });
  },

  addCargoToCarriage: (instanceId, cargo) => {
    set((state) => {
      const usedCargoIds = new Set(
        state.currentPlan.marshalling.flatMap((mc) => mc.cargos.map((c) => c.id)),
      );
      if (usedCargoIds.has(cargo.id)) return state;
      const m = state.currentPlan.marshalling.map((mc) => {
        if (mc.instanceId !== instanceId) return mc;
        return { ...mc, cargos: [...mc.cargos, cargo] };
      });
      const plan = { ...state.currentPlan, marshalling: m };
      saveDraft(plan);
      return { currentPlan: plan, validation: recompute(plan) };
    });
  },

  removeCargoFromCarriage: (instanceId, cargoId) => {
    set((state) => {
      const m = state.currentPlan.marshalling.map((mc) => {
        if (mc.instanceId !== instanceId) return mc;
        return { ...mc, cargos: mc.cargos.filter((c) => c.id !== cargoId) };
      });
      const plan = { ...state.currentPlan, marshalling: m };
      saveDraft(plan);
      return { currentPlan: plan, validation: recompute(plan) };
    });
  },

  setDeparture: (departure) => {
    set((state) => {
      const plan = { ...state.currentPlan, departure };
      saveDraft(plan);
      return { currentPlan: plan, validation: recompute(plan) };
    });
  },

  setActiveResourceTab: (tab) => set({ activeResourceTab: tab }),
  setPlanDrawerOpen: (open) => set({ planDrawerOpen: open }),
  setShowNameDialog: (show) => set({ showNameDialog: show }),

  saveCurrentPlan: (name) => {
    const plan = { ...get().currentPlan, name };
    const saved = persistSavePlan(plan);
    setLastOpenPlanId(plan.id);
    clearDraft();
    set({
      currentPlan: plan,
      savedPlans: saved,
      showNameDialog: false,
      validation: recompute(plan),
    });
  },

  loadPlanById: (id) => {
    const p = loadPlan(id);
    if (!p) return;
    setLastOpenPlanId(id);
    clearDraft();
    set({
      currentPlan: p,
      validation: recompute(p),
      planDrawerOpen: false,
    });
  },

  deletePlanById: (id) => {
    const saved = persistDeletePlan(id);
    set({ savedPlans: saved });
    if (get().currentPlan.id === id) {
      const ep = emptyPlan();
      clearDraft();
      set({ currentPlan: ep, validation: recompute(ep) });
    }
  },

  resetCurrentPlan: () => {
    const ep = emptyPlan();
    clearDraft();
    set({ currentPlan: ep, validation: recompute(ep) });
  },

  duplicatePlan: (id) => {
    const p = loadPlan(id);
    if (!p) return;
    const clone: SchedulePlan = {
      ...p,
      id: generatePlanId(),
      name: `${p.name} (副本)`,
      marshalling: p.marshalling.map((mc) => ({
        ...mc,
        instanceId: generateInstanceId(),
        cargos: [...mc.cargos],
      })),
    };
    const saved = persistSavePlan(clone);
    set({ savedPlans: saved });
  },
}));
