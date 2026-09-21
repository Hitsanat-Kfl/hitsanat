# Database Entities & Table Specifications

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Target ORM:** Drizzle ORM (`packages/database/src/schema/`)  

---

## 1. Identity, Governance & Membership Tables

### 1.1 `members` (University Students)
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Unique member identifier |
| `full_name` | `VARCHAR(255)` | No | | Full civilian name |
| `christian_name` | `VARCHAR(255)` | No | | Christian baptismal name (የክርስትና ስም) |
| `phone_number` | `VARCHAR(32)` | No | UNIQUE | Mobile phone number |
| `year_of_study` | `VARCHAR(32)` | No | | 1st Year, 2nd Year, 3rd Year, 4th Year, 5th Year, GC |
| `academic_department` | `VARCHAR(255)` | No | | University study department (e.g. Software Eng) |
| `campus` | `VARCHAR(128)` | No | | Main Campus, Agri Campus, etc. |
| `gender` | `VARCHAR(16)` | No | CHECK (`gender IN ('Male', 'Female')`) | Gender |
| `photo_url` | `TEXT` | Yes | | S3/Storage bucket image URI |
| `telegram_username` | `VARCHAR(128)` | Yes | | Telegram handle (e.g. `@username`) |
| `date_joined` | `DATE` | No | `DEFAULT CURRENT_DATE` | Date joined the ministry |
| `is_active` | `BOOLEAN` | No | `DEFAULT true` | Active member status |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Last update timestamp |

### 1.2 `sub_departments`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Unique sub-department ID |
| `code` | `VARCHAR(32)` | No | UNIQUE | `TIMIHRT`, `MEZMUR`, `KUTITR`, `EKD`, `KINETIBEB` |
| `name_am` | `VARCHAR(128)` | No | | Amharic title (e.g. ትምህርት) |
| `name_en` | `VARCHAR(128)` | No | | English title (e.g. Timihrt) |
| `description` | `TEXT` | Yes | | Department scope & charter |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Creation timestamp |

### 1.3 `sub_department_members` (Join Table with Scoped Roles)
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Join record ID |
| `member_id` | `UUID` | No | FK $\rightarrow$ `members.id` ON DELETE CASCADE | Member reference |
| `sub_department_id` | `UUID` | No | FK $\rightarrow$ `sub_departments.id` ON DELETE CASCADE | Sub-department reference |
| `role` | `VARCHAR(64)` | No | CHECK (`role IN ('Leader', 'Sub-Leader', 'Secretary', 'Member')`) | Role within department |
| `is_primary` | `BOOLEAN` | No | `DEFAULT false` | Primary department designation |
| `assigned_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Assignment timestamp |

### 1.4 `families` (ቤተሰብ / Khnet)
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Unique family ID |
| `family_name` | `VARCHAR(128)` | No | | Name or family number |
| `father_member_id` | `UUID` | Yes | FK $\rightarrow$ `members.id` ON DELETE SET NULL | Senior male member (Father) |
| `mother_member_id` | `UUID` | Yes | FK $\rightarrow$ `members.id` ON DELETE SET NULL | Senior female member (Mother) |
| `academic_year` | `VARCHAR(32)` | No | | e.g. `2016/2017 E.C.` |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Creation timestamp |

### 1.5 `family_members` (Family Membership Allocation)
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Record ID |
| `family_id` | `UUID` | No | FK $\rightarrow$ `families.id` ON DELETE CASCADE | Family reference |
| `member_id` | `UUID` | No | FK $\rightarrow$ `members.id` ON DELETE CASCADE | Member reference |
| `assigned_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Allocation timestamp |

---

## 2. Beneficiary & Parent Tables

