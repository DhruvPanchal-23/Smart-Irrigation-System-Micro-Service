> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

# Product Features

## 1. Document Purpose

This document defines the complete feature set of the **Weather-Based Smart Irrigation Advisory System**.

The system is a full-stack web application prototype designed for college implementation. It helps farmers:

* Register and manage accounts
* Register one or more farms
* Select farm locations using OpenStreetMap
* View current weather information
* Receive rule-based irrigation recommendations
* Review weather and recommendation history

The system uses:

* React.js
* Vite
* Tailwind CSS
* FastAPI
* MongoDB
* OpenWeather API
* OpenStreetMap
* Leaflet
* Rule-based irrigation logic

The system does not use:

* Machine Learning
* Artificial Intelligence prediction models
* IoT sensors
* Automatic pump control
* Satellite monitoring
* Real soil-moisture data

---

# 2. Feature Categories

The application features are divided into the following categories:

```txt
1. Public Website Features
2. Authentication Features
3. Dashboard Features
4. Farm Management Features
5. Map and Location Features
6. Weather Features
7. Irrigation Recommendation Features
8. History Features
9. Profile Features
10. Navigation Features
11. User Interface Features
12. Security Features
13. Error-Handling Features
14. Administrator Features
15. Future Features
```

---

# 3. Feature Priority Levels

Each feature is classified using the following priorities:

```txt
P0 — Critical MVP feature
P1 — Important feature
P2 — Optional enhancement
P3 — Future feature
```

## Priority Meaning

### P0

The application cannot complete its main workflow without this feature.

### P1

The application can work without it, but the feature significantly improves usability or completeness.

### P2

The feature improves the project but is not required for the first functional version.

### P3

The feature is outside the current prototype and may be implemented later.

---

# 4. Public Website Features

## 4.1 Home Page

**Priority:** P0

The home page introduces the project and guides users toward registration or login.

### Main Sections

* Navigation bar
* Hero section
* Project summary
* Main features
* How the system works
* Benefits
* Technology overview
* Call-to-action section
* Footer

### Hero Content

The hero section should include:

```txt
Weather-Based Smart Irrigation Advisory System

Make better irrigation decisions using live weather data and location-based recommendations.
```

### Hero Actions

* Get Started
* Learn More

### Behaviour

* `Get Started` should open the registration page.
* `Learn More` should scroll to project information or open the About page.
* The layout should remain responsive on all devices.

---

## 4.2 About Page

**Priority:** P1

The About page explains the academic and technical purpose of the application.

### Content

* Project introduction
* Problem statement
* Objectives
* Proposed solution
* Project scope
* Technology stack
* Limitations
* Future scope

### Purpose

The page should help faculty, students, and users understand:

* Why the project was created
* What problem it addresses
* How the system works
* What technologies are used
* What the current prototype does not support

---

## 4.3 Features Page

**Priority:** P2

The Features page provides a visual summary of application capabilities.

### Feature Cards

* User Authentication
* Farm Management
* OpenStreetMap Location Selection
* Live Weather Information
* Irrigation Recommendations
* Weather History
* Recommendation History
* Responsive Dashboard

Each feature card should contain:

* Icon
* Feature title
* Short description
* Optional action link

---

## 4.4 Contact and Help Page

**Priority:** P2

The Contact page allows users to submit questions or feedback.

### Form Fields

* Name
* Email
* Subject
* Message

### Additional Content

* Support information
* Project contact details
* Frequently asked questions
* College-project disclaimer

### Behaviour

* Validate required fields.
* Show loading state during submission.
* Display success or error feedback.
* Contact form storage or email sending is optional.

---

## 4.5 Custom 404 Page

**Priority:** P1

The application should display a custom page when a route does not exist.

### Content

* Large `404` heading
* Page not found message
* Home button
* Dashboard button for authenticated users

### Example Message

```txt
The page you are looking for does not exist.
```

---

# 5. Authentication Features

## 5.1 User Registration

**Priority:** P0

Visitors can create a farmer account.

### Registration Fields

* Full name
* Email address
* Mobile number
* Password
* Confirm password
* Terms acceptance

### Validation

* Name is required.
* Email must be valid.
* Email must be unique.
* Mobile number must use a valid format.
* Password must meet security rules.
* Confirm password must match.
* Terms must be accepted.

### System Behaviour

* Normalize email to lowercase.
* Trim leading and trailing spaces.
* Hash the password.
* Assign the default `farmer` role.
* Prevent public users from selecting an administrator role.
* Display a registration-success message.

---

## 5.2 User Login

**Priority:** P0

