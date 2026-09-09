import type { PlanActivity } from "../entities/planning.js";
import { ValidationError } from "../errors/index.js";

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
    budgetContribution: number;
    resourceContribution: number;
    timeContribution: number;
  };
}

export interface BatchWeightInput {
  activities: WeightCalculationInput[];
}

export interface BatchWeightResult {
  activities: WeightCalculationResult[];
  totalWeight: number;
  totals: {
    budget: number;
    people: number;
    time: number;
  };
}

export interface IWeightCalculationEngine {
  calculateWeight(
    input: WeightCalculationInput,
    totals: {
      budget: number;
      people: number;
      time: number;
    }
  ): WeightCalculationResult;
  calculateBatch(inputs: WeightCalculationInput[]): BatchWeightResult;
  distributeQuarterly(
    activity: PlanActivity,
    totalWeight: number
  ): { q1: number; q2: number; q3: number; q4: number };
}

/**
 * 3-Factor Weight Calculation Engine (BR-030)
 *
 * Formula: Weight_i = 1/3 * [
 *   (Budget_i / Sum_Budget * 100) +
 *   (People_i / Sum_People * 100) +
 *   (Time_i / Sum_Time * 100)
 * ]
 *
 * Baseline totals from Action PLN.xlsx:
 * - Budget: 3,500.00 ETB
 * - People: 112 units
 * - Time: 45 units
 * - Sum of weights: 100.00%
 */
export class WeightCalculationEngine implements IWeightCalculationEngine {
  calculateWeight(
    input: WeightCalculationInput,
    totals: { budget: number; people: number; time: number }
  ): WeightCalculationResult {
    const budgetContribution = totals.budget > 0 ? (input.budget / totals.budget) * 100 : 0;
    const resourceContribution =
      totals.people > 0 ? (input.humanResource / totals.people) * 100 : 0;
    const timeContribution = totals.time > 0 ? (input.plannedTime / totals.time) * 100 : 0;

    const weight = (budgetContribution + resourceContribution + timeContribution) / 3;

    return {
      weight: Math.round(weight * 10000) / 10000,
      breakdown: {
        budgetContribution: Math.round(budgetContribution * 10000) / 10000,
        resourceContribution: Math.round(resourceContribution * 10000) / 10000,
        timeContribution: Math.round(timeContribution * 10000) / 10000,
      },
    };
  }

  calculateBatch(inputs: WeightCalculationInput[]): BatchWeightResult {
    if (inputs.length === 0) {
      throw new ValidationError("At least one activity is required");
    }

    const totals = inputs.reduce(
      (acc, input) => ({
        budget: acc.budget + input.budget,
        people: acc.people + input.humanResource,
        time: acc.time + input.plannedTime,
      }),
      { budget: 0, people: 0, time: 0 }
    );

    const activities = inputs.map((input) => this.calculateWeight(input, totals));

    const totalWeight =
      Math.round(activities.reduce((sum, a) => sum + a.weight, 0) * 10000) / 10000;

    return { activities, totalWeight, totals };
  }

  distributeQuarterly(
    activity: PlanActivity,
    totalWeight: number
  ): { q1: number; q2: number; q3: number; q4: number } {
    const quarterlyTotal =
      activity.q1Target + activity.q2Target + activity.q3Target + activity.q4Target;

    if (quarterlyTotal === 0) {
      return { q1: 0, q2: 0, q3: 0, q4: 0 };
    }

    const weightPerUnit = totalWeight > 0 ? activity.weight / quarterlyTotal : 0;

    return {
      q1: Math.round(activity.q1Target * weightPerUnit * 10000) / 10000,
      q2: Math.round(activity.q2Target * weightPerUnit * 10000) / 10000,
      q3: Math.round(activity.q3Target * weightPerUnit * 10000) / 10000,
      q4: Math.round(activity.q4Target * weightPerUnit * 10000) / 10000,
    };
  }
}
