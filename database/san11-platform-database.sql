--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2 (Debian 13.2-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    activity_id integer NOT NULL,
    user_id integer NOT NULL,
    create_time timestamp without time zone NOT NULL,
    action integer NOT NULL,
    resource_name text NOT NULL
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: binaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.binaries (
    binary_id integer NOT NULL,
    package_id integer NOT NULL,
    url text,
    download_count integer DEFAULT 0,
    version text NOT NULL,
    description text NOT NULL,
    create_time timestamp without time zone NOT NULL,
    tag text,
    download_method text,
    size text,
    parent text
);


ALTER TABLE public.binaries OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    parent text NOT NULL,
    comment_id integer NOT NULL,
    create_time timestamp without time zone NOT NULL,
    update_time timestamp without time zone,
    text text NOT NULL,
    author_id integer NOT NULL,
    upvote_count integer DEFAULT 0,
    name text
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.packages (
    package_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    create_time timestamp without time zone NOT NULL,
    category_id integer NOT NULL,
    status integer NOT NULL,
    author_id integer NOT NULL,
    image_urls text[],
    download_count integer DEFAULT 0,
    tag_ids integer[],
    update_time timestamp without time zone
);


ALTER TABLE public.packages OWNER TO postgres;

--
-- Name: replies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.replies (
    comment_id integer NOT NULL,
    reply_id integer NOT NULL,
    create_time timestamp without time zone NOT NULL,
    update_time timestamp without time zone,
    text text NOT NULL,
    author_id integer NOT NULL,
    upvote_count integer DEFAULT 0,
    parent text
);


ALTER TABLE public.replies OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid text NOT NULL,
    user_id integer NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: statistics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statistics (
    date date NOT NULL,
    visit_count integer DEFAULT 0,
    download_count integer DEFAULT 0
);


ALTER TABLE public.statistics OWNER TO postgres;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    tag_id integer NOT NULL,
    name text NOT NULL,
    category_id integer NOT NULL,
    mutable boolean NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    user_type text NOT NULL,
    create_timestamp timestamp without time zone NOT NULL,
    image_url text,
    website text,
    name text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: verification_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_codes (
    email text NOT NULL,
    code text NOT NULL
);


CREATE TABLE public.articles (
    parent text NOT NULL,
    resource_id int NOT NULL,

    data json,
    -- subject text NOT NULL,
    -- content text,
    -- author_id integer NOT NULL,
    -- create_time timestamp NOT NULL,
    -- update_time timestamp NOT NULL,
    -- state integer NOT NULL,
    -- tags text[],
    -- view_count integer,
    -- like_count integer,

    PRIMARY KEY (parent, resource_id)
);
ALTER TABLE public.articles OWNER TO postgres;


ALTER TABLE public.verification_codes OWNER TO postgres;

--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (activity_id, user_id, create_time, resource_name);


--
-- Name: binaries binaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.binaries
    ADD CONSTRAINT binaries_pkey PRIMARY KEY (package_id, binary_id, create_time);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (category_id, package_id, create_time);


--
-- Name: replies replies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.replies
    ADD CONSTRAINT replies_pkey PRIMARY KEY (comment_id, reply_id);


--
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (date);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (name, category_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id, create_timestamp);


--
-- Name: verification_codes verification_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_codes
    ADD CONSTRAINT verification_codes_pkey PRIMARY KEY (email);


--
-- Name: packages packages_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- PostgreSQL database dump complete
--



\dt;