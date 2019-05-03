--
-- PostgreSQL database dump
--

-- Dumped from database version 11.0
-- Dumped by pg_dump version 11.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_roleid_fkey;
ALTER TABLE IF EXISTS ONLY public.rooms DROP CONSTRAINT IF EXISTS rooms_houseid_fkey;
ALTER TABLE IF EXISTS ONLY public.reservations DROP CONSTRAINT IF EXISTS reservations_roomid_fkey;
ALTER TABLE IF EXISTS ONLY public.reservations DROP CONSTRAINT IF EXISTS reservations_lesseeid_fkey;
ALTER TABLE IF EXISTS ONLY public.referrerlog DROP CONSTRAINT IF EXISTS referrerlog_userid_fkey;
ALTER TABLE IF EXISTS ONLY public.referrerlog DROP CONSTRAINT IF EXISTS referrerlog_referrerid_fkey;
ALTER TABLE IF EXISTS ONLY public.paylog DROP CONSTRAINT IF EXISTS paylog_reservationsid_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.rooms DROP CONSTRAINT IF EXISTS rooms_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.reservations DROP CONSTRAINT IF EXISTS reservations_pkey;
ALTER TABLE IF EXISTS ONLY public.referrerlog DROP CONSTRAINT IF EXISTS referrerlog_pkey;
ALTER TABLE IF EXISTS ONLY public.paylog DROP CONSTRAINT IF EXISTS paylog_pkey;
ALTER TABLE IF EXISTS ONLY public.lessee DROP CONSTRAINT IF EXISTS lessee_pkey;
ALTER TABLE IF EXISTS ONLY public.houses DROP CONSTRAINT IF EXISTS houses_pkey;
ALTER TABLE IF EXISTS ONLY public.bookingtype DROP CONSTRAINT IF EXISTS bookingtype_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rooms ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reservations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.referrerlog ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.paylog ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.lessee ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.houses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.bookingtype ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users cascade ;
DROP SEQUENCE IF EXISTS public.rooms_id_seq;
DROP TABLE IF EXISTS public.rooms cascade;
DROP SEQUENCE IF EXISTS public.roles_id_seq;
DROP TABLE IF EXISTS public.roles cascade;
DROP SEQUENCE IF EXISTS public.reservations_id_seq;
DROP TABLE IF EXISTS public.reservations cascade;
DROP SEQUENCE IF EXISTS public.referrerlog_id_seq;
DROP TABLE IF EXISTS public.referrerlog cascade;
DROP SEQUENCE IF EXISTS public.paylog_id_seq;
DROP TABLE IF EXISTS public.paylog cascade;
DROP SEQUENCE IF EXISTS public.lessee_id_seq;
DROP TABLE IF EXISTS public.lessee cascade;
DROP SEQUENCE IF EXISTS public.houses_id_seq;
DROP TABLE IF EXISTS public.houses cascade;
DROP SEQUENCE IF EXISTS public.bookingtype_id_seq;
DROP TABLE IF EXISTS public.bookingtype cascade;
SET default_tablespace = '';

SET default_with_oids = false;

CREATE TABLE tydtype (
    id serial primary key,
    name text
);

CREATE TABLE guesttype (
    id serial primary key,
    name text
);

CREATE TABLE ranktype (
    id serial primary key,
    name varchar(3)
);

--
-- Name: bookingtype; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookingtype (
    id integer NOT NULL,
    name character varying(100)
);


--
-- Name: bookingtype_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookingtype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookingtype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookingtype_id_seq OWNED BY public.bookingtype.id;


--
-- Name: houses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.houses (
    id integer NOT NULL,
    name character varying(100)
);


--
-- Name: houses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.houses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: houses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.houses_id_seq OWNED BY public.houses.id;


--
-- Name: lessee; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessee (
    id integer NOT NULL,
    fname character varying(100),
    lname character varying(100),
    email character varying(254) unique,
    rank integer references ranktype(id),
    phone text,
    address text,
    city text,
    state text,
    zipcode text,
    notes character varying(12)
);


--
-- Name: lessee_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lessee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lessee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lessee_id_seq OWNED BY public.lessee.id;


--
-- Name: paylog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.paylog (
    id integer NOT NULL,
    reservationsid bigint,
    amountdue numeric(8,2),
    amountpaid numeric(8,2),
    duedate date,
    datepaid date
);


--
-- Name: paylog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.paylog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: paylog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.paylog_id_seq OWNED BY public.paylog.id;


--
-- Name: referrerlog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referrerlog (
    id integer NOT NULL,
    userid bigint,
    referrerid bigint,
    payed boolean,
    datepaid date
);


--
-- Name: referrerlog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referrerlog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referrerlog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referrerlog_id_seq OWNED BY public.referrerlog.id;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservations (
    id integer NOT NULL,
    lesseeid bigint,
    purpose text,
    numberofguests integer,
    guesttype integer references guesttype(id),
    tdytype integer references tdytype(id)
    checkindate date,
    checkoutdate date,
    roomid bigint,
    notes text,
    bookingtypeid bigint
);


