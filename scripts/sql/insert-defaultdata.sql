insert into houses (name) values ('River Creek'), ('Phoenix'), ('Sparrow');


insert into rooms (houseid, name)
values (
           (select id from houses where name = 'River Creek'), 'RECEE'
       ),(
           (select id from houses where name = 'River Creek'), 'WILLIE'
       ),(
           (select id from houses where name = 'River Creek'), 'CASTLE'
       ),(
           (select id from houses where name = 'River Creek'), 'MCCOY'
       ),(
           (select id from houses where name = 'River Creek'), 'BRGSTRM'
       ),(
           (select id from houses where name = 'River Creek'), 'HAHN'
       ),(
           (select id from houses where name = 'River Creek'), 'UPR HFRD'
       );

insert into rooms (houseid, name)
values (
           (select id from houses where name = 'Phoenix'), 'HOWARD'
       ),(
           (select id from houses where name = 'Phoenix'), 'LORING'
       ),(
           (select id from houses where name = 'Phoenix'), 'WALKER'
       );

insert into rooms (houseid, name)
values (
           (select id from houses where name = 'Sparrow'), 'GRIFFISS'
       ), (
           (select id from houses where name = 'Sparrow'), 'MATHER'
       ), (
           (select id from houses where name = 'Sparrow'), 'HUNTER'
       );

insert into bookingtype (name) values ('TENTATIVE'), ('CONFIRMED'), ('CLEANING');
insert into tdytype (name) values ('AMOC'), ('IFF'), ('LRO');
insert into guesttype (name) values ('NONE'), ('PET'), ('GUEST'), ('GUEST AND PET');
insert into ranktype (name) values ('O1'), ('O2'), ('O3'), ('O4');
