# REPO_BLUEPRINT

## Document Status
- Status: Canonical working baseline
- Purpose: define the intended repository structure and ownership boundaries for the Ardtire digital governance platform
- Audience: engineering, architecture, future AI implementation agents

---

## 1. Repo Philosophy

The repository must make architectural boundaries obvious.

A good blueprint should:
- separate deployable applications from shared packages
- separate source-of-truth docs from implementation code
- make domain ownership visible
- reduce accidental coupling
- support phased growth without reorganization churn

---

## 2. Top-Level Structure

```text
.
├── apps
│   ├── web
│   ├── gov-api
│   └── cms
├── packages
│   ├── audit
│   ├── authz
│   ├── config
│   ├── contracts
│   ├── domain
│   ├── gov-client
│   ├── test-helpers
│   ├── ui
│   └── workflows
├── prisma
│   ├── schema.prisma
│   ├── migrations
│   └── seed
├── docs
│   ├── adr
│   ├── ai
│   ├── architecture
│   ├── delivery
│   ├── domain
│   └── runbooks
├── infra
│   ├── docker
│   ├── k8s
│   └── scripts
├── tools
│   ├── codegen
│   ├── lint
│   ├── validation
│   └── scripts
├── .github
│   └── workflows
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── turbo.json
├── .env.example
└── README.md