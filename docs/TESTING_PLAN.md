> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

# Testing Plan

## 1. Document Purpose

This document defines the testing strategy for the **Weather-Based Smart Irrigation Advisory System**.

The purpose of testing is to verify that the application:

* Works according to the defined requirements
* Handles valid and invalid inputs correctly
* Protects authenticated resources
* Fetches weather data correctly
* Generates irrigation recommendations using predefined rules
* Stores and retrieves application data correctly
* Works on desktop, tablet, and mobile devices
* Displays appropriate loading, success, empty, and error states

The system is a college-level full-stack prototype built using:

* React.js
* Vite
* Tailwind CSS
* FastAPI
* MongoDB
* OpenWeather API
* OpenStreetMap
* Leaflet

---

# 2. Testing Objectives

The main testing objectives are:

1. Verify user registration and login.
2. Verify JWT-based authentication.
3. Verify role-based access control.
4. Verify farm creation, viewing, editing, and deletion.
5. Verify farm ownership protection.
6. Verify OpenStreetMap location selection.
7. Verify latitude and longitude handling.
8. Verify weather API integration.
9. Verify weather data formatting.
10. Verify irrigation recommendation rules.
11. Verify weather and recommendation history.
12. Verify profile management.
13. Verify form validation.
14. Verify database operations.
15. Verify API error handling.
16. Verify responsive design.
17. Verify accessibility basics.
18. Verify security-related behaviour.
19. Verify loading and empty states.
20. Verify that private data is not exposed.

---

# 3. Scope of Testing

## 3.1 Features Included

The following modules will be tested:

* Public pages
* User registration
* User login
* User logout
* Authentication restoration
* Protected routes
* User profile
* Change password
* Add farm
* View farms
* Edit farm
* Delete farm
* Farm details
* Farm ownership
* OpenStreetMap
* Weather API
* Weather display
* Irrigation recommendation
* Recommendation history
* Weather history
* Dashboard
* Navigation
* Responsive design
* API error handling
* Form validation

## 3.2 Features Excluded

The following features are outside the current testing scope:

* IoT soil-moisture sensors
* Automatic pump control
* Machine Learning models
* AI prediction
* Satellite monitoring
* SMS integration
* WhatsApp integration
* Payment processing
* Real agricultural field testing
* Large-scale performance testing for thousands of users

---

# 4. Testing Types

The project should use the following testing types:

```txt
1. Unit Testing
2. Component Testing
3. Integration Testing
4. API Testing
5. Database Testing
6. Functional Testing
7. System Testing
8. User Interface Testing
9. Responsive Testing
10. Accessibility Testing
11. Security Testing
12. Performance Testing
13. Compatibility Testing
14. User Acceptance Testing
15. Regression Testing
```

---

# 5. Testing Tools

## Frontend Testing

* Vitest
* React Testing Library
* Jest DOM
* Browser developer tools
* Lighthouse
* Chrome DevTools

## Backend Testing

* Pytest
* FastAPI TestClient
* HTTPX
* Pytest Asyncio

## API Testing

* Postman
* Thunder Client
* Swagger UI
* FastAPI OpenAPI documentation

## Database Testing

* MongoDB Compass
* MongoDB Atlas
* Test database

## UI and Compatibility Testing

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Mobile browser emulator

## Performance Testing

* Lighthouse
* Postman response-time checks
* Apache JMeter, optional

---

# 6. Test Environment

## Development Environment

```txt
Operating System: Windows 10 or Windows 11
Frontend: React.js with Vite
Backend: Python with FastAPI
Database: MongoDB
Browser: Google Chrome
API Client: Postman
Code Editor: Visual Studio Code
```

## Frontend Development URL

```txt
http://localhost:5173
```

## Backend Development URL

```txt
http://localhost:8000
```

## API Base URL

```txt
http://localhost:8000/api/v1
```

## API Documentation

```txt
http://localhost:8000/docs
```

## Test Database

Use a separate test database.

Example:

```env
DATABASE_NAME=smart_irrigation_test
```

Do not run automated tests against the production database.

---

# 7. Test Data Strategy

Testing should use dummy development data.

## Example Test User

```json
{
  "name": "Rahul Patil",
  "email": "rahul.test@example.com",
  "mobile": "9876543210",
  "password": "Test@1234"
}
```

## Example Second User

```json
{
  "name": "Amit Sharma",
  "email": "amit.test@example.com",
  "mobile": "9876501234",
  "password": "Test@5678"
}
```

The second user is required for ownership and authorization tests.

## Example Farm

```json
{
  "farmName": "Patil Sugarcane Farm",
  "cropName": "Sugarcane",
  "area": 5,
  "areaUnit": "acre",
  "state": "Maharashtra",
  "district": "Pune",
  "village": "Baramati",
  "latitude": 18.1792,
  "longitude": 74.6078
}
```

## Example Weather Data

```json
{
  "temperature": 36,
  "humidity": 60,
  "windSpeed": 10,
  "pressure": 1009,
  "rainProbability": 20,
  "weatherCondition": "Clear"
}
```

Test data must not contain real passwords or sensitive personal information.

---

# 8. Test Levels

## 8.1 Unit Testing

Unit testing verifies individual functions or small modules.

Backend unit tests should cover:

