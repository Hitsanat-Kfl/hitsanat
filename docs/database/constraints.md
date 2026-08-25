# Database Constraints, Indexes & Performance

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Database Engine:** PostgreSQL 15+  

---

## 1. Unique Constraints & Invariants

```sql
-- 1. Enforce max one Father and one Mother per Child (BR-010)
ALTER TABLE child_parents 
ADD CONSTRAINT uq_child_parent_relation UNIQUE (child_id, relation);

-- 2. Prevent duplicate sub-department role entries for the same member
ALTER TABLE sub_department_members 
ADD CONSTRAINT uq_member_sub_department UNIQUE (member_id, sub_department_id);

-- 3. Unique phone number for university student members
ALTER TABLE members 
ADD CONSTRAINT uq_members_phone UNIQUE (phone_number);

-- 4. Unique academic year master plan
ALTER TABLE annual_master_plans 
ADD CONSTRAINT uq_annual_plan_academic_year UNIQUE (academic_year);

-- 5. Prevent duplicate score records for the same child and exam
ALTER TABLE student_scores 
ADD CONSTRAINT uq_student_assessment_score UNIQUE (academic_assessment_id, child_id);

-- 6. Prevent duplicate attendance entries for the same session and person
ALTER TABLE program_session_attendance 
ADD CONSTRAINT uq_session_person_attendance UNIQUE (program_session_id, person_type, person_id);
```

---

## 2. Check Constraints (Data Validation at Rest)

```sql
-- 1. Gender Enums
ALTER TABLE members ADD CONSTRAINT chk_member_gender CHECK (gender IN ('Male', 'Female'));
ALTER TABLE children ADD CONSTRAINT chk_child_gender CHECK (gender IN ('Male', 'Female'));

-- 2. Parent Relation
ALTER TABLE child_parents ADD CONSTRAINT chk_parent_relation CHECK (relation IN ('Father', 'Mother'));

-- 3. Child Cohort Group Classification
ALTER TABLE children ADD CONSTRAINT chk_child_group CHECK (kutr_group IN ('Kutr 1', 'Kutr 2'));

-- 4. 5 Designated Collection Locations
ALTER TABLE children ADD CONSTRAINT chk_child_collection_loc CHECK (
    collection_location IN ('Apartama', 'Gende Boy', 'Gende Je', 'Cobalt', 'Bate')
);

-- 5. Sub-Department Codes
ALTER TABLE sub_departments ADD CONSTRAINT chk_subdept_code CHECK (
    code IN ('TIMIHRT', 'MEZMUR', 'KUTITR', 'EKD', 'KINETIBEB')
);

-- 6. Attendance Status
ALTER TABLE program_session_attendance ADD CONSTRAINT chk_session_attend_status CHECK (
    status IN ('Expected', 'Present', 'Absent', 'Excused')
);
ALTER TABLE event_attendance ADD CONSTRAINT chk_event_attend_status CHECK (
    status IN ('Expected', 'Present', 'Absent', 'Excused')
);

-- 7. Exam Score Boundaries
ALTER TABLE student_scores ADD CONSTRAINT chk_score_positive CHECK (score_achieved >= 0);
```

---

## 3. High-Performance Indexing Strategy

To guarantee sub-50ms query times on free-tier PostgreSQL, the following B-tree and composite indexes are defined:

```sql
-- Member lookups and filtering by active status & academic department
CREATE INDEX idx_members_active ON members(is_active) WHERE is_active = true;
CREATE INDEX idx_members_year_of_study ON members(year_of_study);

-- Fast child birthday queries by month (Gregorian extraction)
CREATE INDEX idx_children_dob_month ON children(EXTRACT(MONTH FROM date_of_birth), EXTRACT(DAY FROM date_of_birth));
CREATE INDEX idx_children_group ON children(kutr_group);
CREATE INDEX idx_children_location ON children(collection_location);

-- Fast attendance rosters for Saturday/Sunday sessions
CREATE INDEX idx_session_attendance_lookup ON program_session_attendance(program_session_id, person_type, status);
CREATE INDEX idx_event_attendance_lookup ON event_attendance(event_id, person_type, status);

-- Plan hierarchy traversal indexes
CREATE INDEX idx_plan_activities_goal ON plan_activities(plan_goal_id);
CREATE INDEX idx_plan_distributions_subdept ON plan_distributions(sub_department_id);
CREATE INDEX idx_weekly_plans_dist ON weekly_plans(plan_distribution_id, ethiopian_month, week_number);

-- Audit log timeline queries
CREATE INDEX idx_audit_log_timeline ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_log_resource ON audit_logs(resource_type, resource_id);
```