### 2.1 `children`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Child ID |
| `full_name` | `VARCHAR(255)` | No | | Full civilian name |
| `christian_name` | `VARCHAR(255)` | No | | Christian baptismal name (የክርስትና ስም) |
| `gender` | `VARCHAR(16)` | No | CHECK (`gender IN ('Male', 'Female')`) | Gender |
| `date_of_birth` | `DATE` | No | | Gregorian birth date (drives Ethiopian birthday query) |
| `address` | `TEXT` | No | | Residential neighborhood / home address |
| `kutr_group` | `VARCHAR(16)` | No | CHECK (`kutr_group IN ('Kutr 1', 'Kutr 2')`) | Educational cohort classification |
| `collection_location`| `VARCHAR(64)` | No | CHECK (`collection_location IN ('Apartama', 'Gende Boy', 'Gende Je', 'Cobalt', 'Bate')`) | Designated Saturday gathering point |
| `photo_url` | `TEXT` | Yes | | Photo storage URL |
| `is_active` | `BOOLEAN` | No | `DEFAULT true` | Enrolled status |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Creation timestamp |

### 2.2 `parents`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Parent ID |
| `full_name` | `VARCHAR(255)` | No | | Full name |
| `phone_number` | `VARCHAR(32)` | No | | Primary phone number |
| `secondary_phone` | `VARCHAR(32)` | Yes | | Alternative phone number |
| `address` | `TEXT` | No | | Residential home address |
| `occupation` | `VARCHAR(128)` | Yes | | Work/profession |
| `notes` | `TEXT` | Yes | | Pastoral notes / instructions |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Creation timestamp |

### 2.3 `child_parents` (Child-Parent Relationship with Cardinality Invariant)
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Relationship ID |
| `child_id` | `UUID` | No | FK $\rightarrow$ `children.id` ON DELETE CASCADE | Child reference |
| `parent_id` | `UUID` | No | FK $\rightarrow$ `parents.id` ON DELETE RESTRICT | Parent reference |
| `relation` | `VARCHAR(16)` | No | CHECK (`relation IN ('Father', 'Mother')`) | Relationship type |
| **Constraint** | | | `UNIQUE(child_id, relation)` | **Enforces max 1 Father, 1 Mother per child** |

---

## 3. Planning & Strategy Tables (Action Plan Schema)

### 3.1 `annual_master_plans`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Master Plan ID |
| `academic_year` | `VARCHAR(32)` | No | UNIQUE | e.g., `2016/2017 E.C.` |
| `title` | `VARCHAR(255)` | No | | Plan title |
| `total_budget` | `NUMERIC(12,2)`| No | `DEFAULT 0.00` | Total budget in ETB ($\sum = 3500.00$) |
| `total_people` | `INTEGER` | No | `DEFAULT 0` | Total human resource units ($\sum = 112$) |
| `total_time` | `INTEGER` | No | `DEFAULT 0` | Total time score units ($\sum = 45$) |
| `status` | `VARCHAR(32)` | No | CHECK (`status IN ('Draft', 'Distributed', 'Active', 'Completed', 'Archived')`) | Lifecycle status |
| `created_by` | `UUID` | No | FK $\rightarrow$ `members.id` | Plan author (Ekd Leader) |
| `approved_by` | `UUID` | Yes | FK $\rightarrow$ `members.id` | Approver (Chairperson) |
| `approved_at` | `TIMESTAMPTZ` | Yes | | Approval timestamp |

### 3.2 `plan_goals`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Goal ID |
| `annual_plan_id` | `UUID` | No | FK $\rightarrow$ `annual_master_plans.id` ON DELETE CASCADE | Parent master plan |
| `goal_number` | `INTEGER` | No | | Goal index (1 through 6) |
| `title` | `TEXT` | No | | Goal title in Amharic (e.g. ለሕጻናት መንፈሳዊ ት/ት ማስተማር) |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Creation timestamp |

