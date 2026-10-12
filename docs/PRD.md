> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

# Product Requirements Document

## 1. Product Name

**Weather-Based Smart Irrigation Advisory System**

---

# 2. Product Summary

The Weather-Based Smart Irrigation Advisory System is a full-stack web application prototype designed to help farmers make basic irrigation decisions using live weather information.

The system allows farmers to:

* Create an account
* Register one or more farms
* Select farm locations using OpenStreetMap
* Fetch current weather using farm coordinates
* Receive rule-based irrigation recommendations
* View weather and recommendation history
* Manage farm and profile information

The project is intended for academic demonstration and college submission.

It is not intended to replace professional agricultural guidance or real farm-monitoring systems.

---

# 3. Product Vision

Create a simple, reliable, and user-friendly web platform that demonstrates how live weather data and location-based services can support irrigation decisions.

The system should provide a clear workflow:

```txt
Register
   ↓
Login
   ↓
Add Farm
   ↓
Select Location
   ↓
Fetch Weather
   ↓
Generate Recommendation
   ↓
View History
```

The product should appear professional while remaining manageable for a college-level implementation.

---

# 4. Problem Statement

Farmers may irrigate fields without checking current weather conditions or upcoming rainfall.

This can result in:

* Unnecessary irrigation
* Water wastage
* Electricity wastage
* Irrigation immediately before rainfall
* Poor irrigation planning
* Difficulty tracking previous decisions

A simple weather-based advisory application can help users understand whether irrigation may be required based on current conditions.

---

# 5. Proposed Solution

The proposed system provides a web-based dashboard where farmers can:

1. Register and log in.
2. Add farm information.
3. Select the farm location on an India map.
4. Save latitude and longitude.
5. Fetch live weather information.
6. Apply predefined irrigation rules.
7. Display a simple irrigation recommendation.
8. Save weather and recommendation records.
9. Review previous history.

The system uses live weather data but does not use machine learning, IoT sensors, or automatic irrigation control.

---

# 6. Product Goals

The main product goals are:

* Build a complete full-stack web application.
* Demonstrate weather API integration.
* Demonstrate OpenStreetMap integration.
* Generate simple weather-based irrigation recommendations.
* Store user, farm, weather, and recommendation data.
* Provide a responsive farmer dashboard.
* Protect user data with authentication.
* Maintain clean and modular project architecture.
* Make the project easy to explain during viva.
* Create a foundation for future agricultural features.

---

# 7. Non-Goals

The current product will not:

* Use Machine Learning
* Use AI prediction models
* Use soil-moisture sensors
* Control irrigation pumps
* Automate irrigation
* Use satellite images
* Use drone monitoring
* Predict crop yield
* Diagnose crop diseases
* Guarantee irrigation accuracy
* Replace agricultural experts
* Support commercial-scale farm management
* Process payments

These may be considered future enhancements.

---

# 8. Target Users

## Primary User

The primary user is a farmer who wants to:

* Register farms
* Check local weather
* Receive irrigation suggestions
* View previous records

## Secondary User

An optional administrator may:

* View users
* View farms
* View system records
* Manage account status
* Monitor system activity

## Public User

A visitor may:

* View project information
* View features
* Register
* Log in
* Contact support

Detailed user roles are defined in:

```txt
docs/USERS.md
```

---

# 9. User Personas

## Persona 1: Small-Scale Farmer

```txt
Name: Rahul Patil
Location: Maharashtra
Farm Type: Sugarcane
Technical Skill: Basic
Device: Mobile phone
Goal: Check whether irrigation may be required
```

### Needs

* Simple interface
* Clear weather information
* Easy farm registration
* Direct recommendation
* Mobile-friendly design

### Challenges

* Limited technical knowledge
* Dependence on mobile internet
* Difficulty interpreting raw weather data

---

## Persona 2: Multi-Farm Owner

```txt
Name: Amit Sharma
Location: Karnataka
Farm Type: Multiple crops
Technical Skill: Moderate
Device: Mobile and laptop
Goal: Manage multiple farm locations
```