Registered users can log in using email and password.

### Login Fields

* Email
* Password
* Remember me
* Forgot-password link, UI only if not implemented

### System Behaviour

* Validate credentials.
* Return a JWT access token.
* Load the authenticated user.
* Redirect the user to the dashboard.
* Reject invalid credentials.
* Disable the login button while processing.
* Display an error message when login fails.

---

## 5.3 User Logout

**Priority:** P0

Authenticated users can log out.

### Behaviour

* Clear authentication state.
* Remove locally stored authentication information.
* Redirect to the login or home page.
* Prevent protected pages from remaining accessible.
* Display a logout-success message if appropriate.

---

## 5.4 Authentication Restoration

**Priority:** P0

The system should restore authentication after page refresh.

### Behaviour

* Read the stored token.
* Verify the token through the backend.
* Load the current user.
* Keep valid sessions active.
* Redirect expired sessions to login.

### Session Message

```txt
Your session has expired. Please log in again.
```

---

## 5.5 Password Visibility Toggle

**Priority:** P1

Password fields should include a show/hide control.

### Behaviour

* Use an eye icon.
* Include an accessible label.
* Do not change the stored password value.
* Support keyboard operation.

---

## 5.6 Change Password

**Priority:** P1

Authenticated users can change their password.

### Fields

* Current password
* New password
* Confirm new password

### Behaviour

* Verify the current password.
* Validate the new password.
* Confirm the two new password fields match.
* Hash the new password.
* Reject incorrect current passwords.
* Display success or error feedback.

---

## 5.7 Forgot Password

**Priority:** P3

A future version may allow password reset using:

* Email verification
* Reset token
* Time-limited reset link
* New password form

For the current prototype, the forgot-password link may be UI only.

---

# 6. Farmer Dashboard Features

## 6.1 Welcome Card

**Priority:** P0

The dashboard should display a welcome message.

### Example

```txt
Welcome back, Rahul.
Here is the latest information about your farms.
```

### Content

* Farmer name
* Current date
* Short dashboard summary

---

## 6.2 Total Farms Summary

**Priority:** P0

Display the number of farms owned by the current user.

### Example

```txt
Total Farms: 3
```

The value must come from the backend.

---

## 6.3 Selected Farm Summary

**Priority:** P1

Display the currently selected farm.

### Content

* Farm name
* Crop name
* Area
* Location
* View details action

---

## 6.4 Current Weather Summary

**Priority:** P0

Display current weather for the selected farm.

### Values

* Temperature
* Humidity
* Weather condition
* Rain probability
* Last updated time

---

## 6.5 Latest Recommendation

**Priority:** P0

Display the most recent recommendation for the selected farm.

### Content

* Recommendation title
* Status
* Reason
* Suggested action
* Generated date

---

## 6.6 Quick Actions

**Priority:** P1

The dashboard should provide quick navigation actions.

### Actions

```txt
Add Farm
View Farms
Check Weather
Get Recommendation
View History
Update Profile
```

Each action should include:

* Icon
* Label
* Route
* Hover and focus state

---

## 6.7 Recent Weather History

**Priority:** P1

Display a small list or table of recent weather records.

### Fields

* Date
* Temperature
* Humidity
* Rain probability
* Weather condition

---

## 6.8 Recent Recommendation History

**Priority:** P1

Display recent recommendation records.

### Fields

* Date
* Farm
* Recommendation
* Status

---

## 6.9 Dashboard Charts

**Priority:** P2

Optional dashboard charts may show:

* Temperature trend
* Humidity trend
* Rain-probability trend
* Recommendation count by status

Use Recharts or Chart.js.

---

## 6.10 Dashboard Partial Failure Handling

**Priority:** P1

If one dashboard API fails:

* Other dashboard sections should remain usable.
* The failed card should display its own error state.
* The complete page should not crash.

---

# 7. Farm Management Features

## 7.1 Add Farm

**Priority:** P0

Farmers can register one or more farms.

### Farm Fields

* Farm name
* Crop name
* Farm area
* Area unit
* State
* District
* Village
* Latitude
* Longitude

### Behaviour

* Validate required fields.
* Require an area greater than zero.
* Require a selected map location.
* Associate the farm with the authenticated user.
* Display a success message.
* Prevent duplicate form submissions.

---

## 7.2 View My Farms

**Priority:** P0

Display all farms owned by the authenticated farmer.

### Display Options

* Card layout
* Responsive table layout

### Farm Information

* Farm name
* Crop
* Area
* State
* District
* Village
* Location
* Current status
* Available actions

### Actions

