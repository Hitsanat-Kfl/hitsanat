-- Add check constraints for kutr_group and collection_location
ALTER TABLE children ADD CONSTRAINT children_kutr_group_check
  CHECK (kutr_group IN ('Kutr 1', 'Kutr 2'));

ALTER TABLE children ADD CONSTRAINT children_collection_location_check
  CHECK (collection_location IN ('Apartama', 'Gende Boy', 'Gende Je', 'Cobalt', 'Bate'));

-- Add unique constraint for child-parent relationship
ALTER TABLE child_parents ADD CONSTRAINT child_parents_child_id_relation_unique
  UNIQUE (child_id, relation);
