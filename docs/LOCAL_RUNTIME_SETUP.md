# Local Runtime Setup

## Objective

Run the first local FieldLogic operational cognition runtime.

## Prerequisites

Install:
- Node.js
- npm
- Wrangler CLI

## Install dependencies

Run:

npm install

## Apply local D1 migrations

Run:

npm run db:migrate:local

## Start local runtime

Run:

npm run dev

## Run smoke test

Run:

npm run smoke

## Initial runtime validation

Test endpoints:

POST /events/intake
POST /workflows/cbi/telemetry
GET /jobs/:id/summary
GET /jobs/:id/timeline
GET /benchmarks/installers
GET /benchmarks/jobs

## Strategic milestone

If local runtime execution succeeds, FieldLogic officially becomes:
- a runnable operational cognition runtime
- a functioning telemetry ingestion system
- a live operational evaluation platform

This is the first real operational proof-of-life milestone.