* View
* Edit
* Delete
* Check Weather
* Get Recommendation

---

## 7.3 Search Farms

**Priority:** P1

Users can search farms by farm name.

### Behaviour

* Search should be case-insensitive.
* Search should update the visible farm list.
* Display a no-results state when no farm matches.

---

## 7.4 Filter Farms by Crop

**Priority:** P2

Users may filter farms by crop type.

### Example Filters

* All Crops
* Sugarcane
* Wheat
* Rice
* Cotton
* Other

---

## 7.5 View Farm Details

**Priority:** P0

Display complete information for one owned farm.

### Sections

* Farm information
* Crop information
* Area
* Full address
* Coordinates
* Map marker
* Current weather
* Latest recommendation
* Recent history

### Security

The backend must confirm that the farm belongs to the authenticated user.

---

## 7.6 Edit Farm

**Priority:** P0

Farmers can update farms they own.

### Editable Fields

* Farm name
* Crop
* Area
* Area unit
* State
* District
* Village
* Latitude
* Longitude

### Behaviour

* Load current values into the form.
* Validate changes.
* Update the map marker when coordinates change.
* Display a success message.
* Reject access to another user's farm.

---

## 7.7 Delete Farm

**Priority:** P0

Farmers can delete farms they own.

### Behaviour

* Display a confirmation dialog.
* Allow cancellation.
* Disable the confirmation button during deletion.
* Remove the farm from the visible list after success.
* Display an error if deletion fails.

### Confirmation Example

```txt
Are you sure you want to delete this farm?
This action cannot be undone.
```

---

## 7.8 Multiple Farm Support

**Priority:** P0

A farmer can register multiple farms.

Each farm should have independent:

* Location
* Weather information
* Recommendation
* Weather history
* Recommendation history

---

## 7.9 Farm Ownership Protection

**Priority:** P0

Users can access only their own farms.

The backend must verify ownership before:

* Viewing a farm
* Editing a farm
* Deleting a farm
* Fetching weather
* Generating recommendations
* Viewing farm history

---

# 8. Map and Location Features

## 8.1 OpenStreetMap Integration

**Priority:** P0

The system should use:

* OpenStreetMap
* Leaflet
* React Leaflet

No Google Maps billing should be required.

---

## 8.2 India-Centred Initial Map

**Priority:** P0

The map should initially display India.

```js
const INDIA_CENTER = [20.5937, 78.9629];
```

The zoom level should show most of India clearly.

---

## 8.3 Click-to-Select Location

**Priority:** P0

Users can click the map to select a farm location.

### Behaviour

* Capture latitude.
* Capture longitude.
* Place a marker.
* Display selected coordinates.
* Update the marker when the user clicks elsewhere.

---

## 8.4 Location Marker

**Priority:** P0

The selected location should use a visible map marker.

### Marker Popup

The popup may display:

* Farm name
* Latitude
* Longitude
* Selected location message

---

## 8.5 Reset Location

**Priority:** P1

Users can reset the selected map location.

### Behaviour

* Remove the marker.
* Clear latitude and longitude.
* Require a new location before saving.

---

## 8.6 Coordinate Validation

**Priority:** P0

Latitude must be between:

```txt
-90 and 90
```

Longitude must be between:

```txt
-180 and 180
```

Invalid coordinates must be rejected.

---

## 8.7 Display Existing Farm Location

**Priority:** P0

Farm-details and edit pages should display the saved location.

### Behaviour

* Centre the map near the saved location.
* Display the existing marker.
* Allow marker movement on edit pages.

---

## 8.8 Map Loading State

**Priority:** P1

Display a loading placeholder while the map initializes.

The page should not show an empty broken area.

---

## 8.9 Map Error State

**Priority:** P1

If the map fails to load:

* Display a clear error.
* Keep the form usable where possible.
* Do not allow submission without valid coordinates.

---

## 8.10 Reverse Geocoding

**Priority:** P2

The system may convert coordinates into a readable place name using Nominatim or another geocoding service.

Possible output:

```txt
Baramati, Pune, Maharashtra, India
```

Manual state, district, and village entry should still remain available.

---

## 8.11 India-Bound Location Validation

**Priority:** P2

The system may optionally reject locations outside India.

This can use:

* Approximate coordinate boundaries
* Reverse-geocoded country code

---

# 9. Weather Features

## 9.1 Current Weather Retrieval

**Priority:** P0

The backend fetches weather using the farm's stored latitude and longitude.

### Flow

```txt
Select Farm
    ↓
Load Farm Coordinates
    ↓
Call OpenWeather API
    ↓
Normalize Weather Data
    ↓
Return Weather to Frontend
```

