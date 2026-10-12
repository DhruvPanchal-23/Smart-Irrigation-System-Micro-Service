> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

# System Users and Roles

## 1. Document Purpose

This document defines the users, roles, permissions, responsibilities, access rules, and expected behaviour of the **Weather-Based Smart Irrigation Advisory System**.

The system is mainly designed for farmers who want to:

* Register their farms
* Select farm locations on OpenStreetMap
* View current weather information
* Receive irrigation recommendations
* Review previous weather and recommendation records

The system may also include an administrator role for managing users, farms, and system records.

---

# 2. User Roles

The application supports the following user roles:

```txt
1. Visitor
2. Farmer
3. Administrator
```

The primary user of the application is the farmer.

---

# 3. Visitor

A visitor is a user who has not logged into the application.

## Visitor Capabilities

A visitor can:

* Open the home page
* View the project introduction
* View project features
* View the About page
* View the Contact page
* Open the registration page
* Open the login page
* Read general irrigation information
* View the technology used in the project

## Visitor Restrictions

A visitor cannot:

* Access the dashboard
* Add a farm
* View registered farms
* Fetch farm-specific weather
* Generate irrigation recommendations
* View recommendation history
* Access a user profile
* Modify application data

## Visitor Navigation

```txt
Home
About
Features
Contact
Login
Register
```

## Visitor Use Case

```txt
Visitor opens website
        │
        ▼
Views project information
        │
        ▼
Chooses Register or Login
```

---

# 4. Farmer

A farmer is a registered and authenticated user.

The farmer is the main user of the system.

## Farmer Capabilities

A farmer can:

* Register an account
* Log in
* Log out
* View the dashboard
* Add a farm
* View personal farms
* Edit farm information
* Delete a farm
* Select farm location on OpenStreetMap
* Save latitude and longitude
* View live weather information
* View temperature
* View humidity
* View wind speed
* View rain probability
* View weather conditions
* Generate irrigation recommendations
* View the recommendation reason
* View suggested irrigation action
* View previous weather records
* View recommendation history
* Update personal information
* Change password

---

# 5. Farmer Registration Data

A farmer account should contain the following information:

```txt
Full Name
Email Address
Mobile Number
Password
Confirm Password
Role
Account Status
Created Date
Updated Date
```

## Example Farmer Record

```json
{
  "name": "Rahul Patil",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "role": "farmer",
  "isActive": true,
  "createdAt": "2026-07-22T10:00:00Z",
  "updatedAt": "2026-07-22T10:00:00Z"
}
```

The password must never be returned in an API response.

Only the password hash should be stored in the database.

---

# 6. Farmer Authentication

## Registration Flow

```txt
Farmer opens registration page
            │
            ▼
Enters account details
            │
            ▼
Frontend validates form
            │
            ▼
Backend validates request
            │
            ▼
System checks duplicate email
            │
            ▼
Password is hashed
            │
            ▼
User account is stored
            │
            ▼
Registration success message
```

## Login Flow

```txt
Farmer enters email and password
              │
              ▼
Backend verifies credentials
              │
              ▼
JWT access token is generated
              │
              ▼
Farmer is redirected to dashboard
```

## Logout Flow

```txt
Farmer selects Logout
        │
        ▼
Authentication data is cleared
        │
        ▼
Farmer is redirected to Login
```

---

# 7. Farmer Dashboard

After login, the farmer should see a dashboard containing:

* Welcome message
* Farmer name
* Total farms
* Current selected farm
* Current weather
* Temperature
* Humidity
* Rain probability
* Latest recommendation
* Recent weather history
* Recent recommendation history
* Quick actions

## Dashboard Quick Actions

```txt
Add Farm
View Farms
Check Weather
Get Recommendation
View History
Update Profile
```

---

# 8. Farm Ownership

Each farm must belong to one farmer.

```txt
Farmer
   │
   └── Can own multiple farms
```

A farmer can access only farms that belong to their own account.

## Ownership Rule

```txt
Farm.userId must match authenticated User._id
```

Before performing any farm operation, the backend must verify ownership.

## Allowed Farm Operations

A farmer can:

```txt
Create Own Farm
View Own Farms
View Own Farm Details
Edit Own Farm
Delete Own Farm
View Weather for Own Farm
Generate Recommendation for Own Farm
View History for Own Farm
```

## Forbidden Farm Operations

A farmer cannot:

```txt
View Another Farmer's Farm
Edit Another Farmer's Farm
Delete Another Farmer's Farm
View Another Farmer's Weather
View Another Farmer's Recommendations
```

---

# 9. Farm Information

A farmer can register one or more farms.

Each farm should contain:

```txt
Farm Name
Crop Name
Farm Area
Area Unit
State
District
Village
Latitude
Longitude
Owner ID
Created Date
Updated Date
```

