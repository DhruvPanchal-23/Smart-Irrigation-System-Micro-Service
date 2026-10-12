> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

TODO
1. Document Purpose

This file tracks the remaining work for the Weather-Based Smart Irrigation Advisory System.

Use it to:

Record unfinished tasks
Prioritize MVP work
Track frontend and backend progress
Prevent duplicate work
Identify documentation inconsistencies
Prepare the project for testing, demonstration, and college submission

Task status symbols:

[ ] Not started
[-] In progress
[x] Completed
[!] Blocked

Priority levels:

P0 — Critical MVP task
P1 — Important task
P2 — Optional improvement
P3 — Future scope
2. Immediate Project Decisions
P0 — Resolve Backend Stack Conflict

Confirm the final backend stack.

Keep Node.js + Express.js + MongoDB + Compass if using the current backend folder.

Remove or update all FastAPI references from documentation.

Ensure ARCHITECTURE.md matches the actual Express backend.

Ensure DECISIONS.md matches the actual Express backend.

Ensure REQUIREMENTS.md matches the actual Express backend.

Ensure PRD.md matches the actual Express backend.

Ensure API.md uses Express-style path parameters consistently.

Ensure TESTING_PLAN.md uses Jest and Supertest instead of Pytest.

Ensure package.json includes "type": "module" if ES-module imports are used.

Recommended final stack:

Frontend:
React + Vite + Tailwind CSS

Backend:
Node.js + Express.js

Database:
MongoDB + Compass

Map:
OpenStreetMap + React Leaflet

Weather:
OpenWeather API through backend

Authentication:
JWT + bcrypt
3. Documentation Tasks
P0 — Core Documentation

Create PRD.md

Create REQUIREMENTS.md

Create DECISIONS.md

Create FEATURES.md

Create USERS.md

Create ARCHITECTURE.md

Create UI_GUIDELINES.md

Create API.md

Create FRONTEND.md

Create BACKEND.md

Create TESTING_PLAN.md

Create TODO.md

P1 — Remaining Documentation

Create DATABASE.md

Create TASKS.md

Create AGENTS.md

Create root project README.md

Create frontend README.md

Review backend README.md

Create API setup instructions

Create project installation guide

Create viva notes

Create final project report outline

Add screenshots to documentation

Add an architecture diagram

Add an ER-style database relationship diagram

Add complete environment-variable documentation

Add final deployment instructions

P0 — Documentation Consistency Review

Replace all FastAPI references if Express remains final.

Replace all Pydantic references with the selected Express validation library.

Replace Pytest references with Jest and Supertest.

Replace Python-JOSE references with jsonwebtoken.

Replace Passlib references with bcryptjs or bcrypt.

Replace HTTPX references with Axios.

Replace Motor or PyMongo references with Compass.

Confirm route parameter style uses :farmId in Express implementation.

Confirm all files use farmId or farm_id consistently.

Confirm all files use userId, owner, or user consistently.

Confirm recommendation status names are identical in every document.

Confirm API response format is identical in every document.

Confirm deletion behaviour for related records.

4. Frontend Project Setup
P0

Confirm React and Vite are installed.

Confirm Tailwind CSS is configured.

Install React Router DOM.

Install Axios.

Install React Hook Form.

Install React Leaflet and Leaflet.

Install Lucide React.

Install React Hot Toast.

Install Recharts if charts are required.

Create frontend .env.

Create frontend .env.example.

Add VITE_API_BASE_URL.

Confirm frontend runs using npm run dev.

Remove unused starter Vite code.

Remove unused logos and demo assets.

Confirm Tailwind styles render correctly.

Import Leaflet CSS once.

Frontend environment example:

VITE_API_BASE_URL=http://localhost:8000/api/v1
5. Frontend Common Components
P0

Implement components/common/Alert.jsx

Implement components/common/Button.jsx

Implement components/common/Footer.jsx

Implement components/common/Loader.jsx

Implement components/common/Modal.jsx

Implement components/common/Navbar.jsx

Implement components/common/Sidebar.jsx

P1 — Recommended Missing Components

Add components/common/Input.jsx

Add components/common/Select.jsx

Add components/common/PasswordInput.jsx

Add components/common/EmptyState.jsx

Add components/common/ErrorState.jsx

Add components/common/ConfirmDialog.jsx

Add components/common/PageHeader.jsx

Add components/common/Skeleton.jsx

Add components/common/Pagination.jsx

Component Quality

Add loading state to reusable buttons.

Add disabled state to reusable buttons.

Add keyboard support to modal.

Add focus management to modal.

Add mobile navigation behaviour to navbar.

Add mobile drawer behaviour to sidebar.

Add active route styling using NavLink.

Add accessible labels to icon-only buttons.

Confirm all common components follow the blue design system.

6. Frontend Authentication
P0

Implement services/api.js

Add Axios base URL.

Add request interceptor for bearer token.

Add response interceptor for HTTP 401.

Implement services/authService.js

Implement context/AuthContext.jsx

Implement hooks/useAuth.js

Implement routes/ProtectedRoute.jsx

Implement registration flow.

Implement login flow.

Implement logout flow.

Restore authentication after refresh.

Redirect expired sessions to Login.

Prevent authenticated users from reopening Login/Register.

Display generic invalid-credentials errors.

Prevent duplicate login requests.

Prevent public role selection.

P1

Add password visibility toggle.

Add Remember Me behaviour.

Add session-expired toast.

Add change-password UI.

Add logout confirmation if required.

Consider secure cookie authentication for future production version.

7. Frontend Layouts and Routes
P0

Implement layouts/MainLayout.jsx

Implement layouts/DashboardLayout.jsx

Implement routes/AppRoutes.jsx

Add public routes.

Add protected routes.

Add NotFound.jsx.

Add mobile sidebar state.

Add dashboard header.

Add user avatar or initials.

Add page title or breadcrumb area.

Required Routes

/

/about

/login

/register

/dashboard

/farms

/farms/add

/farms/:farmId

/farms/:farmId/edit

/weather

/recommendation

/history

/profile

*

8. Frontend Pages
P0 — Public Pages

Complete pages/Home.jsx

Complete pages/About.jsx

Complete pages/Login.jsx

Complete pages/Register.jsx

Complete pages/NotFound.jsx

P0 — Protected Pages