The frontend should not directly use the private API key.

---

## 9.2 Temperature Display

**Priority:** P0

Display temperature in Celsius.

Example:

```txt
34°C
```

---

## 9.3 Humidity Display

**Priority:** P0

Display humidity as a percentage.

Example:

```txt
68%
```

---

## 9.4 Wind Speed Display

**Priority:** P0

Display wind speed using a clear unit.

Example:

```txt
12 km/h
```

---

## 9.5 Atmospheric Pressure

**Priority:** P1

Display pressure when available.

Example:

```txt
1009 hPa
```

---

## 9.6 Rain Probability

**Priority:** P0

Display the probability of rainfall.

Example:

```txt
Rain Probability: 40%
```

This value is required for the irrigation recommendation.

---

## 9.7 Weather Condition

**Priority:** P0

Display the main weather condition.

Examples:

* Clear
* Clouds
* Rain
* Thunderstorm
* Mist

---

## 9.8 Weather Description

**Priority:** P1

Display a user-friendly weather description.

Example:

```txt
Partly cloudy
```

---

## 9.9 Weather Icon

**Priority:** P1

Display an icon matching the current condition.

Icons may come from:

* OpenWeather
* Lucide React
* Local weather icons

---

## 9.10 Last Updated Time

**Priority:** P1

Display when the weather was last fetched.

Example:

```txt
Last updated: 22 July 2026, 4:30 PM
```

---

## 9.11 Farm Selector

**Priority:** P0

The Weather page should allow the user to select one of their farms.

### Behaviour

* Load owned farms only.
* Select a default farm where appropriate.
* Refresh weather when the farm changes.
* Display an empty state when no farms exist.

---

## 9.12 Weather Refresh

**Priority:** P1

Allow users to manually refresh weather information.

### Behaviour

* Display a loading state.
* Prevent repeated rapid requests.
* Update the last-updated time.
* Save the new record when appropriate.

---

## 9.13 Five-Day Forecast

**Priority:** P2

The application may display a weather forecast.

### Forecast Values

* Date
* Minimum temperature
* Maximum temperature
* Rain probability
* Weather condition
* Icon

---

## 9.14 Weather History

**Priority:** P1

Store and display previous weather records.

### Fields

* Date
* Temperature
* Humidity
* Wind speed
* Pressure
* Rain probability
* Condition

---

## 9.15 Weather Charts

**Priority:** P2

Display historical weather data using charts.

Possible charts:

* Temperature line chart
* Humidity line chart
* Rain-probability bar chart

---

## 9.16 Weather API Failure Handling

**Priority:** P0

If weather cannot be fetched:

* Display a user-friendly error.
* Do not display fabricated weather values.
* Do not generate a fake recommendation.
* Provide a retry action.

### Example Error

```txt
Unable to fetch weather information.
Please check your internet connection and try again.
```

---

# 10. Irrigation Recommendation Features

## 10.1 Rule-Based Recommendation Engine

**Priority:** P0

The backend generates recommendations using predefined weather rules.

The frontend must not be the source of truth.

---

## 10.2 Rule Priority

**Priority:** P0

Rules must run in this order:

```txt
1. Rain probability
2. Humidity
3. Temperature
4. Default condition
```

---

## 10.3 No Irrigation Required

**Priority:** P0

Condition:

```txt
Rain probability > 60%
```

Result:

```txt
No Irrigation Required
```

Suggested reason:

```txt
Rainfall is expected, so irrigation may not be required.
```

Suggested action:

```txt
Delay irrigation and monitor rainfall conditions.
```

---

## 10.4 Delay Irrigation

**Priority:** P0

Condition:

```txt
Humidity > 80%
```

Result:

```txt
Delay Irrigation
```

Suggested reason:

```txt
The humidity level is high, which may reduce immediate water loss.
```

Suggested action:

```txt
Check the weather again before irrigating.
```

---

## 10.5 Irrigate Today

**Priority:** P0

Condition:

```txt
Temperature > 35°C
```

Result:

```txt
Irrigate Today
```

Suggested reason:

```txt
The temperature is high and may increase crop water demand.
```

Suggested action:

```txt
Consider irrigating the farm today.
```

---

## 10.6 Monitor Weather

**Priority:** P0

Condition:

```txt
No higher-priority rule matched
```

Result:

```txt
Monitor Weather
```

Suggested reason:

```txt
No critical irrigation condition was detected.
```

Suggested action:

```txt
Continue monitoring weather conditions before irrigating.
```

---

## 10.7 Recommendation Card

