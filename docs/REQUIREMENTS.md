> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

# Project Requirements

## 1. Document Purpose

This document defines the functional, non-functional, technical, security, data, interface, and system requirements for the **Weather-Based Smart Irrigation Advisory System**.

The application is a college-level full-stack prototype that helps farmers view weather information and receive simple irrigation recommendations based on predefined weather rules.

The project uses:

* React.js frontend
* FastAPI backend
* MongoDB database
* OpenWeather API
* OpenStreetMap with Leaflet
* Rule-based irrigation recommendations

The project does not use:

* Machine Learning
* Artificial Intelligence prediction models
* IoT sensors
* Automatic pump control
* Satellite monitoring
* Real soil-moisture measurements

---

# 2. Project Objective

The main objective of the system is to provide farmers with a simple web application that can:

* Register and manage user accounts
* Register and manage farms
* Select farm locations on an interactive map
* Fetch weather information using farm coordinates
* Generate weather-based irrigation recommendations
* Store weather and recommendation history
* Display all information through a responsive dashboard

The system is intended as an advisory prototype and not as a commercial agricultural decision system.

---

# 3. Project Scope

## 3.1 Included Scope

The system includes:

* Public website
* User registration
* User login and logout
* JWT authentication
* Farmer dashboard
* Farmer profile
* Farm registration
* Farm editing
* Farm deletion
* Farm list
* Farm details
* OpenStreetMap integration
* Latitude and longitude selection
* Live weather API integration
* Current weather display
* Rain probability display
* Rule-based irrigation recommendation
* Weather history
* Recommendation history
* Responsive interface
* Error handling
* Form validation

## 3.2 Excluded Scope

The system does not include:

* Machine Learning
* Deep Learning
* AI prediction
* Soil-moisture sensors
* IoT devices
* Automatic irrigation
* Pump control
* Satellite data
* Drone monitoring
* Payment systems
* Government identity verification
* Real-time commercial farm monitoring
* Guaranteed agricultural recommendations

---

# 4. User Roles

The application supports the following roles:

```txt
Visitor
Farmer
Administrator
```

The administrator role is optional for the initial prototype.

## 4.1 Visitor

A visitor can:

* View the home page
* View the About page
* View project features
* Open the Contact page
* Register an account
* Log in

A visitor cannot:

* Access the dashboard
* Add farms
* View weather for registered farms
* Generate recommendations
* View history
* Access profile information

## 4.2 Farmer

A farmer can:

* Register
* Log in
* Log out
* View dashboard
* Add farms
* View owned farms
* Edit owned farms
* Delete owned farms
* Select farm locations
* View weather
* Generate recommendations
* View history
* Update profile
* Change password

## 4.3 Administrator

An administrator may:

* View all users
* View all farms
* View weather records
* View recommendations
* Activate or deactivate accounts
* View system statistics

---

# 5. Functional Requirements

## 5.1 Public Website

The application shall provide the following public pages:

```txt
Home
About
Features
Contact
Login
Register
Not Found
```

### FR-PUB-01

The system shall display a home page containing:

* Project title
* Project description
* Main features
* How the system works
* Benefits
* Call-to-action buttons
* Footer

### FR-PUB-02

The system shall display an About page containing:

* Problem statement
* Objectives
* Proposed solution
* Scope
* Technology stack
* Limitations
* Future scope

### FR-PUB-03

The system shall provide navigation links to public pages.

### FR-PUB-04

The system shall display a custom 404 page for invalid routes.

---

# 6. Authentication Requirements

## 6.1 User Registration

### FR-AUTH-01

The system shall allow a visitor to register an account.

### FR-AUTH-02

The registration form shall include:

* Full name
* Email address
* Mobile number
* Password
* Confirm password
* Terms acceptance checkbox

### FR-AUTH-03

The system shall validate all required registration fields.

### FR-AUTH-04

The system shall validate the email format.

### FR-AUTH-05

The system shall prevent duplicate email registration.

### FR-AUTH-06

The system shall verify that password and confirm password match.

### FR-AUTH-07

The system shall hash passwords before storing them.

### FR-AUTH-08