## Example Farm Record

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
  "longitude": 74.6078,
  "userId": "user_object_id"
}
```

---

# 10. Farm Location Selection

The farmer selects a farm location using OpenStreetMap.

## Map Interaction Flow

```txt
Farmer opens Add Farm page
          │
          ▼
OpenStreetMap is displayed
          │
          ▼
Farmer clicks farm location
          │
          ▼
Marker is placed
          │
          ▼
Latitude and longitude are captured
          │
          ▼
Coordinates are saved with farm
```

The farmer must not be allowed to submit a farm without selecting a valid location.

---

# 11. Weather Access

A farmer can request weather information for a registered farm.

The system should display:

* Current temperature
* Humidity
* Wind speed
* Atmospheric pressure
* Rain probability
* Weather condition
* Weather description
* Last updated time

## Weather Access Flow

```txt
Farmer selects farm
        │
        ▼
Frontend sends farm ID
        │
        ▼
Backend verifies farm ownership
        │
        ▼
Backend loads latitude and longitude
        │
        ▼
Backend calls weather API
        │
        ▼
Weather data is returned
```

A farmer should not manually provide weather values.

Weather information should come from the external weather API.

---

# 12. Irrigation Recommendation Access

A farmer can generate an irrigation recommendation for a registered farm.

The recommendation is based on:

* Rain probability
* Temperature
* Humidity
* Current weather condition

## Recommendation Results

Possible recommendation results:

```txt
No Irrigation Required
Delay Irrigation
Irrigate Today
Monitor Weather
```

## Recommendation Rule Examples

```txt
Rain probability above 60%
→ No Irrigation Required

Humidity above 80%
→ Delay Irrigation

Temperature above 35°C
→ Irrigate Today