Complete pages/Dashboard.jsx

Complete pages/AddFarm.jsx

Complete pages/Weather.jsx

Complete pages/Recommendation.jsx

Complete pages/Profile.jsx

P0 — Missing Required Pages

Add pages/MyFarms.jsx

Add pages/FarmDetails.jsx

Add pages/EditFarm.jsx

Add pages/History.jsx

P2 — Optional Public Pages

Add pages/Features.jsx

Add pages/Contact.jsx

9. Frontend Farm Features
P0

Implement components/farm/FarmCard.jsx

Implement components/farm/FarmForm.jsx

Implement components/farm/FarmList.jsx

Implement services/farmService.js

Implement hooks/useFarms.js

Add farm creation.

Add farm list.

Add farm details.

Add farm editing.

Add farm deletion.

Add delete confirmation.

Add search by farm name.

Show only current user's farms.

Add loading state.

Add empty state.

Add error state.

Add no-search-results state.

Prevent duplicate farm creation.

Do not send userId from the frontend.

P1

Add crop filter.

Add state filter.

Add sorting.

Add pagination.

Add quick Weather action.

Add quick Recommendation action.

10. Frontend Map Features
P0

Implement components/map/IndiaMap.jsx

Implement components/map/LocationPicker.jsx

Implement components/map/MarkerPopup.jsx

Centre initial map on India.

Allow click-to-select location.

Place marker at selected location.

Move marker when location changes.

Display latitude and longitude.

Require location before farm submission.

Display saved farm location.

Support editing saved location.

Validate latitude and longitude.

Add map loading state.

Add map error state.

Confirm map works on mobile.

Fix Leaflet marker icon path if required.

P2

Add reverse geocoding.

Add readable location name.

Add India-only validation.

Add current-device-location option only if required.

11. Frontend Weather Features
P0

Implement components/weather/WeatherCard.jsx

Implement components/weather/WeatherDetails.jsx

Implement services/weatherService.js

Implement hooks/useWeather.js

Add farm selector.

Fetch current weather.

Display temperature.

Display humidity.

Display wind speed.

Display pressure.

Display rain probability.

Display weather condition.

Display weather description.

Display last updated time.

Add refresh button.

Add loading state.

Add retry action.

Clear old weather when farm changes.

Prevent previous farm data from remaining visible.

Never display fabricated weather.

P2

Implement ForecastCard.jsx

Implement WeatherChart.jsx

Add five-day forecast.

Add temperature chart.

Add humidity chart.

Add rain-probability chart.

12. Frontend Recommendation Features
P0

Implement components/recommendation/RecommendationCard.jsx

Implement components/recommendation/StatusBadge.jsx

Implement services/recommendationService.js

Add farm selector.

Generate recommendation.

Display recommendation status.

Display recommendation title.

Display weather snapshot.

Display reason.

Display recommended action.

Display generated time.

Display advisory disclaimer.

Add loading state.

Add error state.

Add retry action.

Prevent duplicate recommendation requests.

Do not calculate the official recommendation in React.

Do not display a recommendation when weather fails.

P1

Add latest recommendation to dashboard.

Add recommendation history.

Add status filter.

Add date filter.

13. Frontend Profile Features
P0

Display current user profile.

Display name.

Display email.

Display mobile number.

Display role.

Display account status.

Display account creation date.

Display farm count.

Add profile update form.

Add field validation.

Add success feedback.

Add loading state.

Never display password hash.

P1

Add change-password form.

Verify current password.

Add profile avatar or initials.

Add account actions section.

14. Frontend Utilities
P0

Complete utils/constants.js

Complete utils/formatters.js

Complete utils/helpers.js

Complete utils/validators.js

Required Constants

India map centre

Area units

Recommendation statuses

Route paths

Pagination defaults

Date formats

Fallback labels

Required Formatters

Temperature

Humidity

Wind speed

Pressure

Rain probability

Area

Date

Date and time

Coordinates

Required Validators

Name

Email

Mobile number

Password

Farm name

Crop name

Area

Latitude

Longitude

15. Backend Project Setup
P0

Confirm Node.js version.

Confirm Express installation.

Confirm Compass installation.

Confirm .env exists locally.

Confirm .env.example exists.

Confirm .gitignore excludes .env.

Confirm .gitignore excludes node_modules.

Confirm backend runs using npm run dev.

Confirm server port.

Confirm MongoDB connection.

Confirm CORS allows frontend development URL.

Add helmet.

Add JSON request-size limit.

Add health-check endpoint.

Add request logging.

Recommended backend environment:

NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_irrigation
JWT_SECRET=
JWT_EXPIRES_IN=1h
OPENWEATHER_API_KEY=
OPENWEATHER_BASE_URL=https://api.openweathermap.org
FRONTEND_URL=http://localhost:5173
16. Backend Configuration
P0

Complete config/db.js

Complete config/jwt.js

Add database connection logging.

Add safe database error handling.

Add JWT generation.

Add JWT verification.

Add token expiration.

Ensure token payload contains only required data.

Never log secrets.

17. Backend Models
P0

Complete models/User.js

Complete models/Farm.js

Complete models/WeatherHistory.js

Complete models/Recommendation.js

User Model

Add unique lowercase email.

Add password hash.

Add farmer default role.

Add account status.

Add timestamps.

Hide password hash from normal queries.

Add password comparison method.

Farm Model

Add owner reference.

Add farm fields.

Validate area.

Validate coordinates.

Add timestamps.

Add owner index.

Weather History Model

Add farm reference.

Add user reference.

Add normalized weather fields.

Add recorded timestamp.

Add compound index.

Recommendation Model

Add farm reference.

Add user reference.

Add status.

Add title.

Add reason.

Add action.

Add weather snapshot.

Add generated timestamp.

Add history indexes.

18. Backend Middleware
P0

Complete middleware/auth.middleware.js

Complete middleware/error.middleware.js

Complete middleware/validation.middleware.js

Authentication Middleware

Parse Bearer token.

Verify JWT.

Load user.

Reject missing token.

Reject invalid token.

Reject expired token.

Reject inactive user.

Attach safe user to req.user.

Error Middleware

Add 404 middleware.

Handle validation errors.

Handle invalid ObjectIds.

Handle duplicate email errors.

Handle JWT errors.