The system shall assign the default role:

```txt
farmer
```

### FR-AUTH-09

The public registration form shall not allow users to choose the administrator role.

### FR-AUTH-10

The system shall display a success message after registration.

---

## 6.2 User Login

### FR-AUTH-11

The system shall allow registered users to log in using:

* Email
* Password

### FR-AUTH-12

The system shall validate user credentials.

### FR-AUTH-13

The system shall return an authentication token after successful login.

### FR-AUTH-14

The system shall redirect authenticated farmers to the dashboard.

### FR-AUTH-15

The system shall reject incorrect credentials.

### FR-AUTH-16

The system shall display a user-friendly login error.

### FR-AUTH-17

The login button shall be disabled while the request is being processed.

---

## 6.3 User Logout

### FR-AUTH-18

The system shall allow authenticated users to log out.

### FR-AUTH-19

The system shall clear authentication data after logout.

### FR-AUTH-20

The system shall redirect users to the login or home page after logout.

### FR-AUTH-21

Protected pages shall not remain accessible after logout.

---

## 6.4 Session Management

### FR-AUTH-22

The application shall restore the authenticated user after page refresh when the token is valid.

### FR-AUTH-23

The system shall reject expired tokens.

### FR-AUTH-24

The system shall redirect users to login when their session expires.

### FR-AUTH-25

The system shall display:

```txt
Your session has expired. Please log in again.
```

---

# 7. User Profile Requirements

### FR-USR-01

The system shall provide a profile page for authenticated users.

### FR-USR-02

The profile page shall display:

* Full name
* Email
* Mobile number
* Role
* Account creation date
* Number of farms

### FR-USR-03

The farmer shall be able to update:

* Full name
* Mobile number

### FR-USR-04

The system shall validate updated profile information.

### FR-USR-05

The system shall provide a change-password function.

### FR-USR-06

Changing the password shall require:

* Current password
* New password
* Confirm new password

### FR-USR-07

The system shall never display or return the stored password hash.

---

# 8. Dashboard Requirements

### FR-DASH-01

The system shall provide a dashboard for authenticated farmers.

### FR-DASH-02

The dashboard shall display:

* Welcome message
* Farmer name
* Total farms
* Selected farm
* Current weather
* Rain probability
* Latest recommendation
* Recent weather history
* Recent recommendation history
* Quick actions

### FR-DASH-03

The dashboard shall provide quick actions for:

```txt
Add Farm
View Farms
Check Weather
Get Recommendation
View History
Update Profile
```

### FR-DASH-04

The dashboard shall display an empty state when the user has no farms.

### FR-DASH-05

The dashboard shall display loading indicators while fetching data.

### FR-DASH-06

A failure in one dashboard module shall not make the complete dashboard unusable.

---

# 9. Farm Management Requirements

## 9.1 Add Farm

### FR-FARM-01

The system shall allow an authenticated farmer to register a farm.

### FR-FARM-02

The farm form shall include:

* Farm name
* Crop name
* Farm area
* Area unit
* State
* District
* Village
* Latitude
* Longitude

### FR-FARM-03

The system shall require all mandatory farm fields.

### FR-FARM-04

The system shall validate that farm area is greater than zero.

### FR-FARM-05

The system shall associate every farm with the authenticated user.

### FR-FARM-06

The system shall not allow a farm to be created without a selected location.

### FR-FARM-07

The system shall display a success message after farm creation.

---

## 9.2 View Farms

### FR-FARM-08

The system shall display all farms owned by the authenticated farmer.

### FR-FARM-09

The farmer shall not see farms owned by other users.

### FR-FARM-10

The farm list shall display:

* Farm name
* Crop name
* Area
* State
* District
* Village
* Coordinates
* Available actions

### FR-FARM-11

The farm list shall support searching by farm name.

### FR-FARM-12

The farm list may support filtering by crop.

### FR-FARM-13

The system shall display an empty state when no farms exist.

---

## 9.3 View Farm Details

### FR-FARM-14

The system shall provide a farm-details page.

### FR-FARM-15

The farm-details page shall display:

* Farm information
* Crop information
* Area
* Location information
* Map marker
* Current weather
* Latest recommendation
* Recent history

### FR-FARM-16

The backend shall verify ownership before returning farm details.

---

## 9.4 Edit Farm

### FR-FARM-17

The system shall allow farmers to edit their own farms.

### FR-FARM-18

The farmer shall be able to update:

* Farm name
* Crop name
* Area
* Area unit
* State
* District
* Village
* Latitude
* Longitude

### FR-FARM-19

The system shall reject invalid updates.

### FR-FARM-20

The system shall reject updates to farms owned by another user.

### FR-FARM-21

The system shall display a success message after an update.

---

## 9.5 Delete Farm

### FR-FARM-22

The system shall allow farmers to delete their own farms.

### FR-FARM-23

The system shall display a confirmation dialog before deletion.

### FR-FARM-24

The system shall cancel deletion when the user selects Cancel.

### FR-FARM-25

The system shall reject deletion of another user's farm.

### FR-FARM-26

The deleted farm shall be removed from the farm list.

---

# 10. Map Requirements

### FR-MAP-01

The application shall use:

* Leaflet
* React Leaflet
* OpenStreetMap

### FR-MAP-02

The map shall initially display India.

Recommended centre:

```js
const INDIA_CENTER = [20.5937, 78.9629];
```

### FR-MAP-03

The user shall be able to click on the map to select a location.

### FR-MAP-04

The system shall place a marker at the selected location.

### FR-MAP-05

Selecting another location shall move the marker.

### FR-MAP-06

The system shall display the selected:

* Latitude
* Longitude

### FR-MAP-07

The coordinates shall be stored with the farm.

### FR-MAP-08

The map shall display a loading state while initializing.

### FR-MAP-09

The map shall display an error state if it cannot load.

### FR-MAP-10

The map shall remain usable on mobile devices.

### FR-MAP-11

The user shall be able to reset the selected location.

### FR-MAP-12

Latitude shall be between:

```txt
-90 and 90
```

### FR-MAP-13

Longitude shall be between:

```txt
-180 and 180
```

---

# 11. Weather Requirements

## 11.1 Weather Retrieval

### FR-WEA-01

The backend shall retrieve live weather information using the farm's latitude and longitude.

### FR-WEA-02

The frontend shall send the farm ID to the backend.

### FR-WEA-03

The backend shall verify farm ownership.

### FR-WEA-04

The backend shall retrieve coordinates from the stored farm record.

### FR-WEA-05

The backend shall call the OpenWeather API.

### FR-WEA-06

The frontend shall not directly contain the private weather API key.

### FR-WEA-07

The system shall not use hardcoded weather values as live data.

---

## 11.2 Weather Display

### FR-WEA-08

The weather page shall display:

* Temperature
* Humidity
* Wind speed
* Pressure
* Rain probability
* Weather condition
* Weather description
* Weather icon
* Last updated time

### FR-WEA-09

The system may display:

* Sunrise
* Sunset
* Weather forecast
* Weather history chart

### FR-WEA-10

The system shall display correct units.

Examples:

```txt
Temperature: 34°C
Humidity: 68%
Wind Speed: 12 km/h
Rain Probability: 40%
```

### FR-WEA-11

The system shall display `Not available` when an optional value is missing.

### FR-WEA-12

The system shall save retrieved weather information in weather history.

### FR-WEA-13

The system shall display loading states while weather data is being fetched.

### FR-WEA-14

The system shall display a clear error when weather data cannot be retrieved.

### FR-WEA-15

The system shall never create a fake recommendation when weather data is unavailable.

---

# 12. Recommendation Requirements

## 12.1 Recommendation Engine

### FR-REC-01

The system shall generate irrigation recommendations using predefined rules.

### FR-REC-02

The recommendation engine shall use:

* Rain probability
* Humidity
* Temperature

### FR-REC-03

The recommendation rules shall be stored in the backend.

### FR-REC-04

The frontend shall not be the source of truth for recommendation decisions.

### FR-REC-05

The rule order shall be:

```txt
1. Rain probability
2. Humidity
3. Temperature
4. Default rule
```

### FR-REC-06