* Password hashing
* Password verification
* JWT token creation
* JWT token decoding
* Email normalization
* Coordinate validation
* Irrigation recommendation rules
* MongoDB ObjectId conversion
* Response formatting

Frontend unit tests should cover:

* Form validation functions
* Date formatting
* Temperature formatting
* Weather formatting
* Status badge mapping
* Local utility functions

---

## 8.2 Component Testing

Component testing verifies individual React components.

Components to test:

* Button
* Input
* Select
* PasswordInput
* StatusBadge
* WeatherCard
* FarmCard
* RecommendationCard
* MapSelector
* EmptyState
* ErrorState
* LoadingSpinner
* Sidebar
* Navbar
* ProtectedRoute

Component tests should verify:

* Correct rendering
* Prop handling
* Click events
* Disabled states
* Loading states
* Error messages
* Conditional content
* Accessibility labels

---

## 8.3 Integration Testing

Integration testing verifies communication between modules.

Important integration points:

```txt
React Frontend ↔ FastAPI Backend
FastAPI Backend ↔ MongoDB
FastAPI Backend ↔ OpenWeather API
Farm Coordinates ↔ Weather Service
Weather Service ↔ Recommendation Service
Authentication ↔ Protected Routes
Frontend Forms ↔ Backend Validation
```

---

## 8.4 System Testing

System testing verifies the complete application workflow.

Example complete workflow:

```txt
Register
   ↓
Login
   ↓
Open Dashboard
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
   ↓
Update Profile
   ↓
Logout
```

---

# 9. Unit Test Plan

## 9.1 Irrigation Rule Tests

The recommendation rules must be tested independently.

Recommended rule order:

```txt
1. Rain probability
2. Humidity
3. Temperature
4. Default condition
```

### Rule Test Cases

| Test ID | Rain Probability | Humidity | Temperature | Expected Result        |
| ------- | ---------------: | -------: | ----------: | ---------------------- |
| UR-01   |              70% |      60% |        30°C | No Irrigation Required |
| UR-02   |              61% |      85% |        38°C | No Irrigation Required |
| UR-03   |              20% |      85% |        30°C | Delay Irrigation       |
| UR-04   |              20% |      81% |        38°C | Delay Irrigation       |
| UR-05   |              20% |      60% |        36°C | Irrigate Today         |
| UR-06   |              20% |      60% |        35°C | Monitor Weather        |
| UR-07   |              60% |      80% |        35°C | Monitor Weather        |
| UR-08   |               0% |      40% |        25°C | Monitor Weather        |

Boundary values must be tested because rules use values such as `> 60`, `> 80`, and `> 35`.

---

## 9.2 Password Tests

| Test ID | Scenario                              | Expected Result              |
| ------- | ------------------------------------- | ---------------------------- |
| PW-01   | Hash valid password                   | Hash is generated            |
| PW-02   | Verify correct password               | Returns true                 |
| PW-03   | Verify incorrect password             | Returns false                |
| PW-04   | Compare raw password with stored hash | Raw password is never stored |
| PW-05   | Empty password                        | Validation error             |

---

## 9.3 JWT Tests

| Test ID | Scenario                    | Expected Result      |
| ------- | --------------------------- | -------------------- |
| JWT-01  | Create token for valid user | Token generated      |
| JWT-02  | Decode valid token          | User ID returned     |
| JWT-03  | Decode expired token        | Authentication error |
| JWT-04  | Decode modified token       | Authentication error |
| JWT-05  | Missing token               | HTTP 401             |
| JWT-06  | Invalid bearer format       | HTTP 401             |

---

## 9.4 Coordinate Validation Tests

| Test ID |     Latitude |    Longitude | Expected Result   |
| ------- | -----------: | -----------: | ----------------- |
| CO-01   |      18.1792 |      74.6078 | Valid             |
| CO-02   |           91 |           74 | Invalid latitude  |
| CO-03   |          -91 |           74 | Invalid latitude  |
| CO-04   |           18 |          181 | Invalid longitude |
| CO-05   |           18 |         -181 | Invalid longitude |
| CO-06   |        Empty |        Empty | Validation error  |
| CO-07   | String value | String value | Validation error  |

---

# 10. Authentication Test Cases

## 10.1 Registration Testing

| Test ID | Test Scenario                    | Test Input          | Expected Result           |
| ------- | -------------------------------- | ------------------- | ------------------------- |
| AUTH-01 | Register with valid details      | Valid user data     | User created              |
| AUTH-02 | Register with duplicate email    | Existing email      | HTTP 409                  |
| AUTH-03 | Register with invalid email      | `rahul.com`         | Validation error          |
| AUTH-04 | Register with empty name         | Empty name          | Validation error          |
| AUTH-05 | Register with short password     | `1234`              | Validation error          |
| AUTH-06 | Passwords do not match           | Different passwords | Frontend validation error |
| AUTH-07 | Mobile contains letters          | `98ABC12345`        | Validation error          |
| AUTH-08 | Email contains uppercase letters | `RAHUL@EXAMPLE.COM` | Email normalized          |
| AUTH-09 | Name contains outer spaces       | `Rahul`             | Name trimmed              |
| AUTH-10 | User selects admin role          | Modified request    | Role forced to farmer     |

