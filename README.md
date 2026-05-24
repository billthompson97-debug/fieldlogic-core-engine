# FieldLogic Core Engine

FieldLogic is an operational intelligence layer for residential remodeling. It is not a CRM, estimating tool, or project management app. It is the shared truth engine that structures what actually happens from sold scope to field execution, QA, callbacks, labor variance, and margin protection.

## Core thesis

Remodeling companies do not fail because they lack tasks. They fail because field reality is unstructured:

- scope risk is discovered too late
- installer labor variance is invisible until margin is gone
- callbacks are treated as isolated problems instead of signal
- QA evidence is scattered across photos, texts, notes, and memory
- handoffs are inconsistent
- operating standards live in people, not systems

FieldLogic turns operational chaos into structured remodeling telemetry.

## First build objective

The first version of FieldLogic Core Engine establishes the data model, event taxonomy, risk scoring foundation, and Cloudflare-native API scaffold for wet-area remodeling operations.

## Architecture

```txt
fieldlogic-core-engine/
  src/
    index.ts                  Cloudflare Worker entrypoint
    domain/                   Business logic and scoring
    schemas/                  Event and entity contracts
  docs/                       Product, architecture, and operating docs
  contracts/                  External data contracts
  infrastructure/             Deployment and platform notes
  workers/                    Future worker-specific services
```

## Core objects

- Job
- Scope
- Room
- Measurement
- Material Package
- Labor Phase
- Installer Assignment
- QA Event
- Callback Event
- Risk Signal
- Margin Signal
- Operational Lineage Record

## Strategic build order

1. Operational taxonomy
2. Event schema
3. Risk scoring engine
4. QA and callback intelligence
5. Labor variance engine
6. Cloudflare deployment
7. CBI beta telemetry loop
8. Contractor-facing FieldLogic Pro layer

## Current status

Phase 1 scaffold is initialized. The repository now has a Cloudflare Worker-ready TypeScript foundation and documentation for the core operating model.