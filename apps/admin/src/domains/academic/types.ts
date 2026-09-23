export type AssessmentType = "Mid_Exam" | "Final_Exam" | "Assignment";

export interface Assessment {
  id: string;
  curriculumId: string;
  assessmentType: AssessmentType;
  subjectTopic: string;
  maxScore: number;
  academicPeriod: string;
  examDate: string;
  createdAt: string;
}

export interface StudentScore {
  id: string;
  academicAssessmentId: string;
  childId: string;
  childName?: string;
  scoreAchieved: number;
  recordedBy: string;
  createdAt: string;
}

export interface ScoreFilters {
  assessmentId?: string;
  childId?: string;
}