--
-- Name: reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50)
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    houseid bigint,
    name character varying(100)
);


--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL ,
    fname character varying(100),
    lname character varying(100),
    email character varying(254) ,
    password text,
    salt text,
    roleid bigint
);

-- alter table users add constraint email_unq unique (email);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE user_preferences (
    id serial primary key,
    userid bigint references users(id),
    preferences text
);

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookingtype id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookingtype ALTER COLUMN id SET DEFAULT nextval('public.bookingtype_id_seq'::regclass);


--
-- Name: houses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.houses ALTER COLUMN id SET DEFAULT nextval('public.houses_id_seq'::regclass);


--
-- Name: lessee id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessee ALTER COLUMN id SET DEFAULT nextval('public.lessee_id_seq'::regclass);


--
-- Name: paylog id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paylog ALTER COLUMN id SET DEFAULT nextval('public.paylog_id_seq'::regclass);


--
-- Name: referrerlog id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrerlog ALTER COLUMN id SET DEFAULT nextval('public.referrerlog_id_seq'::regclass);


--
-- Name: reservations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookingtype; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookingtype (id, name) FROM stdin;
\.


--
-- Data for Name: houses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.houses (id, name) FROM stdin;
1	River Creek
2	Phoenix
3	Sparrow
\.


--
-- Data for Name: lessee; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lessee (id, fname, lname, email, phone, address, city, state, zipcode, notes) FROM stdin;
\.


--
-- Data for Name: paylog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.paylog (id, reservationsid, amountdue, amountpaid, duedate, datepaid) FROM stdin;
\.


--
-- Data for Name: referrerlog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.referrerlog (id, userid, referrerid, payed, datepaid) FROM stdin;
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservations (id, lesseeid, purpose, numberofguests, pet, checkindate, checkoutdate, roomid, notes, bookingtypeid) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	user
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rooms (id, houseid, name) FROM stdin;
1	1	RECEE
2	1	WILLIE
3	1	CASTLE
4	1	MCCOY
5	1	BRGSTRM
6	1	HAHN
7	1	UPR HFRD
8	2	HOWARD
9	2	LORING
10	2	WALKER
11	3	GRIFFISS
12	3	MATHER
13	3	HUNTER
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, fname, lname, email, password, salt, roleid) FROM stdin;
1	administrator	account	admin@admin.sheppardhanger.com	5dff03a060dfc941f3432a1a2de113733ee5ea7703c211d5a235cd1fc578ed86c3edae8778d5a5063667831e42c91fd29d83779bfd6805a43bd10cd3f271d1bc	2f2c0a37a965469ca26e0ad00511b3bb	1
\.


--
-- Name: bookingtype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookingtype_id_seq', 1, false);


--
-- Name: houses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.houses_id_seq', 3, true);


--
-- Name: lessee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lessee_id_seq', 1, false);


--
-- Name: paylog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.paylog_id_seq', 1, false);


--
-- Name: referrerlog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.referrerlog_id_seq', 1, false);


--
-- Name: reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reservations_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rooms_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: bookingtype bookingtype_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookingtype
    ADD CONSTRAINT bookingtype_pkey PRIMARY KEY (id);


--
-- Name: houses houses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT houses_pkey PRIMARY KEY (id);


--
-- Name: lessee lessee_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessee
    ADD CONSTRAINT lessee_pkey PRIMARY KEY (id);


--
-- Name: paylog paylog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paylog
    ADD CONSTRAINT paylog_pkey PRIMARY KEY (id);


--
-- Name: referrerlog referrerlog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrerlog
    ADD CONSTRAINT referrerlog_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

-- ALTER TABLE ONLY public.users
--     ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: paylog paylog_reservationsid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paylog
    ADD CONSTRAINT paylog_reservationsid_fkey FOREIGN KEY (reservationsid) REFERENCES public.reservations(id);


--
-- Name: referrerlog referrerlog_referrerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrerlog
    ADD CONSTRAINT referrerlog_referrerid_fkey FOREIGN KEY (referrerid) REFERENCES public.lessee(id);


--
-- Name: referrerlog referrerlog_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrerlog
    ADD CONSTRAINT referrerlog_userid_fkey FOREIGN KEY (userid) REFERENCES public.lessee(id);


--
-- Name: reservations reservations_lesseeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_lesseeid_fkey FOREIGN KEY (lesseeid) REFERENCES public.lessee(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_roomid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_roomid_fkey FOREIGN KEY (roomid) REFERENCES public.rooms(id) ON DELETE RESTRICT;


--
-- Name: rooms rooms_houseid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_houseid_fkey FOREIGN KEY (houseid) REFERENCES public.houses(id);


--
-- Name: users users_roleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_roleid_fkey FOREIGN KEY (roleid) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

