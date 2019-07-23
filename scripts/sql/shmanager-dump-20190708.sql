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

ALTER TABLE ONLY public.users DROP CONSTRAINT users_roleid_fkey;
ALTER TABLE ONLY public.rooms DROP CONSTRAINT rooms_houseid_fkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_tdytype_fkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_roomid_fkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_lesseeid_fkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_houseid_fkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_guesttype_fkey;
ALTER TABLE ONLY public.refreshtokens DROP CONSTRAINT refreshtokens_userid_fkey;
ALTER TABLE ONLY public.referrerlog DROP CONSTRAINT referrerlog_userid_fkey;
ALTER TABLE ONLY public.referrerlog DROP CONSTRAINT referrerlog_referrerid_fkey;
ALTER TABLE ONLY public.paylog DROP CONSTRAINT paylog_reservationsid_fkey;
ALTER TABLE ONLY public.lessee DROP CONSTRAINT lessee_reservationid_fkey;
ALTER TABLE ONLY public.lessee DROP CONSTRAINT lessee_ranktype_fkey;
ALTER TABLE ONLY public.lessee DROP CONSTRAINT lessee_programid_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.tdytype DROP CONSTRAINT tdytype_pkey;
ALTER TABLE ONLY public.rooms DROP CONSTRAINT rooms_pkey;
ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
ALTER TABLE ONLY public.reservations DROP CONSTRAINT reservations_pkey;
ALTER TABLE ONLY public.refreshtokens DROP CONSTRAINT refreshtokens_pkey;
ALTER TABLE ONLY public.referrerlog DROP CONSTRAINT referrerlog_pkey;
ALTER TABLE ONLY public.ranktype DROP CONSTRAINT ranktype_pkey;
ALTER TABLE ONLY public.paylog DROP CONSTRAINT paylog_pkey;
ALTER TABLE ONLY public.lessee DROP CONSTRAINT lessee_pkey;
ALTER TABLE ONLY public.lessee DROP CONSTRAINT lessee_email_key;
ALTER TABLE ONLY public.houses DROP CONSTRAINT houses_pkey;
ALTER TABLE ONLY public.guesttype DROP CONSTRAINT guesttype_pkey;
ALTER TABLE ONLY public.email_templates DROP CONSTRAINT email_templates_pkey;
ALTER TABLE ONLY public.bookingtype DROP CONSTRAINT bookingtype_pkey;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.user_preferences ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tdytype ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.rooms ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.reservations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.referrerlog ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.ranktype ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.paylog ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.lessee ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.houses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.guesttype ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.bookingtype ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.user_preferences_id_seq;
DROP TABLE public.user_preferences;
DROP SEQUENCE public.tdytype_id_seq;
DROP TABLE public.tdytype;
DROP SEQUENCE public.rooms_id_seq;
DROP TABLE public.rooms;
DROP SEQUENCE public.roles_id_seq;
DROP TABLE public.roles;
DROP SEQUENCE public.reservations_id_seq;
DROP TABLE public.reservations;
DROP TABLE public.refreshtokens;
DROP SEQUENCE public.referrerlog_id_seq;
DROP TABLE public.referrerlog;
DROP SEQUENCE public.ranktype_id_seq;
DROP TABLE public.ranktype;
DROP SEQUENCE public.paylog_id_seq;
DROP TABLE public.paylog;
DROP SEQUENCE public.lessee_id_seq;
DROP TABLE public.lessee;
DROP SEQUENCE public.houses_id_seq;
DROP TABLE public.houses;
DROP SEQUENCE public.guesttype_id_seq;
DROP TABLE public.guesttype;
DROP TABLE public.email_templates;
DROP SEQUENCE public.bookingtype_id_seq;
DROP TABLE public.bookingtype;
DROP TYPE public.statusenum;
--
-- Name: statusenum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.statusenum AS ENUM (
    'archived',
    'active'
);


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
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates (
    name character varying(100) NOT NULL,
    template text
);


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
    rank integer,
    reservationid bigint,
    archived boolean,
    status public.statusenum,
    programid bigint
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
-- Name: refreshtokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refreshtokens (
    userid bigint NOT NULL,
    tokenname text,
    token text,
    expireat date
);


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservations (
    id integer NOT NULL,
    lesseeid bigint,
    purpose integer,
    numberofguests integer,
    pet boolean,
    checkindate date,
    checkoutdate date,
    roomid bigint NOT NULL,
    notes text,
    bookingtypeid bigint NOT NULL,
    status public.statusenum,
    houseid bigint,
    doorcode character varying(30)
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
    roleid bigint,
    preferences text DEFAULT '{}'::text
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
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (name);


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
-- Name: refreshtokens refreshtokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refreshtokens
    ADD CONSTRAINT refreshtokens_pkey PRIMARY KEY (userid);


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
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: lessee lessee_programid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessee
    ADD CONSTRAINT lessee_programid_fkey FOREIGN KEY (programid) REFERENCES public.tdytype(id);


--
-- Name: lessee lessee_ranktype_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessee
    ADD CONSTRAINT lessee_ranktype_fkey FOREIGN KEY (rank) REFERENCES public.ranktype(id);


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
-- Name: refreshtokens refreshtokens_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refreshtokens
    ADD CONSTRAINT refreshtokens_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: reservations reservations_guesttype_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_guesttype_fkey FOREIGN KEY (numberofguests) REFERENCES public.guesttype(id);


--
-- Name: reservations reservations_houseid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_houseid_fkey FOREIGN KEY (houseid) REFERENCES public.houses(id);


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
-- Name: reservations reservations_tdytype_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_tdytype_fkey FOREIGN KEY (purpose) REFERENCES public.tdytype(id);


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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO shmanager;


--
-- Name: TABLE bookingtype; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.bookingtype TO shmanager;


--
-- Name: SEQUENCE bookingtype_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.bookingtype_id_seq TO shmanager;


--
-- Name: TABLE guesttype; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.guesttype TO shmanager;


--
-- Name: SEQUENCE guesttype_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.guesttype_id_seq TO shmanager;


--
-- Name: TABLE houses; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.houses TO shmanager;


--
-- Name: SEQUENCE houses_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.houses_id_seq TO shmanager;


--
-- Name: TABLE lessee; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.lessee TO shmanager;


--
-- Name: SEQUENCE lessee_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.lessee_id_seq TO shmanager;


--
-- Name: TABLE paylog; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.paylog TO shmanager;


--
-- Name: SEQUENCE paylog_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.paylog_id_seq TO shmanager;


--
-- Name: TABLE ranktype; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.ranktype TO shmanager;


--
-- Name: SEQUENCE ranktype_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.ranktype_id_seq TO shmanager;


--
-- Name: TABLE referrerlog; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.referrerlog TO shmanager;


--
-- Name: SEQUENCE referrerlog_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.referrerlog_id_seq TO shmanager;


--
-- Name: TABLE reservations; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.reservations TO shmanager;


--
-- Name: SEQUENCE reservations_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.reservations_id_seq TO shmanager;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.roles TO shmanager;


--
-- Name: SEQUENCE roles_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.roles_id_seq TO shmanager;


--
-- Name: TABLE rooms; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.rooms TO shmanager;


--
-- Name: SEQUENCE rooms_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.rooms_id_seq TO shmanager;


--
-- Name: TABLE tdytype; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.tdytype TO shmanager;


--
-- Name: SEQUENCE tdytype_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.tdytype_id_seq TO shmanager;


--
-- Name: TABLE user_preferences; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_preferences TO shmanager;


--
-- Name: SEQUENCE user_preferences_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.user_preferences_id_seq TO shmanager;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.users TO shmanager;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.users_id_seq TO shmanager;


--
-- PostgreSQL database dump complete
--

