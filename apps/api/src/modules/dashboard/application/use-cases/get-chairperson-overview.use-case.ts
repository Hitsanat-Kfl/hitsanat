import { and, count, desc, eq, gte, getDb, sql } from "@repo/database";
import {
  annualMasterPlans,
  events,
  members,
  children,
  planActivities,
  planApprovals,
  planProgressRecords,
  planDistributions,
  planGoals,
  reportSubmissions,
  subDepartments,
  weeklyPlans,
} from "@repo/database/schema";

export interface ChairpersonOverview {
  kpis: {
    activeMembers: number;
    enrolledChildren: number;
    weightedAchievementRate: number;
    budgetUtilization: number;
  };
  departmentComparison: {
    subDepartmentId: string;
    subDepartmentName: string;
    weightedProgressIndex: number;
  }[];
  approvalsInbox: {
    id: string;
    type: "PLAN_APPROVAL" | "REPORT_REVIEW";
    title: string;
    requester: string;
    createdAt: string;
  }[];
  upcomingEvents: { id: string; title: string; eventDate: string }[];
  generatedAt: string;
}

export class GetChairpersonOverviewUseCase {
  async execute(): Promise<ChairpersonOverview> {
    const db = getDb();

    const [
      activeMembersResult,
      childrenResult,
      activePlan,
      submissions,
      pendingPlanApprovals,
      upcomingEventsRows,
      deptRows,
    ] = await Promise.all([
      db.select({ value: count() }).from(members).where(eq(members.isActive, true)),
      db.select({ value: count() }).from(children),
      db
        .select()
        .from(annualMasterPlans)
        .where(eq(annualMasterPlans.status, "Active"))
        .orderBy(desc(annualMasterPlans.approvedAt))
        .limit(1),
      db
        .select()
        .from(reportSubmissions)
        .where(eq(reportSubmissions.status, "Submitted"))
        .orderBy(desc(reportSubmissions.createdAt))
        .limit(10),
      db.select().from(planApprovals).where(eq(planApprovals.status, "Pending")).limit(10),
      db
        .select()
        .from(events)
        .where(gte(events.eventDate, new Date()))
        .orderBy(events.eventDate)
        .limit(5),
      this.computeDepartmentComparison(),
    ]);

    const plan = activePlan[0];

    // Weighted achievement rate: sum(actual progress weight) / sum(total weight).
    let weightedAchievementRate = 0;
    // Budget utilization: executed (Completed) weekly-execution budget share
    // relative to the active plan's total budget, 0–100.
    let budgetUtilization = 0;
    if (plan) {
      budgetUtilization = await this.computeBudgetUtilization(plan.totalBudget, plan.id);
      const goals = await db.select().from(planGoals).where(eq(planGoals.annualPlanId, plan.id));
      if (goals.length > 0) {
        const activities = await db
          .select()
          .from(planActivities)
          .where(
            sql`${planActivities.planGoalId} IN (${sql.join(
              goals.map((g) => sql`${g.id}`),
              sql`, `
            )})`
          );
        const totalWeight = activities.reduce((sum, a) => sum + Number(a.weight), 0);
        if (totalWeight > 0) {
          const distributionIds = (
            await db
              .select({ id: planDistributions.id })
              .from(planDistributions)
              .where(
                sql`${planDistributions.planActivityId} IN (${sql.join(
                  activities.map((a) => sql`${a.id}`),
                  sql`, `
                )})`
              )
          ).map((r) => r.id);

          const achievedWeightRows =
            distributionIds.length > 0
              ? await db
                  .select({ weight: planActivities.weight })
                  .from(weeklyPlans)
                  .innerJoin(
                    planDistributions,
                    eq(weeklyPlans.planDistributionId, planDistributions.id)
                  )
                  .innerJoin(
                    planActivities,
                    eq(planDistributions.planActivityId, planActivities.id)
                  )
                  .innerJoin(
                    planProgressRecords,
                    eq(planProgressRecords.weeklyPlanId, weeklyPlans.id)
                  )
                  .where(
                    and(
                      sql`${weeklyPlans.planDistributionId} IN (${sql.join(
                        distributionIds.map((id) => sql`${id}`),
                        sql`, `
                      )})`,
                      eq(planProgressRecords.status, "Completed")
                    )
                  )
              : [];

          // Weighted progress: count completed weekly executions per activity,
          // scaled by activity weight; approximate per-activity completion by
          // ratio of completed weekly plans to total weekly plans.
          const totalWeekly = await db
            .select({ value: count() })
            .from(weeklyPlans)
            .where(
              distributionIds.length > 0
                ? sql`${weeklyPlans.planDistributionId} IN (${sql.join(
                    distributionIds.map((id) => sql`${id}`),
                    sql`, `
                  )})`
                : sql`false`
            );
          const completedWeekly = achievedWeightRows.length;
          const totalWeeklyCount = totalWeekly[0]?.value ?? 0;
          weightedAchievementRate =
            totalWeeklyCount > 0 ? Math.round((completedWeekly / totalWeeklyCount) * 100) : 0;
        }
      }

      // (Budget utilization computed above via computeBudgetUtilization.)
    }

    return {
      kpis: {
        activeMembers: activeMembersResult[0]?.value ?? 0,
        enrolledChildren: childrenResult[0]?.value ?? 0,
        weightedAchievementRate,
        budgetUtilization,
      },
      departmentComparison: deptRows,
      approvalsInbox: [
        ...pendingPlanApprovals.map((a) => ({
          id: a.id,
          type: "PLAN_APPROVAL" as const,
          title: a.changeSummary.slice(0, 120),
          requester: a.requestedBy,
          createdAt: a.createdAt.toISOString(),
        })),
        ...submissions.map((s) => ({
          id: s.id,
          type: "REPORT_REVIEW" as const,
          title: `${s.reportType} report — ${s.periodLabel}`,
          requester: s.submittedBy,
          createdAt: s.createdAt.toISOString(),
        })),
      ].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      upcomingEvents: upcomingEventsRows.map((e) => ({
        id: e.id,
        title: e.eventName,
        eventDate: e.eventDate.toISOString(),
      })),
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Budget utilization (executive KPI, dashboards.md §1.1): sum of plan
   * activity budgets that have at least one Completed weekly execution,
   * divided by the plan's total budget. Approximation: completion of an
   * activity's weekly executions implies its budget was consumed.
   */
  private async computeBudgetUtilization(
    planTotalBudget: string | null,
    planId: string
  ): Promise<number> {
    const db = getDb();
    const totalBudget = Number(planTotalBudget ?? 0);
    if (totalBudget <= 0) return 0;

    const goalRows = await db
      .select({ id: planGoals.id })
      .from(planGoals)
      .where(eq(planGoals.annualPlanId, planId));
    if (goalRows.length === 0) return 0;

    const activityRows = await db
      .select({
        id: planActivities.id,
        budget: planActivities.budget,
      })
      .from(planActivities)
      .where(
        sql`${planActivities.planGoalId} IN (${sql.join(
          goalRows.map((g) => sql`${g.id}`),
          sql`, `
        )})`
      );
    if (activityRows.length === 0) return 0;

    const distributionRows = await db
      .select({
        id: planDistributions.id,
        planActivityId: planDistributions.planActivityId,
      })
      .from(planDistributions)
      .where(
        sql`${planDistributions.planActivityId} IN (${sql.join(
          activityRows.map((a) => sql`${a.id}`),
          sql`, `
        )})`
      );
    if (distributionRows.length === 0) return 0;

    const completedActivityIds = new Set<string>(
      (
        await db
          .select({ planActivityId: planDistributions.planActivityId })
          .from(weeklyPlans)
          .innerJoin(planProgressRecords, eq(planProgressRecords.weeklyPlanId, weeklyPlans.id))
          .innerJoin(planDistributions, eq(weeklyPlans.planDistributionId, planDistributions.id))
          .where(
            and(
              sql`${weeklyPlans.planDistributionId} IN (${sql.join(
                distributionRows.map((d) => sql`${d.id}`),
                sql`, `
              )})`,
              eq(planProgressRecords.status, "Completed")
            )
          )
      ).map((r) => r.planActivityId)
    );

    const consumedBudget = activityRows
      .filter((a) => completedActivityIds.has(a.id))
      .reduce((sum, a) => sum + Number(a.budget), 0);
    return Math.min(100, Math.round((consumedBudget / totalBudget) * 100));
  }

  /**
   * Department Comparison Bar Chart data: weighted progress index per
   * sub-department — ratio of completed weekly plans to assigned weekly plans,
   * scaled to 0–100.
   */
  private async computeDepartmentComparison(): Promise<
    ChairpersonOverview["departmentComparison"]
  > {
    const db = getDb();
    const departments = await db.select().from(subDepartments);

    const progressRows = await db
      .select({
        subDepartmentId: planDistributions.subDepartmentId,
        total: count(weeklyPlans.id),
        completed: sql<number>`SUM(CASE WHEN ${planProgressRecords.status} = 'Completed' THEN 1 ELSE 0 END)`,
      })
      .from(planDistributions)
      .innerJoin(weeklyPlans, eq(weeklyPlans.planDistributionId, planDistributions.id))
      .leftJoin(planProgressRecords, eq(planProgressRecords.weeklyPlanId, weeklyPlans.id))
      .groupBy(planDistributions.subDepartmentId);

    const byDept = new Map(progressRows.map((r) => [r.subDepartmentId, r]));

    return departments.map((dept) => {
      const stats = byDept.get(dept.id);
      const total = Number(stats?.total ?? 0);
      const completed = Number(stats?.completed ?? 0);
      return {
        subDepartmentId: dept.id,
        subDepartmentName: dept.nameEn,
        weightedProgressIndex: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }
}