Otherwise
→ Monitor Weather
```

## Farmer Recommendation View

The farmer should see:

* Farm name
* Current weather summary
* Recommendation status
* Reason
* Recommended action
* Recommendation date
* Advisory disclaimer

## Disclaimer

The interface should display:

```txt
This recommendation is based only on weather information and predefined rules.
It should be treated as an advisory and not as a replacement for professional agricultural guidance.
```

---

# 13. Farmer History

A farmer can view previous records for their own farms.

## Weather History

Weather history may contain:

```txt
Date
Farm
Temperature
Humidity
Wind Speed
Rain Probability
Weather Condition
```

## Recommendation History

Recommendation history may contain:

```txt
Date
Farm
Weather Summary
Recommendation
Reason
Suggested Action
Status
```

## History Filters

The farmer may filter history by:

* Farm
* Date
* Recommendation status
* Weather condition

---

# 14. Farmer Profile

The farmer profile page should display:

* Profile avatar or initials
* Full name
* Email address
* Mobile number
* User role
* Account creation date
* Number of registered farms

## Farmer Profile Actions

A farmer can:

* Update full name
* Update mobile number
* Change password
* View account information
* Log out

A farmer should not normally change the account role.

Email changes may require additional verification if implemented.

---

# 15. Administrator

An administrator is a system-management user.

The administrator role is optional for the initial college prototype but may be included for demonstration.

## Administrator Capabilities

An administrator can:

* Log in to the admin dashboard
* View all registered users
* View all farms
* View weather records
* View recommendation records
* Search users
* Filter users
* Activate or deactivate user accounts
* View system activity
* View summary statistics
* Manage inappropriate or invalid records
* View reports

## Administrator Navigation

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

# 16. Administrator Dashboard

The administrator dashboard may display:

* Total users
* Active users
* Total farms
* Total weather records
* Total recommendations
* Recently registered users
* Recently added farms
* System status
* Weather API status

The administrator dashboard should use the same blue UI theme as the farmer dashboard.

---

# 17. Administrator Restrictions

An administrator should not:

* View plain-text passwords
* View password hashes
* View JWT tokens
* View external API keys
* Modify weather API data manually
* Access environment variables through the UI
* Delete data without confirmation
* change recommendation rules through the UI unless that feature is intentionally implemented

All sensitive actions should be protected.

---

# 18. Role-Based Access Control

The system should use role-based access control.

## Role Values

```txt
visitor
farmer
admin
```

A visitor is not stored as an authenticated role.

Registered users normally have either:

```txt
farmer
admin
```

## Permission Matrix

| Feature                 | Visitor | Farmer | Administrator |
| ----------------------- | ------: | -----: | ------------: |
| View Home Page          |     Yes |    Yes |           Yes |
| View About Page         |     Yes |    Yes |           Yes |
| Register Account        |     Yes |     No |            No |
| Login                   |     Yes |    Yes |           Yes |
| View Farmer Dashboard   |      No |    Yes |      Optional |
| Add Farm                |      No |    Yes |      Optional |
| View Own Farms          |      No |    Yes |           Yes |
| View All Farms          |      No |     No |           Yes |
| Edit Own Farm           |      No |    Yes |           Yes |
| Delete Own Farm         |      No |    Yes |           Yes |
| View Weather            |      No |    Yes |           Yes |
| Generate Recommendation |      No |    Yes |           Yes |
| View Own History        |      No |    Yes |           Yes |
| View All History        |      No |     No |           Yes |
| Update Own Profile      |      No |    Yes |           Yes |
| Manage Users            |      No |     No |           Yes |
| Access Admin Dashboard  |      No |     No |           Yes |

---

# 19. Protected Routes

## Farmer-Protected Routes

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

## Administrator-Protected Routes

```txt
/admin
/admin/users
/admin/farms
/admin/weather
/admin/recommendations
/admin/reports
/admin/settings
```

## Public Routes

```txt
/
/about
/features
/contact
/login
/register
```

---

# 20. Unauthorized Access Handling

## Unauthenticated Access

When a visitor attempts to access a protected route:

```txt
Redirect to /login
```

Display:

```txt
Please log in to access this page.
```

## Forbidden Access

When a farmer attempts to access an administrator route:

```txt
Return HTTP 403
```

Display:

```txt
You do not have permission to access this page.
```

## Missing Resource

When a farm does not exist:

```txt
Return HTTP 404
```

Display:

```txt
Farm not found.
```

## Ownership Failure

When a farmer requests another farmer's resource:

```txt
Return HTTP 403
```

Do not reveal unnecessary information about the resource owner.

---

# 21. User Account Status

A user account may contain the following status:

```txt
active
inactive
suspended
```

## Active Account

An active user can log in and use permitted features.

## Inactive Account

An inactive user cannot log in until the account is activated.

## Suspended Account

A suspended user cannot access the system.

Suggested login message:

```txt
Your account is currently unavailable. Please contact the administrator.
```

Do not reveal internal account-management information.

---

# 22. Password Rules

User passwords should follow minimum security rules.

Recommended requirements:

* Minimum 8 characters
* At least one uppercase letter
* At least one lowercase letter
* At least one number
* Optional special character requirement
* Must match confirm-password field

Passwords must:

* Be hashed before storage
* Never be logged
* Never be returned in API responses
* Never appear in browser-visible state after submission

---

# 23. User Validation Rules

## Name

* Required
* Minimum 2 characters
* Maximum 100 characters
* Trim leading and trailing spaces

## Email

* Required
* Valid email format
* Converted to lowercase
* Must be unique

## Mobile Number

* Optional or required based on project scope
* Must contain a valid number
* For India, normally 10 digits
* Should not contain letters

## Password

* Required during registration
* Must meet password requirements
* Must match confirmation

## Farm Ownership

* User must be authenticated
* Farm must belong to current user

---

# 24. User Interface Behaviour

## User Feedback

The system should provide clear messages.

### Success Messages

```txt
Account created successfully.
Login successful.
Farm added successfully.
Farm updated successfully.
Farm deleted successfully.
Profile updated successfully.
Password changed successfully.
```

### Error Messages

```txt
Email is already registered.
Invalid email or password.
Unable to load your farms.
Unable to fetch weather information.
You do not have permission to access this resource.
Your session has expired.
```

---

# 25. Loading States

Display loading states when:

* Logging in
* Registering
* Fetching profile
* Loading farms
* Saving farm
* Fetching weather
* Generating recommendation
* Loading history
* Updating profile

Example button states:

```txt
Logging in...
Creating account...
Saving farm...
Fetching weather...
Generating recommendation...
Updating profile...
```

Buttons should be disabled during submission to prevent duplicate requests.

---

# 26. Empty States

## No Farms

```txt
No farms added yet.