Handle external API errors.

Hide production stack traces.

Log unexpected errors safely.

Validation Middleware

Select one library: express-validator, Joi, or Zod.

Add registration validation.

Add login validation.

Add profile validation.

Add password validation.

Add farm validation.

Add pagination validation.

Add ObjectId validation.

Return field-level errors.

19. Backend Authentication
P0

Complete services/auth.service.js

Complete controllers/auth.controller.js

Complete routes/auth.routes.js

Implement registration.

Normalize email.

Reject duplicate email.

Hash password.

Force role to farmer.

Implement login.

Verify password.

Generate JWT.

Return safe user.

Implement /auth/me.

Implement logout response.

Never return password hash.

Use generic invalid-credentials error.

20. Backend User Profile
P0

Complete controllers/user.controller.js

Complete routes/user.routes.js

Implement profile retrieval.

Implement profile update.

Allow only name and mobile updates.

Add profile validation.

Add farm count.

Implement change password.

Verify current password.

Hash new password.

Never return password hash.

21. Backend Farm Features
P0

Complete controllers/farm.controller.js

Complete routes/farm.routes.js

Implement farm creation.

Assign owner from req.user.

Ignore client-provided owner.

Implement owned farm list.

Implement farm details.

Implement farm update.

Implement farm deletion.

Verify ownership for every operation.

Validate ObjectIds.

Add search.

Add pagination.

Add sorting.

Add filters.

Define related-record deletion policy.

Required Ownership Rule
farm.owner.toString() === req.user.id.toString()
22. Backend Location Service
P0

Complete services/location.service.js

Add latitude validation.

Add longitude validation.

Add coordinate normalization.

P2

Add reverse geocoding.

Add Nominatim timeout.

Add India-bound validation.

Add readable location formatting.

23. Backend Weather Integration
P0

Complete services/weather.service.js

Complete controllers/weather.controller.js

Complete routes/weather.routes.js

Read OpenWeather key from .env.

Call weather provider from backend only.

Use Axios timeout.

Use metric units.

Normalize weather response.

Display safe provider errors.

Store weather history.

Verify farm ownership.

Implement current weather endpoint.

Implement weather history endpoint.

Do not fabricate weather.

Prevent excessive duplicate history records.

P2

Implement forecast endpoint.

Add weather caching.

Add provider-health monitoring.

24. Backend Recommendation Logic
P0

Complete utils/irrigationRules.js

Complete services/recommendation.service.js

Complete controllers/recommendation.controller.js

Complete routes/recommendation.routes.js

Apply rain rule first.

Apply humidity rule second.

Apply temperature rule third.

Apply default rule last.

Generate reason.

Generate recommended action.

Add advisory disclaimer.

Store weather snapshot.

Save recommendation.

Get latest recommendation.

Get recommendation history.

Verify farm ownership.

Do not generate when weather fails.

Required rules:

if (rainProbability > 60) {
  return "No Irrigation Required";
}

if (humidity > 80) {
  return "Delay Irrigation";
}

if (temperature > 35) {
  return "Irrigate Today";
}

return "Monitor Weather";
25. Backend Utilities
P0

Complete utils/apiResponse.js

Complete utils/constants.js

Complete utils/logger.js

API Response

Add success helper.

Add error helper.

Add validation error format.

Use consistent fields across all controllers.

Constants

User roles

User statuses

Recommendation statuses

Area units

Pagination limits

Error codes

Weather timeout

Disclaimer

Logger

Add info logging.

Add warning logging.

Add error logging.

Remove sensitive fields.

Avoid logging authorization headers.

26. Backend Root Files
P0

Complete app.js

Complete server.js

Review package.json

Confirm package-lock.json is committed.

Review backend README.md.

app.js

Configure CORS.

Configure JSON parsing.

Configure URL-encoded parsing.

Configure Helmet.

Register routes.

Add health endpoint.

Add 404 handler.

Add error handler last.

Export Express app.

server.js

Load environment.

Connect MongoDB.

Start server.

Handle startup errors.

Handle graceful shutdown.

Handle unhandled rejection.

Handle uncaught exception.

27. Database Tasks
P0

Create MongoDB database.

Confirm collection names.

Add unique email index.

Add farm-owner index.

Add weather-history compound index.

Add recommendation-history indexes.

Verify timestamps.

Verify ObjectId relationships.

Decide farm deletion cascade policy.

Create seed data.

Create test database.

Create DATABASE.md.

Suggested collections:

users
farms
weatherhistories
recommendations

Confirm actual Compass-generated collection names and document them.

28. API Tasks
P0

Confirm /api/v1 prefix.

Confirm all endpoint names.

Confirm request body field names.

Confirm response structure.

Confirm HTTP status codes.

Confirm pagination format.

Confirm date format.

Confirm recommendation status values.

Confirm error-code values.

Synchronize API.md with real implementation.

Create Postman collection.

Add Postman environment.

Test all endpoints manually.

29. Testing Tasks
P0 — Backend

Install Jest.

Install Supertest.

Configure test environment.

Create separate test database.

Mock OpenWeather requests.

Test registration.

Test duplicate email.

Test login.

Test invalid credentials.

Test valid JWT.

Test expired JWT.

Test profile.

Test password change.

Test farm creation.

Test farm list.

Test farm details.

Test farm update.

Test farm deletion.

Test ownership protection.

Test invalid ObjectId.

Test weather success.

Test weather failure.

Test weather timeout.

Test recommendation rules.

Test recommendation history.

Test sensitive-field protection.

P0 — Recommendation Boundaries

Rain probability 61

Rain probability 60

Humidity 81

Humidity 80

Temperature 36

Temperature 35

Multiple rules true

No rules true

P1 — Frontend

Install Vitest.

Install React Testing Library.

Test Login.

Test Register.

Test ProtectedRoute.

Test FarmForm.

Test LocationPicker.

Test WeatherCard.

Test RecommendationCard.

Test loading states.

Test error states.

Test empty states.

Test mobile navigation.

Manual Testing

Test Chrome.

Test Edge.

Test Firefox.

Test 320px width.

Test 375px width.

Test 425px width.

Test 768px width.

Test 1024px width.

Test 1280px width.

Test keyboard navigation.

Run Lighthouse.

Record defects.

Prepare final testing report.

30. Security Review
P0

