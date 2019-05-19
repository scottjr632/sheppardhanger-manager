CREATE TYPE statusenum AS ENUM ('archived', 'active');

ALTER TABLE reservations ADD COLUMN status statusenum;
ALTER TABLE lessee ADD COLUMN status statusenum;