### 3.3 `plan_activities`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Activity ID |
| `plan_goal_id` | `UUID` | No | FK $\rightarrow$ `plan_goals.id` ON DELETE CASCADE | Parent goal |
| `activity_number`| `INTEGER` | No | | Activity index under goal |
| `main_activity` | `TEXT` | No | | Main activity description (ዋና ተግባር) |
| `expected_result`| `TEXT` | Yes | | Expected outcome / deliverable (ውጤት) |
| `annual_target` | `INTEGER` | No | | Planned quantity target (የዓመት ዕቅድ) |
| `budget` | `NUMERIC(10,2)`| No | `DEFAULT 0.00` | Allocated budget in ETB (በጀት) |
| `human_resource`| `INTEGER` | No | `DEFAULT 0` | Assigned student members count (ሰው) |
| `planned_time` | `INTEGER` | No | `DEFAULT 0` | Duration / frequency units (ጊዜ) |
| `weight` | `NUMERIC(6,4)` | No | | Computed mathematical weight % (ክብደት) |
| `q1_target` | `INTEGER` | No | `DEFAULT 0` | Q1 planned target (Tikimt, Hidar, Tahsas) |
| `q2_target` | `INTEGER` | No | `DEFAULT 0` | Q2 planned target (Tir, Yekatit, Megabit) |
| `q3_target` | `INTEGER` | No | `DEFAULT 0` | Q3 planned target (Miazia, Ginbot, Sene) |
| `q4_target` | `INTEGER` | No | `DEFAULT 0` | Q4 planned target |

### 3.4 `plan_distributions` (Sub-Department Plan Ownership)
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Distribution ID |
| `plan_activity_id`| `UUID` | No | FK $\rightarrow$ `plan_activities.id` ON DELETE CASCADE | Master activity |
| `sub_department_id`| `UUID` | No | FK $\rightarrow$ `sub_departments.id` ON DELETE RESTRICT | Executing sub-department |
| `status` | `VARCHAR(32)` | No | CHECK (`status IN ('Assigned', 'In_Progress', 'Completed')`) | Execution status |
| `assigned_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Assignment timestamp |

### 3.5 `weekly_plans` & `plan_progress_records`
| Table | Key Columns | Purpose |
| :--- | :--- | :--- |
| `weekly_plans` | `id`, `plan_distribution_id`, `ethiopian_month`, `week_number`, `session_date`, `task_description` | Granular weekly execution task |
| `plan_progress_records` | `id`, `weekly_plan_id`, `actual_result_numeric`, `actual_result_text`, `status`, `challenges`, `submitted_by` | Lowest-level recorded progress rolling up to quarterly/annual |

---

## 4. Attendance & Event Tables (ADR-0001, ADR-0002)

### 4.1 `program_sessions` & `program_session_attendance`
- `program_sessions`: `id`, `session_type` (`Saturday`, `Sunday`), `session_date` (`DATE`), `start_time`, `end_time`.
- `program_session_attendance`: `id`, `program_session_id`, `person_type` (`Member`, `Child`), `person_id` (`UUID`), `collection_location` (optional), `status` (`Expected`, `Present`, `Absent`, `Excused`), `recorded_by` (Kutitr member ID), `confirmed_at`.

### 4.2 `events`, `event_assignments` & `event_attendance`
- `events`: `id`, `event_name`, `event_type` (`Special`, `Extra_Training`, `Awdemerit`, `Adar`), `event_date` (`TIMESTAMPTZ`), `is_published`, `countdown_active`.
- `event_program_assignments`: `id`, `event_id`, `sub_department_id`, `program_title`, `assigned_members` (JSONB/join table ensuring $\ge 2$ members).
- `event_attendance`: `id`, `event_id`, `person_type`, `person_id`, `status`, `recorded_by`, `confirmed_at`.

---

## 5. Academic Tracking & Announcements Tables

### 5.1 `academic_assessments` & `student_scores`
- `academic_assessments`: `id`, `curriculum_id`, `assessment_type` (`Mid_Exam`, `Final_Exam`, `Assignment`), `subject_topic`, `max_score`, `academic_period`, `exam_date`.
- `student_scores`: `id`, `academic_assessment_id`, `child_id`, `score_achieved` (`NUMERIC(5,2)`), `recorded_by` (Timihrt teacher ID).

### 5.2 `announcements` & `audit_logs`
- `announcements`: `id`, `title`, `content`, `target_audience` (`Public`, `Members`, `Parents`), `is_published`, `publish_to_telegram`, `published_at`, `created_by`.
- `audit_logs`: `id`, `operator_id`, `action`, `resource_type`, `resource_id`, `payload_diff` (`JSONB`), `ip_address`, `timestamp`.

---

## 6. Meeting Scheduler Tables

### 6.1 `leadership_meetings`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Meeting ID |
| `title` | `VARCHAR(255)` | No | | Meeting title |
| `description` | `TEXT` | Yes | | Meeting description/agenda |
| `meeting_date` | `DATE` | No | | Meeting date |
| `start_time` | `TIME` | No | | Start time |
| `end_time` | `TIME` | Yes | | End time |
| `location` | `VARCHAR(255)` | Yes | | Meeting location |
| `status` | `VARCHAR(32)` | No | CHECK (`status IN ('Scheduled', 'In_Progress', 'Completed', 'Cancelled')`) | Meeting status |
| `is_recurring` | `BOOLEAN` | No | `DEFAULT false` | Recurring meeting flag |
| `recurrence_pattern` | `VARCHAR(32)` | Yes | CHECK (`recurrence_pattern IN ('Weekly', 'Bi_Weekly', 'Monthly')`) | Recurrence pattern |
| `recurrence_end_date` | `DATE` | Yes | | Recurrence end date |
| `created_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Creator (Chairperson, Sub-Chairperson, or Secretary) |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Creation timestamp |

