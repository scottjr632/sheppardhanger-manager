create table documents(
  id serial,
  name varchar(100) not null,
  path text not null,
  userid bigint references users(id) not null,
  lesseeid bigint references lessee(id),
  reservationid bigint references reservations(id)
);