---

## 10.2 Login Testing

| Test ID | Test Scenario                   | Expected Result          |
| ------- | ------------------------------- | ------------------------ |
| AUTH-11 | Valid email and password        | Login successful         |
| AUTH-12 | Incorrect password              | HTTP 401                 |
| AUTH-13 | Unknown email                   | HTTP 401                 |
| AUTH-14 | Empty email                     | Validation error         |
| AUTH-15 | Empty password                  | Validation error         |
| AUTH-16 | Inactive account                | Login rejected           |
| AUTH-17 | Valid login                     | JWT token returned       |
| AUTH-18 | Login button clicked repeatedly | Single request submitted |
| AUTH-19 | Login request loading           | Button disabled          |
| AUTH-20 | Login successful                | Redirect to dashboard    |

---

## 10.3 Logout Testing

| Test ID | Test Scenario                     | Expected Result                |
| ------- | --------------------------------- | ------------------------------ |
| AUTH-21 | User clicks logout                | Authentication data cleared    |
| AUTH-22 | User opens dashboard after logout | Redirect to login              |
| AUTH-23 | Browser back after logout         | Protected page inaccessible    |
| AUTH-24 | Expired token                     | User redirected to login       |
| AUTH-25 | Logout success                    | Confirmation message displayed |

---

# 11. Profile Test Cases

| Test ID | Test Scenario                                  | Expected Result                |
| ------- | ---------------------------------------------- | ------------------------------ |
| PRO-01  | View profile                                   | Correct user data displayed    |
| PRO-02  | Update valid name                              | Profile updated                |
| PRO-03  | Update valid mobile number                     | Profile updated                |
| PRO-04  | Update invalid mobile number                   | Validation error               |
| PRO-05  | Update email to duplicate email                | HTTP 409                       |
| PRO-06  | Access profile without token                   | HTTP 401                       |
| PRO-07  | Password hash in response                      | Must not appear                |
| PRO-08  | Change password using correct current password | Password changed               |
| PRO-09  | Change password using wrong current password   | Request rejected               |
| PRO-10  | New passwords do not match                     | Validation error               |
| PRO-11  | Refresh profile page                           | User remains authenticated     |
| PRO-12  | Submit profile update twice                    | Duplicate submission prevented |

---

# 12. Farm Management Test Cases

## 12.1 Add Farm

| Test ID | Test Scenario                  | Expected Result            |
| ------- | ------------------------------ | -------------------------- |
| FARM-01 | Add farm with valid data       | Farm created               |
| FARM-02 | Farm name missing              | Validation error           |
| FARM-03 | Crop name missing              | Validation error           |
| FARM-04 | Area missing                   | Validation error           |
| FARM-05 | Area is zero                   | Validation error           |
| FARM-06 | Area is negative               | Validation error           |
| FARM-07 | State missing                  | Validation error           |
| FARM-08 | District missing               | Validation error           |
| FARM-09 | Village missing                | Validation error           |
| FARM-10 | Location not selected          | Submission rejected        |
| FARM-11 | Invalid coordinates            | Validation error           |
| FARM-12 | Valid map location selected    | Coordinates stored         |
| FARM-13 | Unauthenticated user adds farm | HTTP 401                   |
| FARM-14 | Farm created                   | Farm owner is current user |
| FARM-15 | Save button clicked twice      | Only one farm created      |

---

## 12.2 View Farms

| Test ID | Test Scenario           | Expected Result              |
| ------- | ----------------------- | ---------------------------- |
| FARM-16 | User has multiple farms | All owned farms displayed    |
| FARM-17 | User has no farms       | Empty state displayed        |
| FARM-18 | User views farm list    | Other users' farms hidden    |
| FARM-19 | API loading             | Skeleton or loader displayed |
| FARM-20 | API failure             | Error state displayed        |
| FARM-21 | Search by farm name     | Matching farms displayed     |
| FARM-22 | Filter by crop          | Correct farms displayed      |
| FARM-23 | No search results       | No-results state displayed   |

---

## 12.3 View Farm Details

| Test ID | Test Scenario            | Expected Result        |
| ------- | ------------------------ | ---------------------- |
| FARM-24 | View owned farm          | Farm details displayed |
| FARM-25 | Invalid farm ID          | HTTP 400 or 404        |
| FARM-26 | Missing farm             | HTTP 404               |
| FARM-27 | View another user's farm | HTTP 403               |
| FARM-28 | Farm coordinates exist   | Marker shown on map    |
| FARM-29 | Farm data loading        | Loader displayed       |
| FARM-30 | Farm map fails           | Map error displayed    |

---

## 12.4 Edit Farm

| Test ID | Test Scenario            | Expected Result                |
| ------- | ------------------------ | ------------------------------ |
| FARM-31 | Edit valid farm details  | Farm updated                   |
| FARM-32 | Edit farm name only      | Other fields preserved         |
| FARM-33 | Edit location            | Marker and coordinates updated |
| FARM-34 | Invalid area             | Validation error               |
| FARM-35 | Edit another user's farm | HTTP 403                       |
| FARM-36 | Edit missing farm        | HTTP 404                       |
| FARM-37 | Submit unchanged form    | No invalid update              |
| FARM-38 | Update successful        | Success notification displayed |