**Priority:** P0

Display the recommendation in a prominent card.

### Content

* Farm name
* Recommendation title
* Status badge
* Weather summary
* Reason
* Recommended action
* Generated time
* Disclaimer

---

## 10.8 Recommendation Colour States

**Priority:** P1

Recommended visual styles:

```txt
No Irrigation Required — Green
Delay Irrigation — Amber
Irrigate Today — Blue
Monitor Weather — Sky Blue
Error — Red
```

Colour must not be the only status indicator.

---

## 10.9 Recommendation Disclaimer

**Priority:** P0

Display this or equivalent text:

```txt
This recommendation is based on weather information and predefined rules.
It should be treated as an advisory and not as a replacement for professional agricultural guidance.
```

---

## 10.10 Save Recommendation

**Priority:** P0

Generated recommendations should be stored in MongoDB.

Store:

* User ID
* Farm ID
* Weather snapshot
* Recommendation
* Status
* Reason
* Recommended action
* Creation date

---

## 10.11 Recommendation History

**Priority:** P1

Users can view previous recommendations for owned farms.

### Fields

* Date
* Farm
* Weather summary
* Recommendation
* Reason
* Action
* Status

---

## 10.12 Recommendation Loading State

**Priority:** P1

Display progress while generating a recommendation.

Example:

```txt
Generating recommendation...
```

Prevent duplicate requests during loading.

---

## 10.13 Recommendation Error State

**Priority:** P0

If weather data is unavailable:

* Do not create a recommendation.
* Display an error message.
* Provide a weather-retry action.

---

## 10.14 Suggested Irrigation Duration

**Priority:** P2

The system may display an approximate duration when the result is `Irrigate Today`.

Example:

```txt
Suggested duration: approximately 2 hours
```

This must be clearly labelled as a simple prototype suggestion, not a scientific calculation.

---

# 11. History Features

## 11.1 Combined History Page

**Priority:** P1

The History page can show:

* Weather history
* Recommendation history

These may use separate tabs.

---

## 11.2 Weather History Table

**Priority:** P1

Columns:

* Date
* Farm
* Temperature
* Humidity
* Rain probability
* Condition

---

## 11.3 Recommendation History Table

**Priority:** P1

Columns:

* Date
* Farm
* Recommendation
* Status
* Reason
* Action

---

## 11.4 Filter by Farm

**Priority:** P1

Users can display records from a selected farm.

---

## 11.5 Filter by Date

**Priority:** P2

Users may filter by:

* Single date
* Date range
* Recent seven days
* Recent thirty days

---

## 11.6 Filter by Recommendation Status

**Priority:** P2

Possible filters:

* All
* No Irrigation Required
* Delay Irrigation
* Irrigate Today
* Monitor Weather

---

## 11.7 Search History

**Priority:** P2

Search may match:

* Farm name
* Weather condition
* Recommendation

---

## 11.8 Pagination

**Priority:** P1

Large history lists should use pagination.

### Pagination Data

* Current page
* Page size
* Total records
* Total pages

---

## 11.9 Mobile History Layout

**Priority:** P1

On smaller screens:

* Tables should scroll horizontally, or
* Records should use responsive cards.

---

## 11.10 History Empty State

**Priority:** P1

Example:

```txt
No history records are available yet.

Fetch weather or generate a recommendation to create your first record.
```

---

## 11.11 Export History

**Priority:** P2

Users may export history as:

* CSV
* PDF

The feature is optional for the first version.

---

# 12. Profile Features

## 12.1 View Profile

**Priority:** P0

Display:

* Avatar or initials
* Full name
* Email
* Mobile number
* User role
* Account creation date
* Number of farms

---

## 12.2 Update Profile

**Priority:** P1

Users can update:

* Full name
* Mobile number

Email update is optional and may require verification.

---

## 12.3 Profile Avatar

**Priority:** P2

The profile may display:

* User initials
* Generated avatar
* Uploaded image in a future version

For the MVP, initials are sufficient.

---

## 12.4 Change Password

**Priority:** P1

Users can securely update their password.

---

## 12.5 Account Status

**Priority:** P2

Display account status:

```txt
Active
Inactive
Suspended
```

Farmers should normally see only their current status.

---

## 12.6 Account Deletion

**Priority:** P3

A future version may allow users to request account deletion.

This requires:

* Confirmation
* Password verification
* Data-retention decision
* Related farm-record handling

---

# 13. Navigation Features

## 13.1 Public Navbar

**Priority:** P0

Menu items:

```txt
Home
About
Features
Contact
Login
Register
```

### Behaviour

