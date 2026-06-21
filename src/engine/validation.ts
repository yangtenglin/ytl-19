import type { SchedulePlan, MarshalledCarriage, ValidationResult, Station } from '../types';
import { STATION_ORDER } from '../data/mockData';

const OVERWEIGHT_PER_TON = 5;
const OVERWEIGHT_BONUS_THRESHOLD = 0.5;
const OVERWEIGHT_BONUS_PENALTY = 20;
const MISROUTE_PER_CARGO = 15;
const DELAY_PER_HOUR = 8;

function getGrade(totalPenalty: number): ValidationResult['grade'] {
  if (totalPenalty === 0) return 'S';
  if (totalPenalty < 30) return 'A';
  if (totalPenalty < 80) return 'B';
  if (totalPenalty < 150) return 'C';
  if (totalPenalty < 250) return 'D';
  return 'F';
}

export function validatePlan(plan: SchedulePlan): ValidationResult {
  let totalWeight = 0;
  let totalMaxWeight = 0;
  let totalCapacity = 0;
  let usedCapacity = 0;
  let overweightPenalty = 0;
  let misroutePenalty = 0;
  let delayPenalty = 0;

  const overloadedCarriages: Array<{ instanceId: string; overBy: number }> = [];
  const misroutedCargos: Array<{ cargoId: string; cargoName: string; expectedStation: Station; actualStation: Station }> = [];
  const delayedCargos: Array<{ cargoId: string; cargoName: string; delayedBy: number }> = [];

  plan.marshalling.forEach((mc) => {
    totalMaxWeight += mc.carriage.maxWeight;
    totalCapacity += mc.carriage.capacity;

    const carriageWeight = mc.cargos.reduce((sum, c) => sum + c.weight, 0);
    const carriageUsed = mc.cargos.length;

    totalWeight += carriageWeight;
    usedCapacity += carriageUsed;

    if (carriageWeight > mc.carriage.maxWeight) {
      const overBy = carriageWeight - mc.carriage.maxWeight;
      overloadedCarriages.push({ instanceId: mc.instanceId, overBy });
      overweightPenalty += Math.ceil(overBy) * OVERWEIGHT_PER_TON;
      const ratio = overBy / mc.carriage.maxWeight;
      if (ratio > OVERWEIGHT_BONUS_THRESHOLD) {
        overweightPenalty += OVERWEIGHT_BONUS_PENALTY;
      }
    }
  });

  const stations: (string | null)[] = plan.marshalling.map((mc) => {
    if (mc.cargos.length === 0) return null;
    const counts: Record<string, number> = {};
    mc.cargos.forEach((c) => {
      counts[c.destination] = (counts[c.destination] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  });

  plan.marshalling.forEach((mc, idx) => {
    if (idx === 0) return;
    const prevStation = stations[idx - 1];
    if (!prevStation) return;
    const prevOrder = STATION_ORDER.indexOf(prevStation);
    mc.cargos.forEach((cargo) => {
      const cargoOrder = STATION_ORDER.indexOf(cargo.destination);
      if (cargoOrder !== -1 && prevOrder !== -1 && cargoOrder < prevOrder) {
        misroutedCargos.push({
          cargoId: cargo.id,
          cargoName: cargo.name,
          expectedStation: cargo.destination,
          actualStation: prevStation as Station,
        });
      }
    });
  });

  const misrouteMap = new Map(misroutedCargos.map((m) => [m.cargoId, m]));
  plan.marshalling.forEach((mc) => {
    mc.cargos.forEach((cargo) => {
      if (!misrouteMap.has(cargo.id)) {
        let prevStation: string | null = null;
        for (let p = plan.marshalling.indexOf(mc) - 1; p >= 0; p--) {
          if (stations[p]) {
            prevStation = stations[p];
            break;
          }
        }
        if (prevStation && prevStation !== cargo.destination) {
          const prevOrder = STATION_ORDER.indexOf(prevStation);
          const cargoOrder = STATION_ORDER.indexOf(cargo.destination);
          if (cargoOrder !== -1 && prevOrder !== -1 && Math.abs(cargoOrder - prevOrder) > 2) {
            misroutedCargos.push({
              cargoId: cargo.id,
              cargoName: cargo.name,
              expectedStation: cargo.destination,
              actualStation: prevStation as Station,
            });
          }
        }
      }
    });
  });
  misroutePenalty = misroutedCargos.length * MISROUTE_PER_CARGO;

  if (plan.departure) {
    plan.marshalling.forEach((mc) => {
      mc.cargos.forEach((cargo) => {
        const delay = plan.departure!.hoursFromNow - cargo.deadline;
        if (delay > 0) {
          delayedCargos.push({
            cargoId: cargo.id,
            cargoName: cargo.name,
            delayedBy: delay,
          });
          delayPenalty += delay * DELAY_PER_HOUR;
        }
      });
    });
  }

  const totalPenalty = overweightPenalty + misroutePenalty + delayPenalty;

  return {
    totalWeight,
    totalMaxWeight,
    totalCapacity,
    usedCapacity,
    overloadedCarriages,
    misroutedCargos,
    delayedCargos,
    overweightPenalty,
    misroutePenalty,
    delayPenalty,
    totalPenalty,
    grade: getGrade(totalPenalty),
  };
}

export function getCarriageUtilization(mc: MarshalledCarriage) {
  const weight = mc.cargos.reduce((s, c) => s + c.weight, 0);
  return {
    weight,
    weightRatio: Math.min(1, weight / mc.carriage.maxWeight),
    capacityUsed: mc.cargos.length,
    capacityRatio: Math.min(1, mc.cargos.length / mc.carriage.capacity),
  };
}
