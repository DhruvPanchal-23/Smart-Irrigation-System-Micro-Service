> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

# Technical and Product Decisions

## 1. Document Purpose

This document records the important product, architecture, technology, design, security, data, API, testing, and implementation decisions for the **Weather-Based Smart Irrigation Advisory System**.

The purpose of this document is to ensure that:

* All project documents remain consistent
* Codex follows the same technical direction
* Developers understand why each technology was selected
* Unnecessary technologies are not added
* The project remains manageable for a college-level implementation
* Future changes can be evaluated against existing decisions

This document is a source of truth for technical choices.

---

# 2. Decision Status Values

Each decision may use one of the following statuses:

```txt
Proposed
Accepted
Rejected
Deprecated
Superseded
```

For the current project, all decisions in this document are considered:

```txt
Accepted
```

unless explicitly marked otherwise.

---

# 3. Decision Priority

When project documents conflict, use the following priority:

```txt
1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. PRD.md
5. FEATURES.md
6. UI_GUIDELINES.md
7. API.md
8. DATABASE.md
9. FRONTEND.md
10. BACKEND.md
11. TESTING_PLAN.md
12. TASKS.md
13. TODO.md
```

`REQUIREMENTS.md` defines what the system must do.

`DECISIONS.md` defines how major product and technical choices must be implemented.

---

# 4. Decision Summary

| ID      | Decision                                    | Status   |
| ------- | ------------------------------------------- | -------- |
| DEC-001 | Build a weather-based irrigation prototype  | Accepted |
| DEC-002 | Do not use Machine Learning                 | Accepted |
| DEC-003 | Do not use IoT sensors                      | Accepted |
| DEC-004 | Use rule-based recommendation logic         | Accepted |
| DEC-005 | Use React with Vite                         | Accepted |
| DEC-006 | Use Tailwind CSS                            | Accepted |
| DEC-007 | Use Python with FastAPI                     | Accepted |
| DEC-008 | Use MongoDB                                 | Accepted |
| DEC-009 | Use OpenStreetMap with Leaflet              | Accepted |
| DEC-010 | Use OpenWeather API                         | Accepted |
| DEC-011 | Fetch weather through the backend           | Accepted |
| DEC-012 | Use JWT authentication                      | Accepted |
| DEC-013 | Use a blue design system                    | Accepted |
| DEC-014 | Use layered architecture                    | Accepted |
| DEC-015 | Keep frontend and backend separate          | Accepted |
| DEC-016 | Support multiple farms per farmer           | Accepted |
| DEC-017 | Verify farm ownership in the backend        | Accepted |
| DEC-018 | Store weather and recommendation history    | Accepted |
| DEC-019 | Use REST APIs under `/api/v1`               | Accepted |
| DEC-020 | Use reusable frontend components            | Accepted |
| DEC-021 | Use environment variables for secrets       | Accepted |
| DEC-022 | Add optional admin features after MVP       | Accepted |
| DEC-023 | Use India as the initial map view           | Accepted |
| DEC-024 | Use a weather-only advisory disclaimer      | Accepted |
| DEC-025 | Use Pytest and Vitest for automated testing | Accepted |

---

# 5. Product Decisions

## DEC-001: Build a Weather-Based Irrigation Prototype

### Status

Accepted

### Decision

The project will be implemented as a **Weather-Based Smart Irrigation Advisory System prototype**.

The system will help users:

* Register farms
* Select locations
* View live weather
* Receive simple irrigation advice
* View history

### Reason

The original concept included AI, IoT, GIS, cloud infrastructure, and large-scale farm monitoring. That version is too complex for a small college project.

The prototype version is:

* Easier to build
* Easier to test
* Easier to explain
* Suitable for a semester project
* Technically complete enough to demonstrate full-stack development

### Consequence

The project must be presented as:

```txt
A prototype weather-based irrigation advisory system
```

It must not be presented as a complete commercial agricultural platform.

