# Shared backend source

This directory contains copied Express route modules, controllers, services,
Mongoose models, authentication middleware, recommendation rules and Node tests.
Install dependencies here with npm ci. Run domain processes from the parent
microservices directory using npm run identity, npm run farm, npm run weather,
and npm run recommendation, or npm run dev for all services and the gateway.

serviceServer.js mounts only the selected domain. Recommendation generation uses
the weather service HTTP client. server.js is the inherited monolith entry point
and is not used by the microservices launcher. All four services share this source
package and the documented MongoDB collections.

Use npm run seed:validate here to validate the inherited synthetic dataset.
See ../README.md and ../docs/MICROSERVICES.md for current setup and verification.