* Sticky header
* Active link styling
* Mobile menu
* Login and register actions

---

## 13.2 Farmer Sidebar

**Priority:** P0

Menu items:

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

### Behaviour

* Dark navy background
* Blue active item
* Lucide icons
* Hover state
* Mobile drawer

---

## 13.3 Dashboard Header

**Priority:** P1

Header content:

* Mobile menu button
* Page title
* Notification icon, optional
* User name
* User avatar
* Profile dropdown

---

## 13.4 Active Route Highlighting

**Priority:** P0

The current route should be visibly highlighted using React Router `NavLink`.

---

## 13.5 Protected Routes

**Priority:** P0

Protected routes include:

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

Unauthenticated users should be redirected to login.

---

## 13.6 Breadcrumbs

**Priority:** P2

Optional breadcrumbs may appear on nested pages.

Example:

```txt
Dashboard / Farms / Patil Farm
```

---

# 14. User Interface Features

## 14.1 Blue Design System

**Priority:** P0

The complete application should use:

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

---

## 14.2 Responsive Design

**Priority:** P0

Support:

* Mobile
* Tablet
* Laptop
* Desktop

Test widths:

```txt
320px
375px
425px
768px
1024px
1280px
1440px
```

---

## 14.3 Reusable Components

**Priority:** P0

Required reusable components include:

```txt
Navbar
Footer
Sidebar
Header
PageHeader
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
WeatherCard
FarmCard
RecommendationCard
MapSelector
HistoryTable
ProtectedRoute
```

---

## 14.4 Loading States

**Priority:** P0

Loading states must exist for:

* Registration
* Login
* Dashboard
* Profile
* Farms
* Farm submission
* Map
* Weather
* Recommendation
* History
* Delete operations

---

## 14.5 Skeleton Loading

**Priority:** P1

Use skeleton cards for dashboard, weather, and history loading.

---

## 14.6 Empty States

**Priority:** P0

Empty states are required for:

* No farms
* No weather history
* No recommendations
* No search results
* No selected farm

---

## 14.7 Error States

**Priority:** P0

Error states are required for:

* Server unavailable
* Database failure
* Weather API failure
* Invalid form
* Missing farm
* Unauthorized access
* Map failure
* Session expiration

---

## 14.8 Toast Notifications

**Priority:** P1

Display concise notifications for:

* Registration success
* Login success
* Logout success
* Farm created
* Farm updated
* Farm deleted
* Profile updated
* Password changed
* Weather error
* Recommendation error

---

## 14.9 Confirmation Dialogs

**Priority:** P1

Use confirmation dialogs for:

* Farm deletion
* Logout, optional
* Destructive administrator actions

---

## 14.10 Form Validation Feedback

**Priority:** P0

All forms should provide:

* Visible labels
* Required indicators
* Inline error messages
* Focus states
* Disabled states
* Submission states

---

## 14.11 Accessibility

**Priority:** P1

The interface should support:

* Keyboard navigation
* Visible focus states
* Semantic HTML
* Accessible labels
* Alt text
* Sufficient contrast
* Screen-reader-friendly errors
* Non-colour status indicators

---

# 15. Security Features

## 15.1 Password Hashing

**Priority:** P0

Passwords must be hashed before database storage.

Plain passwords must never be stored.

---

## 15.2 JWT Authentication

**Priority:** P0

Protected endpoints require a valid JWT access token.

---

## 15.3 Token Expiration

**Priority:** P0

Tokens must have a configured expiration time.

Expired tokens must be rejected.

---

## 15.4 Farm Ownership Authorization

**Priority:** P0

Every farm-specific backend operation must verify ownership.

---

## 15.5 Role Protection

**Priority:** P1

Administrator routes must reject farmer accounts.

Public registration must always assign the farmer role.

---

## 15.6 Backend Weather API Protection

**Priority:** P0

The OpenWeather API key must remain in the backend environment file.

It must not appear in frontend source code.

---

## 15.7 Environment Variable Protection

**Priority:** P0

Secrets must use environment variables.

Required backend variables may include:

```env
MONGODB_URL=
DATABASE_NAME=
JWT_SECRET_KEY=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
OPENWEATHER_API_KEY=
FRONTEND_URL=
```

---

## 15.8 Sensitive Response Protection

**Priority:** P0

API responses must not include:

* Password
* Password hash
* JWT secret
* API key
* Database URL
* Stack trace
* Internal file path

---

## 15.9 Duplicate Submission Protection

**Priority:** P1

Buttons should be disabled during form submission to prevent:

* Duplicate user creation
* Duplicate farm creation
* Repeated deletion
* Repeated recommendation creation