Confirm passwords are hashed.

Confirm hashes never appear in responses.

Confirm JWT secret is private.

Confirm JWT expiration works.

Confirm role escalation is blocked.

Confirm farm ownership is enforced.

Confirm OpenWeather key stays in backend.

Confirm .env is ignored.

Confirm CORS is restricted.

Confirm error stack is hidden in production.

Confirm invalid ObjectIds are handled safely.

Confirm user input is validated.

Confirm duplicate submissions are prevented.

Confirm no sensitive values are logged.

Confirm production uses HTTPS.

P1

Add rate limiting.

Add security headers.

Add request sanitization.

Add account lockout after repeated failed logins.

Add refresh-token strategy if required.

Add HTTP-only cookie authentication for production.

31. UI and UX Review
P0

Confirm blue primary theme.

Confirm dark navy sidebar.

Confirm white cards.

Confirm light slate background.

Confirm consistent spacing.

Confirm consistent typography.

Confirm all buttons have hover states.

Confirm all buttons have disabled states.

Confirm all forms have labels.

Confirm validation messages are visible.

Confirm loading states are present.

Confirm empty states are present.

Confirm error states are present.

Confirm delete actions require confirmation.

Confirm no page displays undefined.

Confirm no page displays null.

Confirm no page displays NaN.

Confirm mobile layout works.

Confirm map fits small screens.

Confirm tables scroll on mobile.

Confirm focus states are visible.

32. Deployment Tasks
P1

Create production MongoDB Atlas database.

Add production database user.

Restrict database network access.

Deploy backend.

Add backend environment variables.

Deploy frontend.

Add frontend API base URL.

Configure production CORS.

Confirm HTTPS.

Test production authentication.

Test production weather integration.

Test production maps.

Add production health check.

Add error logging.

Add deployment instructions to README.

Possible platforms:

Frontend:
Vercel or Netlify

Backend:
Render or Railway

Database:
MongoDB Atlas
33. College Submission Tasks
P0

Complete project report.

Add abstract.

Add introduction.

Add problem statement.

Add objectives.

Add literature survey.

Add methodology.

Add architecture.

Add database design.

Add API design.

Add implementation details.

Add screenshots.

Add testing results.

Add limitations.

Add future scope.

Add conclusion.

Add references.

Prepare source-code ZIP.

Remove .env from submission ZIP.

Include .env.example.

Include installation instructions.

Include sample login or seed instructions.

Prepare demonstration data.

Prepare viva questions and answers.

Prepare project presentation.

Test complete project before submission.

34. MVP Completion Checklist

The MVP is complete only when:

User can register.

User can log in.

User can log out.

Authentication survives refresh.

Protected routes work.

User can add a farm.

User can select a map location.

Coordinates are stored.

User can view own farms.

User can edit own farms.

User can delete own farms.

User cannot access another user's farms.

Weather is fetched from the backend.

Weather is displayed correctly.

Weather failure is handled.

Recommendation rules work.

Recommendation is saved.

History is available.

Profile can be viewed.

Profile can be updated.

Password can be changed.

UI works on mobile.

No secret is exposed.

Critical tests pass.

Documentation matches the code.

35. Current Priority Order

Work in this order:

1. Resolve Node.js versus FastAPI documentation conflict
2. Complete backend setup and database connection
3. Complete authentication backend
4. Complete authentication frontend
5. Complete protected routes and layouts
6. Complete farm CRUD backend
7. Complete farm UI
8. Complete map location selection
9. Complete weather backend integration
10. Complete weather frontend
11. Complete recommendation engine
12. Complete recommendation frontend
13. Complete history
14. Complete profile
15. Add loading, empty, and error states
16. Test security and ownership
17. Responsive and accessibility review
18. Deployment
19. Final report and viva preparation
36. Future Scope
P3

Multi-language support

Hindi translation

Marathi translation

SMS alerts

WhatsApp alerts

Mobile application

Soil-moisture sensors

IoT integration

Automatic pump control

Crop-specific irrigation rules

Machine Learning prediction

Advanced analytics

Admin dashboard

CSV export

PDF reports

Redis caching

Background jobs

Email notifications

Regional weather warnings

These tasks must not delay the P0 MVP.

37. Final Rule

Do not mark the project complete until:

Code
Documentation
API behaviour
Database structure
Testing plan
UI behaviour
Security rules

all describe and implement the same system.

Library
/
TODO.md
TODO
1. Document Purpose

This file tracks the remaining work for the Weather-Based Smart Irrigation Advisory System.

Use it to:

Record unfinished tasks
Prioritize MVP work
Track frontend and backend progress
Prevent duplicate work
Identify documentation inconsistencies
Prepare the project for testing, demonstration, and college submission

Task status symbols:

[ ] Not started
[-] In progress
[x] Completed
[!] Blocked

Priority levels:

P0 — Critical MVP task
P1 — Important task
P2 — Optional improvement
P3 — Future scope
2. Immediate Project Decisions
P0 — Resolve Backend Stack Conflict

Confirm the final backend stack.

Keep Node.js + Express.js + MongoDB + Compass if using the current backend folder.

Remove or update all FastAPI references from documentation.

Ensure ARCHITECTURE.md matches the actual Express backend.

Ensure DECISIONS.md matches the actual Express backend.

Ensure REQUIREMENTS.md matches the actual Express backend.

Ensure PRD.md matches the actual Express backend.

Ensure API.md uses Express-style path parameters consistently.

Ensure TESTING_PLAN.md uses Jest and Supertest instead of Pytest.

Ensure package.json includes "type": "module" if ES-module imports are used.

Recommended final stack:

Frontend:
React + Vite + Tailwind CSS

Backend:
Node.js + Express.js

Database:
MongoDB + Compass

Map:
OpenStreetMap + React Leaflet

Weather:
OpenWeather API through backend

Authentication:
JWT + bcrypt
3. Documentation Tasks
P0 — Core Documentation

Create PRD.md

Create REQUIREMENTS.md

Create DECISIONS.md

Create FEATURES.md

Create USERS.md

Create ARCHITECTURE.md

Create UI_GUIDELINES.md

Create API.md

Create FRONTEND.md

Create BACKEND.md

Create TESTING_PLAN.md

Create TODO.md

P1 — Remaining Documentation

Create DATABASE.md