---

## 12.5 Delete Farm

| Test ID | Test Scenario                 | Expected Result         |
| ------- | ----------------------------- | ----------------------- |
| FARM-39 | Delete owned farm             | Farm deleted            |
| FARM-40 | Delete confirmation cancelled | Farm remains            |
| FARM-41 | Delete confirmation accepted  | Delete request sent     |
| FARM-42 | Delete another user's farm    | HTTP 403                |
| FARM-43 | Delete missing farm           | HTTP 404                |
| FARM-44 | Farm deleted                  | Removed from farm list  |
| FARM-45 | Delete API fails              | Error message displayed |

---

# 13. OpenStreetMap Test Cases

| Test ID | Test Scenario                  | Expected Result                 |
| ------- | ------------------------------ | ------------------------------- |
| MAP-01  | Add Farm page opens            | Map displayed                   |
| MAP-02  | Initial map view               | India centered                  |
| MAP-03  | User clicks map                | Marker placed                   |
| MAP-04  | User clicks another location   | Marker moves                    |
| MAP-05  | User selects location          | Latitude displayed              |
| MAP-06  | User selects location          | Longitude displayed             |
| MAP-07  | User resets location           | Marker removed                  |
| MAP-08  | Map loading                    | Loading placeholder displayed   |
| MAP-09  | Leaflet CSS missing            | Must be detected during UI test |
| MAP-10  | Mobile device                  | Map remains usable              |
| MAP-11  | Location outside allowed range | Validation applied if enabled   |
| MAP-12  | User submits without location  | Form rejected                   |
| MAP-13  | Marker selected                | Popup displays location data    |
| MAP-14  | Map resized                    | Tiles render correctly          |

---

# 14. Weather API Test Cases

## 14.1 Weather Request

| Test ID | Test Scenario                  | Expected Result             |
| ------- | ------------------------------ | --------------------------- |
| WEA-01  | Request weather for owned farm | Weather returned            |
| WEA-02  | Farm does not exist            | HTTP 404                    |
| WEA-03  | Farm belongs to another user   | HTTP 403                    |
| WEA-04  | Missing token                  | HTTP 401                    |
| WEA-05  | Valid coordinates              | API called with coordinates |
| WEA-06  | Invalid coordinates            | Validation error            |
| WEA-07  | Weather API unavailable        | Friendly error returned     |
| WEA-08  | Weather API times out          | Timeout handled             |
| WEA-09  | Invalid API key                | External service error      |
| WEA-10  | Unexpected API response        | Parsing error handled       |

---

## 14.2 Weather Display

| Test ID | Test Scenario             | Expected Result             |
| ------- | ------------------------- | --------------------------- |
| WEA-11  | Weather loaded            | Temperature displayed       |
| WEA-12  | Weather loaded            | Humidity displayed          |
| WEA-13  | Weather loaded            | Wind speed displayed        |
| WEA-14  | Weather loaded            | Pressure displayed          |
| WEA-15  | Weather loaded            | Rain probability displayed  |
| WEA-16  | Weather loaded            | Weather condition displayed |
| WEA-17  | Temperature unavailable   | `Not available` displayed   |
| WEA-18  | API loading               | Skeleton displayed          |
| WEA-19  | API error                 | Error state displayed       |
| WEA-20  | Weather data returned     | Saved to history            |
| WEA-21  | Current weather refreshed | Last updated time changes   |
| WEA-22  | Units displayed           | Correct unit formatting     |

---

# 15. Recommendation Test Cases

## 15.1 Recommendation Logic

| Test ID | Scenario                           | Expected Result                |
| ------- | ---------------------------------- | ------------------------------ |
| REC-01  | Rain probability greater than 60%  | No Irrigation Required         |
| REC-02  | Rain 60% exactly                   | Rain rule not triggered        |
| REC-03  | Humidity greater than 80%          | Delay Irrigation               |
| REC-04  | Humidity 80% exactly               | Humidity rule not triggered    |
| REC-05  | Temperature greater than 35°C      | Irrigate Today                 |
| REC-06  | Temperature 35°C exactly           | Temperature rule not triggered |
| REC-07  | No rule matched                    | Monitor Weather                |
| REC-08  | Rain high and temperature high     | No Irrigation Required         |
| REC-09  | Humidity high and temperature high | Delay Irrigation               |
| REC-10  | Missing required weather value     | Recommendation error handled   |

---

## 15.2 Recommendation API

| Test ID | Test Scenario                          | Expected Result               |
| ------- | -------------------------------------- | ----------------------------- |
| REC-11  | Generate recommendation for owned farm | Recommendation returned       |
| REC-12  | Generate for missing farm              | HTTP 404                      |
| REC-13  | Generate for another user's farm       | HTTP 403                      |
| REC-14  | Weather service fails                  | Recommendation not fabricated |
| REC-15  | Recommendation generated               | Record saved                  |
| REC-16  | Response includes status               | Status present                |
| REC-17  | Response includes reason               | Reason present                |
| REC-18  | Response includes action               | Action present                |
| REC-19  | Missing authentication                 | HTTP 401                      |
| REC-20  | Multiple rapid requests                | Duplicate handling verified   |

---

## 15.3 Recommendation UI