---

## DEC-002: Do Not Use Machine Learning

### Status

Accepted

### Decision

The current version will not use:

* Machine Learning
* Deep Learning
* AI prediction models
* Trained agricultural datasets

### Reason

Machine Learning would require:

* Reliable training data
* Data cleaning
* Model training
* Model evaluation
* Accuracy validation
* Additional deployment complexity

The project does not require these features to demonstrate its main workflow.

### Consequence

Do not create:

```txt
ml/
models/
training/
datasets/
prediction_model.py
tensorflow/
scikit-learn model files
```

Machine Learning may be mentioned only as future scope.

---

## DEC-003: Do Not Use IoT Sensors

### Status

Accepted

### Decision

The project will not use physical IoT sensors.

Excluded hardware includes:

* Soil-moisture sensors
* ESP32
* DHT11 or DHT22
* Relay modules
* Water pumps
* Flow sensors
* Sensor gateways

### Reason

The current prototype focuses on web development, API integration, maps, databases, and rule-based logic.

Hardware would increase:

* Cost
* Setup difficulty
* Testing difficulty
* Project risk
* Demonstration complexity

### Consequence

The system must not claim to measure actual soil moisture.

---

## DEC-004: Use Rule-Based Recommendation Logic

### Status

Accepted

### Decision

Irrigation recommendations will be generated using predefined backend rules.

### Rule Priority

```txt
1. Rain probability
2. Humidity
3. Temperature
4. Default condition
```

### Rules

```python
if rain_probability > 60:
    recommendation = "No Irrigation Required"

elif humidity > 80:
    recommendation = "Delay Irrigation"

elif temperature > 35:
    recommendation = "Irrigate Today"

else:
    recommendation = "Monitor Weather"
```

### Reason

Rule-based logic is:

* Easy to understand
* Easy to test
* Predictable
* Suitable for academic demonstration
* Independent of training data

### Consequence

The rule engine must exist only in the backend.

The frontend may display the result but must not independently calculate the official recommendation.

---

# 6. Frontend Decisions

## DEC-005: Use React with Vite

### Status

Accepted

### Decision

The frontend will use:

```txt
React.js
Vite
JavaScript
```

### Reason

React provides:

* Reusable components
* Strong ecosystem
* Easy state management
* Good routing support
* Good support for maps and charts

Vite provides:

* Fast development server
* Simple configuration
* Fast builds
* Modern frontend setup

### Rejected Alternatives

#### Create React App

Rejected because it is older and slower than Vite.

#### Plain HTML, CSS, and JavaScript

Rejected because the project requires multiple pages, reusable components, authentication state, routing, and dynamic data.

#### Next.js

Rejected because server-side rendering is unnecessary for this prototype.

---

## DEC-006: Use Tailwind CSS

### Status

Accepted

### Decision

Tailwind CSS will be used for interface styling.

### Reason

Tailwind provides:

* Fast UI development
* Consistent spacing
* Responsive utilities
* Easy theme management
* Reusable design patterns

### Rejected Alternatives

#### Bootstrap

Rejected because the project requires a custom blue dashboard design rather than a Bootstrap-style interface.

#### Inline CSS

Rejected because it reduces maintainability and consistency.

#### Large custom CSS files

Rejected as the primary styling approach because Tailwind is more efficient for this project.

### Consequence

Do not use Bootstrap and Tailwind together.

Avoid inline styling except where required by third-party map or chart libraries.

---

## DEC-007: Use React Router

### Status

Accepted

### Decision

Use `react-router-dom` for public, protected, and nested routes.

### Required Route Groups

```txt
Public Routes
Protected Farmer Routes
Optional Administrator Routes
Not Found Route
```

### Reason

React Router supports:

* Client-side navigation
* Protected routes
* Nested layouts
* Active menu states
* Route parameters

### Consequence

Use `NavLink` for active navigation styling.