### 6.2 `meeting_attendees`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Attendee ID |
| `meeting_id` | `UUID` | No | FK $\rightarrow$ `leadership_meetings.id` ON DELETE CASCADE | Parent meeting |
| `user_id` | `UUID` | No | FK $\rightarrow$ `users.id` | Attendee user |
| `attendance_status` | `VARCHAR(32)` | No | CHECK (`attendance_status IN ('Pending', 'Present', 'Absent', 'Excused')`) | Attendance status |
| `marked_by` | `UUID` | Yes | FK $\rightarrow$ `users.id` | Who marked attendance (Chairperson, Sub-Chairperson, or Secretary) |
| `marked_at` | `TIMESTAMPTZ` | Yes | | When attendance was marked |

### 6.3 `meeting_minutes`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Minutes ID |
| `meeting_id` | `UUID` | No | FK $\rightarrow$ `leadership_meetings.id` ON DELETE CASCADE | Parent meeting |
| `content` | `TEXT` | No | | Meeting minutes content |
| `action_items` | `JSONB` | Yes | | Action items with assignees and deadlines |
| `recorded_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Recorder (Chairperson, Sub-Chairperson, or Secretary) |
| `recorded_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Recording timestamp |

---

## 7. Secretary Dashboard Extension Tables

### 7.1 `member_transfers`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Transfer ID |
| `member_id` | `UUID` | No | FK $\rightarrow$ `members.id` | Member being transferred |
| `from_sub_department` | `VARCHAR(32)` | No | | Source sub-department code |
| `to_sub_department` | `VARCHAR(32)` | No | | Destination sub-department code |
| `reason` | `TEXT` | No | | Transfer reason documentation |
| `transferred_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Secretary who performed transfer |
| `transferred_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Transfer timestamp |