---

## 15.10 CORS Configuration

**Priority:** P1

The backend should allow approved frontend origins only.

---

# 16. Error-Handling Features

## 16.1 Form Errors

**Priority:** P0

Display field-level validation messages.

Example:

```txt
Please enter a valid email address.
```

---

## 16.2 Authentication Errors

**Priority:** P0

Examples:

```txt
Invalid email or password.

Your session has expired. Please log in again.

You do not have permission to access this page.
```

---

## 16.3 Farm Errors

**Priority:** P0

Examples:

```txt
Farm not found.

You cannot access this farm.

Unable to save farm information.
```

---

## 16.4 Weather Errors

**Priority:** P0

Examples:

```txt
Unable to fetch weather information.

The weather service is currently unavailable.

Please try again later.
```

---

## 16.5 Network Errors

**Priority:** P0

Example:

```txt
Unable to connect to the server.
Please check your internet connection.
```

---

## 16.6 Safe Fallback Values

**Priority:** P1

Missing optional values should display:

```txt
Not available
```

The UI must not display:

```txt
undefined
null
NaN
[object Object]
```

---

# 17. Administrator Features

Administrator features are optional for the first version.

## 17.1 Admin Login

**Priority:** P2

Administrators use the standard login system with role-based redirection.

---

## 17.2 Admin Dashboard

**Priority:** P2

Display:

* Total users
* Active users
* Total farms
* Weather-record count
* Recommendation count
* Recent users
* Recent farms

---

## 17.3 User Management

**Priority:** P2

Administrators may:

* View users
* Search users
* Filter users
* View user details
* Activate accounts
* Deactivate accounts
* Suspend accounts

Administrators must never see password hashes.

---

## 17.4 Farm Monitoring

**Priority:** P2

Administrators may view all registered farms.

Possible filters:

* Farmer
* State
* District
* Crop

---

## 17.5 Weather Records

**Priority:** P2

Administrators may view system weather records.

---

## 17.6 Recommendation Records

**Priority:** P2

Administrators may view generated recommendations.

---

## 17.7 Reports

**Priority:** P3

Administrators may export summary reports.

Possible formats:

* CSV
* PDF

---

# 18. Future Features

## 18.1 Multi-Language Support

**Priority:** P3

Possible languages:

* English
* Hindi
* Marathi
* Kannada

---

## 18.2 SMS Alerts

**Priority:** P3

Send notifications for:

* Expected rain
* High temperature
* Irrigation recommendation
* Weather warning

---

## 18.3 WhatsApp Alerts

**Priority:** P3

Send advisory messages through WhatsApp integration.

---

## 18.4 Mobile Application

**Priority:** P3

Develop a mobile application using:

* React Native
* Flutter

---

## 18.5 Soil-Moisture Sensors

**Priority:** P3

Integrate IoT devices for actual soil-moisture data.

---

## 18.6 Automatic Pump Control

**Priority:** P3

Future versions may control irrigation pumps using:

* Relay module
* ESP32
* Scheduling logic
* Safety controls

---

## 18.7 Crop-Specific Rules

**Priority:** P3

Different crops may use different:

* Temperature thresholds
* Water requirements
* Humidity rules
* Irrigation durations

---

## 18.8 Machine Learning

**Priority:** P3

Future models may predict:

* Next irrigation date
* Irrigation duration
* Crop water demand
* Water stress
* Yield

This is explicitly excluded from the current version.

---

## 18.9 Government Agriculture Integration

**Priority:** P3

Future versions may connect to:

* Government weather alerts
* Crop advisory services
* Agricultural schemes
* Local-language information

---

## 18.10 Advanced Analytics

**Priority:** P3

Possible analytics:

* Water-use trends
* Regional weather patterns
* Farm comparison
* Recommendation accuracy
* Crop-based statistics

---

# 19. MVP Feature Set

The minimum viable product must include:

```txt
User Registration
User Login
User Logout
JWT Authentication
Protected Routes
Dashboard
Add Farm
My Farms
Farm Details
Edit Farm
Delete Farm
OpenStreetMap
Location Selection
Latitude and Longitude Storage
Current Weather
Rain Probability
Rule-Based Recommendation
Weather History
Recommendation History
Profile
Responsive UI
Loading States
Empty States
Error States
```

The MVP is incomplete if any of these critical features are missing:

```txt
Authentication
Farm Management
Location Selection
Weather Integration
Recommendation Logic
Ownership Protection
```

---

# 20. Feature Dependencies

## Authentication Dependency

The following features require authentication:

* Dashboard
* Farm management
* Weather
* Recommendation
* History
* Profile

## Farm Dependency

The following features require at least one farm:

* Farm-specific weather
* Irrigation recommendation
* Weather history
* Recommendation history

## Location Dependency

The following features require valid coordinates:

* Weather retrieval
* Weather history
* Irrigation recommendation

## Weather Dependency

The recommendation feature requires valid weather data.

The system must not generate a recommendation when weather retrieval fails.

---

# 21. Feature Workflow

```txt
Visitor opens website
        │
        ▼
Registers account
        │
        ▼
Logs in
        │
        ▼
Views dashboard
        │
        ▼
Adds farm
        │
        ▼
Selects map location
        │
        ▼
Saves coordinates
        │
        ▼
Fetches live weather
        │
        ▼
Generates recommendation
        │
        ▼
Views saved history
        │
        ▼
Manages profile
        │
        ▼
Logs out
```

---

# 22. Feature Acceptance Checklist

## Authentication

* Registration works.
* Duplicate email is rejected.
* Login works.
* Invalid login is rejected.
* Token is created.
* Protected routes work.
* Logout works.
* Expired session is handled.

## Farm Management

* Farm can be added.
* Location is required.
* Coordinates are stored.
* Owned farms are displayed.
* Farm can be edited.
* Farm can be deleted.
* Other users' farms cannot be accessed.

## Map

* India map loads.
* Marker can be placed.
* Marker can be moved.
* Coordinates update.
* Existing location is displayed.
* Mobile map is usable.

## Weather

* Weather uses stored coordinates.
* Temperature is displayed.
* Humidity is displayed.
* Rain probability is displayed.
* API errors are handled.
* Weather history is stored.
* API key is not exposed.

## Recommendation

* Rule order is correct.
* Rain rule works.
* Humidity rule works.
* Temperature rule works.
* Default rule works.
* Reason is displayed.
* Action is displayed.
* Disclaimer is displayed.
* Record is stored.

## Interface

* Blue theme is consistent.
* Sidebar works.
* Mobile navigation works.
* Forms have validation.
* Loading states exist.
* Empty states exist.
* Error states exist.
* 404 page works.

---

# 23. Related Documents

| Document           | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `PRD.md`           | Product definition and goals               |
| `REQUIREMENTS.md`  | Functional and non-functional requirements |
| `USERS.md`         | User roles and access                      |
| `ARCHITECTURE.md`  | Technical architecture                     |
| `DECISIONS.md`     | Technical decisions                        |
| `UI_GUIDELINES.md` | Design system                              |
| `TESTING_PLAN.md`  | Testing strategy                           |
| `DATABASE.md`      | Database collections and relationships     |
| `API.md`           | API endpoint definitions                   |
| `FRONTEND.md`      | Frontend implementation                    |
| `BACKEND.md`       | Backend implementation                     |
| `TASKS.md`         | Development work plan                      |
| `TODO.md`          | Current pending tasks                      |

---

# 24. Rules for Codex

Codex must follow these feature rules:

* Implement P0 features before P1 and P2.
* Do not add Machine Learning.
* Do not add IoT functionality.
* Use React with Vite.
* Use FastAPI.
* Use MongoDB.
* Use OpenStreetMap and Leaflet.
* Fetch weather through the backend.
* Never expose the weather API key.
* Use JWT authentication.
* Verify farm ownership.
* Keep recommendation logic in the backend.
* Apply recommendation rules in the documented order.
* Do not fabricate weather data.
* Do not generate recommendations without valid weather.
* Use reusable frontend components.
* Include loading, empty, success, and error states.
* Use the blue UI design system.
* Keep public and protected layouts separate.
* Keep frontend and backend code modular.
* Follow `REQUIREMENTS.md` and `ARCHITECTURE.md`.
* Write tests for every critical P0 feature.

When documentation conflicts, use this priority:

```txt
1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. PRD.md
5. FEATURES.md
6. UI_GUIDELINES.md
7. TASKS.md
8. TODO.md
```

---

# 25. Final Feature Summary

The completed product must allow a farmer to:

```txt
Create an account
      ↓
Log in securely
      ↓
Register multiple farms
      ↓
Select farm locations on an India map
      ↓
Fetch live weather using coordinates
      ↓
Receive rule-based irrigation advice
      ↓
View weather and recommendation history
      ↓
Manage farms and profile
      ↓
Log out securely
```

The final feature set must be:

* Functional
* Secure
* Responsive
* Modular
* Consistent
* Easy to use
* Easy to test
* Suitable for college submission
* Ready for future expansion