Do not manually switch pages using conditional rendering in `App.jsx`.

---

## DEC-008: Use Axios for API Communication

### Status

Accepted

### Decision

Use Axios for frontend API requests.

### Reason

Axios provides:

* Central API configuration
* Request interceptors
* Response interceptors
* Authentication-header support
* Consistent error handling

### Consequence

Create a shared Axios instance in:

```txt
frontend/src/services/api.js
```

Do not duplicate the API base URL inside page components.

---

## DEC-009: Use React Hook Form

### Status

Accepted

### Decision

Use React Hook Form for important forms.

### Forms

* Registration
* Login
* Add farm
* Edit farm
* Profile
* Change password
* Contact

### Reason

React Hook Form provides:

* Better validation handling
* Reduced re-rendering
* Cleaner form code
* Submission states
* Field-level errors

### Consequence

Do not manually manage every form field using separate state variables unless the form is very small.

---

## DEC-010: Use Lucide React Icons

### Status

Accepted

### Decision

Use `lucide-react` as the main icon library.

### Reason

Lucide icons are:

* Consistent
* Lightweight
* Modern
* Easy to use
* Suitable for dashboards

### Consequence

Do not mix several icon libraries without a clear reason.

---

# 7. User Interface Decisions

## DEC-011: Use a Blue Design System

### Status

Accepted

### Decision

Blue will be the primary application theme.

### Main Colours

```txt
Primary: Blue
Secondary: Sky Blue
Sidebar: Dark Navy
Background: Light Slate
Cards: White
Success: Green
Warning: Amber
Error: Red
```

### Core Values

```txt
Primary: #2563EB
Primary Dark: #1D4ED8
Secondary: #0EA5E9
Sidebar: #0F172A
Background: #F8FAFC
Surface: #FFFFFF
```

### Reason

Blue represents:

* Water
* Irrigation
* Weather
* Technology
* Reliability

### Consequence

Green may be used for success states but must not be the primary theme.

All pages must follow `UI_GUIDELINES.md`.

---

## DEC-012: Use Separate Public and Dashboard Layouts

### Status

Accepted

### Decision

The frontend will use two primary layouts.

### Public Layout

```txt
Navbar
Main Content
Footer
```

Used for:

* Home
* About
* Features
* Contact
* Login
* Register

### Dashboard Layout

```txt
Sidebar
Header
Main Content
```

Used for:

* Dashboard
* Add Farm
* My Farms
* Weather
* Recommendation
* History
* Profile

### Reason

Public and authenticated pages have different navigation and visual requirements.

### Consequence

Create:

```txt
PublicLayout.jsx
DashboardLayout.jsx
```

Do not duplicate layout elements inside every page.

---

## DEC-013: Use Reusable UI Components

### Status

Accepted

### Decision

Common interface elements must use reusable components.

### Required Components

```txt
Button
Input
Select
PasswordInput
Modal
ConfirmDialog
LoadingSpinner
Skeleton
EmptyState
ErrorState
StatusBadge
FarmCard
WeatherCard
RecommendationCard
MapSelector
```

### Reason

Reusable components improve:

* Consistency
* Maintainability
* Testing
* Development speed

### Consequence

Avoid copying the same button, input, card, or modal markup across multiple pages.

---

## DEC-014: Make the Interface Responsive

### Status

Accepted

### Decision

The complete application must support:

```txt
Mobile
Tablet
Laptop
Desktop
```

### Required Test Widths

```txt
320px
375px
425px
768px
1024px
1280px
1440px
```

### Consequence

* Sidebar becomes a drawer on mobile
* Forms become single column
* Cards stack vertically
* Tables become scrollable
* Maps remain interactive
* Touch targets remain usable

---

# 8. Backend Decisions

## DEC-015: Use Python with FastAPI

### Status

Accepted

### Decision

The backend will use:

```txt
Python
FastAPI
Uvicorn
Pydantic
```

### Reason

FastAPI provides:

* Automatic API documentation
* Request validation
* Response validation
* Async support
* Clear route definitions
* Modern Python development

### Rejected Alternatives

#### Flask

Rejected because FastAPI provides stronger built-in validation and documentation.

#### Django

Rejected because Django is unnecessarily large for this REST API prototype.

#### Node.js and Express

Rejected for the final backend because the project has selected Python and FastAPI.

### Consequence

Do not mix Express and FastAPI backend implementations.

---

## DEC-016: Use Layered Backend Architecture

### Status

Accepted

### Decision

The backend will separate:

```txt
Routes
Controllers
Services
Repositories
Schemas
Models
Dependencies
Middleware
Utilities
Configuration
```

### Reason

Layered architecture improves:

* Code organization
* Testing
* Maintainability
* Separation of responsibilities
* Codex understanding

### Consequence

Routes must not contain:

* Database queries
* Weather API logic
* Recommendation rules
* Complex business logic

---

## DEC-017: Use Pydantic Schemas

### Status

Accepted

### Decision

Use Pydantic models for request and response validation.

### Required Schema Types

```txt
UserCreate
UserLogin
UserResponse
FarmCreate
FarmUpdate
FarmResponse
WeatherResponse
RecommendationResponse
```

### Reason

Pydantic provides:

* Automatic validation
* Clear API contracts
* Swagger documentation
* Type safety

### Consequence

Never return raw database documents without converting them into response schemas.

---

## DEC-018: Use HTTPX for External API Calls

### Status

Accepted

### Decision

Use `httpx` for OpenWeather API requests.

### Reason

HTTPX provides:

* Async support
* Timeout configuration
* Structured error handling
* Modern Python API

### Consequence

Weather requests must use explicit timeouts.

Do not make external requests directly inside route files.

---

# 9. Database Decisions

## DEC-019: Use MongoDB

### Status

Accepted

### Decision

Use MongoDB as the primary database.

### Required Collections

```txt
users
farms
weather_history
recommendations
```

### Reason

MongoDB provides:

* Flexible document structures
* Easy integration with Python
* Simple local development
* MongoDB Atlas deployment
* Good support for prototype applications

### Rejected Alternatives

#### MySQL

Rejected because MongoDB better matches the selected project structure and simplifies flexible weather records.

#### PostgreSQL

Rejected because relational features are not necessary for this small prototype.

#### Firebase

Rejected because the backend must demonstrate FastAPI and database integration.

---

## DEC-020: Use Referenced Relationships

### Status

Accepted

### Decision

Use reference-based relationships.

```txt
Farm.userId → User._id

WeatherHistory.farmId → Farm._id

Recommendation.farmId → Farm._id

Recommendation.userId → User._id
```

### Reason

References prevent large embedded user documents and support independent queries.

### Consequence

The backend must verify referenced records and ownership.

---

## DEC-021: Use Timestamps

### Status

Accepted

### Decision

Important records must include timestamps.

### Fields

```txt
createdAt
updatedAt
recordedAt
```

### Consequence

Use UTC timestamps in the database.

Convert dates for display in the frontend.

---

## DEC-022: Use a Unique Email Index

### Status

Accepted

### Decision

The users collection must enforce unique email addresses.

### Reason

Application-level duplicate checks alone are not sufficient.

### Consequence

The backend must handle duplicate-key database errors and return HTTP 409.

---

# 10. Map Decisions

## DEC-023: Use OpenStreetMap with Leaflet

### Status

Accepted

### Decision

Use:

```txt
OpenStreetMap
Leaflet
React Leaflet
```

### Reason

OpenStreetMap is:

* Free
* Open source
* Suitable for college projects
* Easy to integrate
* Available across India

### Rejected Alternative

#### Google Maps

Rejected because it may require billing configuration and API-key management.

### Consequence

The map must display OpenStreetMap attribution.

---

## DEC-024: Use India as Initial Map View

### Status