Create TASKS.md

Create AGENTS.md

Create root project README.md

Create frontend README.md

Review backend README.md

Create API setup instructions

Create project installation guide

Create viva notes

Create final project report outline

Add screenshots to documentation

Add an architecture diagram

Add an ER-style database relationship diagram

Add complete environment-variable documentation

Add final deployment instructions

P0 — Documentation Consistency Review

Replace all FastAPI references if Express remains final.

Replace all Pydantic references with the selected Express validation library.

Replace Pytest references with Jest and Supertest.

Replace Python-JOSE references with jsonwebtoken.

Replace Passlib references with bcryptjs or bcrypt.

Replace HTTPX references with Axios.

Replace Motor or PyMongo references with Compass.

Confirm route parameter style uses :farmId in Express implementation.

Confirm all files use farmId or farm_id consistently.

Confirm all files use userId, owner, or user consistently.

Confirm recommendation status names are identical in every document.

Confirm API response format is identical in every document.

Confirm deletion behaviour for related records.

4. Frontend Project Setup
P0

Confirm React and Vite are installed.

Confirm Tailwind CSS is configured.

Install React Router DOM.

Install Axios.

Install React Hook Form.

Install React Leaflet and Leaflet.

Install Lucide React.

Install React Hot Toast.

Install Recharts if charts are required.

Create frontend .env.

Create frontend .env.example.

Add VITE_API_BASE_URL.

Confirm frontend runs using npm run dev.

Remove unused starter Vite code.

Remove unused logos and demo assets.

Confirm Tailwind styles render correctly.

Import Leaflet CSS once.

Frontend environment example:

VITE_API_BASE_URL=http://localhost:8000/api/v1
5. Frontend Common Components
P0

Implement components/common/Alert.jsx

Implement components/common/Button.jsx

Implement components/common/Footer.jsx

Implement components/common/Loader.jsx

Implement components/common/Modal.jsx

Implement components/common/Navbar.jsx

Implement components/common/Sidebar.jsx

P1 — Recommended Missing Components

Add components/common/Input.jsx

Add components/common/Select.jsx

Add components/common/PasswordInput.jsx

Add components/common/EmptyState.jsx

Add components/common/ErrorState.jsx

Add components/common/ConfirmDialog.jsx

Add components/common/PageHeader.jsx

Add components/common/Skeleton.jsx

Add components/common/Pagination.jsx

Component Quality

Add loading state to reusable buttons.

Add disabled state to reusable buttons.

Add keyboard support to modal.

Add focus management to modal.

Add mobile navigation behaviour to navbar.

Add mobile drawer behaviour to sidebar.

Add active route styling using NavLink.

Add accessible labels to icon-only buttons.

Confirm all common components follow the blue design system.

6. Frontend Authentication
P0

Implement services/api.js

Add Axios base URL.

Add request interceptor for bearer token.

Add response interceptor for HTTP 401.

Implement services/authService.js

Implement context/AuthContext.jsx

Implement hooks/useAuth.js

Implement routes/ProtectedRoute.jsx

Implement registration flow.

Implement login flow.

Implement logout flow.

Restore authentication after refresh.

Redirect expired sessions to Login.

Prevent authenticated users from reopening Login/Register.

Display generic invalid-credentials errors.

Prevent duplicate login requests.

Prevent public role selection.

P1

Add password visibility toggle.

Add Remember Me behaviour.

Add session-expired toast.

Add change-password UI.

Add logout confirmation if required.

Consider secure cookie authentication for future production version.

7. Frontend Layouts and Routes
P0

Implement layouts/MainLayout.jsx

Implement layouts/DashboardLayout.jsx

Implement routes/AppRoutes.jsx

Add public routes.

Add protected routes.

Add NotFound.jsx.

Add mobile sidebar state.

Add dashboard header.

Add user avatar or initials.

Add page title or breadcrumb area.

Required Routes

/

/about

/login

/register

/dashboard

/farms

/farms/add

/farms/:farmId

/farms/:farmId/edit

/weather

/recommendation

/history

/profile

*

8. Frontend Pages
P0 — Public Pages

Complete pages/Home.jsx

Complete pages/About.jsx

Complete pages/Login.jsx

Complete pages/Register.jsx

Complete pages/NotFound.jsx

P0 — Protected Pages

Complete pages/Dashboard.jsx

Complete pages/AddFarm.jsx

Complete pages/Weather.jsx

Complete pages/Recommendation.jsx

Complete pages/Profile.jsx

P0 — Missing Required Pages

Add pages/MyFarms.jsx

Add pages/FarmDetails.jsx

Add pages/EditFarm.jsx

Add pages/History.jsx

P2 — Optional Public Pages

Add pages/Features.jsx

Add pages/Contact.jsx

9. Frontend Farm Features
P0

Implement components/farm/FarmCard.jsx

Implement components/farm/FarmForm.jsx

Implement components/farm/FarmList.jsx

Implement services/farmService.js

Implement hooks/useFarms.js

Add farm creation.

Add farm list.

Add farm details.

Add farm editing.

Add farm deletion.

Add delete confirmation.

Add search by farm name.

Show only current user's farms.

Add loading state.

Add empty state.

Add error state.

Add no-search-results state.

Prevent duplicate farm creation.

Do not send userId from the frontend.

P1

Add crop filter.

Add state filter.

Add sorting.

Add pagination.

Add quick Weather action.

Add quick Recommendation action.

10. Frontend Map Features
P0

Implement components/map/IndiaMap.jsx

Implement components/map/LocationPicker.jsx

Implement components/map/MarkerPopup.jsx

Centre initial map on India.

Allow click-to-select location.

Place marker at selected location.

Move marker when location changes.

Display latitude and longitude.

Require location before farm submission.

Display saved farm location.

Support editing saved location.

Validate latitude and longitude.

Add map loading state.

Add map error state.

Confirm map works on mobile.

Fix Leaflet marker icon path if required.

P2

Add reverse geocoding.

Add readable location name.

Add India-only validation.

Add current-device-location option only if required.

11. Frontend Weather Features
P0

Implement components/weather/WeatherCard.jsx

Implement components/weather/WeatherDetails.jsx

Implement services/weatherService.js

Implement hooks/useWeather.js

Add farm selector.

Fetch current weather.

Display temperature.