The following rules shall be applied:

```txt
If rain probability > 60%
→ No Irrigation Required

Else if humidity > 80%
→ Delay Irrigation

Else if temperature > 35°C
→ Irrigate Today

Else
→ Monitor Weather
```

### FR-REC-07

Rain probability shall be checked first because expected rainfall may remove the need for irrigation.

---

## 12.2 Recommendation Output

### FR-REC-08

The recommendation response shall include:

* Farm ID
* Farm name
* Weather summary
* Recommendation status
* Recommendation title
* Reason
* Recommended action
* Creation date

### FR-REC-09

Possible recommendation values shall include:

```txt
No Irrigation Required
Delay Irrigation
Irrigate Today
Monitor Weather
```

### FR-REC-10

The recommendation page shall display:

* Selected farm
* Current weather
* Recommendation
* Reason
* Suggested action
* Advisory disclaimer

### FR-REC-11

The system shall save generated recommendations.

### FR-REC-12

The system shall display a loading state while generating a recommendation.

### FR-REC-13

The system shall display a clear error if recommendation generation fails.

### FR-REC-14

The interface shall display the disclaimer:

```txt
This recommendation is based on weather information and predefined rules.
It should be treated as an advisory and not as a replacement for professional agricultural guidance.
```

---

# 13. History Requirements

## 13.1 Weather History

### FR-HIS-01

The system shall store weather records for registered farms.

### FR-HIS-02

Weather history shall include:

* Farm
* Temperature
* Humidity
* Wind speed
* Rain probability
* Weather condition
* Date

### FR-HIS-03

Farmers shall view only the history of their own farms.

---

## 13.2 Recommendation History

### FR-HIS-04

The system shall store generated recommendations.

### FR-HIS-05

Recommendation history shall include:

* Date
* Farm
* Weather summary
* Recommendation
* Reason
* Suggested action
* Status

### FR-HIS-06

The history page shall support filtering by:

* Farm
* Date
* Recommendation status

### FR-HIS-07

The history page shall display an empty state when no records exist.

### FR-HIS-08

The history page shall support pagination when necessary.

### FR-HIS-09

Tables shall be horizontally scrollable on small screens.

---

# 14. Navigation Requirements

## 14.1 Public Navigation

The public menu shall include:

```txt
Home
About
Features
Contact
Login
Register
```

## 14.2 Farmer Navigation

The authenticated sidebar shall include:

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

## 14.3 Administrator Navigation

Optional administrator navigation:

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

### FR-NAV-01

The application shall use React Router.

### FR-NAV-02

The active route shall be visually highlighted.

### FR-NAV-03

Protected routes shall redirect unauthenticated users to login.

### FR-NAV-04

The application shall provide mobile navigation.

### FR-NAV-05

The sidebar shall collapse into a drawer on mobile devices.

---

# 15. Protected Route Requirements

The following routes shall require authentication:

```txt
/dashboard
/farms
/farms/add
/farms/:farmId
/farms/:farmId/edit
/weather
/recommendation
/history
/profile
```

### FR-SEC-01

The frontend shall prevent unauthenticated navigation to protected pages.

### FR-SEC-02

The backend shall verify authentication independently.

### FR-SEC-03

Frontend route protection shall not be considered sufficient authorization.

### FR-SEC-04

The backend shall return HTTP 401 for missing or invalid authentication.

### FR-SEC-05

The backend shall return HTTP 403 for forbidden resource access.

---

# 16. API Requirements

The API base path shall be:

```txt
/api/v1
```

## 16.1 Authentication APIs

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

## 16.2 User APIs

```txt
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password
```

## 16.3 Farm APIs

```txt
POST   /api/v1/farms
GET    /api/v1/farms
GET    /api/v1/farms/{farm_id}
PUT    /api/v1/farms/{farm_id}
DELETE /api/v1/farms/{farm_id}
```

## 16.4 Weather APIs

```txt
GET /api/v1/weather/{farm_id}
GET /api/v1/weather/{farm_id}/forecast
GET /api/v1/weather/{farm_id}/history
```

## 16.5 Recommendation APIs