Accepted

### Decision

The map will initially be centred on India.

```js
const INDIA_CENTER = [20.5937, 78.9629];
```

### Reason

The system is intended for farms in India.

### Consequence

Use a zoom level that displays most of India initially.

---

## DEC-025: Require Map Location Before Farm Submission

### Status

Accepted

### Decision

A farm cannot be created without valid latitude and longitude.

### Reason

Farm coordinates are required for weather retrieval.

### Consequence

The Save Farm button must reject submission when no map location is selected.

---

## DEC-026: Keep Address Fields and Coordinates

### Status

Accepted

### Decision

Store both:

```txt
State
District
Village
Latitude
Longitude
```

### Reason

Coordinates are required for APIs, while textual location fields are easier for users to understand.

### Consequence

Reverse geocoding may be added later but is not required for the MVP.

---

# 11. Weather Decisions

## DEC-027: Use OpenWeather API

### Status

Accepted

### Decision

Use OpenWeather as the external weather provider.

### Required Weather Values

* Temperature
* Humidity
* Wind speed
* Pressure
* Rain probability
* Weather condition
* Weather description

### Reason

OpenWeather provides suitable current-weather and forecast data for prototype use.

### Consequence

Weather response data must be normalized before returning it to the frontend.

---

## DEC-028: Call the Weather API from the Backend

### Status

Accepted

### Decision

The frontend will not call OpenWeather directly.

### Flow

```txt
Frontend sends farm ID
        ↓
Backend loads farm coordinates
        ↓
Backend calls OpenWeather
        ↓
Backend normalizes data
        ↓
Backend returns weather
```

### Reason

This keeps the API key private and centralizes:

* Error handling
* Data normalization
* Ownership validation
* History storage
* Recommendation generation

### Consequence

The OpenWeather API key must exist only in backend environment variables.

---

## DEC-029: Do Not Fabricate Weather Data

### Status

Accepted

### Decision

If the weather API fails, the interface must show an error.

### Reason

Displaying fake live data would make the prototype misleading.

### Consequence

Do not silently use dummy weather values in production components.

Dummy data may be used only in:

* Automated tests
* Seed files
* Explicit demo mode

---

## DEC-030: Save Weather History

### Status

Accepted

### Decision

Successful weather requests may be stored in `weather_history`.

### Reason

History allows:

* Previous weather review
* Dashboard trends
* Recommendation traceability
* Testing database operations

### Consequence

Avoid saving excessive duplicate records from repeated requests within a very short period.

---

# 12. Recommendation Decisions

## DEC-031: Backend Is the Recommendation Source of Truth

### Status

Accepted

### Decision

The backend generates the official irrigation recommendation.

### Reason

Backend logic:

* Cannot be easily manipulated by users
* Is reusable across clients
* Can be tested centrally
* Produces consistent results

### Consequence

Frontend rule files may exist only for display helpers or testing, not for authoritative decisions.

---

## DEC-032: Rain Rule Has Highest Priority

### Status

Accepted

### Decision

Rain probability must be checked before humidity and temperature.

### Reason

Rain may remove the need for irrigation even when temperature is high.

### Example

```txt
Rain probability: 80%
Temperature: 38°C

Result:
No Irrigation Required
```

### Consequence

Do not reorder the rule conditions without updating requirements and tests.

---

## DEC-033: Display Reason and Action

### Status

Accepted

### Decision

Every recommendation must include:

* Status
* Title
* Reason
* Recommended action

### Reason

A simple recommendation title alone does not explain the decision.

### Example

```txt
Recommendation:
Irrigate Today

Reason:
The temperature is above 35°C and rainfall probability is low.

Action:
Consider irrigating the farm today.
```

---

## DEC-034: Display Advisory Disclaimer

### Status

Accepted

### Decision

The recommendation page must state that the result is weather-based advisory information.

### Required Meaning

