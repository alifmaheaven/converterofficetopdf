CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(128) NOT NULL,
    username character varying(128) NOT NULL,
    email character varying(128) NOT NULL,
    password character varying(255) NOT NULL,
    is_active integer,
    created_date timestamp with time zone,
    modified_date timestamp with time zone
);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_name_key UNIQUE (name);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);

CREATE TABLE public.types (
    id uuid NOT NULL,
    name character varying(150),
    description text,
    created_date timestamp with time zone,
    modified_date timestamp with time zone
);

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_pkey PRIMARY KEY (id);


CREATE TABLE public.categories (
    id uuid NOT NULL,
    types_id uuid,
    name character varying(150),
    description character varying(150),
    created_date timestamp with time zone,
    modified_date timestamp with time zone
);

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

CREATE INDEX fki_typesxcategories ON public.categories USING btree (types_id);

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT typesxcategories FOREIGN KEY (types_id) REFERENCES public.types(id);

CREATE TABLE public.journals (
    id uuid NOT NULL,
    users_id uuid,
    categories_id uuid,
    name character varying,
    description text,
    created_date timestamp with time zone,
    modified_date timestamp with time zone,
    price integer,
    nota text
);

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT journals_pkey PRIMARY KEY (id);

CREATE INDEX fki_journalsxcategories ON public.journals USING btree (categories_id);

CREATE INDEX fki_journalsxusers ON public.journals USING btree (users_id);

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT journalsxcategories FOREIGN KEY (categories_id) REFERENCES public.categories(id);

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT journalsxusers FOREIGN KEY (users_id) REFERENCES public.users(id);