```txt
POST /api/v1/recommendations/{farm_id}
GET  /api/v1/recommendations/{farm_id}
GET  /api/v1/recommendations/{farm_id}/history
```

### API-REQ-01

All protected endpoints shall verify JWT authentication.

### API-REQ-02

Farm-specific endpoints shall verify ownership.

### API-REQ-03

The backend shall validate request data using Pydantic.

### API-REQ-04

The API shall use correct HTTP status codes.

### API-REQ-05

The API shall return consistent response structures.

---

# 17. Standard API Response Requirements

## 17.1 Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## 17.2 Error Response

```json
{
  "success": false,
  "message": "Operation failed",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

## 17.3 Validation Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### API-REQ-06

Responses shall not expose:

* Passwords
* Password hashes
* JWT secrets
* API keys
* Stack traces
* Database connection strings
* Internal file paths

---

# 18. Database Requirements

The application shall use MongoDB.

Required collections:

```txt
users
farms
weather_history
recommendations
```

## 18.1 Users Collection

Required fields:

```txt
_id
name
email
mobile
passwordHash
role
isActive
createdAt
updatedAt
```

Requirements:

* Email shall be unique
* Email shall be stored in lowercase
* Password shall be stored only as a hash
* Default role shall be farmer

## 18.2 Farms Collection

Required fields:

```txt
_id
userId
farmName
cropName
area
areaUnit
state
district
village
latitude
longitude
createdAt
updatedAt
```

Requirements:

* Every farm shall reference a user
* userId shall identify the owner
* Coordinates shall be numbers

## 18.3 Weather History Collection

Required fields:

```txt
_id
farmId
temperature
humidity
windSpeed
pressure
rainProbability
weatherCondition
weatherDescription
recordedAt
```

## 18.4 Recommendations Collection

Required fields:

```txt
_id
farmId
userId
weatherSnapshot
status
recommendation
reason
recommendedAction
createdAt
```

---

# 19. Data Relationship Requirements

The data relationships shall be:

```txt
User
  └── One-to-Many Farms

Farm
  ├── One-to-Many Weather Records
  └── One-to-Many Recommendations
```

Reference mapping:

```txt
Farm.userId → User._id

WeatherHistory.farmId → Farm._id

Recommendation.farmId → Farm._id

Recommendation.userId → User._id
```

### DATA-REQ-01

The backend shall verify ownership using the authenticated user ID.

### DATA-REQ-02

The system shall not rely on a user ID supplied by the frontend for ownership.

### DATA-REQ-03

The system shall create timestamps for new records.

### DATA-REQ-04

The system shall update `updatedAt` when editable records change.

---

# 20. Validation Requirements

## 20.1 User Validation

### Name

* Required
* Minimum 2 characters
* Maximum 100 characters
* Leading and trailing spaces removed

### Email

* Required
* Valid format
* Lowercase
* Unique

### Mobile Number

* Required or optional according to implementation
* Valid Indian mobile format
* Normally 10 digits
* Must not contain letters

### Password

* Minimum 8 characters
* At least one uppercase letter
* At least one lowercase letter
* At least one number
* Confirm password must match

---

## 20.2 Farm Validation

### Farm Name

* Required
* Minimum 2 characters
* Maximum 100 characters

### Crop Name

* Required
* Minimum 2 characters

### Area

* Required
* Numeric
* Greater than zero

### Area Unit

Allowed values may include:

```txt
acre
hectare
square metre
```

### State

* Required

### District

* Required

### Village

* Required

### Latitude

* Required
* Numeric
* Between -90 and 90

### Longitude

* Required
* Numeric
* Between -180 and 180

---

# 21. User Interface Requirements

The complete application shall follow the blue design system defined in:

```txt
docs/UI_GUIDELINES.md
```

## 21.1 Colour Requirements

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

## 21.2 Layout Requirements

Public pages shall use:

```txt
Navbar
Main Content
Footer
```

Protected pages shall use:

```txt
Sidebar
Header
Main Content
```

## 21.3 Component Requirements

The frontend shall provide reusable components such as:

```txt
Navbar
Footer
Sidebar
Header
Button
Input
Select
Modal
Loader
EmptyState
ErrorState
StatusBadge
WeatherCard
FarmCard
RecommendationCard
MapSelector
HistoryTable
ProtectedRoute
```

## 21.4 Form Requirements

Forms shall include:

* Visible labels
* Required indicators
* Placeholder text
* Validation messages
* Loading states
* Disabled states
* Focus states
* Submit feedback

---

# 22. Loading Requirements

The system shall display loading states when:

* Registering
* Logging in
* Fetching profile
* Loading dashboard
* Loading farms
* Saving farm
* Updating farm
* Deleting farm
* Loading map
* Fetching weather
* Generating recommendation
* Loading history
* Updating profile
* Changing password

Buttons shall be disabled while forms are submitting.

---

# 23. Empty-State Requirements

The application shall provide empty states for:

* No farms
* No weather records
* No recommendations
* No search results
* No selected farm
* No forecast data

Example:

```txt
No farms added yet.

