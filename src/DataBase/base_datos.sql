-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ponderados_2025_1 (
  CODIGO bigint NOT NULL,
  PROGRAMA text,
  SEDE text,
  JORNADA text,
  LECTURA CRITICA bigint,
  CIENCIAS NATURALES bigint,
  SOCIALES Y CIDADANAS bigint,
  MATEMATICAS bigint,
  INGLES bigint,
  CONSTRAINT ponderados_2025_1_pkey PRIMARY KEY (CODIGO)
);
CREATE TABLE public.puntajes_corte (
  CODIGO bigint NOT NULL,
  PROGRAMA text,
  SEDE text,
  JORNADA text,
  PRIMERO text,
  ULTIMO text,
  CONSTRAINT puntajes_corte_pkey PRIMARY KEY (CODIGO)
);
CREATE TABLE public.user_icfes_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  lectura_critica integer CHECK (lectura_critica >= 0 AND lectura_critica <= 100),
  matematicas integer CHECK (matematicas >= 0 AND matematicas <= 100),
  sociales_ciudadanas integer CHECK (sociales_ciudadanas >= 0 AND sociales_ciudadanas <= 100),
  ciencias_naturales integer CHECK (ciencias_naturales >= 0 AND ciencias_naturales <= 100),
  ingles integer CHECK (ingles >= 0 AND ingles <= 100),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_icfes_scores_pkey PRIMARY KEY (id),
  CONSTRAINT user_icfes_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);