| Test ID | Test Scenario                | Expected Result               |
| ------- | ---------------------------- | ----------------------------- |
| REC-21  | No Irrigation Required       | Green status shown            |
| REC-22  | Irrigate Today               | Blue status shown             |
| REC-23  | Delay Irrigation             | Amber status shown            |
| REC-24  | Monitor Weather              | Blue information status shown |
| REC-25  | Weather unavailable          | Red error shown               |
| REC-26  | Recommendation loading       | Loading indicator shown       |
| REC-27  | Recommendation available     | Disclaimer displayed          |
| REC-28  | Save successful              | Success notification shown    |
| REC-29  | Recommendation history empty | Empty state displayed         |

---

# 16. History Test Cases

| Test ID | Test Scenario                    | Expected Result                 |
| ------- | -------------------------------- | ------------------------------- |
| HIS-01  | View weather history             | Owned records displayed         |
| HIS-02  | View recommendation history      | Owned records displayed         |
| HIS-03  | No history exists                | Empty state displayed           |
| HIS-04  | Filter by farm                   | Correct records displayed       |
| HIS-05  | Filter by date                   | Correct records displayed       |
| HIS-06  | Filter by status                 | Correct records displayed       |
| HIS-07  | Invalid page number              | Safe pagination response        |
| HIS-08  | Mobile device                    | Card or scrollable layout shown |
| HIS-09  | Another user's history requested | HTTP 403                        |
| HIS-10  | History API error                | Error message displayed         |
| HIS-11  | Search returns nothing           | No-results state displayed      |
| HIS-12  | Long history list                | Pagination works                |

---

# 17. Dashboard Test Cases

| Test ID | Test Scenario                        | Expected Result                 |
| ------- | ------------------------------------ | ------------------------------- |
| DASH-01 | Authenticated user opens dashboard   | Dashboard displayed             |
| DASH-02 | Unauthenticated user opens dashboard | Redirect to login               |
| DASH-03 | User has farms                       | Farm count displayed            |
| DASH-04 | User has no farms                    | Add-farm prompt displayed       |
| DASH-05 | Weather available                    | Current weather displayed       |
| DASH-06 | Recommendation available             | Latest recommendation displayed |
| DASH-07 | API loading                          | Dashboard skeleton displayed    |
| DASH-08 | One API fails                        | Remaining sections still usable |
| DASH-09 | Quick action clicked                 | Correct page opens              |
| DASH-10 | Mobile screen                        | Cards stack vertically          |
| DASH-11 | User refreshes page                  | Authentication restored         |
| DASH-12 | Session expired                      | Redirect to login               |

---

# 18. Navigation Test Cases

| Test ID | Test Scenario        | Expected Result           |
| ------- | -------------------- | ------------------------- |
| NAV-01  | Click Home           | Home page opens           |
| NAV-02  | Click About          | About page opens          |
| NAV-03  | Click Login          | Login page opens          |
| NAV-04  | Click Register       | Register page opens       |
| NAV-05  | Click Dashboard      | Dashboard opens           |
| NAV-06  | Click Add Farm       | Add Farm opens            |
| NAV-07  | Click My Farms       | Farm list opens           |
| NAV-08  | Click Weather        | Weather page opens        |
| NAV-09  | Click Recommendation | Recommendation page opens |
| NAV-10  | Click History        | History page opens        |
| NAV-11  | Click Profile        | Profile page opens        |
| NAV-12  | Active route         | Active menu highlighted   |
| NAV-13  | Unknown route        | 404 page displayed        |
| NAV-14  | Mobile menu button   | Sidebar drawer opens      |
| NAV-15  | Mobile menu close    | Sidebar drawer closes     |

---

# 19. Form Validation Test Cases

| Test ID | Test Scenario               | Expected Result         |
| ------- | --------------------------- | ----------------------- |
| FORM-01 | Submit empty required field | Error displayed         |
| FORM-02 | Correct invalid value       | Error removed           |
| FORM-03 | Invalid email format        | Error displayed         |
| FORM-04 | Invalid mobile number       | Error displayed         |
| FORM-05 | Negative farm area          | Error displayed         |
| FORM-06 | Password mismatch           | Error displayed         |
| FORM-07 | Form submission loading     | Button disabled         |
| FORM-08 | Backend validation error    | Field error displayed   |
| FORM-09 | Server error                | General error displayed |
| FORM-10 | Successful submission       | Form handled correctly  |
| FORM-11 | Labels present              | Every field has label   |
| FORM-12 | Keyboard navigation         | Form controls reachable |

---

# 20. API Testing Plan

## Authentication Endpoints

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

## User Endpoints

```txt
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password
```

## Farm Endpoints

```txt
POST   /api/v1/farms
GET    /api/v1/farms
GET    /api/v1/farms/{farm_id}
PUT    /api/v1/farms/{farm_id}
DELETE /api/v1/farms/{farm_id}
```

## Weather Endpoints

```txt
GET /api/v1/weather/{farm_id}
GET /api/v1/weather/{farm_id}/forecast
GET /api/v1/weather/{farm_id}/history
```

## Recommendation Endpoints

```txt
POST /api/v1/recommendations/{farm_id}
GET  /api/v1/recommendations/{farm_id}
GET  /api/v1/recommendations/{farm_id}/history
```

