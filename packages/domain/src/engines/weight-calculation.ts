import type { PlanActivity } from "../entities/planning.js";

export interface WeightCalculationInput {
  annualTarget: number;
  budget: number;
  humanResource: number;
  plannedTime: number;
  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;
}

export interface WeightCalculationResult {
  weight: number;
  breakdown: {
    targetContribution: number;
    budgetContribution: number;
    resourceContribution: number;
    timeContribution: number;
  };
}

export interface IWeightCalculationEngine {
  calculateWeight(input: WeightCalculationInput): WeightCalculationResult;
  distributeQuarterly(
    activity: PlanActivity,
    totalWeight: number
  ): { q1: number; q2: number; q3: number; q4: number };
}
