import type { SchedulePlan } from '../types';

const STORAGE_KEY = 'platform-dispatcher-plans-v1';
const LAST_OPEN_PLAN_KEY = 'platform-dispatcher-last-id-v1';
const CURRENT_DRAFT_KEY = 'platform-dispatcher-draft-v1';

interface StorageData {
  plans: SchedulePlan[];
  version: number;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadPlans(): SchedulePlan[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = safeParse<StorageData>(raw, { plans: [], version: 1 });
  return data.plans || [];
}

export function savePlans(plans: SchedulePlan[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plans, version: 1 } satisfies StorageData),
    );
  } catch (e) {
    console.error('Failed to save plans:', e);
  }
}

export function savePlan(plan: SchedulePlan): SchedulePlan[] {
  const plans = loadPlans();
  const idx = plans.findIndex((p) => p.id === plan.id);
  if (idx >= 0) {
    plans[idx] = { ...plan, updatedAt: Date.now() };
  } else {
    plans.push({ ...plan, createdAt: Date.now(), updatedAt: Date.now() });
  }
  savePlans(plans);
  return plans;
}

export function deletePlan(planId: string): SchedulePlan[] {
  const plans = loadPlans().filter((p) => p.id !== planId);
  savePlans(plans);
  return plans;
}

export function loadPlan(planId: string): SchedulePlan | null {
  return loadPlans().find((p) => p.id === planId) || null;
}

export function setLastOpenPlanId(id: string | null): void {
  try {
    if (id) localStorage.setItem(LAST_OPEN_PLAN_KEY, id);
    else localStorage.removeItem(LAST_OPEN_PLAN_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function getLastOpenPlanId(): string | null {
  return localStorage.getItem(LAST_OPEN_PLAN_KEY);
}

export function saveDraft(plan: SchedulePlan): void {
  try {
    localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify(plan));
  } catch (e) {
    console.error(e);
  }
}

export function loadDraft(): SchedulePlan | null {
  const raw = localStorage.getItem(CURRENT_DRAFT_KEY);
  return safeParse<SchedulePlan | null>(raw, null);
}

export function clearDraft(): void {
  localStorage.removeItem(CURRENT_DRAFT_KEY);
}

export function exportPlan(plan: SchedulePlan): string {
  return JSON.stringify(plan, null, 2);
}

export function generatePlanId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateInstanceId(): string {
  return `inst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
