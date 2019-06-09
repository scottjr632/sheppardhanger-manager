insert into houses (name) values ('River Creek'), ('Phoenix'), ('Sparrow');
insert into roles (name) values ('admin'), ('user');
insert into users (fname, lname, email, password, salt, roleid) values
(
    'administrator',
    'account',
    'admin@admin.sheppardhanger.com',
    '5dff03a060dfc941f3432a1a2de113733ee5ea7703c211d5a235cd1fc578ed86c3edae8778d5a5063667831e42c91fd29d83779bfd6805a43bd10cd3f271d1bc',
    '2f2c0a37a965469ca26e0ad00511b3bb',
    2
);

insert into rooms (houseid, name) values
 (
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

insert into rooms (houseid, name) values
(
    (select id from houses where name = 'Phoenix'), 'HOWARD'
),(
    (select id from houses where name = 'Phoenix'), 'LORING'
),(
    (select id from houses where name = 'Phoenix'), 'WALKER'
);

insert into rooms (houseid, name) values
(
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
insert into email_templates (name, template) values
(
    'CONTRACT', 
    'Hi **LESSEENAME** hope all is well.  Please take a moment to review the agreement, if you have any questions please feel free to call us at any time, 954-471-6872.  If there are any blocks that need to be filled in that you do not have the information readily available just put a "0" in the box and then you can provide us with the information once you do have it.  Once we receive the agreement back we will block off a room for you.  We look forward to having you stay at The Sheppard Hangar!

Thanks again, all the best,

Nicolette and Craig McColaugh
THE SHEPPARD HANGAR® Crashpads
The River Creek House
The Phoenix House
The Sparrow House
www.SheppardHangar.com
SheppardHangar@Gmail.com
954-471-6872'
),
(
    'NO ROOMS', 
    'Hi **LESSEENAME**, hope all is well.  Thanks so much for the inquiry, unfortunately it looks like our first opening at The Sheppard Hangar will not be until mid **MONTH** barring any unforeseen changes to our current bookings.  
We suggest  contacting:

Troy at: 
Website:  www.sheppardafbcrashpad.com
Email:  airforcecrashpadsllc@gmail.com

and see if he might have space, please say hello from us.  If you do end up staying with him please let us know!

If you do come across anyone that will be coming to Sheppard for training in **MONTH** or later please keep us in mind, we are offering a $200 referral gift to you for anyone that you refer that stays for 30 nights or more at The Sheppard Hangar.  

Thanks again, all the best,
Nicolette and Craig McColaugh
THE SHEPPARD HANGAR® Crashpads
The River Creek House
The Phoenix House'
),
(
    'WELCOME',
    'Hi **LESSEENAME**, thanks so much for the inquiry.  We would love to have you stay at The Sheppard Hangar while you go through training!  

We will be sending a separate email to you with the rental agreement attached for your review via a DocuSign email.  If you do not receive it please let us know, we have had problems with the email going to spam folders.   As of now we have a room available for you, however we cannot guarantee a room reservation until we receive the rental agreement document back from you, so if you have any questions with the agreement please contact us as soon as possible.

We will do our best to accommodate any specific room requests, however we cannot guarantee that you will be assigned a specific request.  Just know that we will gladly work with you if you are unhappy with your initial room assignment.  We appreciate your understanding and flexibility.  

Help us spread the word! We are offering a $200 referral gift to those who refer a guest that stays for 30 nights or more at The Sheppard Hangar.  It’s never too late to book with us – on base lodging can be canceled at any time!

If you have any questions please feel free to contact us at any time at (954) 471-6872 and if there is anything that we can do to make your stay more enjoyable please let us know!

Thanks again, all the best,
Nicolette and Craig McColaugh
THE SHEPPARD HANGAR® Crashpads
The River Creek House
The Phoenix House
The Sparrow House
www.SheppardHangar.com
SheppardHangar@Gmail.com
954-471-6872'
);