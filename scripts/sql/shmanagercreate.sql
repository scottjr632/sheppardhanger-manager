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
ALTER TABLE IF EXISTS ONLY public.lessee DROP CONSTRAINT IF EXISTS lessee_reservationid_fkey;
ALTER TABLE IF EXISTS ONLY public.tdytype DROP CONSTRAINT IF EXISTS tdytype_pkey;
ALTER TABLE IF EXISTS ONLY public.rooms DROP CONSTRAINT IF EXISTS rooms_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.reservations DROP CONSTRAINT IF EXISTS reservations_pkey;
ALTER TABLE IF EXISTS ONLY public.referrerlog DROP CONSTRAINT IF EXISTS referrerlog_pkey;
ALTER TABLE IF EXISTS ONLY public.ranktype DROP CONSTRAINT IF EXISTS ranktype_pkey;
ALTER TABLE IF EXISTS ONLY public.paylog DROP CONSTRAINT IF EXISTS paylog_pkey;
ALTER TABLE IF EXISTS ONLY public.lessee DROP CONSTRAINT IF EXISTS lessee_pkey;
ALTER TABLE IF EXISTS ONLY public.lessee DROP CONSTRAINT IF EXISTS lessee_email_key;
ALTER TABLE IF EXISTS ONLY public.houses DROP CONSTRAINT IF EXISTS houses_pkey;
ALTER TABLE IF EXISTS ONLY public.guesttype DROP CONSTRAINT IF EXISTS guesttype_pkey;
ALTER TABLE IF EXISTS ONLY public.bookingtype DROP CONSTRAINT IF EXISTS bookingtype_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_preferences ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tdytype ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rooms ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reservations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.referrerlog ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ranktype ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.paylog ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.lessee ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.houses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.guesttype ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.bookingtype ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.user_preferences_id_seq;
DROP TABLE IF EXISTS public.user_preferences;
DROP SEQUENCE IF EXISTS public.tdytype_id_seq;
DROP TABLE IF EXISTS public.tdytype;
DROP SEQUENCE IF EXISTS public.rooms_id_seq;
DROP TABLE IF EXISTS public.rooms;
DROP SEQUENCE IF EXISTS public.roles_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP SEQUENCE IF EXISTS public.reservations_id_seq;
DROP TABLE IF EXISTS public.reservations;
DROP SEQUENCE IF EXISTS public.referrerlog_id_seq;
DROP TABLE IF EXISTS public.referrerlog;
DROP SEQUENCE IF EXISTS public.ranktype_id_seq;
DROP TABLE IF EXISTS public.ranktype;
DROP SEQUENCE IF EXISTS public.paylog_id_seq;
DROP TABLE IF EXISTS public.paylog;
DROP SEQUENCE IF EXISTS public.lessee_id_seq;
DROP TABLE IF EXISTS public.lessee;
DROP SEQUENCE IF EXISTS public.houses_id_seq;
DROP TABLE IF EXISTS public.houses;
DROP SEQUENCE IF EXISTS public.guesttype_id_seq;
DROP TABLE IF EXISTS public.guesttype;
DROP SEQUENCE IF EXISTS public.bookingtype_id_seq;
DROP TABLE IF EXISTS public.bookingtype;
SET default_tablespace = '';

SET default_with_oids = false;

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
-- Name: guesttype; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guesttype (
    id integer NOT NULL,
    name text
);


--
-- Name: guesttype_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guesttype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guesttype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guesttype_id_seq OWNED BY public.guesttype.id;


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
    email character varying(254),
    phone text,
    address text,
    city text,
    state text,
    zipcode text,
    notes text,
    rank text,
    reservationid bigint,
    archived boolean
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
-- Name: ranktype; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ranktype (
    id integer NOT NULL,
    name character varying(3)
);


--
-- Name: ranktype_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ranktype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ranktype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ranktype_id_seq OWNED BY public.ranktype.id;


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
    pet boolean,
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
-- Name: tdytype; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tdytype (
    id integer NOT NULL,
    name character varying(50)
);


--
-- Name: tdytype_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tdytype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tdytype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tdytype_id_seq OWNED BY public.tdytype.id;


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_preferences (
    id integer NOT NULL,
    userid bigint,
    preferences text
);


--
-- Name: user_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_preferences_id_seq OWNED BY public.user_preferences.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    fname character varying(100),
    lname character varying(100),
    email character varying(254),
    password text,
    salt text,
    roleid bigint
);


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


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookingtype id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookingtype ALTER COLUMN id SET DEFAULT nextval('public.bookingtype_id_seq'::regclass);


--
-- Name: guesttype id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guesttype ALTER COLUMN id SET DEFAULT nextval('public.guesttype_id_seq'::regclass);


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
-- Name: ranktype id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranktype ALTER COLUMN id SET DEFAULT nextval('public.ranktype_id_seq'::regclass);


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
-- Name: tdytype id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tdytype ALTER COLUMN id SET DEFAULT nextval('public.tdytype_id_seq'::regclass);


--
-- Name: user_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_preferences_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: bookingtype bookingtype_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookingtype
    ADD CONSTRAINT bookingtype_pkey PRIMARY KEY (id);


--
-- Name: guesttype guesttype_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guesttype
    ADD CONSTRAINT guesttype_pkey PRIMARY KEY (id);


--
-- Name: houses houses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT houses_pkey PRIMARY KEY (id);


--
-- Name: lessee lessee_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessee
    ADD CONSTRAINT lessee_email_key UNIQUE (email);


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
-- Name: ranktype ranktype_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranktype
    ADD CONSTRAINT ranktype_pkey PRIMARY KEY (id);


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
-- Name: tdytype tdytype_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tdytype
    ADD CONSTRAINT tdytype_pkey PRIMARY KEY (id);


--
-- Name: lessee lessee_reservationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessee
    ADD CONSTRAINT lessee_reservationid_fkey FOREIGN KEY (reservationid) REFERENCES public.reservations(id);


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