### 7.2 `bulk_import_jobs`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Job ID |
| `type` | `VARCHAR(32)` | No | CHECK (`type IN ('members', 'children', 'parents')`) | Import entity type |
| `status` | `VARCHAR(32)` | No | CHECK (`status IN ('pending', 'processing', 'completed', 'failed')`) | Job status |
| `total_rows` | `INTEGER` | No | `DEFAULT 0` | Total rows in import file |
| `processed_rows` | `INTEGER` | No | `DEFAULT 0` | Rows processed so far |
| `success_rows` | `INTEGER` | No | `DEFAULT 0` | Successfully imported rows |
| `failed_rows` | `INTEGER` | No | `DEFAULT 0` | Failed rows count |
| `errors` | `JSONB` | Yes | | Array of `{row, message}` error objects |
| `created_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Secretary who initiated import |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Job creation timestamp |
| `completed_at` | `TIMESTAMPTZ` | Yes | | Job completion timestamp |

### 7.3 `data_quality_checks`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Check ID |
| `entity_type` | `VARCHAR(32)` | No | CHECK (`entity_type IN ('member', 'child', 'parent')`) | Entity type checked |
| `entity_id` | `UUID` | No | | ID of the entity with issue |
| `issue_type` | `VARCHAR(64)` | No | | Issue type (missing_phone, duplicate_name, etc.) |
| `field_name` | `VARCHAR(64)` | Yes | | Field with the issue |
| `severity` | `VARCHAR(16)` | No | CHECK (`severity IN ('warning', 'error')`) | Issue severity |
| `resolved` | `BOOLEAN` | No | `DEFAULT false` | Whether issue is resolved |
| `resolved_by` | `UUID` | Yes | FK $\rightarrow$ `users.id` | Who resolved the issue |
| `resolved_at` | `TIMESTAMPTZ` | Yes | | Resolution timestamp |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Check creation timestamp |

---

## 8. Timihrt Leader Extension Tables

### 8.1 `report_card_templates`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Template ID |
| `name` | `VARCHAR(128)` | No | | Template name (e.g., 'Ministry Standard') |
| `description` | `TEXT` | Yes | | Template description |
| `header_html` | `TEXT` | No | | HTML header with logo and ministry name |
| `footer_html` | `TEXT` | No | | HTML footer with signature lines |
| `is_active` | `BOOLEAN` | No | `DEFAULT true` | Whether template is active |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Creation timestamp |

### 8.2 `generated_report_cards`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Report card ID |
| `child_id` | `UUID` | No | FK $\rightarrow$ `children.id` | Student being reported |
| `academic_year` | `VARCHAR(32)` | No | | Ethiopian academic year (e.g., '2016/2017 E.C.') |
| `academic_period` | `VARCHAR(32)` | No | CHECK (`academic_period IN ('Mid_Term', 'Final', 'Annual')`) | Academic period |
| `template_id` | `UUID` | No | FK $\rightarrow$ `report_card_templates.id` | Template used |
| `generated_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Timihrt leader who generated |
| `generated_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Generation timestamp |
| `file_url` | `TEXT` | Yes | | URL to generated PDF file |
| `file_type` | `VARCHAR(16)` | No | CHECK (`file_type IN ('pdf', 'excel')`) | File format |

### 8.3 `report_card_grades`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Grade entry ID |
| `report_card_id` | `UUID` | No | FK $\rightarrow$ `generated_report_cards.id` ON DELETE CASCADE | Parent report card |
| `assessment_type` | `VARCHAR(32)` | No | CHECK (`assessment_type IN ('Mid_Exam', 'Final_Exam', 'Assignment')`) | Assessment type |
| `subject_topic` | `VARCHAR(255)` | No | | Subject or topic name |
| `score_achieved` | `NUMERIC(5,2)` | No | | Score achieved |
| `max_score` | `NUMERIC(5,2)` | No | | Maximum possible score |
| `percentage` | `NUMERIC(5,2)` | No | | Calculated percentage |

### 8.4 `report_card_summary`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Summary ID |
| `report_card_id` | `UUID` | No | FK $\rightarrow$ `generated_report_cards.id` ON DELETE CASCADE | Parent report card |
| `total_score` | `NUMERIC(7,2)` | No | | Sum of all scores |
| `total_max_score` | `NUMERIC(7,2)` | No | | Sum of all max scores |
| `average_percentage` | `NUMERIC(5,2)` | No | | Overall average percentage |
| `class_rank` | `INTEGER` | Yes | | Rank in class (1 = highest) |
| `class_size` | `INTEGER` | No | | Total students in class |
| `attendance_present` | `INTEGER` | No | `DEFAULT 0` | Days present |
| `attendance_absent` | `INTEGER` | No | `DEFAULT 0` | Days absent |
| `attendance_excused` | `INTEGER` | No | `DEFAULT 0` | Days excused |
| `teacher_comments` | `TEXT` | Yes | | Teacher comments on student |
| `conduct_grade` | `VARCHAR(16)` | Yes | | Conduct/behavior grade |

---

## 9. Kutitr Leader Extension Tables

### 9.1 `route_performance_stats`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Stats ID |
| `route_name` | `VARCHAR(64)` | No | | Route name (Apartama, Gende Boy, Gende Je, Cobalt, Bate) |
| `session_date` | `DATE` | No | | Session date |
| `session_type` | `VARCHAR(16)` | No | CHECK (`session_type IN ('Saturday', 'Sunday')`) | Session type |
| `expected_children` | `INTEGER` | No | `DEFAULT 0` | Expected children count |
| `picked_up_children` | `INTEGER` | No | `DEFAULT 0` | Children actually picked up |
| `attendance_rate` | `NUMERIC(5,2)` | No | | Calculated attendance rate percentage |
| `avg_pickup_time` | `TIME` | Yes | | Average pickup time |
| `issues_logged` | `INTEGER` | No | `DEFAULT 0` | Number of issues reported |
| `issues_details` | `JSONB` | Yes | | Array of issue descriptions |
| `recorded_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Kutitr leader who recorded |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Record creation timestamp |