```txt
The recommendation is based on weather information and predefined rules.
It is not a replacement for professional agricultural guidance.
```

### Reason

The system does not use:

* Soil moisture
* Crop stage
* Soil type
* Expert inspection
* Scientific irrigation calculations

---

# 13. Authentication and Security Decisions

## DEC-035: Use JWT Authentication

### Status

Accepted

### Decision

Use JWT access tokens for protected API requests.

### Reason

JWT is suitable for:

* REST APIs
* Separate frontend and backend
* Stateless authentication
* Protected routes

### Consequence

Protected requests must use:

```txt
Authorization: Bearer <token>
```

---

## DEC-036: Hash Passwords with Bcrypt

### Status

Accepted

### Decision

Passwords must be hashed using bcrypt through a supported password library.

### Reason

Plain passwords must never be stored.

### Consequence

Never log or return:

```txt
password
passwordHash
```

---

## DEC-037: Use Farmer as Default Role

### Status

Accepted

### Decision

All public registrations receive the role:

```txt
farmer
```

### Reason

Users must not be able to assign themselves administrator permissions.

### Consequence

Ignore or reject any public registration request containing `admin`.

---

## DEC-038: Verify Ownership on Every Farm-Specific Operation

### Status

Accepted

### Decision

The backend must confirm that:

```txt
farm.userId == authenticated_user.id
```

before:

* Viewing
* Editing
* Deleting
* Fetching weather
* Generating recommendations
* Viewing history

### Reason

Frontend protection alone does not prevent unauthorized API access.

### Consequence

Return:

```txt
401 Unauthorized
```

for missing authentication.

Return:

```txt
403 Forbidden
```

for unauthorized resource access.

---

## DEC-039: Store Secrets in Environment Variables

### Status

Accepted

### Decision

Store the following outside source code:

```env
MONGODB_URL=
DATABASE_NAME=
JWT_SECRET_KEY=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
OPENWEATHER_API_KEY=
FRONTEND_URL=
```

### Consequence

* Commit `.env.example`
* Do not commit `.env`
* Do not place real keys in documentation
* Do not expose backend secrets to Vite

---

## DEC-040: Restrict CORS

### Status

Accepted

### Decision

Allow only approved frontend origins.

### Development Origin

```txt
http://localhost:5173
```

### Reason

Unrestricted production CORS increases security risk.

### Consequence

Do not use wildcard CORS in production.

---

# 14. API Decisions

## DEC-041: Use REST APIs

### Status

Accepted

### Decision

The backend will expose REST-style HTTP endpoints.

### Reason

REST is:

* Easy to understand
* Easy to test in Postman
* Suitable for React and FastAPI
* Appropriate for CRUD operations

### Rejected Alternative

GraphQL is rejected because it adds unnecessary complexity.

---

## DEC-042: Use API Versioning

### Status

Accepted

### Decision

All application APIs will use:

```txt
/api/v1
```

### Reason

Versioning allows future changes without breaking old clients.

---

## DEC-043: Use Consistent API Responses

### Status

Accepted

### Decision

Use a standard response structure.

### Success

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Operation failed",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

### Reason

Consistent responses simplify frontend handling.

---

## DEC-044: Use Correct HTTP Status Codes

### Status

Accepted

### Required Status Codes

```txt
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```

### Consequence

Do not return HTTP 200 for every failure.

---

# 15. Error-Handling Decisions

## DEC-045: Use User-Friendly Error Messages

### Status

Accepted

### Decision

Frontend messages should be understandable and non-technical.

### Good Example

```txt
Unable to fetch weather information.
Please try again.
```

### Bad Example

```txt
HTTPX ConnectTimeout at weather_service.py line 47
```

### Consequence

Technical details may be logged on the backend but must not be sent to users.

---

## DEC-046: Use Loading, Empty, and Error States

### Status

Accepted

### Decision

Every data-driven page must include:

```txt
Loading state
Success state
Empty state
Error state
```

### Reason

