## Clean Architecture in Flutter

Clean Architecture is not about folder structure — it's about dependency direction. The core principle is that dependencies point inward, toward the domain layer.

### The Three Layers

- **Domain Layer** — Entities, use cases, and repository interfaces. This is the heart of your application.
- **Data Layer** — Repository implementations, data sources, and models. This layer implements the domain contracts.
- **Presentation Layer** — UI components, state management, and navigation. This layer depends on the domain layer.

### Why This Works

By inverting dependencies, you create a system where business logic is independent of external concerns. This makes testing easier, reduces coupling, and allows for independent evolution of each layer.

The result is a codebase that remains maintainable as your application grows.
