# Microservices migration - 2026-10-06

This clone retains React/Vite/Tailwind, Node/Express, MongoDB/Mongoose, JWT/bcrypt,
Leaflet/OpenStreetMap and backend OpenWeather integration. The user's repository
AGENTS.md explicitly requires Express; historical Python/FastAPI examples in the
copied product documents are superseded for this implementation.

Identity owns auth/profile routes; farm owns farm routes; weather owns weather
routes, provider requests and weather-history writes; recommendation owns advice
routes, rules and snapshots. The gateway preserves the /api/v1 contract and
forwards bearer tokens. Recommendation generation calls the weather HTTP API
before saving advice. Failed weather cannot create new recommendations.

Shared MongoDB and shared source are an explicit initial migration tradeoff.
Authentication loads the current user in each process; ownership queries remain
scoped to that user. No independent databases, event broker, distributed
transactions, containers or deployment configuration were introduced.

## Verified results

- npm test: 16 tests passed (existing rule/database checks plus gateway routing,
  authorization/body/query forwarding, service boundaries and weather failures).
- npm run test:integration: passed using five independent backend processes,
  local smart_irrigation_microservices_test and a mocked weather provider.
  Covered database readiness, registration, duplicate email, login/invalid login,
  profile/password changes, farm CRUD, ownership, invalid ObjectIds, weather,
  recommendation snapshots/histories, provider failure without new advice,
  deletion cleanup and logout.
- npm run lint: frontend ESLint passed.
- npm run build: frontend build passed with the inherited large-bundle warning.
- npm --prefix shared run seed:validate: 1 user, 5 farms, 9,130 weather records
  and 9,130 recommendations validated.
- Frontend dev server started on 5174; HTTP returned 200 and the React entry point.

No real secrets were copied or saved. Browser/map interaction and a real
OpenWeather request were not manually verified. The frontend has no configured
component tests; the inherited backend has no lint script.

## Integration check

From microservices/, run npm run test:integration. MongoDB must listen locally
on 127.0.0.1:27017. The check uses a separate test database, removes only its
generated users/records, and stops its child processes. It never drops a database
and requires no real application secrets or provider key.

See ../README.md for installation, environment configuration, ports and startup.
