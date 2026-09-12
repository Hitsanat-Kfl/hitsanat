export interface SubDepartment {
  id: string;
  code: string;
  nameAm: string;
  nameEn: string;
  description: string | null;
  createdAt: Date;
}

export interface SubDepartmentMember {
  memberId: string;
  memberName: string;
  christianName: string;
  role: string;
  isPrimary: boolean;
  assignedAt: Date;
}