Add your first farm to start receiving weather information and irrigation recommendations.
```

---

# 24. Error-Handling Requirements

The system shall handle:

* Invalid form input
* Duplicate email
* Invalid login
* Expired session
* Missing farm
* Unauthorized access
* Invalid coordinates
* MongoDB connection failure
* Weather API failure
* Weather API timeout
* Invalid API key
* Network failure
* Unexpected server failure

User-facing messages shall be clear and non-technical.

Examples:

```txt
Unable to connect to the server.

Unable to fetch weather information.

Farm not found.

You do not have permission to access this resource.

Something went wrong. Please try again.
```

The system shall not expose technical stack traces.

---

# 25. Security Requirements

## SEC-REQ-01

Passwords shall be hashed using a secure hashing method such as bcrypt.

## SEC-REQ-02

Plain passwords shall never be stored.

## SEC-REQ-03

JWT tokens shall have an expiration time.

## SEC-REQ-04

JWT secrets shall be stored in environment variables.

## SEC-REQ-05

The OpenWeather API key shall be stored in backend environment variables.

## SEC-REQ-06

The frontend shall never contain secret API keys.

## SEC-REQ-07

Every protected backend endpoint shall verify authentication.

## SEC-REQ-08

Farm ownership shall be verified before viewing, updating, or deleting a farm.

## SEC-REQ-09

The system shall prevent users from assigning themselves an administrator role.

## SEC-REQ-10

Sensitive values shall not be logged.

## SEC-REQ-11

CORS shall allow only approved frontend origins.

## SEC-REQ-12

The production system shall use HTTPS.

## SEC-REQ-13

Destructive actions shall require confirmation.

## SEC-REQ-14

Duplicate form submissions shall be prevented.

---

# 26. Environment Variable Requirements

Backend environment variables:

```env
MONGODB_URL=
DATABASE_NAME=
JWT_SECRET_KEY=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
OPENWEATHER_API_KEY=
FRONTEND_URL=
```

Frontend environment variables:

```env
VITE_API_BASE_URL=
```

Requirements:

* `.env` shall not be committed
* `.env.example` shall be committed
* No real secret shall appear in documentation
* No secret shall be hardcoded in source code

---

# 27. Non-Functional Requirements

## 27.1 Performance

### NFR-PER-01

Normal API responses should complete within approximately 2 seconds under normal development conditions.

### NFR-PER-02

Weather API responses should complete within approximately 5 seconds.

### NFR-PER-03

The initial page should load within approximately 3 seconds on a normal connection.

### NFR-PER-04

The frontend should avoid unnecessary re-rendering.

### NFR-PER-05

The application should avoid repeated weather API calls when the same fresh data is already available.

---

## 27.2 Responsiveness

### NFR-RES-01

The application shall support:

* Mobile
* Tablet
* Laptop
* Desktop

### NFR-RES-02

The interface shall be tested at:

```txt
320px
375px
425px
768px
1024px
1280px
1440px
```

### NFR-RES-03

Forms shall use a single-column layout on mobile.

### NFR-RES-04

Dashboard cards shall stack on smaller screens.

### NFR-RES-05

Tables shall scroll horizontally on mobile.

### NFR-RES-06

The map shall remain interactive on mobile.

---

## 27.3 Accessibility

### NFR-ACC-01

Every form field shall have a visible label.

### NFR-ACC-02

Icon-only buttons shall use accessible labels.

### NFR-ACC-03

Keyboard navigation shall be supported.

### NFR-ACC-04

Focus indicators shall be visible.

### NFR-ACC-05

Images shall contain alt text.

### NFR-ACC-06

Status shall not be communicated using colour alone.

### NFR-ACC-07

The application should target a Lighthouse accessibility score of 90 or above.

---

## 27.4 Compatibility

The application shall support recent versions of:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox

Optional support:

* Safari
* Android Chrome
* iOS Safari

---

## 27.5 Maintainability

### NFR-MNT-01

The application shall use reusable components.

### NFR-MNT-02

Frontend API logic shall be separated into services.

### NFR-MNT-03

Backend routes shall not contain business logic.

### NFR-MNT-04

Database logic should be separated into repositories where implemented.

### NFR-MNT-05

Recommendation logic shall exist in one backend module.

### NFR-MNT-06

The code shall use meaningful names.

### NFR-MNT-07

The project shall follow the architecture defined in:

```txt
docs/ARCHITECTURE.md
```

---

## 27.6 Reliability

### NFR-REL-01

The application shall display an error instead of crashing when an API fails.

### NFR-REL-02

Missing values shall display safe fallback text.

### NFR-REL-03

The system shall not display:

```txt
undefined
null
NaN
[object Object]
```

### NFR-REL-04

The application shall preserve valid user data during normal navigation.

### NFR-REL-05

Database failures shall be handled gracefully.

---

## 27.7 Usability

### NFR-USA-01

Navigation shall be simple and consistent.

### NFR-USA-02

Buttons shall use clear labels.

### NFR-USA-03

Forms shall provide field-level errors.

### NFR-USA-04

Success and error feedback shall be visible.

### NFR-USA-05

The user shall not need technical knowledge to use the system.

### NFR-USA-06

The application shall use consistent terminology.

---

# 28. Technology Requirements

## Frontend

Required:

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Hook Form
* React Leaflet
* Leaflet
* Lucide React

Optional:

* Recharts
* Chart.js
* React Hot Toast

## Backend

Required:

* Python
* FastAPI
* Uvicorn
* Pydantic
* Motor or PyMongo
* Passlib
* Python-JOSE
* HTTPX
* Python Dotenv

## Database

* MongoDB local or MongoDB Atlas

## External Services

* OpenWeather API
* OpenStreetMap

---

# 29. Folder-Structure Requirements

## Frontend Structure

```txt
frontend/src/
├── assets/
├── components/
├── pages/
├── layouts/
├── routes/
├── services/
├── context/
├── hooks/
├── utils/
├── App.jsx
├── main.jsx
└── index.css
```

## Backend Structure

```txt
backend/app/
├── main.py
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── models/
├── schemas/
├── middleware/
├── dependencies/
└── utils/
```

## Documentation Structure

```txt
docs/
├── README.md
├── AGENTS.md
├── REQUIREMENTS.md
├── DECISIONS.md
├── FEATURES.md
├── USERS.md
├── TESTING_PLAN.md
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
├── FRONTEND.md
├── BACKEND.md
├── UI_GUIDELINES.md
├── TASKS.md
└── TODO.md
```

---

# 30. Testing Requirements

Testing shall follow:

```txt
docs/TESTING_PLAN.md
```

Required testing areas:

* Registration
* Login
* Logout
* JWT authentication
* Profile
* Farm CRUD
* Farm ownership
* Map interaction
* Weather API
* Recommendation rules
* History
* Responsive layout
* Error handling
* Security
* Accessibility

Testing tools may include:

* Pytest
* FastAPI TestClient
* HTTPX
* Vitest
* React Testing Library
* Postman
* Swagger UI
* Lighthouse

External weather requests shall be mocked during automated unit tests.

---

# 31. Acceptance Criteria

## Registration

* Valid user can register
* Duplicate email is rejected
* Invalid email is rejected
* Password mismatch is rejected
* Password is hashed
* Default role is farmer

## Login

* Valid user can log in
* Invalid credentials are rejected
* Token is returned
* User is redirected to dashboard
* Expired token is rejected

## Farm Management

* Farmer can add a farm
* Location is required
* Coordinates are stored
* Farmer can view owned farms
* Farmer can edit owned farms
* Farmer can delete owned farms
* Farmer cannot access another user's farm

## Weather

* Weather is fetched using saved coordinates
* API key is hidden from frontend
* Weather values are displayed with units
* Weather history is stored
* API failures are handled

## Recommendation

* Rules run in correct priority
* Rain above 60% returns No Irrigation Required
* Humidity above 80% returns Delay Irrigation
* Temperature above 35°C returns Irrigate Today
* Default returns Monitor Weather
* Recommendation includes reason and action
* Recommendation is stored in history

## Interface

* Blue design system is followed
* Mobile layout works
* Loading states appear
* Empty states appear
* Error states appear
* Navigation works
* Protected routes work

---

# 32. Project Constraints

The project is constrained by:

* Dependence on internet connectivity
* Dependence on weather API availability
* Dependence on weather forecast accuracy
* No soil-moisture measurements
* No crop-specific scientific calculation
* No automatic irrigation control
* Rule-based advisory only
* Limited academic project timeline
* Limited development and deployment budget

The system must not be presented as a guaranteed agricultural decision tool.

---

# 33. Future Requirements

Future versions may add:

* Soil-moisture sensors
* IoT devices
* Crop-specific rules
* Automatic pump control
* Machine Learning prediction
* SMS notifications
* WhatsApp notifications
* Multi-language support
* Mobile application
* Admin dashboard
* Regional weather alerts
* Government agriculture integration
* Report export
* Redis caching
* Role-based agricultural experts
* Fertigation recommendations
* Yield estimation

These features are outside the current implementation scope.

---

# 34. Requirements Traceability

| Requirement Area           | Related Document   |
| -------------------------- | ------------------ |
| User roles and permissions | `USERS.md`         |
| System architecture        | `ARCHITECTURE.md`  |
| UI and design system       | `UI_GUIDELINES.md` |
| Testing strategy           | `TESTING_PLAN.md`  |
| Technical decisions        | `DECISIONS.md`     |
| Complete features          | `FEATURES.md`      |
| Database details           | `DATABASE.md`      |
| API endpoints              | `API.md`           |
| Frontend implementation    | `FRONTEND.md`      |
| Backend implementation     | `BACKEND.md`       |
| Development tasks          | `TASKS.md`         |
| Pending work               | `TODO.md`          |

---

# 35. Rules for Codex

Codex must follow these requirements:

* Use React with Vite for the frontend
* Use FastAPI for the backend
* Use MongoDB for storage
* Use OpenStreetMap with Leaflet
* Use OpenWeather through the backend
* Keep the weather API key private
* Use blue as the primary UI theme
* Use reusable React components
* Use JWT authentication
* Hash all passwords
* Validate every request
* Verify farm ownership
* Keep business logic out of routes
* Keep database queries out of React
* Keep recommendation logic in the backend
* Apply rules in the correct priority
* Do not add Machine Learning
* Do not add IoT unless explicitly requested
* Do not fabricate weather data
* Do not expose sensitive information
* Include loading, empty, and error states
* Follow the architecture and UI documentation
* Write testable, modular code
* Use environment variables
* Do not generate the project as one large file

---

# 36. Final Requirement Summary

The final system must allow a farmer to complete this workflow:

```txt
Register
   ↓
Login
   ↓
Open Dashboard
   ↓
Add Farm
   ↓
Select Farm Location
   ↓
Save Coordinates
   ↓
Fetch Weather
   ↓
Generate Recommendation
   ↓
Save Weather and Recommendation
   ↓
View History
   ↓
Manage Profile
   ↓
Logout
```

The completed application must be:

* Functional
* Secure
* Responsive
* Modular
* Easy to use
* Easy to test
* Easy to explain during viva
* Suitable for college submission
* Ready for future expansion