Display humidity.

Display wind speed.

Display pressure.

Display rain probability.

Display weather condition.

Display weather description.

Display last updated time.

Add refresh button.

Add loading state.

Add retry action.

Clear old weather when farm changes.

Prevent previous farm data from remaining visible.

Never display fabricated weather.

P2

Implement ForecastCard.jsx

Implement WeatherChart.jsx

Add five-day forecast.

Add temperature chart.

Add humidity chart.

Add rain-probability chart.

12. Frontend Recommendation Features
P0

Implement components/recommendation/RecommendationCard.jsx

Implement components/recommendation/StatusBadge.jsx

Implement services/recommendationService.js

Add farm selector.

Generate recommendation.

Display recommendation status.

Display recommendation title.

Display weather snapshot.

Display reason.

Display recommended action.

Display generated time.

Display advisory disclaimer.

Add loading state.

Add error state.

Add retry action.

Prevent duplicate recommendation requests.

Do not calculate the official recommendation in React.

Do not display a recommendation when weather fails.

P1

Add latest recommendation to dashboard.

Add recommendation history.

Add status filter.

Add date filter.

13. Frontend Profile Features
P0

Display current user profile.

Display name.

Display email.

Display mobile number.

Display role.

Display account status.

Display account creation date.

Display farm count.

Add profile update form.

Add field validation.

Add success feedback.

Add loading state.

Never display password hash.

P1

Add change-password form.

Verify current password.

Add profile avatar or initials.

Add account actions section.

14. Frontend Utilities
P0

Complete utils/constants.js

Complete utils/formatters.js

Complete utils/helpers.js

Complete utils/validators.js

Required Constants

India map centre

Area units

Recommendation statuses

Route paths

Pagination defaults

Date formats

Fallback labels

Required Formatters

Temperature

Humidity

Wind speed

Pressure

Rain probability

Area

Date

Date and time

Coordinates

Required Validators

Name

Email

Mobile number

Password

Farm name

Crop name

Area

Latitude

Longitude

15. Backend Project Setup
P0

Confirm Node.js version.

Confirm Express installation.

Confirm Compass installation.

Confirm .env exists locally.

Confirm .env.example exists.

Confirm .gitignore excludes .env.

Confirm .gitignore excludes node_modules.

Confirm backend runs using npm run dev.

Confirm server port.

Confirm MongoDB connection.

Confirm CORS allows frontend development URL.

Add helmet.

Add JSON request-size limit.

Add health-check endpoint.

Add request logging.

Recommended backend environment:

NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_irrigation
JWT_SECRET=
JWT_EXPIRES_IN=1h
OPENWEATHER_API_KEY=
OPENWEATHER_BASE_URL=https://api.openweathermap.org
FRONTEND_URL=http://localhost:5173
16. Backend Configuration
P0

Complete config/db.js

Complete config/jwt.js

Add database connection logging.

Add safe database error handling.

Add JWT generation.

Add JWT verification.

Add token expiration.

Ensure token payload contains only required data.

Never log secrets.

17. Backend Models
P0

Complete models/User.js

Complete models/Farm.js

Complete models/WeatherHistory.js

Complete models/Recommendation.js

User Model

Add unique lowercase email.

Add password hash.

Add farmer default role.

Add account status.

Add timestamps.

Hide password hash from normal queries.

Add password comparison method.

Farm Model

Add owner reference.

Add farm fields.

Validate area.

Validate coordinates.

Add timestamps.

Add owner index.

Weather History Model

Add farm reference.

Add user reference.

Add normalized weather fields.

Add recorded timestamp.

Add compound index.

Recommendation Model

Add farm reference.

Add user reference.

Add status.

Add title.

Add reason.

Add action.

Add weather snapshot.

Add generated timestamp.

Add history indexes.

18. Backend Middleware
P0

Complete middleware/auth.middleware.js

Complete middleware/error.middleware.js

Complete middleware/validation.middleware.js

Authentication Middleware

Parse Bearer token.

Verify JWT.

Load user.

Reject missing token.

Reject invalid token.

Reject expired token.

Reject inactive user.

Attach safe user to req.user.

Error Middleware

Add 404 middleware.

Handle validation errors.

Handle invalid ObjectIds.

Handle duplicate email errors.

Handle JWT errors.

Handle external API errors.

Hide production stack traces.

Log unexpected errors safely.

Validation Middleware

Select one library: express-validator, Joi, or Zod.

Add registration validation.

Add login validation.

Add profile validation.

Add password validation.

Add farm validation.

Add pagination validation.

Add ObjectId validation.

Return field-level errors.

19. Backend Authentication
P0

Complete services/auth.service.js

Complete controllers/auth.controller.js

Complete routes/auth.routes.js

Implement registration.

Normalize email.

Reject duplicate email.

Hash password.

Force role to farmer.

Implement login.

Verify password.

Generate JWT.

Return safe user.

Implement /auth/me.

Implement logout response.

Never return password hash.

Use generic invalid-credentials error.

20. Backend User Profile
P0

Complete controllers/user.controller.js

Complete routes/user.routes.js

Implement profile retrieval.

Implement profile update.

Allow only name and mobile updates.

Add profile validation.

Add farm count.

Implement change password.

Verify current password.

Hash new password.

Never return password hash.

21. Backend Farm Features
P0

Complete controllers/farm.controller.js

Complete routes/farm.routes.js

Implement farm creation.

Assign owner from req.user.

Ignore client-provided owner.

Implement owned farm list.

Implement farm details.

Implement farm update.

Implement farm deletion.

Verify ownership for every operation.

Validate ObjectIds.

Add search.

Add pagination.

Add sorting.

Add filters.

Define related-record deletion policy.

Required Ownership Rule
farm.owner.toString() === req.user.id.toString()
22. Backend Location Service
P0

Complete services/location.service.js

Add latitude validation.

Add longitude validation.

Add coordinate normalization.

P2

Add reverse geocoding.

Add Nominatim timeout.

Add India-bound validation.

Add readable location formatting.

23. Backend Weather Integration
P0

Complete services/weather.service.js

Complete controllers/weather.controller.js

Complete routes/weather.routes.js

Read OpenWeather key from .env.

Call weather provider from backend only.

Use Axios timeout.

Use metric units.

Normalize weather response.

Display safe provider errors.

