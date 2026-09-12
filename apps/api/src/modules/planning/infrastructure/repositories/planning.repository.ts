import { and, count, desc, eq, getDb, ilike, or } from "@repo/database";
import {
  annualMasterPlans,
  planActivities,
  planDistributions,
  planGoals,
  planProgressRecords,
  weeklyPlans,
} from "@repo/database/schema";
import type {
  AnnualMasterPlan,
  PlanActivity,
  PlanDistribution,
  PlanGoal,
  PlanProgressRecord,
  WeeklyPlan,
} from "@repo/domain";
import type {
  PaginatedResponse,
  PaginationParams,
  PlanWithGoals,
  PlanningRepository,
} from "../../domain/repositories/planning.repository.js";

function toAnnualPlan(row: typeof annualMasterPlans.$inferSelect): AnnualMasterPlan {
  return {
    id: row.id,
    academicYear: row.academicYear,
    title: row.title,
    totalBudget: Number(row.totalBudget),
    totalPeople: row.totalPeople,
    totalTime: row.totalTime,
    status: row.status as AnnualMasterPlan["status"],
    createdBy: row.createdBy,
    approvedBy: row.approvedBy ?? undefined,
    approvedAt: row.approvedAt ?? undefined,
    createdAt: new Date(),
  };
}

function toPlanGoal(row: typeof planGoals.$inferSelect): PlanGoal {
  return {
    id: row.id,
    annualPlanId: row.annualPlanId,
    goalNumber: row.goalNumber,
    title: row.title,
    createdAt: row.createdAt,
  };
}

function toPlanActivity(row: typeof planActivities.$inferSelect): PlanActivity {
  return {
    id: row.id,
    planGoalId: row.planGoalId,
    activityNumber: row.activityNumber,
    mainActivity: row.mainActivity,
    expectedResult: row.expectedResult ?? undefined,
    annualTarget: row.annualTarget,
    budget: Number(row.budget),
    humanResource: row.humanResource,
    plannedTime: row.plannedTime,
    weight: Number(row.weight),
    q1Target: row.q1Target,
    q2Target: row.q2Target,
    q3Target: row.q3Target,
    q4Target: row.q4Target,
    createdAt: new Date(),
  };
}

function toPlanDistribution(row: typeof planDistributions.$inferSelect): PlanDistribution {
  return {
    id: row.id,
    planActivityId: row.planActivityId,
    subDepartmentId: row.subDepartmentId,
    status: row.status as PlanDistribution["status"],
    assignedAt: row.assignedAt,
    createdAt: new Date(),
  };
}

function toWeeklyPlan(row: typeof weeklyPlans.$inferSelect): WeeklyPlan {
  return {
    id: row.id,
    planDistributionId: row.planDistributionId,
    ethiopianMonth: row.ethiopianMonth,
    weekNumber: row.weekNumber,
    sessionDate: row.sessionDate,
    taskDescription: row.taskDescription,
    createdAt: new Date(),
  };
}

function toProgressRecord(row: typeof planProgressRecords.$inferSelect): PlanProgressRecord {
  return {
    id: row.id,
    weeklyPlanId: row.weeklyPlanId,
    actualResultNumeric: row.actualResultNumeric ?? undefined,
    actualResultText: row.actualResultText ?? undefined,
    status: row.status as PlanProgressRecord["status"],
    challenges: row.challenges ?? undefined,
    submittedBy: row.submittedBy,
    createdAt: new Date(),
  };
}

export class DrizzlePlanningRepository implements PlanningRepository {
  async findPlanById(id: string): Promise<PlanWithGoals | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(annualMasterPlans)
      .where(eq(annualMasterPlans.id, id))
      .limit(1);

    if (rows.length === 0) return null;

    const plan = toAnnualPlan(rows[0]);
    const goals = await this.findGoalsByPlanId(id);

    const goalsWithActivities = await Promise.all(
      goals.map(async (goal) => {
        const activities = await this.findActivitiesByGoalId(goal.id);
        return { ...goal, activities };
      })
    );

