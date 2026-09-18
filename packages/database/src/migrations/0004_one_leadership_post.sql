-- BR-009: One Leadership Post Rule
-- A member may hold at most ONE leadership position:
--   - one executive role in users (SUPER_ADMIN, CHAIRPERSON, SUB_CHAIRPERSON, SECRETARY)
--   - XOR one sub-dept leadership post (Leader/Sub-Leader) in sub_department_members
-- Sub-dept Member and Secretary rows are unlimited (ordinary membership / records role).
-- Executives MAY hold plain Member rows (oversight + membership).

-- 1. Block inserting a sub-dept leadership row for a member who is an executive
--    or already holds a leadership post in another department.
CREATE OR REPLACE FUNCTION enforce_one_leadership_post() RETURNS trigger AS $$
DECLARE
  exec_role text;
  other_leadership_count int;
BEGIN
  SELECT role INTO exec_role FROM users WHERE member_id = NEW.member_id;

  SELECT count(*) INTO other_leadership_count
  FROM sub_department_members
  WHERE member_id = NEW.member_id
    AND role IN ('Leader', 'Sub-Leader')
    AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

  IF NEW.role IN ('Leader', 'Sub-Leader') THEN
    IF exec_role IN ('SUPER_ADMIN', 'CHAIRPERSON', 'SUB_CHAIRPERSON', 'SECRETARY') THEN
      RAISE EXCEPTION 'BR-009 violation: member % holds executive role % and cannot also hold sub-department leadership (%)',
        NEW.member_id, exec_role, NEW.role;
    END IF;
    IF other_leadership_count > 0 THEN
      RAISE EXCEPTION 'BR-009 violation: member % already holds a leadership post in another sub-department',
        NEW.member_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_one_leadership_post_insert
  BEFORE INSERT ON sub_department_members
  FOR EACH ROW EXECUTE FUNCTION enforce_one_leadership_post();

CREATE TRIGGER trg_one_leadership_post_update
  BEFORE UPDATE OF member_id, role ON sub_department_members
  FOR EACH ROW EXECUTE FUNCTION enforce_one_leadership_post();

-- 2. Block promoting a user to an executive role while they hold sub-dept leadership.
CREATE OR REPLACE FUNCTION enforce_executive_no_subdept_leadership() RETURNS trigger AS $$
DECLARE
  leadership_count int;
BEGIN
  IF NEW.role IN ('SUPER_ADMIN', 'CHAIRPERSON', 'SUB_CHAIRPERSON', 'SECRETARY')
     AND NEW.member_id IS NOT NULL THEN
    SELECT count(*) INTO leadership_count
    FROM sub_department_members
    WHERE member_id = NEW.member_id
      AND role IN ('Leader', 'Sub-Leader');

    IF leadership_count > 0 THEN
      RAISE EXCEPTION 'BR-009 violation: member % holds sub-department leadership and cannot be assigned executive role %',
        NEW.member_id, NEW.role;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_executive_no_subdept_leadership
  BEFORE INSERT OR UPDATE OF role, member_id ON users
  FOR EACH ROW EXECUTE FUNCTION enforce_executive_no_subdept_leadership();