Store weather history.

Verify farm ownership.

Implement current weather endpoint.

Implement weather history endpoint.

Do not fabricate weather.

Prevent excessive duplicate history records.

P2

Implement forecast endpoint.

Add weather caching.

Add provider-health monitoring.

24. Backend Recommendation Logic
P0

Complete utils/irrigationRules.js

Complete services/recommendation.service.js

Complete controllers/recommendation.controller.js

Complete routes/recommendation.routes.js

Apply rain rule first.

Apply humidity rule second.

Apply temperature rule third.

Apply default rule last.

Generate reason.

Generate recommended action.

Add advisory disclaimer.

Store weather snapshot.

Save recommendation.

Get latest recommendation.

Get recommendation history.

Verify farm ownership.

Do not generate when weather fails.

Required rules:

if (rainProbability > 60) {
  return "No Irrigation Required";
}

if (humidity > 80) {
  return "Delay Irrigation";
}

if (temperature > 35) {
  return "Irrigate Today";
}

return "Monitor Weather";
25. Backend Utilities
P0

Complete utils/apiResponse.js

Complete utils/constants.js

Complete utils/logger.js

API Response

Add success helper.

Add error helper.

Add validation error format.

Use consistent fields across all controllers.

Constants

User roles

User statuses

Recommendation statuses

Area units

Pagination limits

Error codes

Weather timeout

Disclaimer

Logger

Add info logging.

Add warning logging.

Add error logging.

Remove sensitive fields.

Avoid logging authorization headers.

26. Backend Root Files
P0

Complete app.js

Complete server.js

Review package.json

Confirm package-lock.json is committed.

Review backend README.md.

app.js

Configure CORS.

Configure JSON parsing.

Configure URL-encoded parsing.

Configure Helmet.

Register routes.

Add health endpoint.

Add 404 handler.

Add error handler last.

Export Express app.

server.js

Load environment.

Connect MongoDB.

Start server.

Handle startup errors.

Handle graceful shutdown.

Handle unhandled rejection.

Handle uncaught exception.

27. Database Tasks
P0

Create MongoDB database.

Confirm collection names.

Add unique email index.

Add farm-owner index.

Add weather-history compound index.

Add recommendation-history indexes.

Verify timestamps.

Verify ObjectId relationships.

Decide farm deletion cascade policy.

Create seed data.

Create test database.

Create DATABASE.md.

Suggested collections:

users
farms
weatherhistories
recommendations

Confirm actual Compass-generated collection names and document them.

28. API Tasks
P0

Confirm /api/v1 prefix.

Confirm all endpoint names.

Confirm request body field names.

Confirm response structure.

Confirm HTTP status codes.

Confirm pagination format.

Confirm date format.

Confirm recommendation status values.

Confirm error-code values.

Synchronize API.md with real implementation.

Create Postman collection.

Add Postman environment.

Test all endpoints manually.

29. Testing Tasks
P0 — Backend

Install Jest.

Install Supertest.

Configure test environment.

Create separate test database.

Mock OpenWeather requests.

Test registration.

Test duplicate email.

Test login.

Test invalid credentials.

Test valid JWT.

Test expired JWT.

Test profile.

Test password change.

Test farm creation.

Test farm list.

Test farm details.

Test farm update.

Test farm deletion.

Test ownership protection.

Test invalid ObjectId.

Test weather success.

Test weather failure.

Test weather timeout.

Test recommendation rules.

Test recommendation history.

Test sensitive-field protection.

P0 — Recommendation Boundaries

Rain probability 61

Rain probability 60

Humidity 81

Humidity 80

Temperature 36

Temperature 35

Multiple rules true

No rules true

P1 — Frontend

Install Vitest.

Install React Testing Library.

Test Login.

Test Register.

Test ProtectedRoute.

Test FarmForm.

Test LocationPicker.

Test WeatherCard.

Test RecommendationCard.

Test loading states.

Test error states.

Test empty states.

Test mobile navigation.

Manual Testing

Test Chrome.

Test Edge.

Test Firefox.

Test 320px width.

Test 375px width.

Test 425px width.

Test 768px width.

Test 1024px width.

Test 1280px width.

Test keyboard navigation.

Run Lighthouse.

Record defects.

Prepare final testing report.

30. Security Review
P0

Confirm passwords are hashed.

Confirm hashes never appear in responses.

Confirm JWT secret is private.

Confirm JWT expiration works.

Confirm role escalation is blocked.

Confirm farm ownership is enforced.

Confirm OpenWeather key stays in backend.

Confirm .env is ignored.

Confirm CORS is restricted.

Confirm error stack is hidden in production.

Confirm invalid ObjectIds are handled safely.

Confirm user input is validated.

Confirm duplicate submissions are prevented.

Confirm no sensitive values are logged.

Confirm production uses HTTPS.

P1

Add rate limiting.

Add security headers.

Add request sanitization.

Add account lockout after repeated failed logins.

Add refresh-token strategy if required.

Add HTTP-only cookie authentication for production.

31. UI and UX Review
P0

Confirm blue primary theme.

Confirm dark navy sidebar.

Confirm white cards.

Confirm light slate background.

Confirm consistent spacing.

Confirm consistent typography.

Confirm all buttons have hover states.

Confirm all buttons have disabled states.

Confirm all forms have labels.

Confirm validation messages are visible.

Confirm loading states are present.

Confirm empty states are present.

Confirm error states are present.

Confirm delete actions require confirmation.

Confirm no page displays undefined.

Confirm no page displays null.

Confirm no page displays NaN.

Confirm mobile layout works.

Confirm map fits small screens.

Confirm tables scroll on mobile.

Confirm focus states are visible.

32. Deployment Tasks
P1

Create production MongoDB Atlas database.

Add production database user.

Restrict database network access.

Deploy backend.

Add backend environment variables.

Deploy frontend.

Add frontend API base URL.

Configure production CORS.

Confirm HTTPS.

Test production authentication.

Test production weather integration.

Test production maps.

Add production health check.

Add error logging.

Add deployment instructions to README.

Possible platforms:

Frontend:
Vercel or Netlify

Backend:
Render or Railway

Database:
MongoDB Atlas
33. College Submission Tasks
P0

Complete project report.

Add abstract.

Add introduction.

Add problem statement.