For every API endpoint, verify:

* Correct HTTP method
* Correct status code
* Authentication requirements
* Request validation
* Response format
* Authorization
* Error response
* Database effect
* Response time
* Sensitive-field protection

---

# 21. Standard Response Testing

## Successful Response

Verify that successful responses follow the defined format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## Error Response

Verify that errors follow the defined format:

```json
{
  "success": false,
  "message": "Operation failed",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

## Validation Response

Verify field-level validation information.

The response must not expose:

* Stack traces
* Password hashes
* API keys
* Database connection details
* Internal file paths

---

# 22. Database Testing

Database testing should verify:

* Correct collection names
* Correct field types
* Unique email constraint
* User-to-farm relationship
* Farm-to-weather relationship
* Farm-to-recommendation relationship
* Creation timestamps
* Update timestamps
* Record deletion
* Ownership references
* Query filtering
* Index behaviour

## Collections

```txt
users
farms
weather_history
recommendations
```

## Database Test Cases

| Test ID | Test Scenario        | Expected Result                  |
| ------- | -------------------- | -------------------------------- |
| DB-01   | Create user          | User document inserted           |
| DB-02   | Duplicate email      | Insert rejected                  |
| DB-03   | Create farm          | Correct userId stored            |
| DB-04   | Update farm          | updatedAt modified               |
| DB-05   | Delete farm          | Farm removed                     |
| DB-06   | Save weather         | Correct farmId stored            |
| DB-07   | Save recommendation  | Correct farmId and userId stored |
| DB-08   | Query user's farms   | Only owned farms returned        |
| DB-09   | Invalid ObjectId     | Error handled                    |
| DB-10   | Database unavailable | Service error handled            |

---

# 23. Security Testing

Security testing must verify:

* Passwords are hashed
* Password hashes are not returned
* JWT token is required for protected APIs
* Expired tokens are rejected
* Invalid tokens are rejected
* Users cannot access another user's farms
* Users cannot edit another user's farms
* Users cannot delete another user's farms
* Users cannot assign themselves admin role
* Weather API key is not sent to frontend
* Environment variables are not exposed
* CORS is restricted
* Sensitive errors are hidden
* Forms prevent duplicate submission
* User input is validated

## Security Test Cases

| Test ID | Test Scenario                    | Expected Result                |
| ------- | -------------------------------- | ------------------------------ |
| SEC-01  | Read password from API response  | Password absent                |
| SEC-02  | Use invalid JWT                  | HTTP 401                       |
| SEC-03  | Use expired JWT                  | HTTP 401                       |
| SEC-04  | Access another user's farm       | HTTP 403                       |
| SEC-05  | Change request role to admin     | Request ignored or rejected    |
| SEC-06  | Read weather API key in frontend | Key not present                |
| SEC-07  | Submit script in text input      | Safely handled                 |
| SEC-08  | Missing authorization header     | HTTP 401                       |
| SEC-09  | Invalid CORS origin              | Request rejected in production |
| SEC-10  | Backend exception occurs         | Stack trace hidden             |

---

# 24. UI Testing

UI testing should verify:

* Blue colour scheme
* Dark navy sidebar
* White cards
* Light slate background
* Consistent spacing
* Consistent typography
* Visible labels
* Correct icons
* Button states
* Hover states
* Focus states
* Loading indicators
* Empty states
* Error states
* Confirmation dialogs
* Toast notifications
* Responsive layout

## UI Test Cases

| Test ID | Test Scenario    | Expected Result            |
| ------- | ---------------- | -------------------------- |
| UI-01   | Open public page | Navbar and footer visible  |
| UI-02   | Open dashboard   | Sidebar and header visible |
| UI-03   | Active menu      | Blue active state visible  |
| UI-04   | Hover button     | Hover style visible        |
| UI-05   | Disabled button  | Disabled style visible     |
| UI-06   | Form error       | Red error text visible     |
| UI-07   | Success action   | Success toast displayed    |
| UI-08   | API loading      | Loader or skeleton visible |
| UI-09   | No data          | Empty state visible        |
| UI-10   | Delete action    | Confirmation modal visible |
| UI-11   | Long text        | Layout does not break      |
| UI-12   | Missing value    | `Not available` displayed  |

---

# 25. Responsive Testing

Test the application at these widths:

```txt
320px
375px
425px
768px
1024px
1280px
1440px
```

## Mobile Testing

Verify:

* Sidebar is hidden
* Mobile menu works
* Forms use one column
* Cards stack vertically
* Buttons remain usable
* Tables scroll horizontally
* Map remains interactive
* Text does not overflow
* Touch targets are large enough

## Tablet Testing

Verify:

* Grid adapts correctly
* Sidebar behaviour is correct
* Forms remain readable
* Map and charts fit correctly

## Desktop Testing

Verify:

* Sidebar is fixed
* Dashboard uses multi-column grids
* Content spacing is balanced
* Tables and charts use available space

---

# 26. Browser Compatibility Testing

Test on:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox

Optional:

* Safari
* Android Chrome
* iOS Safari

Verify:

* Routing
* Forms
* Map rendering
* Chart rendering
* Responsive behaviour
* CSS consistency
* API requests
* Local storage or authentication behaviour

---

# 27. Accessibility Testing

Verify:

* Every input has a label
* Buttons have accessible names
* Icon-only buttons have `aria-label`
* Keyboard navigation works
* Focus states are visible
* Heading levels are correct
* Images have alt text
* Error messages are understandable
* Colour contrast is sufficient
* Status is not communicated using colour alone
* Modals can be closed by keyboard
* Sidebar can be navigated by keyboard

Recommended tool:

```txt
Lighthouse Accessibility Audit
```

Target accessibility score:

```txt
90 or above
```

---

# 28. Performance Testing

Performance testing should verify:

* Home page loads quickly
* Dashboard loads within acceptable time
* API responses are not unnecessarily slow
* Images are optimized
* Large components do not cause excessive re-rendering
* Weather API is not called repeatedly without need
* Charts remain responsive
* Map does not block the page

Suggested targets:

```txt
Normal API response: below 2 seconds
Weather API response: below 5 seconds
Initial page load: below 3 seconds on normal connection
Lighthouse performance score: 80 or above
```

These targets are suitable for a college prototype and are not strict production guarantees.

---

# 29. Error Handling Testing

Test the following failure conditions:

* No internet connection
* Backend server stopped
* MongoDB unavailable
* OpenWeather API unavailable
* Invalid weather API key
* Weather request timeout
* Invalid JWT token
* Expired session
* Farm not found
* Invalid coordinates
* Invalid form data
* Unexpected backend exception

The application should display user-friendly messages.

Examples:

```txt
Unable to connect to the server.