### 9.2 `route_issues`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Issue ID |
| `route_name` | `VARCHAR(64)` | No | | Route name |
| `session_date` | `DATE` | No | | Session date |
| `issue_type` | `VARCHAR(32)` | No | | Issue type (late_pickup, vehicle_issue, child_absent, parent_not_available, etc.) |
| `description` | `TEXT` | No | | Issue description |
| `child_id` | `UUID` | Yes | FK $\rightarrow$ `children.id` | Related child (if applicable) |
| `resolved` | `BOOLEAN` | No | `DEFAULT false` | Whether issue is resolved |
| `reported_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Who reported the issue |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Issue creation timestamp |

---

## 10. Ekd Leader Extension Tables

### 10.1 `plan_approvals`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Approval ID |
| `plan_id` | `UUID` | No | FK $\rightarrow$ `annual_master_plans.id` | Related plan |
| `change_type` | `VARCHAR(32)` | No | | Change type (budget, people, time, activity) |
| `change_description` | `TEXT` | No | | Description of proposed change |
| `current_value` | `JSONB` | No | | Current value of changed field |
| `proposed_value` | `JSONB` | No | | Proposed new value |
| `status` | `VARCHAR(16)` | No | `DEFAULT 'pending'` CHECK (`status IN ('pending', 'approved', 'rejected', 'revision_needed')`) | Approval status |
| `submitted_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Ekd leader who submitted |
| `reviewed_by` | `UUID` | Yes | FK $\rightarrow$ `users.id` | Chairperson who reviewed |
| `review_comments` | `TEXT` | Yes | | Review comments |
| `reviewed_at` | `TIMESTAMPTZ` | Yes | | Review timestamp |
| `created_at` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Request creation timestamp |

### 10.2 `dept_progress_heatmap`
| Column Name | PostgreSQL Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | PK, `defaultRandom()` | Record ID |
| `sub_dept_id` | `UUID` | No | FK $\rightarrow$ `sub_departments.id` | Sub-department |
| `goal_id` | `UUID` | No | FK $\rightarrow$ `goals.id` | Goal from master plan |
| `activity_id` | `UUID` | Yes | FK $\rightarrow$ `activities.id` | Specific activity (if applicable) |
| `completion_percentage` | `NUMERIC(5,2)` | No | | Completion percentage (0-100) |
| `color_code` | `VARCHAR(16)` | No | | Color code (red, orange, yellow, green) |
| `last_updated` | `TIMESTAMPTZ` | No | `DEFAULT now()` | Last update timestamp |
| `updated_by` | `UUID` | No | FK $\rightarrow$ `users.id` | Who updated the progress |
| `notes` | `TEXT` | Yes | | Progress notes |
