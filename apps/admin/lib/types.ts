export type YearOfStudy = "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "5th Year" | "GC";
export type Gender = "Male" | "Female";
export type SubDeptCode = "TIMIHRT" | "MEZMUR" | "KUTITR" | "EKD" | "KINETIBEB";
export type KutrGroup = "Kutr 1" | "Kutr 2";
export type CollectionLocation = "Apartama" | "Gende Boy" | "Gende Je" | "Cobalt" | "Bate";
export type ParentRelation = "Father" | "Mother";

export interface Member {
  id: string;
  fullName: string;
  christianName: string;
  phoneNumber: string;
  yearOfStudy: YearOfStudy;
  academicDepartment: string;
  campus: string;
  gender: Gender;
  photoUrl: string | null;
  telegramUsername: string | null;
  dateJoined: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  familyName: string;
  fatherMemberId: string | null;
  motherMemberId: string | null;
  academicYear: string;
  createdAt: string;
}

export interface SubDepartment {
  id: string;
  code: SubDeptCode;
  nameAm: string;
  nameEn: string;
  description: string | null;
  createdAt: string;
}

export interface SubDepartmentMember {
  memberId: string;
  memberName: string;
  christianName: string;
  role: string;
  isPrimary: boolean;
  assignedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MemberFilters {
  page?: number;
  limit?: number;
  search?: string;
  subDept?: string;
  familyId?: string;
  yearOfStudy?: string;
  isActive?: boolean;
}

export interface Child {
  id: string;
  fullName: string;
  christianName: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  kutrGroup: KutrGroup;
  collectionLocation: CollectionLocation;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Parent {
  id: string;
  fullName: string;
  phoneNumber: string;
  secondaryPhone: string | null;
  address: string;
  occupation: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ChildParent {
  id: string;
  childId: string;
  parentId: string;
  relation: ParentRelation;
  createdAt: string;
}

export interface ParentWithRelation extends Parent {
  relation: ParentRelation;
  childParentId: string;
}

export interface ChildFilters {
  page?: number;
  limit?: number;
  search?: string;
  kutrGroup?: KutrGroup;
  collectionLocation?: CollectionLocation;
}

export type PlanStatus = "Draft" | "Distributed" | "Active" | "Completed" | "Archived";
export type PlanDistributionStatus = "Assigned" | "In_Progress" | "Completed";

export interface AnnualMasterPlan {
  id: string;
  academicYear: string;
  title: string;
  totalBudget: number;
  totalPeople: number;
  totalTime: number;
  status: PlanStatus;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface PlanGoal {
  id: string;
  annualPlanId: string;
  goalNumber: number;
  title: string;
  createdAt: string;
}

export interface PlanActivity {
  id: string;
  planGoalId: string;
  activityNumber: number;
  mainActivity: string;
  expectedResult?: string;
  annualTarget: number;
  budget: number;
  humanResource: number;
  plannedTime: number;
  weight: number;
  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;
  createdAt: string;
}

export interface PlanWithGoals extends AnnualMasterPlan {
  goals: (PlanGoal & { activities: PlanActivity[] })[];
}

export interface PlanDistribution {
  id: string;
  planActivityId: string;
  subDepartmentId: string;
  status: PlanDistributionStatus;
  assignedAt: string;
  createdAt: string;
}

export interface WeeklyPlan {
  id: string;
  planDistributionId: string;
  ethiopianMonth: string;
  weekNumber: number;
  sessionDate: string;
  taskDescription: string;
  createdAt: string;
}

export interface PlanProgressRecord {
  id: string;
  weeklyPlanId: string;
  actualResultNumeric?: number;
  actualResultText?: string;
  status: PlanDistributionStatus;
  challenges?: string;
  submittedBy: string;
  createdAt: string;
}

export interface DistributionStatusItem {
  distributionId: string;
  activityMainActivity: string;
  subDepartmentId: string;
  status: string;
  assignedAt: string;
}

export interface ProgressSummaryItem {
  goalNumber: number;
  goalTitle: string;
  activityId: string;
  mainActivity: string;
  weight: number;
  progressCount: number;
  totalNumeric: number;
  latestStatus: string | null;
}