### Needs

* Multiple farm support
* Farm-specific weather
* Farm-specific recommendations
* History filters
* Quick navigation

---

## Persona 3: College Evaluator

```txt
Role: Faculty or project guide
Goal: Review project completeness and technical implementation
```

### Needs

* Clear architecture
* Working authentication
* API integration
* Database operations
* Testing documentation
* Responsive UI
* Easy-to-understand workflow

---

# 10. Product Scope

## Included Features

* Public website
* User registration
* User login
* User logout
* JWT authentication
* Protected routes
* Farmer dashboard
* Profile management
* Change password
* Add farm
* View farms
* Edit farm
* Delete farm
* Farm details
* OpenStreetMap integration
* Latitude and longitude storage
* Current weather
* Rain probability
* Weather history
* Irrigation recommendation
* Recommendation history
* Search and filtering
* Loading states
* Empty states
* Error states
* Responsive design
* Custom 404 page

## Optional Features

* Admin dashboard
* Five-day forecast
* Weather charts
* Export history
* Contact form storage
* Reverse geocoding
* Farm search and crop filter

---

# 11. Core User Journey

## 11.1 First-Time Farmer Journey

```txt
Open Home Page
       │
       ▼
Select Register
       │
       ▼
Create Account
       │
       ▼
Login
       │
       ▼
Open Dashboard
       │
       ▼
Select Add Farm
       │
       ▼
Enter Farm Details
       │
       ▼
Select Location on Map
       │
       ▼
Save Farm
       │
       ▼
Check Weather
       │
       ▼
Generate Recommendation
       │
       ▼
View Result
```

## 11.2 Returning Farmer Journey

```txt
Login
  │
  ▼
Dashboard
  │
  ├── View Latest Weather
  ├── View Recommendation
  ├── Manage Farms
  └── View History
```

---

# 12. Functional Requirements Summary

## Authentication

The product must allow users to:

* Register
* Log in
* Log out
* Restore authentication after refresh
* Handle expired sessions
* Change password

## Farm Management

The product must allow farmers to:

* Add farms
* View farms
* Edit farms
* Delete farms
* Select farm locations
* View farm details
* Manage multiple farms

## Weather

The product must:

* Fetch weather using stored coordinates
* Display current weather
* Display temperature
* Display humidity
* Display wind speed
* Display pressure
* Display rain probability
* Display weather condition
* Save weather history
* Handle weather-service failures

## Recommendation

The product must:

* Generate recommendations using backend rules
* Display recommendation status
* Display reason
* Display recommended action
* Save recommendation history
* Display an advisory disclaimer

## History

The product must:

* Store weather records
* Store recommendation records
* Filter history by farm
* Filter history by date
* Filter history by status
* Display empty states
* Support pagination where required

Complete functional requirements are defined in:

```txt
docs/REQUIREMENTS.md
```

---

# 13. Product Features

## 13.1 Home Page

The home page should contain:

* Navigation bar
* Hero section
* Product description
* Main features
* How it works
* Benefits
* Technology overview
* Call-to-action
* Footer

Main call-to-action:

```txt
Get Started
```

Secondary action:

```txt
Learn More
```

---

## 13.2 Registration

The registration form should contain:

* Full name
* Email
* Mobile number
* Password
* Confirm password
* Terms checkbox
* Create account button

The product should:

* Validate fields
* Reject duplicate email
* Reject weak passwords
* Prevent administrator-role selection
* Display success and error messages

---

## 13.3 Login

The login page should contain:

* Email
* Password
* Remember-me option
* Forgot-password UI
* Login button
* Registration link

The login button must display a loading state.

---

## 13.4 Dashboard

The farmer dashboard should display:

* Welcome card
* Total farms
* Current farm
* Current weather
* Rain probability
* Latest recommendation
* Recent history
* Quick actions

Quick actions:

```txt
Add Farm
View Farms
Check Weather
Get Recommendation
View History
```

---

## 13.5 Add Farm

The Add Farm page should contain:

* Farm name
* Crop name
* Farm area
* Area unit
* State
* District
* Village
* OpenStreetMap
* Latitude
* Longitude
* Save button

The farm cannot be saved without selecting a location.

---

## 13.6 My Farms

The My Farms page should provide:

* Farm cards or table
* Search by farm name
* Crop filter
* View action
* Edit action
* Delete action
* Empty state
* Delete confirmation

---

## 13.7 Farm Details

The Farm Details page should display:

* Farm name
* Crop
* Area
* Full location
* Map marker
* Current weather
* Latest recommendation
* Recent records
* Edit action
* Delete action

---

## 13.8 Weather Page

The Weather page should display:

* Farm selector
* Temperature
* Humidity
* Wind speed
* Pressure
* Rain probability
* Weather condition
* Weather description
* Weather icon
* Last updated time
* Forecast, if implemented
* History chart, if implemented

The page must not display fabricated live data.

---

## 13.9 Recommendation Page

The Recommendation page should display:

* Selected farm
* Weather summary
* Recommendation status
* Reason
* Recommended action
* Generated date
* Advisory disclaimer
* Recommendation history

Possible results:

```txt
No Irrigation Required
Delay Irrigation
Irrigate Today
Monitor Weather
```

---

## 13.10 History Page

The History page should display:

* Date
* Farm
* Temperature
* Humidity
* Rain probability
* Weather condition
* Recommendation
* Status

The page should provide:

* Search
* Farm filter
* Date filter
* Status filter
* Pagination
* Mobile-friendly card view or scrolling table

---

## 13.11 Profile Page

The Profile page should display:

* User name
* Email
* Mobile
* Role
* Account date
* Farm count

The user should be able to:

* Update name
* Update mobile number
* Change password
* Log out

---

# 14. Recommendation Rules

The recommendation engine is rule-based.

Rules must run in this priority:

```txt
1. Rain probability
2. Humidity
3. Temperature
4. Default condition
```

Recommended implementation:

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

## Rule Explanation

### Rain Probability Above 60%

```txt
Result:
No Irrigation Required
```

Reason:

Expected rainfall may provide sufficient water.

### Humidity Above 80%

```txt
Result:
Delay Irrigation
```

Reason:

High humidity may reduce immediate water loss.

### Temperature Above 35°C

```txt
Result:
Irrigate Today
```

Reason:

High temperature may increase water demand.

### Default

```txt
Result:
Monitor Weather
```

Reason:

No critical irrigation condition was detected.

The recommendation is advisory only.

---

# 15. Success Metrics

The product will be considered successful when:

* Users can register successfully.
* Users can log in securely.
* Farmers can add farms.
* Map location selection works.
* Coordinates are stored correctly.
* Weather is fetched using farm coordinates.
* Recommendation rules produce expected results.
* History records are stored.
* Users can access only their own farms.
* The interface works on mobile and desktop.
* Critical workflows pass testing.
* The project is easy to demonstrate.
* Documentation is complete.

---

# 16. Key Performance Indicators

For the prototype, track:

```txt
Successful user registrations
Successful logins
Number of farms created
Weather requests completed
Recommendations generated
Weather records saved
Recommendation records saved
Failed API requests
Average API response time
```

Suggested technical targets:

```txt
Normal API response: under 2 seconds
Weather API response: under 5 seconds
Initial page load: under 3 seconds
Accessibility score: 90 or above
Performance score: 80 or above
```

These are prototype targets, not production guarantees.

---

# 17. User Experience Requirements

The product should be:

* Simple
* Clean
* Responsive
* Easy to navigate
* Consistent
* Accessible
* Mobile-friendly
* Clear for non-technical users

The design should use:

```txt
Primary colour: Blue
Secondary colour: Sky Blue
Sidebar: Dark Navy
Background: Light Slate
Cards: White
Success: Green
Warning: Amber
Error: Red
```

Detailed UI requirements are defined in:

```txt
docs/UI_GUIDELINES.md
```

---

# 18. Navigation

## Public Navigation

