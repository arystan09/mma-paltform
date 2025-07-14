
# 🥋 MMA Platform – Backend API

A full-featured backend for a mixed martial arts (MMA) platform, designed to manage fighters, events, individual fights, and dynamic rankings.  
Built with **NestJS**, **GraphQL**, **PostgreSQL**, and **Redis** using a clean, modular, and scalable architecture based on **CLEAN Architecture principles**.

> This backend serves as the foundation for an MMA information system similar to Sherdog.com or Tapology.com.

---

## 🚀 Quick Start

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Start PostgreSQL and Redis via Docker
docker compose up -d

# Run the backend server
npm run start:dev

# Run background ranking worker
npm run start:worker
````

GraphQL Playground: [http://localhost:3000/graphql](http://localhost:3000/graphql)

---

## 🧠 Key Features

* 🧍 Fighter profiles: personal details, weight class, height, team, nickname, and stats
* 📅 Event management: event name, location, date, and associated fights
* 🥊 Fight records: detailed outcomes including winner, method (KO, decision, etc.), round, and duration
* 🧾 Fight history: retrieve all fights participated in by a given fighter
* 🏆 Dynamic fighter rankings: auto-calculated after each fight based on a point system
* 🧮 Background ranking recalculation using **BullMQ + Redis**
* 📊 Top 10 fighters query per ranking
* 📋 Clean GraphQL API: CRUD for Fighters, Events, Fights, Rankings

---

## 📐 Architecture Overview

This project follows **CLEAN Architecture** principles:

```
src/
├── api/                 # GraphQL modules and resolvers
├── application/         # UseCases (business logic)
├── domain/              # Domain entities and interfaces
├── infrastructure/      # TypeORM, database, Redis, BullMQ worker
├── common/              # Shared utilities and helpers
```

* Strong separation of concerns (infra/business/domain layers)
* Scalable and testable structure
* Fully typed (TypeScript)

---

## ⚙️ Technologies Used

| Layer            | Technology       |
| ---------------- | ---------------- |
| Language         | TypeScript       |
| Framework        | NestJS           |
| Database         | PostgreSQL       |
| ORM              | TypeORM          |
| API              | GraphQL (Apollo) |
| Background Tasks | BullMQ + Redis   |
| Containerization | Docker           |

---

## 📊 Ranking Algorithm

A fighter earns points after every fight:

* **Win by KO/Sub**: +4 points
* **Win by Decision**: +3 points
* **Draw**: +1 point
* **Loss**: 0 points

Rankings are automatically updated **in the background** after each fight using a worker queue powered by BullMQ.

---

## 🧪 Example GraphQL Queries

### ▶️ Create Fighter

```graphql
mutation {
  createFighter(input: {
    fullName: "John Smith",
    nickname: "The Hammer",
    birthDate: "1990-01-01",
    height: 180,
    weight: 70,
    team: "Team Alpha",
    weightClassId: 1
  }) {
    id
    fullName
  }
}
```

### 🥊 Record Fight Result

```graphql
mutation {
  recordFightResult(input: {
    fightId: 1,
    winnerId: 1,
    method: KO,
    round: 2,
    duration: "2:45"
  }) {
    id
    winnerId
  }
}
```

### 🧾 Get Fight History by Fighter

```graphql
query {
  fightsByFighterId(fighterId: 1) {
    redCornerId
    blueCornerId
    winnerId
    method
  }
}
```

### 🏆 Get Fighter Rankings by Weight Class

```graphql
query {
  rankingsByWeightClass(weightClassId: 1) {
    fighterName
    points
    wins
    losses
    draws
  }
}
```

---

## 🗃️ Supporting Files

| File                           | Description                       |
| ------------------------------ | --------------------------------- |
| `docs/ERD.drawio`              | Entity Relationship Diagram       |
| `docs/schema.sql`              | SQL DDL: database schema          |
| `.env.example`                 | Example environment configuration |
| `ranking.worker.ts`            | Background worker using BullMQ    |
| `calculate-ranking.usecase.ts` | Ranking calculation logic         |

---

## 📦 Environment Variables

`backend/.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mma_db
REDIS_HOST=localhost
REDIS_PORT=6379
```

