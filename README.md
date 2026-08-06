# Planning Poker

A real-time Planning Poker application built to help Scrum teams estimate user stories collaboratively.

Unlike traditional estimation sessions, every participant votes independently and reveals their cards simultaneously, reducing anchoring bias and encouraging discussion until the team reaches consensus.

**Live Demo**

🌐 Frontend: https://planning-poker-ts-web.vercel.app

⚡ Backend API: https://planning-poker-ts.onrender.com/api/health

---

## Why this project?

Planning Poker is one of the most common techniques used during Sprint Planning.

However, remote estimation sessions often introduce several problems:

- Team members influence each other's estimates.
- Keeping everyone synchronized becomes difficult.
- Participants joining or leaving may cause inconsistent state.
- Managing the facilitator role manually is inconvenient.
- Building reliable real-time interactions is harder than it appears.

This project explores how to solve these challenges through an event-driven architecture powered by Socket.IO while keeping the codebase modular, maintainable and strongly typed.

---

## Features

- Real-time collaborative rooms
- Join by invitation link
- Simultaneous voting
- Reveal cards
- Reset voting rounds
- Automatic host reassignment
- Shared state across all connected clients
- Type-safe communication between frontend and backend

---

## Architecture

```
                 Browser
                     │
                     ▼
            React + Redux Toolkit
                     │
             Socket.IO Client
                     │
══════════════════════════════════
              WebSocket
══════════════════════════════════
                     │
             Socket.IO Server
                     │
             Room Event Handlers
                     │
              In-memory Rooms
                     │
             Shared Types Package
```

The project is organized as a monorepo.

```
apps/
 ├── web
 └── api

packages/
 └── shared
```

### Why a monorepo?

The frontend and backend evolve together.

Keeping them in the same repository makes it possible to:

- share TypeScript types
- share constants
- avoid duplicated contracts
- reduce synchronization errors
- simplify development

---

## Engineering Decisions

### Shared package

Instead of duplicating interfaces on both applications, every event payload, constant and shared model lives inside a dedicated package.

This guarantees that both client and server always speak the same language.

---

### Socket.IO

Planning Poker is fundamentally a real-time application.

Socket.IO provides:

- automatic reconnection
- event-based communication
- room management
- cross-browser compatibility

without forcing us to implement these features manually.

---

### TypeScript everywhere

The entire application is written in TypeScript.

Strong typing prevents inconsistencies between the frontend and backend and improves maintainability as the project grows.

---

### Event-driven communication

Rather than exposing traditional REST endpoints for game interactions, every room action is modeled as an event.

Examples include:

- createRoom
- joinRoom
- vote
- revealCards
- resetVoting

This better reflects the nature of collaborative real-time applications.

---

## Technical Challenges

Building a Planning Poker application is less about rendering cards and more about keeping every connected client synchronized.

Some of the main challenges were:

### State synchronization

Every participant must always see the exact same room state.

The server acts as the single source of truth, while clients only render synchronized updates.

---

### Host reassignment

If the room owner disconnects, leadership must transfer automatically without interrupting the session.

---

### Event consistency

Actions arriving simultaneously should never leave the room in an invalid state.

Keeping all mutations on the server prevents conflicting client states.

---

### Shared contracts

Maintaining identical event payloads between frontend and backend becomes difficult as the application grows.

A shared package removes this duplication entirely.

---

## Tech Stack

Frontend

- React
- TypeScript
- Redux Toolkit
- Socket.IO Client
- Sass
- Vite

Backend

- Node.js
- Express
- Socket.IO
- TypeScript

Shared

- Shared TypeScript package

Deployment

- Vercel
- Render

---

## Running Locally

```bash
git clone https://github.com/CarlosJairo/planning-poker-ts.git

cd planning-poker-ts

npm install

npm run dev
```

---

## Future Improvements

Some ideas for future iterations:

- Persistent storage
- Authentication
- Spectator mode
- Custom card decks
- Jira integration
- Session history
- Docker support
- CI/CD pipeline
- Kubernetes deployment

---

## What I Learned

This project was an opportunity to explore the engineering challenges behind collaborative real-time applications.

Beyond implementing the game itself, it reinforced concepts such as:

- event-driven design
- synchronization of distributed state
- modular architecture
- code sharing across applications
- maintainable TypeScript codebases
- designing systems around a single source of truth