```txt
Home
About
Features
Contact
Login
Register
```

## Farmer Navigation

```txt
Dashboard
Add Farm
My Farms
Weather
Recommendation
History
Profile
Logout
```

## Optional Admin Navigation

```txt
Admin Dashboard
Users
Farms
Weather Records
Recommendations
Reports
Settings
Logout
```

---

# 19. Information Architecture

```txt
Public Website
│
├── Home
├── About
├── Features
├── Contact
├── Login
└── Register

Farmer Application
│
├── Dashboard
├── Farms
│   ├── Add Farm
│   ├── My Farms
│   ├── Farm Details
│   └── Edit Farm
├── Weather
├── Recommendation
├── History
└── Profile

Optional Administration
│
├── Admin Dashboard
├── Users
├── Farms
├── Weather Records
├── Recommendations
└── Reports
```

---

# 20. Technical Architecture

The product uses a client-server architecture.

```txt
React Frontend
      │
      ▼
FastAPI REST API
      │
      ├── MongoDB
      ├── OpenWeather API
      └── Rule-Based Recommendation Engine
```

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* React Hook Form
* React Leaflet
* Lucide React

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* Motor or PyMongo
* HTTPX
* Python-JOSE
* Passlib

## Database

* MongoDB

## External Services

* OpenWeather API
* OpenStreetMap

Detailed architecture is defined in:

```txt
docs/ARCHITECTURE.md
```

---

# 21. Data Requirements

The product should use the following collections:

```txt
users
farms
weather_history
recommendations
```

## Users

Store:

* Name
* Email
* Mobile
* Password hash
* Role
* Account status
* Timestamps

## Farms

Store:

* Owner ID
* Farm name
* Crop
* Area
* Location details
* Latitude
* Longitude
* Timestamps

## Weather History

Store:

* Farm ID
* Temperature
* Humidity
* Wind speed
* Pressure
* Rain probability
* Weather condition
* Recorded date

## Recommendations

Store:

* Farm ID
* User ID
* Weather snapshot
* Recommendation
* Status
* Reason
* Action
* Created date

---

# 22. API Requirements

Base path:

```txt
/api/v1
```

## Authentication

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

## User

```txt
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password
```

## Farm

```txt
POST   /api/v1/farms
GET    /api/v1/farms
GET    /api/v1/farms/{farm_id}
PUT    /api/v1/farms/{farm_id}
DELETE /api/v1/farms/{farm_id}
```

## Weather

```txt
GET /api/v1/weather/{farm_id}
GET /api/v1/weather/{farm_id}/forecast
GET /api/v1/weather/{farm_id}/history
```

## Recommendation

```txt
POST /api/v1/recommendations/{farm_id}
GET  /api/v1/recommendations/{farm_id}
GET  /api/v1/recommendations/{farm_id}/history
```

Detailed API specifications should be stored in:

```txt
docs/API.md
```

---

# 23. Security Requirements

The product must:

* Hash passwords
* Use JWT authentication
* Validate every protected request
* Verify farm ownership
* Prevent role escalation
* Store secrets in environment variables
* Keep the weather API key in the backend
* Avoid exposing password hashes
* Avoid exposing stack traces
* Restrict CORS in production
* Use HTTPS in production
* Confirm destructive actions
* Prevent duplicate form submissions

The backend must remain the source of truth for authorization.

---

# 24. Privacy Requirements

The system must protect:

* User email
* User mobile number
* Password hash
* Authentication token
* Farm coordinates
* API keys

The system must not:

* Return passwords
* Return password hashes
* Log tokens
* Log secret keys
* Expose environment variables
* Allow users to view another user's data

---

# 25. Error Handling

The product should handle:

* Invalid registration
* Duplicate email
* Invalid login
* Expired session
* Missing farm
* Unauthorized farm access
* Invalid coordinates
* Weather API failure
* Weather timeout
* Database failure
* Network failure
* Invalid route
* Unexpected server error

User-facing errors should be simple.

Examples:

```txt
Invalid email or password.

Unable to fetch weather information.

Farm not found.

Your session has expired.

You do not have permission to access this resource.

Something went wrong. Please try again.
```

---

# 26. Loading and Empty States

The product must show loading states during:

* Registration
* Login
* Dashboard loading
* Farm loading
* Farm saving
* Weather retrieval
* Recommendation generation
* History retrieval
* Profile updating

The product must show empty states for:

* No farms
* No weather history
* No recommendations
* No search results
* No selected farm

Example:

```txt
No farms added yet.

Add your first farm to begin receiving weather information and irrigation recommendations.
```

---

# 27. Accessibility Requirements

The product should:

* Use semantic HTML
* Provide visible labels
* Support keyboard navigation
* Show focus states
* Add alt text
* Use sufficient colour contrast
* Add accessible labels to icon buttons
* Use correct heading order
* Avoid colour-only status communication
* Support readable validation messages

---

# 28. Responsive Requirements

The product should work at:

```txt
320px
375px
425px
768px
1024px
1280px
1440px
```

## Mobile

* Drawer navigation
* Single-column forms
* Stacked cards
* Full-width actions
* Scrollable tables
* Interactive map

## Desktop

* Fixed sidebar
* Multi-column dashboard
* Larger map
* Larger charts
* Two-column forms where appropriate

---

# 29. Product Constraints

The product depends on:

* Internet connectivity
* OpenWeather API availability
* OpenStreetMap availability
* MongoDB availability
* Weather-data accuracy
* Correct farm coordinates

The product is limited because:

* No soil data is used
* No crop-specific scientific model is used
* No sensor data is used
* Recommendations are rule-based
* The system is a prototype
* Real agricultural decisions require expert judgment

---

# 30. Risks and Mitigation

## Risk 1: Weather API Failure

Impact:

Weather and recommendations may be unavailable.

Mitigation:

* Display clear errors
* Add retry button
* Use timeout handling
* Avoid fabricated data

## Risk 2: Incorrect Coordinates

Impact:

Weather may be fetched for the wrong location.

Mitigation:

* Show marker
* Show coordinates
* Require user confirmation
* Allow map reset

## Risk 3: Unauthorized Data Access

Impact:

User privacy may be compromised.

Mitigation:

* Use JWT
* Check ownership
* Validate every protected endpoint

## Risk 4: Rule Limitations

Impact:

Recommendations may not fit every crop.

Mitigation:

* Display disclaimer
* Clearly state weather-only logic
* Add crop-specific rules in future

## Risk 5: Mobile Layout Problems

Impact:

Farmers may not use the system easily.

Mitigation:

* Mobile-first design
* Test common screen widths
* Keep controls touch-friendly

---

# 31. Product Milestones

## Phase 1: Planning

* Finalize requirements
* Finalize pages
* Finalize architecture
* Define database
* Define APIs
* Define UI system

## Phase 2: Project Setup

* Create frontend
* Create backend
* Configure MongoDB
* Add environment files
* Add routing
* Add shared layouts

## Phase 3: Authentication

* Registration
* Login
* JWT
* Protected routes
* Profile
* Logout

## Phase 4: Farm Management

* Add farm
* View farms
* Edit farm
* Delete farm
* Farm ownership

## Phase 5: Map Integration

* Add OpenStreetMap
* Select location
* Capture coordinates
* Save coordinates
* Display markers

## Phase 6: Weather

* Connect OpenWeather API
* Fetch current weather
* Display weather
* Save history
* Handle failures

## Phase 7: Recommendation

* Implement rules
* Generate recommendation
* Save history
* Display reason and action

## Phase 8: UI Completion

* Dashboard
* History
* Responsive design
* Loading states
* Empty states
* Error states

## Phase 9: Testing

* Unit testing
* API testing
* Integration testing
* UI testing
* Security testing
* Responsive testing

## Phase 10: Submission

* Final documentation
* Screenshots
* Test report
* Demo preparation
* Viva preparation

---

# 32. Release Plan

## MVP Release

The MVP should include:

* Registration
* Login
* Dashboard
* Add farm
* Farm list
* OpenStreetMap
* Current weather
* Recommendation
* History
* Profile
* Logout

## Version 1.1

Possible additions:

* Five-day forecast
* Weather charts
* Better history filters
* Export records
* Improved profile
* Contact form

## Future Version

Possible additions:

* IoT sensors
* Soil-moisture data
* SMS alerts
* Multi-language support
* Mobile application
* Automatic irrigation
* Crop-specific rules
* Machine Learning

---

# 33. Acceptance Criteria

The MVP is accepted when:

* User registration works.
* Duplicate email is rejected.
* User login works.
* JWT authentication protects routes.
* Farmer can create a farm.
* Farm location can be selected.
* Coordinates are stored.
* Farmer can view own farms.
* Farmer cannot view another user's farms.
* Weather is fetched using coordinates.
* Weather is displayed correctly.
* Recommendation rules run correctly.
* Recommendation includes reason and action.
* Weather and recommendation history are stored.
* Profile update works.
* Logout works.
* Mobile layout works.
* Loading and error states are implemented.
* No secret key is exposed.
* Critical tests pass.

---

# 34. Product Dependencies

The product depends on:

## Frontend Dependencies

* React
* React DOM
* React Router DOM
* Axios
* Tailwind CSS
* React Hook Form
* React Leaflet
* Leaflet
* Lucide React
* Recharts or Chart.js
* React Hot Toast

## Backend Dependencies

* FastAPI
* Uvicorn
* Pydantic
* Motor or PyMongo
* HTTPX
* Python-JOSE
* Passlib
* Bcrypt
* Python Dotenv
* Email Validator

## External Services

* MongoDB
* OpenWeather API
* OpenStreetMap

---

# 35. Documentation References

The following files support the PRD:

| Document           | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `REQUIREMENTS.md`  | Functional and non-functional requirements |
| `ARCHITECTURE.md`  | System architecture                        |
| `USERS.md`         | User roles and permissions                 |
| `FEATURES.md`      | Feature details                            |
| `DECISIONS.md`     | Technical decisions                        |
| `UI_GUIDELINES.md` | Design system                              |
| `TESTING_PLAN.md`  | Testing strategy                           |
| `DATABASE.md`      | Database design                            |
| `API.md`           | API documentation                          |
| `FRONTEND.md`      | Frontend implementation                    |
| `BACKEND.md`       | Backend implementation                     |
| `TASKS.md`         | Development tasks                          |
| `TODO.md`          | Pending work                               |

---

# 36. Rules for Codex

Codex must:

* Follow this PRD
* Follow `REQUIREMENTS.md`
* Follow `ARCHITECTURE.md`
* Follow `UI_GUIDELINES.md`
* Use React with Vite
* Use FastAPI
* Use MongoDB
* Use OpenStreetMap
* Use OpenWeather through the backend
* Use blue as the primary theme
* Use JWT authentication
* Hash passwords
* Verify farm ownership
* Keep recommendation logic in the backend
* Avoid hardcoded live weather
* Avoid hardcoded secrets
* Avoid Machine Learning
* Avoid IoT unless explicitly requested
* Use reusable components
* Use modular backend layers
* Handle loading and errors
* Write testable code
* Keep frontend and backend separate
* Avoid placing the full application in one file

When documentation conflicts, use this priority:

```txt
1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. PRD.md
5. UI_GUIDELINES.md
6. FEATURES.md
7. TASKS.md
8. TODO.md
```

---

# 37. Final Product Definition

The completed product is a responsive web application that allows a farmer to:

```txt
Create Account
      ↓
Login
      ↓
Register Farm
      ↓
Select Map Location
      ↓
Fetch Live Weather
      ↓
Receive Irrigation Advice
      ↓
Save and View History
      ↓
Manage Account
```

The final product must be:

* Functional
* Secure
* Modular
* Responsive
* Easy to use
* Easy to test
* Easy to demonstrate
* Suitable for college submission
* Ready for future development