Blank pages create confusion and make the interface look incomplete.

---

## DEC-047: Prevent Duplicate Submissions

### Status

Accepted

### Decision

Disable actions while requests are processing.

### Applies To

* Registration
* Login
* Add farm
* Edit farm
* Delete farm
* Recommendation generation
* Profile update
* Password change

---

# 16. Testing Decisions

## DEC-048: Use Pytest for Backend Testing

### Status

Accepted

### Decision

Use:

* Pytest
* FastAPI TestClient
* HTTPX
* Pytest Asyncio where required

### Main Test Areas

* Authentication
* Farm CRUD
* Ownership
* Weather service
* Recommendation rules
* Validation
* API responses

---

## DEC-049: Use Vitest and React Testing Library

### Status

Accepted

### Decision

Frontend automated tests will use:

* Vitest
* React Testing Library
* Jest DOM

### Main Test Areas

* Forms
* Protected routes
* Cards
* Loading states
* Error states
* Component behaviour

---

## DEC-050: Mock External Weather Requests

### Status

Accepted

### Decision

Automated tests must not call the real OpenWeather API.

### Reason

Real external requests make tests:

* Slow
* Unreliable
* Dependent on internet access
* Dependent on rate limits
* Difficult to reproduce

### Consequence

Use mock weather responses for unit and integration tests.

---

## DEC-051: Use a Separate Test Database

### Status

Accepted

### Decision

Automated backend tests must use a separate database.

Example:

```env
DATABASE_NAME=smart_irrigation_test
```

### Consequence

Do not run automated tests against development or production data.

---

# 17. MVP Decisions

## DEC-052: Build P0 Features First

### Status

Accepted

### Decision

Implement critical features before optional enhancements.

### P0 Features

```txt
Registration
Login
Logout
JWT Authentication
Protected Routes
Dashboard
Farm CRUD
OpenStreetMap
Weather Integration
Recommendation Logic
History
Profile
Responsive UI
Security
Error Handling
```

### Consequence

Do not begin admin reports, SMS alerts, or advanced charts before the core workflow is complete.

---

## DEC-053: Administrator Features Are Optional

### Status

Accepted

### Decision

The administrator role may be implemented after the farmer MVP is complete.

### Reason

Admin functionality increases:

* Routes
* Permissions
* Testing effort
* UI pages
* Project scope

### Consequence

The project is still considered complete without a full administrator dashboard if all farmer P0 features work.

---

## DEC-054: Forecast and Charts Are Optional

### Status

Accepted

### Decision

Five-day forecast and weather charts are P2 enhancements.

### Reason

The main workflow requires current weather and recommendations, not advanced analytics.

### Consequence

Do not delay the MVP to implement charts.

---

# 18. Deployment Decisions

## DEC-055: Keep Frontend and Backend Independently Deployable

### Status

Accepted

### Decision

The frontend and backend must remain separate applications.

### Possible Deployment

```txt
Frontend:
Vercel or Netlify

Backend:
Render or Railway

Database:
MongoDB Atlas
```

### Reason

Separate deployment matches the client-server architecture.

---

## DEC-056: Use MongoDB Atlas for Cloud Database

### Status

Accepted for deployment

### Decision

MongoDB Atlas is the preferred hosted database.

### Reason

MongoDB Atlas provides:

* Free development tier
* Remote connection
* Easy backups
* Cloud hosting compatibility

### Consequence

Local MongoDB may still be used during development.

---

## DEC-057: Use HTTPS in Production

### Status

Accepted

### Decision

Production frontend and backend must use HTTPS.

### Reason

Authentication tokens and user information must be encrypted in transit.

---

# 19. Documentation Decisions

## DEC-058: Use Documentation-Driven Development

### Status

Accepted

### Decision

The project will use structured Markdown files to guide Codex and development.

### Documentation Files

