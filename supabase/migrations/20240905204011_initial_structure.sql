create sequence "public"."distributed_prizes_id_seq";

create sequence "public"."game_settings_id_seq";

create sequence "public"."prizes_id_seq";

create sequence "public"."users_id_seq";

create table "public"."distributed_prizes" (
    "id" integer not null default nextval('distributed_prizes_id_seq'::regclass),
    "prize_id" integer not null,
    "distributed_today" integer not null,
    "date" date not null default CURRENT_DATE,
    "prize_name" text
);


create table "public"."game_settings" (
    "id" integer not null default nextval('game_settings_id_seq'::regclass),
    "difficulty" text not null
);


create table "public"."prizes" (
    "id" bigint not null default nextval('prizes_id_seq'::regclass),
    "prize" text not null,
    "quantity" integer not null,
    "active" boolean default true,
    "image_url" text,
    "daily_limit" integer,
    "distributed_today" integer default 0,
    "is_consolation" boolean default false
);


create table "public"."users" (
    "id" integer not null default nextval('users_id_seq'::regclass),
    "name" text not null,
    "cpf" text,
    "whatsapp" text not null,
    "email" character varying(255) not null,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "privacyTerms" boolean not null default false,
    "imageTerms" boolean not null default false,
    "bigScreenAgreement" boolean default false,
    "comunicationAgreement" boolean default false,
    "hasPlayed" boolean not null default false
);


alter sequence "public"."distributed_prizes_id_seq" owned by "public"."distributed_prizes"."id";

alter sequence "public"."game_settings_id_seq" owned by "public"."game_settings"."id";

alter sequence "public"."prizes_id_seq" owned by "public"."prizes"."id";

alter sequence "public"."users_id_seq" owned by "public"."users"."id";

CREATE UNIQUE INDEX distributed_prizes_pkey ON public.distributed_prizes USING btree (id);

CREATE UNIQUE INDEX game_settings_pkey ON public.game_settings USING btree (id);

CREATE UNIQUE INDEX prizes_pkey ON public.prizes USING btree (id);

CREATE UNIQUE INDEX users_cpf_key ON public.users USING btree (cpf);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."distributed_prizes" add constraint "distributed_prizes_pkey" PRIMARY KEY using index "distributed_prizes_pkey";

alter table "public"."game_settings" add constraint "game_settings_pkey" PRIMARY KEY using index "game_settings_pkey";

alter table "public"."prizes" add constraint "prizes_pkey" PRIMARY KEY using index "prizes_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_cpf_key" UNIQUE using index "users_cpf_key";

grant delete on table "public"."distributed_prizes" to "anon";

grant insert on table "public"."distributed_prizes" to "anon";

grant references on table "public"."distributed_prizes" to "anon";

grant select on table "public"."distributed_prizes" to "anon";

grant trigger on table "public"."distributed_prizes" to "anon";

grant truncate on table "public"."distributed_prizes" to "anon";

grant update on table "public"."distributed_prizes" to "anon";

grant delete on table "public"."distributed_prizes" to "authenticated";

grant insert on table "public"."distributed_prizes" to "authenticated";

grant references on table "public"."distributed_prizes" to "authenticated";

grant select on table "public"."distributed_prizes" to "authenticated";

grant trigger on table "public"."distributed_prizes" to "authenticated";

grant truncate on table "public"."distributed_prizes" to "authenticated";

grant update on table "public"."distributed_prizes" to "authenticated";

grant delete on table "public"."distributed_prizes" to "service_role";

grant insert on table "public"."distributed_prizes" to "service_role";

grant references on table "public"."distributed_prizes" to "service_role";

grant select on table "public"."distributed_prizes" to "service_role";

grant trigger on table "public"."distributed_prizes" to "service_role";

grant truncate on table "public"."distributed_prizes" to "service_role";

grant update on table "public"."distributed_prizes" to "service_role";

grant delete on table "public"."game_settings" to "anon";

grant insert on table "public"."game_settings" to "anon";

grant references on table "public"."game_settings" to "anon";

grant select on table "public"."game_settings" to "anon";

grant trigger on table "public"."game_settings" to "anon";

grant truncate on table "public"."game_settings" to "anon";

grant update on table "public"."game_settings" to "anon";

grant delete on table "public"."game_settings" to "authenticated";

grant insert on table "public"."game_settings" to "authenticated";

grant references on table "public"."game_settings" to "authenticated";

grant select on table "public"."game_settings" to "authenticated";

grant trigger on table "public"."game_settings" to "authenticated";

grant truncate on table "public"."game_settings" to "authenticated";

grant update on table "public"."game_settings" to "authenticated";

grant delete on table "public"."game_settings" to "service_role";

grant insert on table "public"."game_settings" to "service_role";

grant references on table "public"."game_settings" to "service_role";

grant select on table "public"."game_settings" to "service_role";

grant trigger on table "public"."game_settings" to "service_role";

grant truncate on table "public"."game_settings" to "service_role";

grant update on table "public"."game_settings" to "service_role";

grant delete on table "public"."prizes" to "anon";

grant insert on table "public"."prizes" to "anon";

grant references on table "public"."prizes" to "anon";

grant select on table "public"."prizes" to "anon";

grant trigger on table "public"."prizes" to "anon";

grant truncate on table "public"."prizes" to "anon";

grant update on table "public"."prizes" to "anon";

grant delete on table "public"."prizes" to "authenticated";

grant insert on table "public"."prizes" to "authenticated";

grant references on table "public"."prizes" to "authenticated";

grant select on table "public"."prizes" to "authenticated";

grant trigger on table "public"."prizes" to "authenticated";

grant truncate on table "public"."prizes" to "authenticated";

grant update on table "public"."prizes" to "authenticated";

grant delete on table "public"."prizes" to "service_role";

grant insert on table "public"."prizes" to "service_role";

grant references on table "public"."prizes" to "service_role";

grant select on table "public"."prizes" to "service_role";

grant trigger on table "public"."prizes" to "service_role";

grant truncate on table "public"."prizes" to "service_role";

grant update on table "public"."prizes" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