Unable to fetch weather information.

Your session has expired. Please log in again.

Farm not found.

Something went wrong. Please try again.
```

---

# 30. Empty-State Testing

Verify empty states for:

* No farms
* No weather history
* No recommendation history
* No search results
* No current farm selected
* No forecast available

Each empty state should contain:

* Relevant icon
* Clear title
* Short explanation
* Action button when appropriate

---

# 31. Regression Testing

Regression testing should be performed after:

* Authentication changes
* Database schema changes
* Farm module changes
* Weather integration changes
* Recommendation rule changes
* Route changes
* UI redesign
* Dependency updates
* Bug fixes

Critical regression workflows:

```txt
Register → Login
Login → Dashboard
Add Farm → View Farm
Farm → Weather
Weather → Recommendation
Recommendation → History
Profile → Logout
```

---

# 32. User Acceptance Testing

User Acceptance Testing verifies that the system satisfies the project requirements.

## UAT Participants

* Student developer
* Project guide
* Faculty evaluator
* Sample student user
* Optional farmer representative

## UAT Scenarios

### Scenario 1: Create Account

```txt
User registers using valid information.
Expected: Account is successfully created.
```

### Scenario 2: Add Farm

```txt
User adds farm information and selects map location.
Expected: Farm is stored and shown in the farm list.
```

### Scenario 3: Check Weather

```txt
User selects a farm and requests weather.
Expected: Live weather details are displayed.
```

### Scenario 4: Get Recommendation

```txt
User requests irrigation advice.
Expected: Correct rule-based recommendation is displayed.
```

### Scenario 5: View History

```txt
User opens history.
Expected: Previous weather and recommendation records appear.
```

### Scenario 6: Unauthorized Access

```txt
Logged-out user opens dashboard.
Expected: User is redirected to login.
```

---

# 33. Defect Severity Levels

## Critical

A critical defect prevents the system from functioning.

Examples:

* Application does not start
* Login fails for all users
* Database cannot connect
* Passwords are exposed
* All protected routes are accessible publicly

## High

A major feature does not work.

Examples:

* Farm cannot be created
* Weather cannot be fetched
* Recommendation logic gives incorrect results
* Users can access other users' data

## Medium

A feature works partially.

Examples:

* Search filter fails
* Validation message is missing
* History pagination fails
* Map marker does not update properly

## Low

A minor visual or usability issue.

Examples:

* Spacing inconsistency
* Incorrect icon size
* Minor text alignment issue
* Typographical error

---

# 34. Defect Report Format

Use the following format when recording bugs:

```txt
Defect ID:
Title:
Module:
Severity:
Priority:
Environment:
Preconditions:
Steps to Reproduce:
Expected Result:
Actual Result:
Screenshot:
Status:
Assigned To:
Date Reported:
Date Resolved:
Remarks:
```

## Example Defect

```txt
Defect ID: BUG-001

Title:
Farm can be submitted without location.

Module:
Add Farm

Severity:
High

Steps to Reproduce:
1. Log in.
2. Open Add Farm.
3. Fill all fields.
4. Do not select map location.
5. Click Save Farm.

Expected Result:
Form should display a location-required error.

Actual Result:
Farm is submitted without coordinates.