```txt
README.md
AGENTS.md
PRD.md
REQUIREMENTS.md
DECISIONS.md
FEATURES.md
USERS.md
ARCHITECTURE.md
UI_GUIDELINES.md
DATABASE.md
API.md
FRONTEND.md
BACKEND.md
TESTING_PLAN.md
TASKS.md
TODO.md
```

### Reason

Structured documentation provides Codex with:

* Project goals
* Constraints
* Architecture
* Naming
* Technology decisions
* Feature priority
* Testing rules

---

## DEC-059: Keep Documentation Consistent

### Status

Accepted

### Decision

When a major technical choice changes, update all related documents.

### Example

If the backend changes, update:

```txt
DECISIONS.md
ARCHITECTURE.md
REQUIREMENTS.md
PRD.md
BACKEND.md
API.md
TESTING_PLAN.md
```

### Consequence

Do not allow conflicting technologies such as FastAPI in one file and Express in another.

---

# 20. Rejected Decisions

## REJ-001: Use Machine Learning in MVP

Rejected because it adds unnecessary dataset and model complexity.

## REJ-002: Use IoT Hardware in MVP

Rejected because hardware is outside the current project scope.

## REJ-003: Use Google Maps

Rejected because OpenStreetMap is free and sufficient.

## REJ-004: Call OpenWeather Directly from Frontend

Rejected because it exposes the API key.

## REJ-005: Put All Backend Logic in `main.py`

Rejected because it creates unmaintainable code.

## REJ-006: Put All Frontend Logic in `App.jsx`

Rejected because it prevents modular development.

## REJ-007: Store Plain Passwords

Rejected due to critical security risk.

## REJ-008: Trust User IDs from Frontend

Rejected because ownership must come from authenticated backend identity.

## REJ-009: Generate Recommendations When Weather Fails

Rejected because the result would be fabricated.

## REJ-010: Use Green as the Main Theme

Rejected because the approved design system uses blue as the primary theme.

---

# 21. Decision Change Process

A decision may be changed only when:

* A requirement changes
* A selected library becomes incompatible
* A security issue is discovered
* A technical limitation prevents implementation
* Faculty requirements change
* A replacement provides a clear benefit

When changing a decision:

1. Mark the old decision as `Superseded`.
2. Add a new decision.
3. Record the reason.
4. List affected documents.
5. Update affected code and tests.
6. Verify that no documentation conflicts remain.

---

# 22. Codex Implementation Rules

Codex must:

* Follow accepted decisions
* Use React with Vite
* Use Tailwind CSS
* Use FastAPI
* Use MongoDB
* Use OpenStreetMap
* Use OpenWeather through the backend
* Use JWT authentication
* Use bcrypt password hashing
* Use the blue design system
* Keep frontend and backend separate
* Keep routes thin
* Keep business logic in services
* Keep database logic out of React
* Verify farm ownership
* Apply recommendation rules in documented order
* Store secrets in environment variables
* Include loading, empty, success, and error states
* Use reusable components
* Use consistent API responses
* Write tests for critical features
* Mock external APIs during automated testing
* Avoid Machine Learning
* Avoid IoT
* Avoid fabricated weather data
* Avoid exposing secrets
* Avoid monolithic files
* Prioritize P0 features

Codex must not independently replace an accepted technology without updating this document.

---

# 23. Final Decision Summary

The approved implementation is:

```txt
Product:
Weather-based irrigation advisory prototype

Frontend:
React + Vite + Tailwind CSS

Backend:
Python + FastAPI

Database:
MongoDB

Map:
OpenStreetMap + Leaflet

Weather:
OpenWeather API through backend

Authentication:
JWT + bcrypt

Recommendation:
Backend rule-based logic

Theme:
Blue and sky blue with dark navy sidebar

Architecture:
Separated frontend and backend with layered backend

Testing:
Pytest + Vitest + API mocks

Scope:
Farmer-focused MVP without Machine Learning or IoT
```

These decisions must remain consistent across the complete project.
