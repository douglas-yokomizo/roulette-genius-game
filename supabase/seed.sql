SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: distributed_prizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: game_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."game_settings" ("id", "difficulty") VALUES
	(1, 'medium');


--
-- Data for Name: prizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."prizes" ("id", "prize", "quantity", "active", "image_url", "daily_limit", "distributed_today", "is_consolation") VALUES
	(16, 'Bolsa impermeável', 800, true, 'https://nzvspxppyqzrpcchotmf.supabase.co/storage/v1/object/public/products/bolsa.png', 100, 0, false),
	(17, 'Jaqueta', 120, true, 'https://nzvspxppyqzrpcchotmf.supabase.co/storage/v1/object/public/products/jaqueta.png', 15, 0, false),
	(18, 'Boné', 120, true, 'https://nzvspxppyqzrpcchotmf.supabase.co/storage/v1/object/public/products/bone.png', 15, 0, false),
	(4, 'Shoulder Bag', 1200, true, 'https://nzvspxppyqzrpcchotmf.supabase.co/storage/v1/object/public/products/shoulder.png', 150, 0, true),
	(15, 'Camiseta', 160, true, 'https://nzvspxppyqzrpcchotmf.supabase.co/storage/v1/object/public/products/camiseta.png', 20, 0, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('products', 'products', NULL, '2024-08-13 15:06:03.752496+00', '2024-08-13 15:06:03.752496+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('0f055f20-28de-455f-ae20-b236c8cd127d', 'products', '.emptyFolderPlaceholder', NULL, '2024-09-04 16:31:59.892618+00', '2024-09-04 16:31:59.892618+00', '2024-09-04 16:31:59.892618+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-09-04T16:32:00.000Z", "contentLength": 0, "httpStatusCode": 200}', '12652cc8-9b67-4835-be33-e2cdebdf3597', NULL, '{}'),
	('f53e1a2d-a4b8-419b-841b-6fdeee9e6f84', 'products', 'camiseta.png', NULL, '2024-09-04 17:57:03.154673+00', '2024-09-04 17:57:03.154673+00', '2024-09-04 17:57:03.154673+00', '{"eTag": "\"3a8d1ddbc1f1de1abfc0083cb8e2c94f-1\"", "size": 783087, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-09-04T17:57:03.000Z", "contentLength": 783087, "httpStatusCode": 200}', 'c2d48371-ac54-41e3-bb68-41161e35c86f', NULL, NULL),
	('1277bdb7-e649-4eb3-a8c0-e033ca63da11', 'products', 'bolsa.png', NULL, '2024-09-04 17:57:03.256811+00', '2024-09-04 17:57:03.256811+00', '2024-09-04 17:57:03.256811+00', '{"eTag": "\"0c92447ef2dc8ac44334c0a2e1fbabd6-1\"", "size": 448694, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-09-04T17:57:03.000Z", "contentLength": 448694, "httpStatusCode": 200}', '63b81adb-007d-416a-8ca1-24468b5de93d', NULL, NULL),
	('f8a03797-b617-495c-b766-6e3179ede7d1', 'products', 'jaqueta.png', NULL, '2024-09-04 17:57:03.327725+00', '2024-09-04 17:57:03.327725+00', '2024-09-04 17:57:03.327725+00', '{"eTag": "\"328d7b3627d8c3fe3ead6c376b3a3487-1\"", "size": 816360, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-09-04T17:57:03.000Z", "contentLength": 816360, "httpStatusCode": 200}', '9dd346ce-631e-4806-9d19-cce02b4be2d8', NULL, NULL),
	('b258aaa9-e3f5-41aa-beec-bf1e95b09d57', 'products', 'bone.png', NULL, '2024-09-04 17:57:03.340435+00', '2024-09-04 17:57:03.340435+00', '2024-09-04 17:57:03.340435+00', '{"eTag": "\"70c1104814b389db9968b48d38d0ebf5-1\"", "size": 534518, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-09-04T17:57:03.000Z", "contentLength": 534518, "httpStatusCode": 200}', '20ab28d3-0e91-44f4-8af6-1d0bcd45f534', NULL, NULL),
	('60c48c30-86d8-49a9-973b-4c0cd150461e', 'products', 'shoulder.png', NULL, '2024-09-04 17:57:03.452927+00', '2024-09-04 17:57:03.452927+00', '2024-09-04 17:57:03.452927+00', '{"eTag": "\"86981eed5ac444cc84cb8cfdbf0315d6-1\"", "size": 480994, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-09-04T17:57:03.000Z", "contentLength": 480994, "httpStatusCode": 200}', '0e8db855-7bbe-45da-b955-a81cb2ab0493', NULL, NULL);


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: distributed_prizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."distributed_prizes_id_seq"', 23, true);


--
-- Name: game_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."game_settings_id_seq"', 1, false);


--
-- Name: prizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."prizes_id_seq"', 18, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 15, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