    return { ...plan, goals: goalsWithActivities };
  }

  async findManyPlans(params: PaginationParams): Promise<PaginatedResponse<AnnualMasterPlan>> {
    const db = getDb();
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = (page - 1) * limit;

    const searchCondition = params.search
      ? or(
          ilike(annualMasterPlans.title, `%${params.search}%`),
          ilike(annualMasterPlans.academicYear, `%${params.search}%`)
        )
      : undefined;

    const whereClause = searchCondition ? and(searchCondition) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(annualMasterPlans)
        .where(whereClause)
        .orderBy(desc(annualMasterPlans.academicYear))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(annualMasterPlans).where(whereClause),
    ]);

    const total = countResult[0]?.value ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: data.map(toAnnualPlan),
      pagination: { page, limit, total, totalPages },
    };
  }

  async createPlan(
    data: Omit<AnnualMasterPlan, "id" | "createdAt" | "updatedAt">
  ): Promise<AnnualMasterPlan> {
    const db = getDb();
    const rows = await db
      .insert(annualMasterPlans)
      .values({
        academicYear: data.academicYear,
        title: data.title,
        totalBudget: String(data.totalBudget),
        totalPeople: data.totalPeople,
        totalTime: data.totalTime,
        status: data.status,
        createdBy: data.createdBy,
        approvedBy: data.approvedBy ?? null,
        approvedAt: data.approvedAt ?? null,
      })
      .returning();
    return toAnnualPlan(rows[0]);
  }

  async updatePlan(
    id: string,
    data: Partial<Omit<AnnualMasterPlan, "id" | "createdAt" | "updatedAt">>
  ): Promise<AnnualMasterPlan> {
    const db = getDb();
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.totalBudget !== undefined) updateData.totalBudget = String(data.totalBudget);
    if (data.totalPeople !== undefined) updateData.totalPeople = data.totalPeople;
    if (data.totalTime !== undefined) updateData.totalTime = data.totalTime;
    if (data.approvedBy !== undefined) updateData.approvedBy = data.approvedBy;
    if (data.approvedAt !== undefined) updateData.approvedAt = data.approvedAt;

    const rows = await db
      .update(annualMasterPlans)
      .set(updateData)
      .where(eq(annualMasterPlans.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`Annual plan not found: ${id}`);
    }
    return toAnnualPlan(rows[0]);
  }

  async deletePlan(id: string): Promise<void> {
    const db = getDb();
    const rows = await db.delete(annualMasterPlans).where(eq(annualMasterPlans.id, id)).returning();
    if (rows.length === 0) {
      throw new Error(`Annual plan not found: ${id}`);
    }
  }

  async createGoal(data: Omit<PlanGoal, "id" | "createdAt">): Promise<PlanGoal> {
    const db = getDb();
    const rows = await db
      .insert(planGoals)
      .values({
        annualPlanId: data.annualPlanId,
        goalNumber: data.goalNumber,
        title: data.title,
      })
      .returning();
    return toPlanGoal(rows[0]);
  }

  async findGoalsByPlanId(planId: string): Promise<PlanGoal[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(planGoals)
      .where(eq(planGoals.annualPlanId, planId))
      .orderBy(planGoals.goalNumber);
    return rows.map(toPlanGoal);
  }

  async createActivity(
    data: Omit<PlanActivity, "id" | "createdAt" | "updatedAt">
  ): Promise<PlanActivity> {
    const db = getDb();
    const rows = await db
      .insert(planActivities)
      .values({
        planGoalId: data.planGoalId,
        activityNumber: data.activityNumber,
        mainActivity: data.mainActivity,
        expectedResult: data.expectedResult ?? null,
        annualTarget: data.annualTarget,
        budget: String(data.budget),
        humanResource: data.humanResource,
        plannedTime: data.plannedTime,
        weight: String(data.weight),
        q1Target: data.q1Target,
        q2Target: data.q2Target,
        q3Target: data.q3Target,
        q4Target: data.q4Target,
      })
      .returning();
    return toPlanActivity(rows[0]);
  }

  async findActivitiesByGoalId(goalId: string): Promise<PlanActivity[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(planActivities)
      .where(eq(planActivities.planGoalId, goalId))
      .orderBy(planActivities.activityNumber);
    return rows.map(toPlanActivity);
  }

  async findActivityById(id: string): Promise<PlanActivity | null> {
    const db = getDb();
    const rows = await db.select().from(planActivities).where(eq(planActivities.id, id)).limit(1);
    return rows.length > 0 ? toPlanActivity(rows[0]) : null;
  }

  async updateActivity(
    id: string,
    data: Partial<Omit<PlanActivity, "id" | "createdAt" | "updatedAt">>
  ): Promise<PlanActivity> {
    const db = getDb();
    const updateData: Record<string, unknown> = {};
    if (data.weight !== undefined) updateData.weight = String(data.weight);
    if (data.q1Target !== undefined) updateData.q1Target = data.q1Target;
    if (data.q2Target !== undefined) updateData.q2Target = data.q2Target;
    if (data.q3Target !== undefined) updateData.q3Target = data.q3Target;
    if (data.q4Target !== undefined) updateData.q4Target = data.q4Target;

    const rows = await db
      .update(planActivities)
      .set(updateData)
      .where(eq(planActivities.id, id))
      .returning();

    if (rows.length === 0) {
      throw new Error(`Plan activity not found: ${id}`);
    }
    return toPlanActivity(rows[0]);
  }

  async createDistribution(
    data: Omit<PlanDistribution, "id" | "createdAt" | "updatedAt">
  ): Promise<PlanDistribution> {
    const db = getDb();
    const rows = await db
      .insert(planDistributions)
      .values({
        planActivityId: data.planActivityId,
        subDepartmentId: data.subDepartmentId,
        status: data.status,
        assignedAt: data.assignedAt,
      })
      .returning();
    return toPlanDistribution(rows[0]);
  }

  async findDistributionsByActivityId(activityId: string): Promise<PlanDistribution[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(planDistributions)
      .where(eq(planDistributions.planActivityId, activityId));
    return rows.map(toPlanDistribution);
  }

  async findDistributionsBySubDepartment(subDepartmentId: string): Promise<PlanDistribution[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(planDistributions)
      .where(eq(planDistributions.subDepartmentId, subDepartmentId));
    return rows.map(toPlanDistribution);
  }

  async updateDistributionStatus(id: string, status: string): Promise<PlanDistribution> {
    const db = getDb();
    const rows = await db
      .update(planDistributions)
      .set({ status })
      .where(eq(planDistributions.id, id))
      .returning();
    if (rows.length === 0) {
      throw new Error(`Plan distribution not found: ${id}`);
    }
    return toPlanDistribution(rows[0]);
  }

  async createWeeklyPlan(
    data: Omit<WeeklyPlan, "id" | "createdAt" | "updatedAt">
  ): Promise<WeeklyPlan> {
    const db = getDb();
    const rows = await db
      .insert(weeklyPlans)
      .values({
        planDistributionId: data.planDistributionId,
        ethiopianMonth: data.ethiopianMonth,
        weekNumber: data.weekNumber,
        sessionDate: data.sessionDate,
        taskDescription: data.taskDescription,
      })
      .returning();
    return toWeeklyPlan(rows[0]);
  }

  async findWeeklyPlansByDistributionId(distributionId: string): Promise<WeeklyPlan[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(weeklyPlans)
      .where(eq(weeklyPlans.planDistributionId, distributionId))
      .orderBy(weeklyPlans.weekNumber);
    return rows.map(toWeeklyPlan);
  }

  async createProgressRecord(
    data: Omit<PlanProgressRecord, "id" | "createdAt" | "updatedAt">
  ): Promise<PlanProgressRecord> {
    const db = getDb();
    const rows = await db
      .insert(planProgressRecords)
      .values({
        weeklyPlanId: data.weeklyPlanId,
        actualResultNumeric: data.actualResultNumeric ?? null,
        actualResultText: data.actualResultText ?? null,
        status: data.status,
        challenges: data.challenges ?? null,
        submittedBy: data.submittedBy,
      })
      .returning();
    return toProgressRecord(rows[0]);
  }

  async findProgressRecordsByWeeklyPlanId(weeklyPlanId: string): Promise<PlanProgressRecord[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(planProgressRecords)
      .where(eq(planProgressRecords.weeklyPlanId, weeklyPlanId));
    return rows.map(toProgressRecord);
  }
}
