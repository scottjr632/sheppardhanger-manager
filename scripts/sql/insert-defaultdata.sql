insert into houses (name) values ('River Creek'), ('Phoenix'), ('Sparrow');
insert into roles (name) values ('admin'), ('user');
insert into users (fname, lname, email, password, salt, roleid)
values (
    'administrator',
    'account',
    'admin@admin.sheppardhanger.com',
    '5dff03a060dfc941f3432a1a2de113733ee5ea7703c211d5a235cd1fc578ed86c3edae8778d5a5063667831e42c91fd29d83779bfd6805a43bd10cd3f271d1bc',
    '2f2c0a37a965469ca26e0ad00511b3bb',
    2
);

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