Status:
Open
```

---

# 35. Test Case Status Values

Use these statuses:

```txt
Not Executed
Passed
Failed
Blocked
Retest
Skipped
```

---

# 36. Test Execution Record

| Test ID | Test Name           | Expected Result   | Actual Result | Status       | Remarks |
| ------- | ------------------- | ----------------- | ------------- | ------------ | ------- |
| AUTH-01 | Valid registration  | User created      |               | Not Executed |         |
| AUTH-11 | Valid login         | Dashboard opens   |               | Not Executed |         |
| FARM-01 | Add valid farm      | Farm created      |               | Not Executed |         |
| MAP-03  | Select map location | Marker placed     |               | Not Executed |         |
| WEA-01  | Fetch weather       | Weather displayed |               | Not Executed |         |
| REC-01  | Rain above 60%      | No irrigation     |               | Not Executed |         |

---

# 37. Entry Criteria

Testing can begin when:

* Requirements are defined
* Frontend and backend run successfully
* Test environment is available
* Test database is configured
* Main APIs are implemented
* UI routes are available
* Weather API key is configured
* Seed test data is prepared

---

# 38. Exit Criteria

Testing may be considered complete when:

* All critical test cases are executed
* All critical defects are resolved
* All high-severity defects are resolved or accepted
* Authentication tests pass
* Farm ownership tests pass
* Weather integration tests pass
* Recommendation rule tests pass
* Core user workflows pass
* Responsive testing is completed
* No sensitive data is exposed
* Faculty-required test documentation is prepared

---

# 39. Test Deliverables

The testing process should produce:

* Testing plan
* Test case document
* API test collection
* Automated unit tests
* Test execution report
* Defect report
* Screenshots
* Performance report
* Accessibility report
* Final testing summary
* User Acceptance Testing report

---

# 40. Automated Backend Test Structure

Recommended structure:

```txt
backend/
└── tests/
    ├── conftest.py
    ├── test_auth.py
    ├── test_users.py
    ├── test_farms.py
    ├── test_weather.py
    ├── test_recommendations.py
    ├── test_history.py
    └── test_irrigation_rules.py
```

## Purpose

### `conftest.py`

Contains:

* Test application
* Test client
* Test database fixture
* Test user fixture
* Authentication token fixture
* Farm fixture
* Mock weather response

### `test_irrigation_rules.py`

Tests the rule engine independently.

### `test_auth.py`

Tests registration, login, JWT, and authentication.

### `test_farms.py`

Tests farm CRUD and ownership.

### `test_weather.py`

Tests weather service and API behaviour.

### `test_recommendations.py`

Tests recommendation generation and saving.

---

# 41. Automated Frontend Test Structure

Recommended structure:

```txt
frontend/src/
└── tests/
    ├── setup.js
    ├── Login.test.jsx
    ├── Register.test.jsx
    ├── ProtectedRoute.test.jsx
    ├── FarmForm.test.jsx
    ├── FarmCard.test.jsx
    ├── MapSelector.test.jsx
    ├── WeatherCard.test.jsx
    ├── RecommendationCard.test.jsx
    └── Dashboard.test.jsx
```

Frontend tests should use mocked API responses.

Do not call the real OpenWeather API during unit tests.

---

# 42. Weather API Mocking

External weather requests should be mocked during automated tests.

Example mock weather data:

```json
{
  "temperature": 36,
  "humidity": 60,
  "windSpeed": 12,
  "pressure": 1008,
  "rainProbability": 20,
  "weatherCondition": "Clear",
  "weatherDescription": "clear sky"
}
```

Mock failure response:

```json
{
  "success": false,
  "message": "Weather service unavailable"
}
```

This keeps tests:

* Fast
* Predictable
* Independent
* Free from API usage limits

---

# 43. Final Testing Checklist

Before project submission, verify:

* Registration works
* Login works
* Logout works
* JWT protection works
* Duplicate email is rejected
* Password is hashed
* Password is not returned
* Protected routes redirect correctly
* Farm can be added
* Farm can be edited
* Farm can be deleted
* Map location can be selected
* Coordinates are stored
* Users cannot access other users' farms
* Weather API works
* Weather errors are handled
* Recommendation rules work
* Rule priority is correct
* Recommendation history works
* Weather history works
* Profile update works
* Change password works
* Loading states appear
* Empty states appear
* Error states appear
* Mobile layout works
* Tablet layout works
* Desktop layout works
* Chrome compatibility works
* Edge compatibility works
* Firefox compatibility works
* No API keys are exposed
* No sensitive information is exposed
* 404 page works
* Test reports are documented

---

# 44. Rules for Codex

Codex must follow these testing rules:

* Use Pytest for backend tests
* Use FastAPI TestClient or HTTPX
* Use a separate test database
* Mock OpenWeather API responses
* Do not call production services during unit tests
* Test both successful and unsuccessful scenarios
* Test boundary values
* Test farm ownership
* Test authentication on every protected route
* Test rule priority
* Test API response structure
* Test loading and error states
* Test components independently
* Avoid tests that depend on execution order
* Clean test data after execution
* Use clear test names
* Keep test fixtures reusable
* Do not include real passwords or API keys
* Do not skip critical security tests
* Keep the backend as the source of truth

---

# 45. Final Testing Summary

The testing strategy ensures that the Weather-Based Smart Irrigation Advisory System is:

* Functionally correct
* Secure
* Responsive
* Reliable
* Easy to use
* Properly validated
* Protected against unauthorized access
* Able to handle external API failures
* Suitable for academic demonstration

The most critical areas are:

```txt
Authentication
Farm Ownership
Weather API Integration
Recommendation Rules
Database Operations
Error Handling
Responsive User Interface
```

All critical workflows must pass before the project is considered ready for final demonstration or college submission.