Add your first farm to start receiving weather information and irrigation recommendations.
```

Action:

```txt
Add Farm
```

## No Weather History

```txt
No weather records are available for this farm.
```

## No Recommendations

```txt
No recommendations have been generated yet.
```

## No Search Results

```txt
No records match your search.
```

---

# 27. User Session Behaviour

The application should:

* Restore the authenticated user after page refresh
* Verify the current token
* Redirect expired sessions to login
* Clear authentication data on logout
* Prevent access to protected pages after logout
* Display a session-expired message

Suggested message:

```txt
Your session has expired. Please log in again.
```

---

# 28. User Privacy

The system should protect personal user information.

Sensitive information includes:

* Password
* Password hash
* Authentication token
* Mobile number
* Email address
* Farm coordinates

The application should:

* Return only required user information
* Prevent users from viewing other users' details
* Avoid logging sensitive fields
* Use HTTPS in production
* Validate authorization for every protected resource

---

# 29. User API Endpoints

## Authentication

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

## Profile

```txt
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password
```

## Farmer Farms

```txt
POST   /api/v1/farms
GET    /api/v1/farms
GET    /api/v1/farms/{farm_id}
PUT    /api/v1/farms/{farm_id}
DELETE /api/v1/farms/{farm_id}
```

## Administrator Users

```txt
GET /api/v1/admin/users
GET /api/v1/admin/users/{user_id}
PUT /api/v1/admin/users/{user_id}/status
```

Administrator endpoints may be excluded from the first prototype version.

---

# 30. User Response Schema

Example user response:

```json
{
  "id": "user_id",
  "name": "Rahul Patil",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "role": "farmer",
  "isActive": true,
  "createdAt": "2026-07-22T10:00:00Z"
}
```

Do not include:

```txt
password
passwordHash
tokenSecret
API keys
internal security fields
```

---

# 31. User Stories

## Visitor User Stories

```txt
As a visitor,
I want to understand the project,
so that I can decide whether to register.

As a visitor,
I want to create an account,
so that I can use the irrigation advisory features.
```

## Farmer User Stories

```txt
As a farmer,
I want to register my farm,
so that I can receive location-based weather information.

As a farmer,
I want to select my farm on a map,
so that the system can use accurate coordinates.

As a farmer,
I want to view current weather,
so that I can understand local conditions.

As a farmer,
I want an irrigation recommendation,
so that I can decide whether irrigation may be required.

As a farmer,
I want to view previous recommendations,
so that I can review earlier advisory records.

As a farmer,
I want to manage multiple farms,
so that I can monitor each farm separately.

As a farmer,
I want to update my profile,
so that my contact information remains correct.
```

## Administrator User Stories

```txt
As an administrator,
I want to view registered users,
so that I can monitor system usage.

As an administrator,
I want to view all farms,
so that I can understand application activity.

As an administrator,
I want to deactivate invalid accounts,
so that the system remains secure.
```

---

# 32. Acceptance Criteria

## Farmer Registration

* User can enter valid registration information
* Duplicate email is rejected
* Invalid email is rejected
* Password mismatch is rejected
* Password is hashed before storage
* Success message is displayed

## Farmer Login

* Valid credentials allow access
* Invalid credentials are rejected
* JWT token is created
* User is redirected to dashboard

## Add Farm

* Authenticated farmer can add a farm
* Required fields are validated
* Map location is required
* Farm is assigned to current user
* Success message is displayed

## View Weather

* Farmer selects owned farm
* Backend verifies ownership
* Weather is fetched using coordinates
* Weather data is displayed
* External API errors are handled

## Generate Recommendation

* Current weather is available
* Rules are applied in correct priority
* Recommendation includes status and reason
* Recommendation is saved
* Farmer can view it in history

## Profile Update

* User can update allowed fields
* Invalid data is rejected
* Password is not exposed
* Updated information is returned

---

# 33. User Limitations

The current prototype does not provide:

* Real soil-moisture monitoring
* Automatic pump control
* Guaranteed agricultural advice
* Machine Learning predictions
* IoT device management
* Satellite farm monitoring
* Government identity verification
* Payment processing

The application provides weather-based advisory information only.

---

# 34. Future User Roles

Future versions may include:

```txt
Field Supervisor
Agricultural Expert
Government Officer
Farm Manager
Researcher
Support Agent
```

Possible future permissions:

* Approve farms
* Create crop-specific recommendations
* Review farmer requests
* Send alerts
* Analyse regional data
* Manage irrigation schedules
* Export reports

These roles are outside the current prototype scope.

---

# 35. Rules for Codex

Codex must follow these user-related rules:

* Use `farmer` as the default registered role
* Do not allow public role selection during registration
* Never return password hashes
* Verify JWT tokens on protected routes
* Verify farm ownership on every farm-specific request
* Use role-based route protection
* Redirect unauthenticated users to login
* Return HTTP 403 for forbidden access
* Return HTTP 404 for missing resources
* Prevent users from accessing other users' data
* Disable buttons during submissions
* Display loading, empty, and error states
* Use clear success and error messages
* Keep the backend as the authorization source of truth
* Do not rely only on frontend route protection
* Do not expose administrator controls to farmers
* Use the blue design system for all user pages

---

# 36. Final User Model Summary

```txt
Visitor
   │
   ├── View public information
   ├── Register
   └── Login

Farmer
   │
   ├── Manage account
   ├── Manage own farms
   ├── Select farm location
   ├── View weather
   ├── Generate recommendations
   └── View own history

Administrator
   │
   ├── View all users
   ├── View all farms
   ├── View system records
   ├── Manage account status
   └── Monitor application activity
```

The user system must remain simple, secure, role-based, and suitable for a college-level full-stack project.