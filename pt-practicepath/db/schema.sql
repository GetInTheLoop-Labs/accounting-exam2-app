-- PT PracticePath — Requirements Knowledge Base schema (PRD §8.2)
-- Postgres 15+. Every volatile datum is a Fact row carrying its own source,
-- verification timestamp, and freshness window — this is what makes
-- per-request validation tractable and auditable (PRD NFR-9).

create type role_kind as enum ('PT', 'PTA', 'both');
create type licensure_path as enum ('initial', 'endorsement', 'compact', 'all');
create type requirement_category as enum (
  'exam', 'application', 'background', 'jurisprudence', 'education',
  'clearance', 'certification', 'health', 'administrative'
);
create type fact_class as enum ('fee', 'wait_time', 'rule', 'url', 'date');
create type verification_method as enum ('live_fetch', 'api', 'manual');
create type issuer_kind as enum (
  'state_board', 'fsbpt', 'compact_commission', 'cert_body', 'federal', 'other'
);
-- Escalation ladder rung assigned per source (PRD §9.3.2)
create type access_rung as enum (
  'A_official_data', 'B_alternative_channel', 'C_direct_fetch',
  'D_licensed_vendor', 'E_human_verification', 'unassessed'
);

create table issuer (
  id          text primary key,              -- e.g. 'fsbpt', 'board-tx'
  name        text not null,
  kind        issuer_kind not null,
  url         text,
  contact     text
);

create table jurisdiction (
  id                  text primary key,      -- USPS code lowercased: 'tx', 'ca', 'dc'
  name                text not null,
  board_issuer_id     text not null references issuer(id),
  compact_member      boolean not null default false,
  compact_active_date date,                  -- null unless actively issuing/accepting
  notes               text
);

create table requirement (
  id                text primary key,        -- e.g. 'tx-jurisprudence-jam'
  jurisdiction_id   text references jurisdiction(id),  -- null = national (e.g. NPTE)
  role              role_kind not null,
  path              licensure_path not null,
  category          requirement_category not null,
  name              text not null,
  description       text not null,
  issuer_id         text not null references issuer(id),
  process_steps     jsonb not null default '[]',  -- ordered [{step, detail, url}]
  depends_on        text[] not null default '{}', -- requirement ids; drives sequencing (FR-15)
  standard_timeline text,                          -- human-readable, e.g. '1-4 days once complete'
  renewal_cycle     text                           -- null = one-time
);

-- The atom of the validation pipeline. One row per volatile datum.
create table fact (
  id                  bigint generated always as identity primary key,
  requirement_id      text not null references requirement(id),
  fact_class          fact_class not null,
  value               text not null,
  unit                text,                  -- 'usd', 'days', 'weeks', null for rules/urls
  source_url          text not null,
  verified_at         timestamptz not null,
  verification_method verification_method not null,
  freshness_window    interval not null,     -- how long verified_at stays servable (FR-23)
  confidence          real not null check (confidence >= 0 and confidence <= 1),
  evidence_snapshot   text,                  -- object-storage key of the fetched-page snapshot
  superseded_by       bigint references fact(id)  -- null = current
);
create index fact_current_by_requirement
  on fact (requirement_id, fact_class) where superseded_by is null;

-- Commonly-required items per practice setting, layered onto reports (FR-12)
create table position_template (
  id               text primary key,         -- e.g. 'home_health'
  setting          text not null,
  requirement_refs text[] not null,
  basis            text not null check (basis in ('legal', 'payer', 'employer_norm'))
);

-- Every detected change, for alerts (FR-26) and audit (FR-24)
create table change_log (
  id          bigint generated always as identity primary key,
  fact_id     bigint not null references fact(id),
  old_value   text not null,
  new_value   text not null,
  detected_at timestamptz not null default now(),
  source_url  text not null
);

-- Source Registry: one row per fact-bearing page we verify against (PRD §9.3.1).
-- The census probe (src/census/probe.ts) fills the access_* columns.
create table source (
  id                 text primary key,       -- e.g. 'tx-board-processing-times'
  issuer_id          text not null references issuer(id),
  url                text,                   -- null until enumerated by the census
  description        text not null,
  fact_classes       fact_class[] not null,  -- what this page is authoritative for
  page_format        text,                   -- 'html' | 'pdf' | 'portal' | null until probed
  access_rung        access_rung not null default 'unassessed',
  robots_disallowed  boolean,
  bot_protection     text,                   -- e.g. 'cloudflare', null = none observed
  last_probe_at      timestamptz,
  last_probe_status  int,                    -- HTTP status of most recent census probe
  notes              text
);
