SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name text NOT NULL,
    PRIMARY KEY (category_id)
);

CREATE TABLE public.sessions (
    sid text NOT NULL,
    user_id integer NOT NULL,
    expiration bigint NOT NULL,
    PRIMARY KEY (sid)
);

CREATE TABLE public.statistics (
    date date NOT NULL,
    visit_count integer DEFAULT 0,
    download_count integer DEFAULT 0,
    PRIMARY KEY (date)
);

CREATE TABLE public.verification_codes (
    email text NOT NULL,
    code text NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE public.activities (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.articles (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.binaries (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.comments (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.notifications (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.packages (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.replies (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.subscriptions (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.subscriptions_legacy (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.tags (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.threads (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);

CREATE TABLE public.users (
    parent text NOT NULL,
    resource_id serial NOT NULL,
    data json,
    PRIMARY KEY (parent, resource_id)
);