Add objectives.

Add literature survey.

Add methodology.

Add architecture.

Add database design.

Add API design.

Add implementation details.

Add screenshots.

Add testing results.

Add limitations.

Add future scope.

Add conclusion.

Add references.

Prepare source-code ZIP.

Remove .env from submission ZIP.

Include .env.example.

Include installation instructions.

Include sample login or seed instructions.

Prepare demonstration data.

Prepare viva questions and answers.

Prepare project presentation.

Test complete project before submission.

34. MVP Completion Checklist

The MVP is complete only when:

User can register.

User can log in.

User can log out.

Authentication survives refresh.

Protected routes work.

User can add a farm.

User can select a map location.

Coordinates are stored.

User can view own farms.

User can edit own farms.

User can delete own farms.

User cannot access another user's farms.

Weather is fetched from the backend.

Weather is displayed correctly.

Weather failure is handled.

Recommendation rules work.

Recommendation is saved.

History is available.

Profile can be viewed.

Profile can be updated.

Password can be changed.

UI works on mobile.

No secret is exposed.

Critical tests pass.

Documentation matches the code.

35. Current Priority Order

Work in this order:

1. Resolve Node.js versus FastAPI documentation conflict
2. Complete backend setup and database connection
3. Complete authentication backend
4. Complete authentication frontend
5. Complete protected routes and layouts
6. Complete farm CRUD backend
7. Complete farm UI
8. Complete map location selection
9. Complete weather backend integration
10. Complete weather frontend
11. Complete recommendation engine
12. Complete recommendation frontend
13. Complete history
14. Complete profile
15. Add loading, empty, and error states
16. Test security and ownership
17. Responsive and accessibility review
18. Deployment
19. Final report and viva preparation
36. Future Scope
P3

Multi-language support

Hindi translation

Marathi translation

SMS alerts

WhatsApp alerts

Mobile application

Soil-moisture sensors

IoT integration

Automatic pump control

Crop-specific irrigation rules

Machine Learning prediction

Advanced analytics

Admin dashboard

CSV export

PDF reports

Redis caching

Background jobs

Email notifications

Regional weather warnings

These tasks must not delay the P0 MVP.

37. Final Rule

Do not mark the project complete until:

Code
Documentation
API behaviour
Database structure
Testing plan
UI behaviour
Security rules

all describe and implement the same system.
## Dashboard Analytics Status — 2026-07-23

- [x] Implement the documented analytical farmer dashboard.
- [x] Use secured weather and recommendation history endpoints without hardcoded records.
- [x] Add reusable Recharts analytics components.
- [x] Add a farm-specific 7-day view, partial-failure handling, tables, map, actions, and alerts.
- [ ] Add automated frontend component tests when the repository adds Vitest and React Testing Library scripts.

## KisanSetu Branding and Responsive Layout — 2026-07-24

- [x] Replace remaining JalSetu labels with KisanSetu.
- [x] Correct narrow-window dashboard sizing and horizontal overflow.
- [ ] Add automated responsive component tests when frontend test tooling is introduced.

## Profile Page Follow-up — 2026-07-25

- [x] Implement the approved responsive profile dashboard design.
- [ ] Add backend persistence for address, notification preferences, application preferences, and profile photos.
- [ ] Add a secured account-deletion endpoint if account deletion enters product scope.
- [ ] Add automated Profile component tests when frontend test tooling is introduced.

## Five-Year Development Seed — 2026-07-25

- [x] Add and validate the supplied five-year synthetic MongoDB seed.
- [ ] Run `npm run seed` against the intended local MongoDB database after setting `SEED_USER_PASSWORD`.

## Dataset Dashboard Simulation — 2026-07-29

- [x] Replace dashboard weather API reads with the bundled synthetic dataset.
- [x] Add farm-aware playback and a moving seven-record analytics window.
- [x] Populate weather, recommendation, and farm-information panels.
- [x] Label the dashboard `Simulated Weather Data` at all times.
- [x] Add loading, genuine empty, and dataset error states.
- [ ] Add automated simulation component tests when Vitest and React Testing Library are configured.
## Earth Palette Refresh — 2026-08-06

- [x] Replace the blue/navy-dominant palette with brown, green, and blue earth tones.
- [x] Preserve semantic status colors and visible focus states.
## Mobile Navigation Drawer Fix — 2026-08-06

- [x] Correct narrow-window navigation overflow and overlapping controls.
## Production Irrigation Advisor — 2026-08-07

- [x] Implement the attached production-style recommendation page brief.
- [x] Keep all advice visibly labeled as simulated, rule-based demonstration guidance.
- [ ] Add automated advisor component tests when Vitest and React Testing Library are configured.

## Sugarcane About Page — 2026-08-09

- [x] Redesign the About page with responsive sugarcane farming and irrigation education.
- [ ] Add automated About page accessibility and responsive tests when Vitest and React Testing Library are configured.

## Login Page Redesign — 2026-08-12

- [x] Implement and verify the reference-inspired login layout without changing authentication behavior or the established palette.
- [ ] Add automated login interaction and responsive tests when Vitest and React Testing Library are configured.

## Production Registration Reliability - 2026-08-12

- [x] Reuse a cached MongoDB connection in serverless invocations.
- [x] Surface unavailable MongoDB as a sanitized `503` response.
- [x] Normalize `FRONTEND_URL` before applying CORS.
- [ ] Set the production Atlas `MONGODB_URI` and `JWT_SECRET` in Vercel, allow network access, redeploy, and verify registration/login.
- [ ] Replace the local `MONGODB_URI` in `backend/.env` with the real Atlas connection string and verify connectivity (credentials are intentionally not stored in tracked files).
- [!] Production health check still returns `503`; verify Atlas Database Access/Network Access and the backend Vercel Production `MONGODB_URI`, then redeploy.

## Login Database Integration Fix - 2026-08-31

- [x] Restore the app-level database middleware required by login and other database-backed routes.
- [x] Verify the local health and invalid-login API responses.
- [ ] Redeploy the backend and verify login with a registered production account.

## Microservices Clone - 2026-10-06

- [x] Verify service startup, gateway routing, copied frontend build/lint and inherited backend tests.
- [ ] Configure clone secrets and verify a real OpenWeather request.
- [ ] Manually verify the copied browser workflow and map selection.
