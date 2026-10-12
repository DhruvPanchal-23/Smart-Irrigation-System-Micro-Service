> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

Frontend Documentation
1. Document Purpose

This document defines the frontend architecture, folder structure, responsibilities, implementation rules, component relationships, page behaviour, state management, API communication, validation, routing, and styling conventions for the Weather-Based Smart Irrigation Advisory System.

The frontend allows farmers to:

Register and log in
View the dashboard
Add and manage farms
Select farm locations using OpenStreetMap
View current weather and forecasts
Generate irrigation recommendations
View and update their profiles
Navigate securely through protected routes

The frontend uses:

React.js
Vite
Tailwind CSS
React Router DOM
Axios
React Hook Form
React Leaflet
Leaflet
Lucide React
Recharts
React Hot Toast
2. Frontend Responsibilities

The frontend is responsible for:

Rendering the user interface
Handling user interactions
Managing authentication state
Validating form input
Communicating with the FastAPI backend
Displaying farms, weather, recommendations, and user data
Displaying OpenStreetMap
Handling loading, success, empty, and error states
Protecting authenticated routes
Providing responsive layouts
Displaying accessible feedback

The frontend must not:

Connect directly to MongoDB
Store plain-text passwords
Contain the OpenWeather secret API key
Generate the official irrigation recommendation
Trust client-side validation as final validation
Contain database operations
Contain backend authorization logic
Expose JWT secrets
Fabricate live weather information

The backend remains the source of truth for:

Authentication
Authorization
Farm ownership
User roles
Weather retrieval
Recommendation generation
Database operations
3. Frontend Folder Structure
frontend/
├── public/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Alert.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── farm/
│   │   │   ├── FarmCard.jsx
│   │   │   ├── FarmForm.jsx
│   │   │   └── FarmList.jsx
│   │   │
│   │   ├── map/
│   │   │   ├── IndiaMap.jsx
│   │   │   ├── LocationPicker.jsx
│   │   │   └── MarkerPopup.jsx
│   │   │
│   │   ├── recommendation/
│   │   │   ├── RecommendationCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   └── weather/
│   │       ├── ForecastCard.jsx
│   │       ├── WeatherCard.jsx
│   │       ├── WeatherChart.jsx
│   │       └── WeatherDetails.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFarms.js
│   │   └── useWeather.js
│   │
│   ├── layouts/
│   │   ├── DashboardLayout.jsx
│   │   └── MainLayout.jsx
│   │
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── AddFarm.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── Recommendation.jsx
│   │   ├── Register.jsx
│   │   └── Weather.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── farmService.js
│   │   ├── recommendationService.js
│   │   └── weatherService.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── .env.example
├── package.json
├── vite.config.js
└── README.md
4. Application Data Flow

The normal frontend request flow should be:

Page or Component
       │
       ▼
Custom Hook
       │
       ▼
Service Function
       │
       ▼
Shared Axios Instance
       │
       ▼
FastAPI Backend
       │
       ▼
Response Returned
       │
       ▼
Hook Updates State
       │
       ▼
Component Renders Result

Example weather flow:

Weather.jsx
    │
    ▼
useWeather()
    │
    ▼
weatherService.getCurrentWeather()
    │
    ▼
api.get("/weather/{farmId}")
    │
    ▼
FastAPI
    │
    ▼
Weather data returned
    │
    ▼
WeatherCard and WeatherDetails render
5. Components Directory

The components directory contains reusable UI elements.

Components should:

Receive data through props
Avoid unnecessary API requests
Avoid page-specific routing logic
Be reusable across multiple pages
Support loading and error states
Use consistent styling
Use accessible HTML
Avoid direct manipulation of global state unless specifically designed for it
6. Common Components
6.1 components/common/Alert.jsx
Purpose

Displays feedback messages such as:

Success messages
Error messages
Warning messages
Informational messages
Example Uses
Registration successful
Farm deleted successfully
Unable to fetch weather
Your session has expired
Suggested Props
<Alert
  type="success"
  title="Farm saved"
  message="Your farm was added successfully."
  onClose={handleClose}
/>
Recommended Props
Prop	Type	Purpose
type	String	success, error, warning, or info
title	String	Optional alert heading
message	String	Main alert message
onClose	Function	Closes the alert
dismissible	Boolean	Determines whether close button is shown
Behaviour

The component should:

Change icon based on alert type
Change border and background based on alert type
Provide an accessible role
Include a close button when dismissible
Avoid displaying technical backend errors directly
Accessibility

Use:

role="alert"

For urgent errors, use:

aria-live="assertive"

For general information, use:

aria-live="polite"
6.2 components/common/Button.jsx
Purpose

Provides a reusable button with consistent styles.

Button Variants
primary
secondary
danger
outline
ghost
Suggested Usage
<Button
  type="submit"
  variant="primary"
  loading={isSubmitting}
  disabled={isSubmitting}
>
  Save Farm
</Button>
Recommended Props
Prop	Type	Purpose
children	ReactNode	Button label
type	String	button, submit, or reset
variant	String	Visual style
size	String	sm, md, or lg
loading	Boolean	Displays loading indicator
disabled	Boolean	Disables interaction
icon	Component	Optional icon
onClick	Function	Click handler
fullWidth	Boolean	Makes button full width
className	String	Additional styles
Behaviour

The component should:

Disable itself while loading
Show a spinner during loading
Prevent repeated form submission
Support icons
Support keyboard interaction
Preserve the correct HTML type
Example Implementation Rule

Do not make every button default to submit.

Default reusable button type should normally be:

type="button"

Form submit buttons should explicitly use:

type="submit"
6.3 components/common/Footer.jsx
Purpose

Displays the footer for public pages.

Content

The footer may contain:

Project name
Short project description
Navigation links
Technology names
Contact details
Copyright
Academic disclaimer
Suggested Sections
Project Information
Quick Links
Technology
Contact
Copyright
Behaviour

The footer should:

Use a dark navy background
Use readable light text
Stack sections on mobile
Display links with hover and focus states
Avoid appearing inside authenticated dashboard pages unless required
Example Disclaimer
This system is an academic prototype and provides weather-based advisory information only.
6.4 components/common/Loader.jsx
Purpose

Displays loading feedback while data is being fetched or processed.

Loader Types

The component may support:

spinner
page
inline
button
overlay
Suggested Props
Prop	Type	Purpose
size	String	Loader size
message	String	Loading description
fullScreen	Boolean	Covers the complete screen
className	String	Additional styling
Example Usage
<Loader message="Loading weather information..." />
Behaviour

The loader should:

Clearly indicate that work is in progress
Avoid freezing the entire interface unnecessarily
Display meaningful text for longer operations
Be accessible to screen readers
Good Loading Messages
Loading dashboard...
Loading farms...
Fetching weather...
Generating recommendation...
Updating profile...
6.5 components/common/Modal.jsx
Purpose

Displays content above the current page.

Use Cases
Delete confirmation
Farm details preview
Important warnings
Logout confirmation
Success confirmation
Suggested Props
Prop	Type	Purpose
isOpen	Boolean	Controls visibility
title	String	Modal heading
children	ReactNode	Modal content
onClose	Function	Closes modal
size	String	Modal width
closeOnOverlay	Boolean	Allows overlay click closing
showCloseButton	Boolean	Displays close icon
Behaviour

The component should:

Render only when open
Disable background scrolling
Trap keyboard focus inside the modal
Close using the Escape key
Return focus to the previous element after closing
Include an overlay
Prevent accidental deletion without confirmation
Accessibility

Use:

role="dialog"
aria-modal="true"
aria-labelledby="modal-title"
6.6 components/common/Navbar.jsx
Purpose

Displays public-site navigation.

Public Navigation
Home
About
Features
Contact
Login
Register
Behaviour

The navbar should:

Display the project logo
Display desktop navigation
Display a hamburger button on mobile
Highlight the active route
Use NavLink
Remain sticky when scrolling
Show Login and Register actions for guests
Optionally show Dashboard for authenticated users
State

The component may use local state for:

const [isMenuOpen, setIsMenuOpen] = useState(false);
Mobile Behaviour

When a navigation link is clicked:

Navigate to the route
Close the mobile menu
Security Note

The navbar should not determine whether a user is actually authorized. It only controls visual navigation.

6.7 components/common/Sidebar.jsx
Purpose

Displays authenticated dashboard navigation.

Navigation Items
Dashboard
Add Farm
My Farms
Weather
Recommendation
Profile
Logout

A history item may be added if a dedicated History page is later created.

Suggested Props
Prop	Type	Purpose
isOpen	Boolean	Mobile sidebar state
onClose	Function	Closes mobile sidebar
onLogout	Function	Handles logout
Behaviour

The sidebar should:

Use a dark navy background
Highlight the active route
Use Lucide icons
Be fixed on desktop
Work as an overlay drawer on mobile
Close after mobile navigation
Provide a Logout action
Show the current user name or role where appropriate
Active Route Style
Blue background
White text
Visible icon
Inactive Route Style
Slate text
Navy background
Lighter hover background
7. Farm Components
7.1 components/farm/FarmCard.jsx
Purpose

Displays one farm in a card format.

Data Displayed
Farm name
Crop name
Area
Area unit
Village
District
State
Coordinates
Creation date
Optional weather status
Actions
View
Edit
Delete
Check Weather
Get Recommendation
Suggested Props
<FarmCard
  farm={farm}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onWeather={handleWeather}
/>
Recommended Props
Prop	Type	Purpose
farm	Object	Farm data
onView	Function	Opens farm details
onEdit	Function	Opens edit flow
onDelete	Function	Requests deletion
onWeather	Function	Opens weather page
loading	Boolean	Displays loading state
Behaviour

The component should:

Display safe fallback text
Format the area correctly
Avoid rendering undefined
Use an accessible action menu or clear buttons
Avoid making the entire card unintentionally clickable
7.2 components/farm/FarmForm.jsx
Purpose

Provides a reusable form for adding or editing farms.

Used By
AddFarm.jsx
Future EditFarm.jsx
Optional farm modal
Fields
Farm Name
Crop Name
Area
Area Unit
State
District
Village
Latitude
Longitude
Suggested Props
Prop	Type	Purpose
initialValues	Object	Existing farm values for editing
onSubmit	Function	Form submission handler
loading	Boolean	Submission state
submitLabel	String	Button label
selectedLocation	Object	Current coordinates
onLocationChange	Function	Updates coordinates
mode	String	create or edit
Validation

The form should validate:

Required fields
Farm-name length
Crop-name length
Area greater than zero
Valid area unit
Valid latitude
Valid longitude
Selected map location
Behaviour

The component should:

Use React Hook Form
Display field-level errors
Populate values in edit mode
Prevent duplicate submission
Keep coordinates synchronized with the map
Reset correctly after successful creation where appropriate
Important Rule

The form must not send userId.

Farm ownership must be assigned by the authenticated backend user.

7.3 components/farm/FarmList.jsx
Purpose

Displays a collection of farms.

Responsibilities
Render multiple FarmCard components
Display loading state
Display empty state
Display no-search-results state
Pass actions to each farm card
Suggested Props
Prop	Type	Purpose
farms	Array	Farm records
loading	Boolean	Farm-list loading state
error	String	Error message
onView	Function	View handler
onEdit	Function	Edit handler
onDelete	Function	Delete handler
searchTerm	String	Current search value
Empty State
No farms added yet.

Add your first farm to start receiving weather information and irrigation recommendations.
No Results State
No farms match your search.
8. Map Components
8.1 components/map/IndiaMap.jsx
Purpose

Provides the primary OpenStreetMap container centred on India.

Default Map Position
const INDIA_CENTER = [20.5937, 78.9629];
Suggested Default Zoom
const INDIA_ZOOM = 5;
Suggested Props
Prop	Type	Purpose
center	Array	Initial map centre
zoom	Number	Initial zoom
children	ReactNode	Markers and map controls
className	String	Additional map styles
Behaviour

The component should:

Render a MapContainer
Render an OpenStreetMap TileLayer
Display OpenStreetMap attribution
Accept child map components
Use a fixed or responsive height
Preserve rounded card boundaries
Work on mobile devices
Required Leaflet Import

Leaflet CSS must be imported once:

import "leaflet/dist/leaflet.css";
Tile Layer
<TileLayer
  attribution='&copy; OpenStreetMap contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
8.2 components/map/LocationPicker.jsx
Purpose

Captures the location selected by the user.

Behaviour

When the user clicks the map:

Read latitude
Read longitude
Update the marker
Send coordinates to the parent component
Suggested Props
<LocationPicker
  position={selectedLocation}
  onLocationChange={setSelectedLocation}
/>
Recommended Props
Prop	Type	Purpose
position	Object or Array	Selected coordinates
onLocationChange	Function	Sends new coordinates
disabled	Boolean	Prevents location changes
React Leaflet Hook

The component will normally use:

useMapEvents
Example Behaviour
useMapEvents({
  click(event) {
    onLocationChange({
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
    });
  },
});
Important Rule

Coordinates should be stored as numbers, not strings.

8.3 components/map/MarkerPopup.jsx
Purpose

Displays selected-location information inside a map popup.

Content
Farm name
Latitude
Longitude
Village or district
Selection confirmation
Suggested Props
Prop	Type	Purpose
farmName	String	Farm label
latitude	Number	Latitude
longitude	Number	Longitude
locationLabel	String	Readable location
Example Content
Patil Sugarcane Farm

Latitude: 18.1792
Longitude: 74.6078
Behaviour

The component should:

Format coordinates to a reasonable number of decimal places
Display fallback text when farm name is unavailable
Avoid complex actions inside the popup
9. Recommendation Components
9.1 components/recommendation/RecommendationCard.jsx
Purpose

Displays a generated irrigation recommendation.

Data Displayed
Farm name
Recommendation title
Status
Weather summary
Reason
Recommended action
Suggested duration, if available
Generated time
Advisory disclaimer
Suggested Props
<RecommendationCard
  recommendation={recommendation}
  loading={isLoading}
  error={error}
/>
Recommended Props
Prop	Type	Purpose
recommendation	Object	Recommendation data
loading	Boolean	Generation state
error	String	Error information
onRetry	Function	Retry action
Supported Statuses
no_irrigation
delay_irrigation
irrigate_today
monitor_weather
Behaviour

The component should:

Use StatusBadge
Display a clear title
Display the reason separately from the action
Display the weather snapshot
Display the advisory disclaimer
Show an error when recommendation generation fails
Never calculate the recommendation itself
9.2 components/recommendation/StatusBadge.jsx
Purpose

Displays a visual status label.

Supported Values
Status	Display Label	Recommended Style
no_irrigation	No Irrigation Required	Green
delay_irrigation	Delay Irrigation	Amber
irrigate_today	Irrigate Today	Blue
monitor_weather	Monitor Weather	Sky blue
error	Unavailable	Red
Suggested Props
<StatusBadge status="irrigate_today" />
Recommended Props
Prop	Type	Purpose
status	String	Status code
label	String	Optional custom label
size	String	Badge size
Behaviour

The component should:

Map internal status codes to readable labels
Use text and icon, not colour alone
Handle unknown status safely
Avoid displaying raw backend codes directly
10. Weather Components
10.1 components/weather/ForecastCard.jsx
Purpose

Displays one weather forecast period or day.

Data Displayed
Date
Minimum temperature
Maximum temperature
Humidity
Rain probability
Weather condition
Weather description
Weather icon
Suggested Props
<ForecastCard forecast={forecastItem} />
Behaviour

The component should:

Format the date
Format temperatures with °C
Format rain probability with %
Display fallback values safely
Remain compact on smaller screens
Note

Forecast support is optional for the MVP.

10.2 components/weather/WeatherCard.jsx
Purpose

Displays a single weather metric.

Example Metrics
Temperature
Humidity
Wind speed
Pressure
Rain probability
Suggested Usage
<WeatherCard
  title="Temperature"
  value="34°C"
  icon={Thermometer}
  description="Feels like 36°C"
/>
Recommended Props
Prop	Type	Purpose
title	String	Metric name
value	String or Number	Main value
icon	Component	Metric icon
description	String	Additional details
loading	Boolean	Skeleton state
Behaviour

The component should:

Use a consistent card layout
Display an icon
Display safe fallback values
Support loading skeletons
Use blue-themed icon containers
10.3 components/weather/WeatherChart.jsx
Purpose

Displays weather history visually.

Possible Charts
Temperature line chart
Humidity line chart
Rain-probability bar chart
Suggested Props
Prop	Type	Purpose
data	Array	Chart records
dataKey	String	Value field
title	String	Chart heading
type	String	line, bar, or area
unit	String	Display unit
loading	Boolean	Loading state
Behaviour

The component should:

Use Recharts
Use ResponsiveContainer
Display meaningful tooltips
Use formatted dates
Handle an empty dataset
Avoid hardcoded chart dimensions
Avoid excessive colours
Empty State
No weather history is available for this chart.
10.4 components/weather/WeatherDetails.jsx
Purpose

Displays the complete current-weather summary.

Data Displayed
Farm name
Location
Temperature
Feels-like temperature
Humidity
Wind speed
Pressure
Rain probability
Weather condition
Weather description
Sunrise
Sunset
Last updated time
Suggested Props
<WeatherDetails weather={weather} farm={selectedFarm} />
Behaviour

The component should:

Use multiple WeatherCard components
Display the main weather condition prominently
Format all units consistently
Display the observation time
Handle missing values safely
Avoid direct API calls
11. Context Directory
11.1 context/AuthContext.jsx
Purpose

Provides global authentication state to the application.

State Managed
Current user
Access token
Authentication status
Initial authentication loading
Authentication errors
Suggested Context Values
{
  user,
  token,
  isAuthenticated,
  loading,
  login,
  register,
  logout,
  refreshUser,
  updateUser
}
Responsibilities

AuthContext.jsx should:

Restore authentication after page refresh
Read stored authentication data
Verify the token using /auth/me
Store the current user
Provide login functionality
Provide logout functionality
Clear invalid authentication
Expose authentication state to routes and components
Login Flow
Login form submitted
       ↓
authService.login()
       ↓
Token and user returned
       ↓
Save token
       ↓
Set user
       ↓
Set authenticated state
       ↓
Navigate to dashboard
Authentication Restoration Flow
Application starts
       ↓
Read token from storage
       ↓
Call authService.getCurrentUser()
       ↓
Valid token?
   ┌───┴────┐
  Yes       No
   │         │
Set user   Clear token
Security Consideration

For a college prototype, the access token may be stored in local storage. A more secure production implementation should consider HTTP-only cookies.

The frontend must never decode a token and treat that alone as complete authorization.

12. Custom Hooks
12.1 hooks/useAuth.js
Purpose

Provides a simple way to consume AuthContext.

Example
const {
  user,
  isAuthenticated,
  login,
  logout,
  loading,
} = useAuth();
Responsibility

The hook should:

Read AuthContext
Throw a useful error if used outside AuthProvider
Avoid duplicating authentication logic
Example Rule
if (!context) {
  throw new Error("useAuth must be used inside AuthProvider");
}
12.2 hooks/useFarms.js
Purpose

Manages reusable farm-related state and operations.

Possible State
farms
selectedFarm
loading
error
pagination
search
filters
Possible Functions
fetchFarms
fetchFarmById
createFarm
updateFarm
deleteFarm
selectFarm
clearError
Suggested Return Value
{
  farms,
  selectedFarm,
  loading,
  error,
  pagination,
  fetchFarms,
  fetchFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
  selectFarm
}
Behaviour

The hook should:

Call farmService
Manage request state
Normalize errors
Update local farm lists after create or delete
Avoid storing authentication logic
12.3 hooks/useWeather.js
Purpose

Manages weather and forecast state.

Possible State
weather
forecast
history
loading
error
lastUpdated
Possible Functions
fetchCurrentWeather
fetchForecast
fetchWeatherHistory
refreshWeather
clearWeather
clearError
Suggested Return Value
{
  weather,
  forecast,
  history,
  loading,
  error,
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherHistory,
  refreshWeather
}
Behaviour

The hook should:

Require a valid farm ID
Call weatherService
Clear old errors before new requests
Avoid keeping weather from the previously selected farm
Handle API failure without fabricating data
13. Layouts Directory
13.1 layouts/MainLayout.jsx
Purpose

Provides the layout for public pages.

Used By
Home
About
Login
Register
Not Found
Future public Features or Contact pages
Structure
<>
  <Navbar />
  <main>
    <Outlet />
  </main>
  <Footer />
</>
Behaviour

The layout should:

Display the public navbar
Render child routes using Outlet
Display the footer
Maintain consistent page width
Provide sufficient top spacing for sticky navigation
13.2 layouts/DashboardLayout.jsx
Purpose

Provides the layout for authenticated pages.

Used By
Dashboard
Add Farm
Weather
Recommendation
Profile
Future My Farms and History pages
Structure
Sidebar
Dashboard Header
Main Content
Local State

The layout may manage:

const [sidebarOpen, setSidebarOpen] = useState(false);
Behaviour

The layout should:

Display fixed sidebar on desktop
Display drawer sidebar on mobile
Display a top header
Render child routes using Outlet
Provide a mobile menu button
Close the drawer after navigation
Show user information
Provide logout access
Recommended Structure
<div className="min-h-screen bg-slate-50">
  <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

  <div className="lg:ml-64">
    <header>{/* dashboard header */}</header>

    <main className="p-4 md:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
</div>
14. Pages Directory

Pages represent complete screens.

Pages may:

Read route parameters
Call custom hooks
Coordinate multiple components
Handle page-specific state
Navigate after successful actions
Display page-level errors

Pages should not:

Contain repeated API configuration
Directly contain database logic
Duplicate shared components
Contain the complete application in one file
14.1 pages/About.jsx
Purpose

Explains the project.

Suggested Sections
Project overview
Problem statement
Objectives
Proposed solution
Main features
Technology stack
Limitations
Future scope
Academic disclaimer
Behaviour

The page should:

Use MainLayout
Present content in readable sections
Use cards and icons
Use the blue design system
Avoid misleading claims about AI, IoT, or automatic irrigation
14.2 pages/AddFarm.jsx
Purpose

Allows an authenticated farmer to add a farm.

Main Components
Page heading
FarmForm
IndiaMap
LocationPicker
MarkerPopup
Alert or toast feedback
Local State
Selected location
Submission loading
Submission error
Workflow
Enter farm details
       ↓
Select location on map
       ↓
Validate form
       ↓
Submit to farm service
       ↓
Farm created
       ↓
Show success message
       ↓
Navigate to dashboard or farm list
Behaviour

The page should:

Require authentication
Prevent submission without location
Pass coordinates into FarmForm
Show loading state
Handle backend validation
Prevent repeated submission
14.3 pages/Dashboard.jsx
Purpose

Provides the main overview after login.

Dashboard Sections
Welcome card
Total farms
Selected farm
Current weather
Rain probability
Latest recommendation
Recent weather data
Recent recommendations
Quick actions
Data Sources

The page may call:

useAuth
useFarms
useWeather
recommendationService
Behaviour

The dashboard should:

Load user-specific data
Display farm-empty state
Avoid crashing when one request fails
Display separate loading states for independent sections
Provide links to main features
Use responsive summary cards
Partial Failure Rule

If weather fails but farms load:

Display farms normally
Show a weather error only in the weather section
14.4 pages/Home.jsx
Purpose

Provides the public landing page.

Sections
Hero
Product overview
Features
How it works
Benefits
Technology
Call-to-action
Main Actions
Get Started
Learn More
Behaviour
Get Started navigates to /register
Learn More navigates to /about or scrolls to a section
Use a responsive hero layout
Use a blue gradient
Display weather and irrigation imagery or illustrations
14.5 pages/Login.jsx
Purpose

Allows users to authenticate.

Fields
Email
Password
Remember me
Login button
Additional Elements
Password visibility toggle
Register link
Forgot-password link, optional
Dependencies
React Hook Form
useAuth
Validators
React Router navigation
Workflow
Enter credentials
       ↓
Validate
       ↓
Call login()
       ↓
Success?
 ┌─────┴─────┐
Yes           No
 │             │
Dashboard   Show error
Behaviour

The page should:

Redirect already authenticated users
Show field-level validation
Disable submit while loading
Display a generic invalid-credentials message
Avoid revealing whether the email exists
14.6 pages/NotFound.jsx
Purpose

Displays a custom 404 page.

Content
404
Page not found message
Home action
Dashboard action for authenticated users
Behaviour

The page should:

Work inside the appropriate layout
Use useAuth to determine the best return route
Avoid exposing route internals
14.7 pages/Profile.jsx
Purpose

Displays and updates user profile information.

Sections
Profile summary
User details
Profile update form
Change-password form
Account information
Data Displayed
Name
Email
Mobile number
Role
Account status
Creation date
Number of farms
Editable Fields
Name
Mobile number
Behaviour

The page should:

Fetch the current profile
Populate current values
Validate updates
Display success feedback
Prevent duplicate updates
Never display a password hash
14.8 pages/Recommendation.jsx
Purpose

Allows the farmer to generate and view an irrigation recommendation.

Main Components
Farm selector
Weather summary
Generate button
RecommendationCard
StatusBadge
Recommendation history, optional
Workflow
Select farm
     ↓
Request recommendation
     ↓
Backend loads weather
     ↓
Backend applies rules
     ↓
Recommendation returned
     ↓
Recommendation card displayed
Behaviour

The page should:

Require an owned farm
Show an empty state when no farms exist
Display loading while generating
Disable duplicate requests
Display errors when weather is unavailable
Display the advisory disclaimer
Never calculate the official recommendation locally
14.9 pages/Register.jsx
Purpose

Allows visitors to create farmer accounts.

Fields
Full name
Email
Mobile number
Password
Confirm password
Terms checkbox
Behaviour

The page should:

Use React Hook Form
Validate all fields
Use authService.register or AuthContext.register
Prevent role selection
Disable submit while processing
Display duplicate-email errors
Navigate to login after successful registration
Security Rule

Never send an administrator role from the public registration form.

14.10 pages/Weather.jsx
Purpose

Displays current weather and optional forecast/history for a selected farm.

Main Components
Farm selector
Refresh button
WeatherDetails
Multiple WeatherCard components
ForecastCard
WeatherChart
Error and loading states
Workflow
Load farms
    ↓
Select farm
    ↓
Fetch weather
    ↓
Display current conditions
    ↓
Optionally fetch forecast/history
Behaviour

The page should:

Fetch weather only after a valid farm is selected
Clear old weather when farm changes
Show a retry button after failure
Display units consistently
Display last-updated time
Avoid showing data from the previous farm
Avoid fabricated fallback weather
15. Routes Directory
15.1 routes/AppRoutes.jsx
Purpose

Defines the complete application routing structure.

Public Routes
/
 /about
 /login
 /register
Protected Routes
/dashboard
/farms/add
/weather
/recommendation
/profile

Additional routes may later include:

/farms
/farms/:farmId
/farms/:farmId/edit
/history
Suggested Structure
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>

  <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/farms/add" element={<AddFarm />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/recommendation" element={<Recommendation />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
Responsibility

AppRoutes.jsx should:

Define routes
Assign layouts
Protect private routes
Include a fallback route
Avoid containing page implementation details
15.2 routes/ProtectedRoute.jsx
Purpose

Prevents unauthenticated users from viewing private pages.

Dependencies
useAuth
React Router Navigate
React Router Outlet
Loader component
Behaviour
Authentication loading
        ↓
Display loader

Authenticated
        ↓
Render Outlet

Not authenticated
        ↓
Redirect to login
Suggested Logic
if (loading) {
  return <Loader message="Checking authentication..." />;
}

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

return <Outlet />;
Redirect Preservation

The component may preserve the attempted route so the user can return after login.

Important Rule

Frontend route protection is for user experience only.

The backend must still verify every protected API request.

16. Services Directory

Services isolate API communication from the UI.

Service files should:

Use the shared Axios instance
Return normalized response data
Avoid UI state
Avoid React hooks
Avoid direct navigation
Throw or normalize predictable errors
16.1 services/api.js
Purpose

Creates and configures the shared Axios instance.

Responsibilities
Configure base URL
Configure JSON headers
Attach authentication token
Handle response errors
Handle expired sessions
Define request timeout
Environment Variable
VITE_API_BASE_URL=http://localhost:8000/api/v1
Suggested Configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
Request Interceptor

The request interceptor should:

Read the current token
Add the bearer token
Avoid adding the token to requests when unavailable
config.headers.Authorization = `Bearer ${token}`;
Response Interceptor

The response interceptor may:

Detect HTTP 401
Clear expired authentication
Avoid redirect loops
Return the original rejection for page-level handling
Important Rule

Do not place the OpenWeather API key in this file.

16.2 services/authService.js
Purpose

Contains authentication and profile API functions.

Suggested Functions
register(userData)
login(credentials)
getCurrentUser()
logout()
getProfile()
updateProfile(profileData)
changePassword(passwordData)
Endpoints
POST /auth/register
POST /auth/login
GET  /auth/me
POST /auth/logout
GET  /users/profile
PUT  /users/profile
PUT  /users/change-password
Behaviour

The service should:

Send only necessary data
Return normalized user and token data
Avoid storing UI loading state
Avoid exposing raw Axios responses unless required
16.3 services/farmService.js
Purpose

Contains farm CRUD API requests.

Suggested Functions
createFarm(farmData)
getFarms(params)
getFarmById(farmId)
updateFarm(farmId, farmData)
deleteFarm(farmId)
Endpoints
POST   /farms
GET    /farms
GET    /farms/{farmId}
PUT    /farms/{farmId}
DELETE /farms/{farmId}
Query Parameters

getFarms may support:

page
limit
search
crop
state
sortBy
sortOrder
Important Rule

Do not include userId in farm creation requests.

16.4 services/recommendationService.js
Purpose

Contains irrigation-recommendation API requests.

Suggested Functions
generateRecommendation(farmId)
getLatestRecommendation(farmId)
getRecommendationHistory(farmId, params)
Endpoints
POST /recommendations/{farmId}
GET  /recommendations/{farmId}
GET  /recommendations/{farmId}/history
Behaviour

The service should:

Require a valid farm ID
Return recommendation data
Pass backend errors to the UI
Never implement recommendation rules
16.5 services/weatherService.js
Purpose

Contains weather-related API requests.

Suggested Functions
getCurrentWeather(farmId)
getForecast(farmId, days)
getWeatherHistory(farmId, params)
Endpoints
GET /weather/{farmId}
GET /weather/{farmId}/forecast
GET /weather/{farmId}/history
Behaviour

The service should:

Send farm IDs only
Avoid calling OpenWeather directly
Return normalized backend data
Respect request timeouts
Propagate API errors clearly
17. Utilities Directory
17.1 utils/constants.js
Purpose

Stores shared constant values.

Possible Constants
export const INDIA_CENTER = [20.5937, 78.9629];
export const INDIA_ZOOM = 5;

export const AREA_UNITS = [
  { value: "acre", label: "Acre" },
  { value: "hectare", label: "Hectare" },
  { value: "square_metre", label: "Square Metre" },
];

export const RECOMMENDATION_STATUS = {
  NO_IRRIGATION: "no_irrigation",
  DELAY_IRRIGATION: "delay_irrigation",
  IRRIGATE_TODAY: "irrigate_today",
  MONITOR_WEATHER: "monitor_weather",
};
Other Possible Constants
Route paths
Pagination defaults
Date formats
Weather-unit labels
Crop options
Error messages
Regex patterns
Rule

Do not store secrets in this file.

17.2 utils/formatters.js
Purpose

Contains reusable formatting functions.

Suggested Functions
formatTemperature(value)
formatHumidity(value)
formatWindSpeed(value)
formatPressure(value)
formatRainProbability(value)
formatArea(area, unit)
formatDate(date)
formatDateTime(date)
formatCoordinates(latitude, longitude)
formatUserName(name)
Example
formatTemperature(34.2);
// "34.2°C"
Safe Fallback

Formatter functions should return:

Not available

when values are missing or invalid.

Rule

Do not allow formatter functions to produce:

undefined°C
null%
NaN km/h
17.3 utils/helpers.js
Purpose

Contains small reusable functions that do not belong to formatting or validation.

Possible Functions
getInitials(name)
buildQueryParams(params)
getErrorMessage(error)
debounce(callback, delay)
isEmptyObject(value)
scrollToTop()
classNames(...values)
getErrorMessage

This helper may convert an Axios error into a readable message.

Priority may be:

Backend message
Field validation message
Network error
Fallback message
Example
export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
17.4 utils/validators.js
Purpose

Contains reusable validation rules.

Possible Validators
validateName(value)
validateEmail(value)
validateMobile(value)
validatePassword(value)
validateFarmName(value)
validateCropName(value)
validateArea(value)
validateLatitude(value)
validateLongitude(value)
User Rules
Name
Required
2–100 characters
Email
Required
Valid format
Mobile
Ten digits
Numeric only
Password
Minimum eight characters
At least one uppercase letter
At least one lowercase letter
At least one number
Farm Rules
Area
Numeric
Greater than zero
Latitude
Between -90 and 90
Longitude
Between -180 and 180
Important Rule

Frontend validation improves user experience.

Backend validation remains mandatory.

18. Root Source Files
18.1 src/App.jsx
Purpose

Acts as the top-level application component.

Responsibilities

App.jsx should:

Render AppRoutes
Provide global providers if they are not already placed in main.jsx
Avoid page implementation logic
Avoid manually defining all page layouts
Suggested Structure
function App() {
  return <AppRoutes />;
}

export default App;
Optional Global Elements

The file may include:

Toast provider
Error boundary
Theme provider
Rule

Do not put all routes, pages, forms, and business logic directly inside App.jsx.

18.2 src/main.jsx
Purpose

Bootstraps the React application.

Responsibilities
Import React
Import React DOM
Import global CSS
Import Leaflet CSS
Render the root application
Wrap application with BrowserRouter
Wrap application with AuthProvider
Optionally configure toast notifications
Suggested Structure
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
Important Rule

The AuthProvider must wrap components that call useAuth.

18.3 src/index.css
Purpose

Contains global styles and Tailwind directives.

Suggested Content
@tailwind base;
@tailwind components;
@tailwind utilities;

Or the correct syntax for the installed Tailwind version.

Global Styles

This file may define:

Root font
Body background
Default text colour
Box sizing
Focus styles
Scrollbar styling
Leaflet fixes
Reusable utility classes
Example Global Rules
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  background: #f8fafc;
  color: #0f172a;
}
Rule

Avoid placing large page-specific style blocks in index.css.

18.4 src/App.css
Purpose

Contains small application-level styles not conveniently handled by Tailwind.

Suitable Uses
Application root sizing
Special animation
Leaflet container fixes
Third-party component overrides
Reusable complex styles
Avoid

Do not use App.css as a large unstructured stylesheet for every page.

If Tailwind is used consistently, this file may remain minimal.

19. Environment Configuration
Frontend .env
VITE_API_BASE_URL=http://localhost:8000/api/v1
.env.example
VITE_API_BASE_URL=http://localhost:8000/api/v1
Rules
Vite variables must begin with VITE_
Do not store backend secrets in Vite variables
Do not store the OpenWeather API key in the frontend
Do not commit real secrets
Restart the Vite development server after changing environment variables
20. Recommended Routes
Public Routes

/
 /about
 /login
 /register

Protected Routes

/dashboard
/farms
/farms/add
/farms/:farmId
/farms/:farmId/edit
/weather
/recommendation
/profile

Fallback Route

*

The current folder structure does not show separate files for:

MyFarms.jsx
FarmDetails.jsx
EditFarm.jsx
History.jsx

These pages should be added later if those routes are part of the final requirements.

Suggested additions:

pages/
├── MyFarms.jsx
├── FarmDetails.jsx
├── EditFarm.jsx
└── History.jsx
21. State Management Rules

Use local component state for:

Modal visibility
Mobile-menu visibility
Selected filters
Search text
Selected farm
Temporary form UI
Tab selection

Use AuthContext for:

Current user
Authentication state
Token state
Login
Logout
Authentication restoration

Use custom hooks for:

Farm data
Weather data
Reusable request logic

Do not put every state value into global context.

22. API Error Handling

The frontend should normalize errors before displaying them.

Possible Error Sources
Backend validation
Invalid authentication
Expired session
Network failure
Request timeout
Weather-service failure
Database failure
Unknown error
Suggested Error Helper
export function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  return "Something went wrong. Please try again.";
}
Rule

Do not display:

AxiosError
Network Error at api.js
HTTPX traceback
MongoServerError
23. Loading-State Rules

Every API-driven screen should provide a loading state.

Page Loading

Use Loader or skeleton cards.

Button Loading

Example labels:

Logging in...
Creating account...
Saving farm...
Fetching weather...
Generating recommendation...
Updating profile...
Loading Rules
Disable actions during submission
Do not hide the entire page for small background operations
Use skeletons for dashboard cards
Use inline spinners for buttons
Preserve existing data while refreshing where appropriate
24. Empty-State Rules

Required empty states include:

No Farms
No farms added yet.

Add your first farm to start receiving weather information and irrigation recommendations.
No Weather
No weather information is available.

Select a farm and fetch its current weather.
No Recommendation
No recommendation has been generated yet.
No Search Results
No farms match your search.

Each empty state should include:

Icon
Heading
Short explanation
Relevant action
25. Styling Rules

The frontend must follow UI_GUIDELINES.md.

Primary Colours
Blue: #2563EB
Dark Blue: #1D4ED8
Sky Blue: #0EA5E9
Navy: #0F172A
Background: #F8FAFC
Cards: #FFFFFF
Common Tailwind Patterns
Card
rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
Primary Button
rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700
Input
w-full rounded-lg border border-slate-300 px-4 py-2.5
focus:border-blue-500 focus:ring-2 focus:ring-blue-100
Dashboard Background
bg-slate-50
Sidebar
bg-slate-900
26. Responsive Design Rules
Mobile
Hide desktop sidebar
Show menu button
Use single-column forms
Stack dashboard cards
Use full-width primary actions
Keep map controls usable
Use scrollable tables
Avoid fixed-width components
Tablet
Use one or two columns
Adjust spacing
Keep side navigation usable
Maintain readable maps and charts
Desktop
Display fixed sidebar
Use multi-column grids
Use larger map and chart areas
Keep content centred and readable
Test Widths
320px
375px
425px
768px
1024px
1280px
1440px
27. Accessibility Rules

The frontend should:

Use semantic HTML
Use proper heading order
Add labels to every form field
Add aria-label to icon buttons
Provide visible focus states
Support keyboard navigation
Add alt text to images
Avoid colour-only status indicators
Make modals keyboard accessible
Use meaningful button labels
Announce form errors appropriately
28. Security Rules

The frontend must:

Never display passwords
Never display password hashes
Never contain the JWT secret
Never contain the OpenWeather secret key
Clear authentication data on logout
Handle expired sessions
Avoid storing sensitive user data unnecessarily
Confirm destructive actions
Prevent duplicate submissions
Escape user-generated values through normal React rendering
Avoid using unsafe HTML rendering

Avoid:

dangerouslySetInnerHTML

unless content is properly sanitized and absolutely required.

29. Performance Rules

The frontend should:

Lazy-load pages where appropriate
Avoid unnecessary API requests
Avoid duplicate weather requests
Memoize expensive derived data only when needed
Keep components focused
Avoid unnecessary context updates
Optimize large images
Use responsive chart containers
Avoid very large bundle dependencies
Debounce search where appropriate

Example lazy loading:

const Dashboard = lazy(() => import("../pages/Dashboard"));
30. File Responsibility Summary
File	Main Responsibility
Alert.jsx	Feedback messages
Button.jsx	Reusable buttons
Footer.jsx	Public footer
Loader.jsx	Loading indicators
Modal.jsx	Dialog and confirmation interface
Navbar.jsx	Public navigation
Sidebar.jsx	Dashboard navigation
FarmCard.jsx	Single farm display
FarmForm.jsx	Add/edit farm form
FarmList.jsx	Farm collection display
IndiaMap.jsx	Base OpenStreetMap
LocationPicker.jsx	Map click and coordinate selection
MarkerPopup.jsx	Selected-location popup
RecommendationCard.jsx	Recommendation result
StatusBadge.jsx	Recommendation status
ForecastCard.jsx	Forecast item
WeatherCard.jsx	Single weather metric
WeatherChart.jsx	Weather-history visualization
WeatherDetails.jsx	Full weather summary
AuthContext.jsx	Authentication state
useAuth.js	Authentication context hook
useFarms.js	Farm data hook
useWeather.js	Weather data hook
DashboardLayout.jsx	Protected-page layout
MainLayout.jsx	Public-page layout
About.jsx	About page
AddFarm.jsx	Add-farm page
Dashboard.jsx	Farmer dashboard
Home.jsx	Landing page
Login.jsx	Login page
NotFound.jsx	404 page
Profile.jsx	Profile page
Recommendation.jsx	Recommendation page
Register.jsx	Registration page
Weather.jsx	Weather page
AppRoutes.jsx	Route definitions
ProtectedRoute.jsx	Route protection
api.js	Shared Axios client
authService.js	Authentication APIs
farmService.js	Farm APIs
recommendationService.js	Recommendation APIs
weatherService.js	Weather APIs
constants.js	Shared constants
formatters.js	Value formatting
helpers.js	General helper functions
validators.js	Client-side validation
App.css	App-level additional styles
App.jsx	Top-level app component
index.css	Global and Tailwind styles
main.jsx	React application entry point
31. Missing Recommended Files

Based on the complete project requirements, consider adding:

components/common/
├── EmptyState.jsx
├── ErrorState.jsx
├── ConfirmDialog.jsx
├── Input.jsx
├── Select.jsx
└── PageHeader.jsx

pages/
├── MyFarms.jsx
├── FarmDetails.jsx
├── EditFarm.jsx
├── History.jsx
├── Features.jsx
└── Contact.jsx

hooks/
└── useRecommendations.js

services/
├── userService.js
└── historyService.js

These files are not mandatory immediately, but they will improve consistency and prevent large page components.

32. Development Order

Implement the frontend in this order:

1. main.jsx
2. App.jsx
3. index.css
4. api.js
5. AuthContext.jsx
6. useAuth.js
7. MainLayout.jsx
8. DashboardLayout.jsx
9. Navbar.jsx
10. Sidebar.jsx
11. AppRoutes.jsx
12. ProtectedRoute.jsx
13. Button.jsx
14. Alert.jsx
15. Loader.jsx
16. Modal.jsx
17. Login.jsx
18. Register.jsx
19. Dashboard.jsx
20. FarmForm.jsx
21. IndiaMap.jsx
22. LocationPicker.jsx
23. AddFarm.jsx
24. FarmCard.jsx
25. FarmList.jsx
26. WeatherCard.jsx
27. WeatherDetails.jsx
28. Weather.jsx
29. StatusBadge.jsx
30. RecommendationCard.jsx
31. Recommendation.jsx
32. Profile.jsx
33. Home.jsx
34. About.jsx
35. NotFound.jsx
36. Responsive improvements
37. Accessibility improvements
38. Testing
33. Frontend Testing Areas

Test:

Login form
Registration form
Protected routes
Authentication restoration
Logout
Farm validation
Location selection
Farm cards
Weather cards
Recommendation statuses
Loading states
Error states
Empty states
Mobile sidebar
Public navbar
Profile updates
API failure handling

Recommended tools:

Vitest
React Testing Library
Jest DOM
Mock Service Worker, optional
34. Frontend Acceptance Criteria

The frontend is considered ready when:

Public navigation works
Registration form works
Login works
Logout works
Protected routes redirect correctly
Authentication survives page refresh
Dashboard loads user data
Farmer can add a farm
Map location can be selected
Coordinates update correctly
Farm cards render correctly
Weather is displayed with correct units
Weather errors are handled
Recommendation displays status, reason, and action
Profile can be updated
Loading states exist
Empty states exist
Error states exist
Mobile navigation works
Layout is responsive
No API key is exposed
No sensitive backend data is displayed
Components are reusable
API calls are placed in services
35. Rules for Codex

Codex must:

Follow this folder structure
Preserve existing filenames
Use functional React components
Use React hooks
Use React Router
Use Tailwind CSS
Use the shared Axios instance
Keep API logic in services
Keep authentication in AuthContext
Keep repeated data logic in custom hooks
Use reusable components
Use React Hook Form for major forms
Keep page components focused
Use OpenStreetMap through React Leaflet
Import Leaflet CSS
Keep the OpenWeather key out of the frontend
Never generate official recommendations in React
Verify loading, empty, success, and error states
Protect private routes
Use accessible form labels
Disable submitting buttons during requests
Avoid monolithic components
Avoid duplicate API functions
Avoid inline CSS
Avoid Bootstrap
Avoid hardcoded live weather
Avoid storing password values
Avoid exposing raw backend errors
Keep the UI consistent with UI_GUIDELINES.md

When documentation conflicts, follow:

1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. API.md
5. FRONTEND.md
6. UI_GUIDELINES.md
7. FEATURES.md
36. Final Frontend Summary

The frontend should support this complete farmer workflow:

Open Website
     ↓
Register
     ↓
Login
     ↓
Dashboard
     ↓
Add Farm
     ↓
Select Location
     ↓
Save Farm
     ↓
View Weather
     ↓
Generate Recommendation
     ↓
View Profile and History
     ↓
Logout

The frontend must remain:

Responsive
Modular
Accessible
Secure
Reusable
Easy to maintain
Easy to test
Consistent with the backend API
Suitable for college submission

Open the file using:

code docs\FRONTEND.md
Frontend.md

FRONTEND.md 

Backend.md

BACKEND.md 

TODO.md

Library
/
BACKEND.md
Backend Documentation
1. Document Purpose

This document defines the backend architecture, folder structure, responsibilities, implementation rules, request flow, security model, database interaction, external API integration, validation, middleware, services, routes, controllers, models, and utility files for the Weather-Based Smart Irrigation Advisory System.

The backend shown in this project uses:

Node.js
Express.js
MongoDB
Compass
JSON Web Tokens
bcrypt
Axios
dotenv
CORS
Morgan or a custom logger

The backend is responsible for:

User registration and authentication
JWT creation and verification
User profile management
Farm creation, retrieval, update, and deletion
Farm ownership protection
Weather API integration
Location-related processing
Rule-based irrigation recommendations
Weather history storage
Recommendation storage
Request validation
Error handling
Standard API responses
2. Important Architecture Decision

The backend folder shown in the project is a Node.js and Express.js backend.

Therefore, this file documents the implementation actually shown in the folder structure.

The project documentation must not describe this backend as FastAPI unless the backend is later migrated to Python.

Use one backend stack consistently:

Current implementation:
Node.js + Express.js + MongoDB + Compass

Do not mix:

FastAPI route files
Express route files
Pydantic schemas
Compass models
Python services
JavaScript controllers

If Node.js remains the selected backend, update the following documents so they match:

ARCHITECTURE.md
DECISIONS.md
REQUIREMENTS.md
PRD.md
API.md
TESTING_PLAN.md
3. Backend Folder Structure
backend/
├── config/
│   ├── db.js
│   └── jwt.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── farm.controller.js
│   ├── recommendation.controller.js
│   ├── user.controller.js
│   └── weather.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
│
├── models/
│   ├── Farm.js
│   ├── Recommendation.js
│   ├── User.js
│   └── WeatherHistory.js
│
├── node_modules/
│
├── routes/
│   ├── auth.routes.js
│   ├── farm.routes.js
│   ├── recommendation.routes.js
│   ├── user.routes.js
│   └── weather.routes.js
│
├── services/
│   ├── auth.service.js
│   ├── location.service.js
│   ├── recommendation.service.js
│   └── weather.service.js
│
├── utils/
│   ├── apiResponse.js
│   ├── constants.js
│   ├── irrigationRules.js
│   └── logger.js
│
├── .env
├── .env.example
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
4. Backend Request Flow

The normal request flow should be:

Frontend Request
      ↓
Express Route
      ↓
Validation Middleware
      ↓
Authentication Middleware
      ↓
Controller
      ↓
Service
      ↓
Compass Model or External API
      ↓
Controller Response
      ↓
Standard API Response

Example:

POST /api/v1/farms
      ↓
farm.routes.js
      ↓
validation.middleware.js
      ↓
auth.middleware.js
      ↓
farm.controller.js
      ↓
Farm.js
      ↓
MongoDB
      ↓
apiResponse.js
5. Configuration Files
5.1 config/db.js
Purpose

Creates and manages the MongoDB connection.

Responsibilities
Read MONGODB_URI from environment variables
Connect to MongoDB using Compass
Log successful connection
Handle initial connection failure
Avoid exposing the complete database connection string
Export a reusable database connection function
Suggested Function
connectDatabase()
Example Structure
import Compass from "Compass";
import logger from "../utils/logger.js";

export async function connectDatabase() {
  try {
    const connection = await Compass.connect(process.env.MONGODB_URI);

    logger.info(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed");
    process.exit(1);
  }
}
Rules
Do not hardcode the database URL.
Do not call Compass.connect() separately in multiple files.
Do not log passwords from the connection string.
Exit the process if the initial database connection fails.
5.2 config/jwt.js
Purpose

Centralizes JWT configuration and helper functions.

Responsibilities
Read JWT secret from environment variables
Read token expiration duration
Generate access tokens
Verify access tokens
Return predictable token errors
Suggested Functions
generateToken(payload)
verifyToken(token)
Example Structure
import jwt from "jsonwebtoken";

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
Token Payload

A token may contain:

{
  userId: user._id,
  role: user.role
}
Rules
Never hardcode the JWT secret.
Do not place passwords or private user data in the token.
Always configure token expiration.
Never trust a decoded token without signature verification.
6. Controllers

Controllers receive validated requests, call services or models, and send responses.

Controllers should:

Read request parameters
Read authenticated user information
Call the correct service
Return standardized responses
Pass errors to error middleware

Controllers should not:

Contain long business rules
Call external APIs directly
Duplicate validation logic
Generate JWT secrets
Contain repeated response formats
6.1 controllers/auth.controller.js
Purpose

Handles authentication-related HTTP requests.

Main Operations
registerUser
loginUser
getCurrentUser
logoutUser
registerUser

Should:

Read name, email, mobile, password, and confirm password.
Validate request data.
Call auth.service.js.
Return 201 Created.
Never return the password hash.
loginUser

Should:

Read email and password.
Call the authentication service.
Return token and safe user data.
Return a generic error for invalid credentials.
getCurrentUser

Should:

Return the authenticated user's profile
Use req.user created by authentication middleware
Exclude password fields
logoutUser

For stateless JWT authentication:

Return a success response
Allow the frontend to clear the token

Token blacklisting may be added later.

6.2 controllers/farm.controller.js
Purpose

Handles farm CRUD requests.

Main Operations
createFarm
getFarms
getFarmById
updateFarm
deleteFarm
createFarm

Should:

Read farm details
Use authenticated user ID as owner
Ignore any client-provided owner ID
Validate location
Create the farm
Return 201 Created
getFarms

Should:

Return only farms owned by the authenticated user
Support search, filtering, sorting, and pagination
Never return another user's farm
getFarmById

Should:

Validate the farm ID
Load the farm
Verify ownership
Return 404 if not found
Return 403 if access is forbidden
updateFarm

Should:

Verify ownership
Update only allowed fields
Run validators
Update updatedAt
Return the updated farm
deleteFarm

Should:

Verify ownership
Delete the farm
Handle related weather and recommendation records according to database policy
Return a standardized success response
6.3 controllers/recommendation.controller.js
Purpose

Handles irrigation recommendation requests.

Main Operations
generateRecommendation
getLatestRecommendation
getRecommendationHistory
generateRecommendation

Should:

Verify farm ownership.
Load or fetch current weather.
Call recommendation.service.js.
Save the recommendation.
Return title, status, reason, action, and disclaimer.
Important Rule

The controller must not contain the actual rule conditions.

The official rules belong in:

utils/irrigationRules.js

or:

services/recommendation.service.js
getLatestRecommendation

Should:

Return the newest recommendation for an owned farm
Return 404 when no recommendation exists
getRecommendationHistory

Should:

Verify ownership
Support pagination and filters
Sort newest records first by default
6.4 controllers/user.controller.js
Purpose

Handles authenticated user profile operations.

Main Operations
getProfile
updateProfile
changePassword
getProfile

Should return:

Name
Email
Mobile
Role
Account status
Account creation date
Farm count
updateProfile

Should allow only approved fields, such as:

name
mobile

Email changes should require extra verification if implemented.

changePassword

Should:

Verify current password.
Validate the new password.
Hash the new password.
Save the updated hash.
Never return the hash.
6.5 controllers/weather.controller.js
Purpose

Handles weather and weather-history requests.

Main Operations
getCurrentWeather
getForecast
getWeatherHistory
getCurrentWeather

Should:

Verify the farm belongs to the user.
Read stored latitude and longitude.
Call weather.service.js.
Save normalized weather data.
Return current weather.
getForecast

Should:

Verify ownership
Call the weather service
Return forecast data
Be optional for MVP
getWeatherHistory

Should:

Return history for an owned farm
Support date filters and pagination
Sort newest first
Important Rule

The controller must not call OpenWeather directly.

7. Middleware

Middleware runs between a route and its controller.

7.1 middleware/auth.middleware.js
Purpose

Protects authenticated routes.

Responsibilities
Read the Authorization header
Extract the Bearer token
Verify the token
Load the current user
Attach safe user information to req.user
Reject inactive or suspended users
Return 401 for invalid authentication
Expected Header
Authorization: Bearer <access_token>
Suggested Middleware
protect
authorizeRoles(...roles)
Example Flow
Authorization header missing
      ↓
401 Unauthorized

Token invalid or expired
      ↓
401 Unauthorized

Token valid
      ↓
Load user
      ↓
Set req.user
      ↓
Continue
Rules
Never trust a user ID from the request body.
Do not expose token verification details.
Never log complete access tokens.
7.2 middleware/error.middleware.js
Purpose

Provides global Express error handling.

Responsibilities
Handle thrown and forwarded errors
Convert known errors into safe API responses
Handle Compass validation errors
Handle duplicate-key errors
Handle invalid ObjectIds
Hide stack traces in production
Log unexpected backend errors
Suggested Middleware
notFoundHandler
errorHandler
Common Error Types
ValidationError
CastError
MongoServerError code 11000
JsonWebTokenError
TokenExpiredError
Axios timeout
External API error
Production Rule

Do not return:

stack trace
database URL
file paths
JWT secret
API key
7.3 middleware/validation.middleware.js
Purpose

Validates incoming request data before the controller executes.

Possible Responsibilities
Validate registration body
Validate login body
Validate farm body
Validate profile updates
Validate password changes
Validate pagination query parameters
Validate MongoDB IDs
Return field-level validation errors
Possible Libraries
express-validator
Joi
Zod

Use one validation library consistently.

Suggested Middleware Pattern
validateRequest(schema)
Validation Response
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
8. Models

Models define MongoDB document structures using Compass.

8.1 models/User.js
Purpose

Defines the user schema.

Suggested Fields
{
  name: String,
  email: String,
  mobile: String,
  passwordHash: String,
  role: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
Recommended Schema Rules
name: required, trimmed, 2–100 characters
email: required, unique, lowercase, indexed
mobile: validated
passwordHash: required, excluded from normal queries where possible
role: enum with default farmer
status: enum with default active
timestamps enabled
Recommended Methods
comparePassword(candidatePassword)
Security Rules
Never store plain passwords.
Never return passwordHash in API responses.
Public registration must never assign admin.
8.2 models/Farm.js
Purpose

Defines farm data.

Suggested Fields
{
  owner: ObjectId,
  farmName: String,
  cropName: String,
  area: Number,
  areaUnit: String,
  state: String,
  district: String,
  village: String,
  latitude: Number,
  longitude: Number,
  createdAt: Date,
  updatedAt: Date
}
Relationship
Farm.owner → User._id
Validation Rules
Owner is required
Farm name is required
Crop name is required
Area must be greater than zero
Latitude must be between -90 and 90
Longitude must be between -180 and 180
Area unit must use allowed values
Recommended Indexes
{ owner: 1 }
{ owner: 1, createdAt: -1 }
{ owner: 1, farmName: 1 }
8.3 models/Recommendation.js
Purpose

Stores generated recommendation records.

Suggested Fields
{
  user: ObjectId,
  farm: ObjectId,
  status: String,
  title: String,
  reason: String,
  recommendedAction: String,
  suggestedDuration: String,
  weatherSnapshot: {
    temperature: Number,
    humidity: Number,
    rainProbability: Number,
    weatherCondition: String
  },
  generatedAt: Date
}
Relationship
Recommendation.user → User._id
Recommendation.farm → Farm._id
Allowed Statuses
no_irrigation
delay_irrigation
irrigate_today
monitor_weather
Recommended Indexes
{ farm: 1, generatedAt: -1 }
{ user: 1, generatedAt: -1 }
8.4 models/WeatherHistory.js
Purpose

Stores normalized weather observations.

Suggested Fields
{
  farm: ObjectId,
  user: ObjectId,
  temperature: Number,
  feelsLike: Number,
  humidity: Number,
  windSpeed: Number,
  pressure: Number,
  rainProbability: Number,
  weatherCondition: String,
  weatherDescription: String,
  weatherIcon: String,
  observedAt: Date,
  recordedAt: Date
}
Relationships
WeatherHistory.farm → Farm._id
WeatherHistory.user → User._id
Recommended Index
{ farm: 1, recordedAt: -1 }
Rules
Store normalized weather values.
Do not store the external API key.
Avoid saving duplicate records too frequently.
9. Routes

Routes define HTTP paths and connect middleware to controllers.

Routes should:

Use express.Router()
Define endpoint paths
Apply middleware
Call controllers
Remain small and readable

Routes must not:

Query MongoDB directly
Contain recommendation rules
Hash passwords
Call OpenWeather directly
Build long response objects
9.1 routes/auth.routes.js
Purpose

Defines public and authenticated authentication routes.

Suggested Endpoints
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
Example
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
9.2 routes/farm.routes.js
Purpose

Defines farm CRUD endpoints.

Suggested Endpoints
POST   /api/v1/farms
GET    /api/v1/farms
GET    /api/v1/farms/:farmId
PUT    /api/v1/farms/:farmId
DELETE /api/v1/farms/:farmId
Middleware

All routes should use:

protect

Create and update routes should also use validation middleware.

9.3 routes/recommendation.routes.js
Purpose

Defines irrigation recommendation endpoints.

Suggested Endpoints
POST /api/v1/recommendations/:farmId
GET  /api/v1/recommendations/:farmId
GET  /api/v1/recommendations/:farmId/history
Behaviour

Every route must:

Require authentication
Verify farm ownership through controller or service
Never accept raw weather values from the client for official recommendation generation
9.4 routes/user.routes.js
Purpose

Defines profile endpoints.

Suggested Endpoints
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password

All routes require authentication.

9.5 routes/weather.routes.js
Purpose

Defines current weather, forecast, and history endpoints.

Suggested Endpoints
GET /api/v1/weather/:farmId
GET /api/v1/weather/:farmId/forecast
GET /api/v1/weather/:farmId/history

All routes require authentication and ownership verification.

10. Services

Services contain reusable business logic and external integration logic.

Services should:

Be independent of Express response objects
Return data or throw predictable errors
Be reusable by controllers
Avoid rendering API responses directly
10.1 services/auth.service.js
Purpose

Contains authentication business logic.

Suggested Functions
registerUser(userData)
authenticateUser(email, password)
buildAuthResponse(user)
hashPassword(password)
Responsibilities
Normalize email
Check duplicate email
Hash passwords
Verify passwords
Create users
Generate JWT
Return safe user objects
Rules
Do not return the password hash.
Use a generic invalid-credentials error.
Force public registrations to farmer.
10.2 services/location.service.js
Purpose

Contains reusable location-related logic.

Possible Functions
validateCoordinates(latitude, longitude)
reverseGeocode(latitude, longitude)
isLocationInIndia(latitude, longitude)
formatLocation(locationData)
MVP Use

For the first version, the service may only validate coordinates.

Optional Integration

Reverse geocoding may use Nominatim.

Rules
Use timeouts for external requests.
Respect OpenStreetMap/Nominatim usage policies.
Do not make reverse geocoding mandatory for farm creation.
Keep manual state, district, and village fields.
10.3 services/recommendation.service.js
Purpose

Coordinates recommendation generation.

Suggested Functions
generateRecommendationForFarm(farm, weather)
saveRecommendation(data)
getLatestRecommendation(farmId, userId)
getRecommendationHistory(farmId, userId, options)
Responsibilities
Accept normalized weather
Apply irrigation rules
Build reason and action text
Create the recommendation record
Return a safe response
Important Rule

The rule priority must remain:

1. Rain probability
2. Humidity
3. Temperature
4. Default
10.4 services/weather.service.js
Purpose

Handles external weather API communication and normalization.

Suggested Functions
fetchCurrentWeather(latitude, longitude)
fetchForecast(latitude, longitude, days)
normalizeCurrentWeather(apiResponse)
normalizeForecast(apiResponse)
saveWeatherHistory(data)
Responsibilities
Read OpenWeather configuration from environment variables
Call the external API using Axios
Use metric units
Configure timeouts
Normalize provider data
Handle missing values
Throw safe service errors
Never expose the API key
Example External Parameters
lat
lon
appid
units=metric
Important Rule

Do not fabricate weather data when the provider fails.

11. Utility Files
11.1 utils/apiResponse.js
Purpose

Provides standardized response helpers.

Suggested Functions
sendSuccess(res, statusCode, message, data)
sendError(res, statusCode, message, code, errors)
Success Format
{
  "success": true,
  "message": "Farm created successfully",
  "data": {}
}
Error Format
{
  "success": false,
  "message": "Farm not found",
  "error": {
    "code": "FARM_NOT_FOUND"
  }
}
Rule

Controllers should not manually recreate the response format repeatedly.

11.2 utils/constants.js
Purpose

Stores shared non-secret constants.

Possible Constants
export const USER_ROLES = {
  FARMER: "farmer",
  ADMIN: "admin",
};

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

export const RECOMMENDATION_STATUS = {
  NO_IRRIGATION: "no_irrigation",
  DELAY_IRRIGATION: "delay_irrigation",
  IRRIGATE_TODAY: "irrigate_today",
  MONITOR_WEATHER: "monitor_weather",
};
Other Possible Constants
Pagination defaults
Maximum page size
Area units
Error codes
Weather timeouts
Advisory disclaimer
Rule

Do not store secrets in this file.

11.3 utils/irrigationRules.js
Purpose

Contains the rule-based recommendation logic.

Required Rule Order
export function evaluateIrrigationRules(weather) {
  const {
    rainProbability,
    humidity,
    temperature,
  } = weather;

  if (rainProbability > 60) {
    return {
      status: "no_irrigation",
      title: "No Irrigation Required",
      reason: "Rainfall is expected, so irrigation may not be required.",
      recommendedAction:
        "Delay irrigation and continue monitoring rainfall conditions.",
    };
  }

  if (humidity > 80) {
    return {
      status: "delay_irrigation",
      title: "Delay Irrigation",
      reason:
        "The humidity is high, which may reduce immediate water loss.",
      recommendedAction:
        "Check the weather again before irrigating.",
    };
  }

  if (temperature > 35) {
    return {
      status: "irrigate_today",
      title: "Irrigate Today",
      reason:
        "The temperature is high and may increase crop water demand.",
      recommendedAction:
        "Consider irrigating the farm today.",
    };
  }

  return {
    status: "monitor_weather",
    title: "Monitor Weather",
    reason: "No critical irrigation condition was detected.",
    recommendedAction:
      "Continue monitoring weather conditions before irrigating.",
  };
}
Rules
Keep this function pure where possible.
Do not access Express request or response objects.
Do not query MongoDB from this utility.
Test all boundary values.
11.4 utils/logger.js
Purpose

Provides centralized application logging.

Possible Tools
Winston
Pino
Console wrapper for a small prototype
Suggested Functions
logger.info()
logger.warn()
logger.error()
logger.debug()
Log
Server startup
Database connection
Request failures
External API failures
Unexpected exceptions
Do Not Log
Passwords
Password hashes
JWT tokens
Authorization headers
API keys
Database credentials
12. Root Backend Files
12.1 app.js
Purpose

Creates and configures the Express application.

Responsibilities
Create the Express app
Configure CORS
Parse JSON
Configure URL-encoded bodies
Add request logging
Register routes
Register health endpoint
Register 404 handler
Register global error middleware
Export the app
Suggested Structure
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import farmRoutes from "./routes/farm.routes.js";
import userRoutes from "./routes/user.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "smart-irrigation-api",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/farms", farmRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
Rules
Do not start the server in app.js.
Do not connect to MongoDB in route files.
Register error middleware last.
12.2 server.js
Purpose

Starts the backend server.

Responsibilities
Load environment variables
Connect to MongoDB
Start listening on the configured port
Handle startup failure
Handle unhandled rejections
Handle graceful shutdown
Suggested Structure
import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 8000;

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

startServer();
Graceful Shutdown

The server may handle:

SIGINT
SIGTERM
unhandledRejection
uncaughtException
12.3 package.json
Purpose

Defines project metadata, scripts, dependencies, and Node version requirements.

Recommended Scripts
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint ."
  }
}
Recommended Dependencies
express
Compass
jsonwebtoken
bcryptjs
axios
dotenv
cors
helmet
morgan
express-validator
Recommended Development Dependencies
nodemon
eslint
jest
supertest
Module Style

Because the files use import and export, include:

{
  "type": "module"
}
12.4 package-lock.json
Purpose

Locks exact dependency versions.

Rules
Commit this file.
Do not edit it manually.
Regenerate it through npm commands.
Keep it synchronized with package.json.
12.5 .env
Purpose

Stores local secret and environment-specific values.

Example
NODE_ENV=development
PORT=8000

MONGODB_URI=mongodb://127.0.0.1:27017/smart_irrigation

JWT_SECRET=replace_with_secure_random_value
JWT_EXPIRES_IN=1h

OPENWEATHER_API_KEY=replace_with_real_key
OPENWEATHER_BASE_URL=https://api.openweathermap.org

FRONTEND_URL=http://localhost:5173
Rules
Never commit this file.
Never place real secrets in documentation.
Restart the server after changes.
12.6 .env.example
Purpose

Documents required environment variables without real secrets.

NODE_ENV=development
PORT=8000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1h
OPENWEATHER_API_KEY=
OPENWEATHER_BASE_URL=https://api.openweathermap.org
FRONTEND_URL=http://localhost:5173

This file should be committed.

12.7 .gitignore
Purpose

Prevents local and sensitive files from being committed.

Recommended Content
node_modules/
.env
.env.local
coverage/
logs/
*.log
.DS_Store
dist/
12.8 README.md
Purpose

Explains how to set up and run the backend.

Recommended Sections
Project overview
Technology stack
Requirements
Installation
Environment variables
Development command
Production command
API base URL
API documentation
Folder structure
Testing
Troubleshooting
Basic Commands
cd backend
npm install
npm run dev
13. Authentication Flow
User submits email and password
           ↓
auth.routes.js
           ↓
validation.middleware.js
           ↓
auth.controller.js
           ↓
auth.service.js
           ↓
User.js
           ↓
Password comparison
           ↓
JWT generation
           ↓
Safe user and token returned
14. Farm Ownership Flow
Protected farm request
        ↓
auth.middleware.js
        ↓
Authenticated user loaded
        ↓
Farm loaded by ID
        ↓
farm.owner compared with req.user.id
        ↓
Match?
 ┌──────┴──────┐
Yes             No
 │               │
Continue      403 Forbidden
Important Rule

Never use this as ownership proof:

req.body.userId

Use:

req.user.id
15. Weather Flow
User selects farm
       ↓
GET /api/v1/weather/:farmId
       ↓
Verify authentication
       ↓
Verify ownership
       ↓
Read farm coordinates
       ↓
weather.service.js
       ↓
OpenWeather API
       ↓
Normalize response
       ↓
WeatherHistory.js
       ↓
Return weather data
16. Recommendation Flow
POST /api/v1/recommendations/:farmId
          ↓
Verify authentication
          ↓
Verify ownership
          ↓
Fetch current weather
          ↓
evaluateIrrigationRules()
          ↓
Build reason and action
          ↓
Recommendation.js
          ↓
Return recommendation

The backend must not generate a recommendation when weather retrieval fails.

17. Standard API Endpoints
Authentication
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
Users
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password
Farms
POST   /api/v1/farms
GET    /api/v1/farms
GET    /api/v1/farms/:farmId
PUT    /api/v1/farms/:farmId
DELETE /api/v1/farms/:farmId
Weather
GET /api/v1/weather/:farmId
GET /api/v1/weather/:farmId/forecast
GET /api/v1/weather/:farmId/history
Recommendations
POST /api/v1/recommendations/:farmId
GET  /api/v1/recommendations/:farmId
GET  /api/v1/recommendations/:farmId/history
18. Validation Rules
Registration
Name required
Valid email required
Email converted to lowercase
Mobile number validated
Password minimum eight characters
Confirm password must match
Role forced to farmer
Login
Email required
Password required
Farm
Farm name required
Crop name required
Area greater than zero
Valid area unit
State required
District required
Village required
Latitude between -90 and 90
Longitude between -180 and 180
Password Change
Current password required
New password validated
Confirmation must match
19. Error Handling Rules

The backend should return safe messages for:

Invalid input
Duplicate email
Invalid credentials
Invalid token
Expired token
Missing farm
Forbidden farm access
MongoDB failure
Weather API failure
Weather timeout
Invalid ObjectId
Unexpected error

Do not return:

Compass stack traces
MongoDB credentials
JWT secret
OpenWeather key
local file paths
20. Security Rules

The backend must:

Hash passwords
Verify JWT signatures
Expire tokens
Validate all protected requests
Verify farm ownership
Prevent role escalation
Store secrets in environment variables
Restrict CORS
Use Helmet
Limit JSON request size
Avoid sensitive logging
Use HTTPS in production
Prevent duplicate submissions where possible
Validate ObjectIds safely
Sanitize or safely handle user input
21. Recommended Missing Backend Files

The current structure is usable, but the following files may improve maintainability:

validators/
├── auth.validator.js
├── farm.validator.js
├── user.validator.js
└── common.validator.js

errors/
└── AppError.js

repositories/
├── user.repository.js
├── farm.repository.js
├── weather.repository.js
└── recommendation.repository.js

tests/
├── auth.test.js
├── farm.test.js
├── weather.test.js
├── recommendation.test.js
└── irrigationRules.test.js

For a small college prototype, repositories are optional.

22. Testing Strategy

Recommended tools:

Jest
Supertest
MongoDB Memory Server
Nock or Axios mocks

Test:

Registration
Duplicate email
Login
Invalid credentials
JWT authentication
Expired token
Profile update
Password change
Farm CRUD
Farm ownership
Invalid ObjectIds
Weather-service success
Weather-service failure
Recommendation rule priority
Recommendation history
Safe API responses

External weather requests must be mocked in automated tests.

23. Development Order
1. package.json
2. .env.example
3. config/db.js
4. config/jwt.js
5. utils/constants.js
6. utils/apiResponse.js
7. utils/logger.js
8. middleware/error.middleware.js
9. models/User.js
10. services/auth.service.js
11. controllers/auth.controller.js
12. routes/auth.routes.js
13. middleware/auth.middleware.js
14. models/Farm.js
15. controllers/farm.controller.js
16. routes/farm.routes.js
17. services/location.service.js
18. models/WeatherHistory.js
19. services/weather.service.js
20. controllers/weather.controller.js
21. routes/weather.routes.js
22. utils/irrigationRules.js
23. models/Recommendation.js
24. services/recommendation.service.js
25. controllers/recommendation.controller.js
26. routes/recommendation.routes.js
27. controllers/user.controller.js
28. routes/user.routes.js
29. app.js
30. server.js
31. Testing
32. Security review
24. Backend Acceptance Criteria

The backend is ready when:

The server starts correctly
MongoDB connects successfully
Registration works
Duplicate emails are rejected
Passwords are hashed
Login returns a valid JWT
Protected routes reject missing tokens
Expired tokens are rejected
Profile APIs work
Farm CRUD works
Farm ownership is enforced
Weather is fetched through the backend
Weather API failures are handled
Weather history is stored
Recommendation rules run in the correct order
Recommendations are saved
No password hashes are returned
No API keys are exposed
Responses follow a consistent format
Critical tests pass
25. Rules for Codex

Codex must:

Use Node.js and Express for this backend structure
Use ES modules consistently
Use MongoDB through Compass
Keep routes thin
Keep controllers focused
Keep external APIs inside services
Keep recommendation rules in one module
Use middleware for authentication and validation
Use standardized responses
Verify farm ownership
Hash passwords securely
Use JWT expiration
Store secrets in .env
Never expose the weather API key
Never return password hashes
Never trust client-provided user IDs
Never fabricate weather
Never generate recommendations without valid weather
Handle invalid ObjectIds
Handle loading-related failures through predictable API responses
Write tests for critical endpoints
Mock external weather requests
Avoid monolithic controller files
Keep documentation synchronized with the actual Node.js backend

Documentation conflict priority:

1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. API.md
5. BACKEND.md
6. TESTING_PLAN.md

Before using this priority, update any document that still incorrectly states that the existing backend uses FastAPI.

26. Final Backend Workflow
React Frontend
      ↓
Express Route
      ↓
Validation Middleware
      ↓
JWT Authentication
      ↓
Controller
      ↓
Service
      ↓
Compass Model or OpenWeather API
      ↓
MongoDB
      ↓
Standard JSON Response

The backend must remain secure, modular, consistent, testable, and suitable for college submission.

Library
/
BACKEND.md
Backend Documentation
1. Document Purpose

This document defines the backend architecture, folder structure, responsibilities, implementation rules, request flow, security model, database interaction, external API integration, validation, middleware, services, routes, controllers, models, and utility files for the Weather-Based Smart Irrigation Advisory System.

The backend shown in this project uses:

Node.js
Express.js
MongoDB
Compass
JSON Web Tokens
bcrypt
Axios
dotenv
CORS
Morgan or a custom logger

The backend is responsible for:

User registration and authentication
JWT creation and verification
User profile management
Farm creation, retrieval, update, and deletion
Farm ownership protection
Weather API integration
Location-related processing
Rule-based irrigation recommendations
Weather history storage
Recommendation storage
Request validation
Error handling
Standard API responses
2. Important Architecture Decision

The backend folder shown in the project is a Node.js and Express.js backend.

Therefore, this file documents the implementation actually shown in the folder structure.

The project documentation must not describe this backend as FastAPI unless the backend is later migrated to Python.

Use one backend stack consistently:

Current implementation:
Node.js + Express.js + MongoDB + Compass

Do not mix:

FastAPI route files
Express route files
Pydantic schemas
Compass models
Python services
JavaScript controllers

If Node.js remains the selected backend, update the following documents so they match:

ARCHITECTURE.md
DECISIONS.md
REQUIREMENTS.md
PRD.md
API.md
TESTING_PLAN.md
3. Backend Folder Structure
backend/
├── config/
│   ├── db.js
│   └── jwt.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── farm.controller.js
│   ├── recommendation.controller.js
│   ├── user.controller.js
│   └── weather.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
│
├── models/
│   ├── Farm.js
│   ├── Recommendation.js
│   ├── User.js
│   └── WeatherHistory.js
│
├── node_modules/
│
├── routes/
│   ├── auth.routes.js
│   ├── farm.routes.js
│   ├── recommendation.routes.js
│   ├── user.routes.js
│   └── weather.routes.js
│
├── services/
│   ├── auth.service.js
│   ├── location.service.js
│   ├── recommendation.service.js
│   └── weather.service.js
│
├── utils/
│   ├── apiResponse.js
│   ├── constants.js
│   ├── irrigationRules.js
│   └── logger.js
│
├── .env
├── .env.example
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
4. Backend Request Flow

The normal request flow should be:

Frontend Request
      ↓
Express Route
      ↓
Validation Middleware
      ↓
Authentication Middleware
      ↓
Controller
      ↓
Service
      ↓
Compass Model or External API
      ↓
Controller Response
      ↓
Standard API Response

Example:

POST /api/v1/farms
      ↓
farm.routes.js
      ↓
validation.middleware.js
      ↓
auth.middleware.js
      ↓
farm.controller.js
      ↓
Farm.js
      ↓
MongoDB
      ↓
apiResponse.js
5. Configuration Files
5.1 config/db.js
Purpose

Creates and manages the MongoDB connection.

Responsibilities
Read MONGODB_URI from environment variables
Connect to MongoDB using Compass
Log successful connection
Handle initial connection failure
Avoid exposing the complete database connection string
Export a reusable database connection function
Suggested Function
connectDatabase()
Example Structure
import Compass from "Compass";
import logger from "../utils/logger.js";

export async function connectDatabase() {
  try {
    const connection = await Compass.connect(process.env.MONGODB_URI);

    logger.info(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed");
    process.exit(1);
  }
}
Rules
Do not hardcode the database URL.
Do not call Compass.connect() separately in multiple files.
Do not log passwords from the connection string.
Exit the process if the initial database connection fails.
5.2 config/jwt.js
Purpose

Centralizes JWT configuration and helper functions.

Responsibilities
Read JWT secret from environment variables
Read token expiration duration
Generate access tokens
Verify access tokens
Return predictable token errors
Suggested Functions
generateToken(payload)
verifyToken(token)
Example Structure
import jwt from "jsonwebtoken";

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
Token Payload

A token may contain:

{
  userId: user._id,
  role: user.role
}
Rules
Never hardcode the JWT secret.
Do not place passwords or private user data in the token.
Always configure token expiration.
Never trust a decoded token without signature verification.
6. Controllers

Controllers receive validated requests, call services or models, and send responses.

Controllers should:

Read request parameters
Read authenticated user information
Call the correct service
Return standardized responses
Pass errors to error middleware

Controllers should not:

Contain long business rules
Call external APIs directly
Duplicate validation logic
Generate JWT secrets
Contain repeated response formats
6.1 controllers/auth.controller.js
Purpose

Handles authentication-related HTTP requests.

Main Operations
registerUser
loginUser
getCurrentUser
logoutUser
registerUser

Should:

Read name, email, mobile, password, and confirm password.
Validate request data.
Call auth.service.js.
Return 201 Created.
Never return the password hash.
loginUser

Should:

Read email and password.
Call the authentication service.
Return token and safe user data.
Return a generic error for invalid credentials.
getCurrentUser

Should:

Return the authenticated user's profile
Use req.user created by authentication middleware
Exclude password fields
logoutUser

For stateless JWT authentication:

Return a success response
Allow the frontend to clear the token

Token blacklisting may be added later.

6.2 controllers/farm.controller.js
Purpose

Handles farm CRUD requests.

Main Operations
createFarm
getFarms
getFarmById
updateFarm
deleteFarm
createFarm

Should:

Read farm details
Use authenticated user ID as owner
Ignore any client-provided owner ID
Validate location
Create the farm
Return 201 Created
getFarms

Should:

Return only farms owned by the authenticated user
Support search, filtering, sorting, and pagination
Never return another user's farm
getFarmById

Should:

Validate the farm ID
Load the farm
Verify ownership
Return 404 if not found
Return 403 if access is forbidden
updateFarm

Should:

Verify ownership
Update only allowed fields
Run validators
Update updatedAt
Return the updated farm
deleteFarm

Should:

Verify ownership
Delete the farm
Handle related weather and recommendation records according to database policy
Return a standardized success response
6.3 controllers/recommendation.controller.js
Purpose

Handles irrigation recommendation requests.

Main Operations
generateRecommendation
getLatestRecommendation
getRecommendationHistory
generateRecommendation

Should:

Verify farm ownership.
Load or fetch current weather.
Call recommendation.service.js.
Save the recommendation.
Return title, status, reason, action, and disclaimer.
Important Rule

The controller must not contain the actual rule conditions.

The official rules belong in:

utils/irrigationRules.js

or:

services/recommendation.service.js
getLatestRecommendation

Should:

Return the newest recommendation for an owned farm
Return 404 when no recommendation exists
getRecommendationHistory

Should:

Verify ownership
Support pagination and filters
Sort newest records first by default
6.4 controllers/user.controller.js
Purpose

Handles authenticated user profile operations.

Main Operations
getProfile
updateProfile
changePassword
getProfile

Should return:

Name
Email
Mobile
Role
Account status
Account creation date
Farm count
updateProfile

Should allow only approved fields, such as:

name
mobile

Email changes should require extra verification if implemented.

changePassword

Should:

Verify current password.
Validate the new password.
Hash the new password.
Save the updated hash.
Never return the hash.
6.5 controllers/weather.controller.js
Purpose

Handles weather and weather-history requests.

Main Operations
getCurrentWeather
getForecast
getWeatherHistory
getCurrentWeather

Should:

Verify the farm belongs to the user.
Read stored latitude and longitude.
Call weather.service.js.
Save normalized weather data.
Return current weather.
getForecast

Should:

Verify ownership
Call the weather service
Return forecast data
Be optional for MVP
getWeatherHistory

Should:

Return history for an owned farm
Support date filters and pagination
Sort newest first
Important Rule

The controller must not call OpenWeather directly.

7. Middleware

Middleware runs between a route and its controller.

7.1 middleware/auth.middleware.js
Purpose

Protects authenticated routes.

Responsibilities
Read the Authorization header
Extract the Bearer token
Verify the token
Load the current user
Attach safe user information to req.user
Reject inactive or suspended users
Return 401 for invalid authentication
Expected Header
Authorization: Bearer <access_token>
Suggested Middleware
protect
authorizeRoles(...roles)
Example Flow
Authorization header missing
      ↓
401 Unauthorized

Token invalid or expired
      ↓
401 Unauthorized

Token valid
      ↓
Load user
      ↓
Set req.user
      ↓
Continue
Rules
Never trust a user ID from the request body.
Do not expose token verification details.
Never log complete access tokens.
7.2 middleware/error.middleware.js
Purpose

Provides global Express error handling.

Responsibilities
Handle thrown and forwarded errors
Convert known errors into safe API responses
Handle Compass validation errors
Handle duplicate-key errors
Handle invalid ObjectIds
Hide stack traces in production
Log unexpected backend errors
Suggested Middleware
notFoundHandler
errorHandler
Common Error Types
ValidationError
CastError
MongoServerError code 11000
JsonWebTokenError
TokenExpiredError
Axios timeout
External API error
Production Rule

Do not return:

stack trace
database URL
file paths
JWT secret
API key
7.3 middleware/validation.middleware.js
Purpose

Validates incoming request data before the controller executes.

Possible Responsibilities
Validate registration body
Validate login body
Validate farm body
Validate profile updates
Validate password changes
Validate pagination query parameters
Validate MongoDB IDs
Return field-level validation errors
Possible Libraries
express-validator
Joi
Zod

Use one validation library consistently.

Suggested Middleware Pattern
validateRequest(schema)
Validation Response
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
8. Models

Models define MongoDB document structures using Compass.

8.1 models/User.js
Purpose

Defines the user schema.

Suggested Fields
{
  name: String,
  email: String,
  mobile: String,
  passwordHash: String,
  role: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
Recommended Schema Rules
name: required, trimmed, 2–100 characters
email: required, unique, lowercase, indexed
mobile: validated
passwordHash: required, excluded from normal queries where possible
role: enum with default farmer
status: enum with default active
timestamps enabled
Recommended Methods
comparePassword(candidatePassword)
Security Rules
Never store plain passwords.
Never return passwordHash in API responses.
Public registration must never assign admin.
8.2 models/Farm.js
Purpose

Defines farm data.

Suggested Fields
{
  owner: ObjectId,
  farmName: String,
  cropName: String,
  area: Number,
  areaUnit: String,
  state: String,
  district: String,
  village: String,
  latitude: Number,
  longitude: Number,
  createdAt: Date,
  updatedAt: Date
}
Relationship
Farm.owner → User._id
Validation Rules
Owner is required
Farm name is required
Crop name is required
Area must be greater than zero
Latitude must be between -90 and 90
Longitude must be between -180 and 180
Area unit must use allowed values
Recommended Indexes
{ owner: 1 }
{ owner: 1, createdAt: -1 }
{ owner: 1, farmName: 1 }
8.3 models/Recommendation.js
Purpose

Stores generated recommendation records.

Suggested Fields
{
  user: ObjectId,
  farm: ObjectId,
  status: String,
  title: String,
  reason: String,
  recommendedAction: String,
  suggestedDuration: String,
  weatherSnapshot: {
    temperature: Number,
    humidity: Number,
    rainProbability: Number,
    weatherCondition: String
  },
  generatedAt: Date
}
Relationship
Recommendation.user → User._id
Recommendation.farm → Farm._id
Allowed Statuses
no_irrigation
delay_irrigation
irrigate_today
monitor_weather
Recommended Indexes
{ farm: 1, generatedAt: -1 }
{ user: 1, generatedAt: -1 }
8.4 models/WeatherHistory.js
Purpose

Stores normalized weather observations.

Suggested Fields
{
  farm: ObjectId,
  user: ObjectId,
  temperature: Number,
  feelsLike: Number,
  humidity: Number,
  windSpeed: Number,
  pressure: Number,
  rainProbability: Number,
  weatherCondition: String,
  weatherDescription: String,
  weatherIcon: String,
  observedAt: Date,
  recordedAt: Date
}
Relationships
WeatherHistory.farm → Farm._id
WeatherHistory.user → User._id
Recommended Index
{ farm: 1, recordedAt: -1 }
Rules
Store normalized weather values.
Do not store the external API key.
Avoid saving duplicate records too frequently.
9. Routes

Routes define HTTP paths and connect middleware to controllers.

Routes should:

Use express.Router()
Define endpoint paths
Apply middleware
Call controllers
Remain small and readable

Routes must not:

Query MongoDB directly
Contain recommendation rules
Hash passwords
Call OpenWeather directly
Build long response objects
9.1 routes/auth.routes.js
Purpose

Defines public and authenticated authentication routes.

Suggested Endpoints
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
Example
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
9.2 routes/farm.routes.js
Purpose

Defines farm CRUD endpoints.

Suggested Endpoints
POST   /api/v1/farms
GET    /api/v1/farms
GET    /api/v1/farms/:farmId
PUT    /api/v1/farms/:farmId
DELETE /api/v1/farms/:farmId
Middleware

All routes should use:

protect

Create and update routes should also use validation middleware.

9.3 routes/recommendation.routes.js
Purpose

Defines irrigation recommendation endpoints.

Suggested Endpoints
POST /api/v1/recommendations/:farmId
GET  /api/v1/recommendations/:farmId
GET  /api/v1/recommendations/:farmId/history
Behaviour

Every route must:

Require authentication
Verify farm ownership through controller or service
Never accept raw weather values from the client for official recommendation generation
9.4 routes/user.routes.js
Purpose

Defines profile endpoints.

Suggested Endpoints
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password

All routes require authentication.

9.5 routes/weather.routes.js
Purpose

Defines current weather, forecast, and history endpoints.

Suggested Endpoints
GET /api/v1/weather/:farmId
GET /api/v1/weather/:farmId/forecast
GET /api/v1/weather/:farmId/history

All routes require authentication and ownership verification.

10. Services

Services contain reusable business logic and external integration logic.

Services should:

Be independent of Express response objects
Return data or throw predictable errors
Be reusable by controllers
Avoid rendering API responses directly
10.1 services/auth.service.js
Purpose

Contains authentication business logic.

Suggested Functions
registerUser(userData)
authenticateUser(email, password)
buildAuthResponse(user)
hashPassword(password)
Responsibilities
Normalize email
Check duplicate email
Hash passwords
Verify passwords
Create users
Generate JWT
Return safe user objects
Rules
Do not return the password hash.
Use a generic invalid-credentials error.
Force public registrations to farmer.
10.2 services/location.service.js
Purpose

Contains reusable location-related logic.

Possible Functions
validateCoordinates(latitude, longitude)
reverseGeocode(latitude, longitude)
isLocationInIndia(latitude, longitude)
formatLocation(locationData)
MVP Use

For the first version, the service may only validate coordinates.

Optional Integration

Reverse geocoding may use Nominatim.

Rules
Use timeouts for external requests.
Respect OpenStreetMap/Nominatim usage policies.
Do not make reverse geocoding mandatory for farm creation.
Keep manual state, district, and village fields.
10.3 services/recommendation.service.js
Purpose

Coordinates recommendation generation.

Suggested Functions
generateRecommendationForFarm(farm, weather)
saveRecommendation(data)
getLatestRecommendation(farmId, userId)
getRecommendationHistory(farmId, userId, options)
Responsibilities
Accept normalized weather
Apply irrigation rules
Build reason and action text
Create the recommendation record
Return a safe response
Important Rule

The rule priority must remain:

1. Rain probability
2. Humidity
3. Temperature
4. Default
10.4 services/weather.service.js
Purpose

Handles external weather API communication and normalization.

Suggested Functions
fetchCurrentWeather(latitude, longitude)
fetchForecast(latitude, longitude, days)
normalizeCurrentWeather(apiResponse)
normalizeForecast(apiResponse)
saveWeatherHistory(data)
Responsibilities
Read OpenWeather configuration from environment variables
Call the external API using Axios
Use metric units
Configure timeouts
Normalize provider data
Handle missing values
Throw safe service errors
Never expose the API key
Example External Parameters
lat
lon
appid
units=metric
Important Rule

Do not fabricate weather data when the provider fails.

11. Utility Files
11.1 utils/apiResponse.js
Purpose

Provides standardized response helpers.

Suggested Functions
sendSuccess(res, statusCode, message, data)
sendError(res, statusCode, message, code, errors)
Success Format
{
  "success": true,
  "message": "Farm created successfully",
  "data": {}
}
Error Format
{
  "success": false,
  "message": "Farm not found",
  "error": {
    "code": "FARM_NOT_FOUND"
  }
}
Rule

Controllers should not manually recreate the response format repeatedly.

11.2 utils/constants.js
Purpose

Stores shared non-secret constants.

Possible Constants
export const USER_ROLES = {
  FARMER: "farmer",
  ADMIN: "admin",
};

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

export const RECOMMENDATION_STATUS = {
  NO_IRRIGATION: "no_irrigation",
  DELAY_IRRIGATION: "delay_irrigation",
  IRRIGATE_TODAY: "irrigate_today",
  MONITOR_WEATHER: "monitor_weather",
};
Other Possible Constants
Pagination defaults
Maximum page size
Area units
Error codes
Weather timeouts
Advisory disclaimer
Rule

Do not store secrets in this file.

11.3 utils/irrigationRules.js
Purpose

Contains the rule-based recommendation logic.

Required Rule Order
export function evaluateIrrigationRules(weather) {
  const {
    rainProbability,
    humidity,
    temperature,
  } = weather;

  if (rainProbability > 60) {
    return {
      status: "no_irrigation",
      title: "No Irrigation Required",
      reason: "Rainfall is expected, so irrigation may not be required.",
      recommendedAction:
        "Delay irrigation and continue monitoring rainfall conditions.",
    };
  }

  if (humidity > 80) {
    return {
      status: "delay_irrigation",
      title: "Delay Irrigation",
      reason:
        "The humidity is high, which may reduce immediate water loss.",
      recommendedAction:
        "Check the weather again before irrigating.",
    };
  }

  if (temperature > 35) {
    return {
      status: "irrigate_today",
      title: "Irrigate Today",
      reason:
        "The temperature is high and may increase crop water demand.",
      recommendedAction:
        "Consider irrigating the farm today.",
    };
  }

  return {
    status: "monitor_weather",
    title: "Monitor Weather",
    reason: "No critical irrigation condition was detected.",
    recommendedAction:
      "Continue monitoring weather conditions before irrigating.",
  };
}
Rules
Keep this function pure where possible.
Do not access Express request or response objects.
Do not query MongoDB from this utility.
Test all boundary values.
11.4 utils/logger.js
Purpose

Provides centralized application logging.

Possible Tools
Winston
Pino
Console wrapper for a small prototype
Suggested Functions
logger.info()
logger.warn()
logger.error()
logger.debug()
Log
Server startup
Database connection
Request failures
External API failures
Unexpected exceptions
Do Not Log
Passwords
Password hashes
JWT tokens
Authorization headers
API keys
Database credentials
12. Root Backend Files
12.1 app.js
Purpose

Creates and configures the Express application.

Responsibilities
Create the Express app
Configure CORS
Parse JSON
Configure URL-encoded bodies
Add request logging
Register routes
Register health endpoint
Register 404 handler
Register global error middleware
Export the app
Suggested Structure
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import farmRoutes from "./routes/farm.routes.js";
import userRoutes from "./routes/user.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "smart-irrigation-api",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/farms", farmRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
Rules
Do not start the server in app.js.
Do not connect to MongoDB in route files.
Register error middleware last.
12.2 server.js
Purpose

Starts the backend server.

Responsibilities
Load environment variables
Connect to MongoDB
Start listening on the configured port
Handle startup failure
Handle unhandled rejections
Handle graceful shutdown
Suggested Structure
import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 8000;

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

startServer();
Graceful Shutdown

The server may handle:

SIGINT
SIGTERM
unhandledRejection
uncaughtException
12.3 package.json
Purpose

Defines project metadata, scripts, dependencies, and Node version requirements.

Recommended Scripts
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint ."
  }
}
Recommended Dependencies
express
Compass
jsonwebtoken
bcryptjs
axios
dotenv
cors
helmet
morgan
express-validator
Recommended Development Dependencies
nodemon
eslint
jest
supertest
Module Style

Because the files use import and export, include:

{
  "type": "module"
}
12.4 package-lock.json
Purpose

Locks exact dependency versions.

Rules
Commit this file.
Do not edit it manually.
Regenerate it through npm commands.
Keep it synchronized with package.json.
12.5 .env
Purpose

Stores local secret and environment-specific values.

Example
NODE_ENV=development
PORT=8000

MONGODB_URI=mongodb://127.0.0.1:27017/smart_irrigation

JWT_SECRET=replace_with_secure_random_value
JWT_EXPIRES_IN=1h

OPENWEATHER_API_KEY=replace_with_real_key
OPENWEATHER_BASE_URL=https://api.openweathermap.org

FRONTEND_URL=http://localhost:5173
Rules
Never commit this file.
Never place real secrets in documentation.
Restart the server after changes.
12.6 .env.example
Purpose

Documents required environment variables without real secrets.

NODE_ENV=development
PORT=8000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1h
OPENWEATHER_API_KEY=
OPENWEATHER_BASE_URL=https://api.openweathermap.org
FRONTEND_URL=http://localhost:5173

This file should be committed.

12.7 .gitignore
Purpose

Prevents local and sensitive files from being committed.

Recommended Content
node_modules/
.env
.env.local
coverage/
logs/
*.log
.DS_Store
dist/
12.8 README.md
Purpose

Explains how to set up and run the backend.

Recommended Sections
Project overview
Technology stack
Requirements
Installation
Environment variables
Development command
Production command
API base URL
API documentation
Folder structure
Testing
Troubleshooting
Basic Commands
cd backend
npm install
npm run dev
13. Authentication Flow
User submits email and password
           ↓
auth.routes.js
           ↓
validation.middleware.js
           ↓
auth.controller.js
           ↓
auth.service.js
           ↓
User.js
           ↓
Password comparison
           ↓
JWT generation
           ↓
Safe user and token returned
14. Farm Ownership Flow
Protected farm request
        ↓
auth.middleware.js
        ↓
Authenticated user loaded
        ↓
Farm loaded by ID
        ↓
farm.owner compared with req.user.id
        ↓
Match?
 ┌──────┴──────┐
Yes             No
 │               │
Continue      403 Forbidden
Important Rule

Never use this as ownership proof:

req.body.userId

Use:

req.user.id
15. Weather Flow
User selects farm
       ↓
GET /api/v1/weather/:farmId
       ↓
Verify authentication
       ↓
Verify ownership
       ↓
Read farm coordinates
       ↓
weather.service.js
       ↓
OpenWeather API
       ↓
Normalize response
       ↓
WeatherHistory.js
       ↓
Return weather data
16. Recommendation Flow
POST /api/v1/recommendations/:farmId
          ↓
Verify authentication
          ↓
Verify ownership
          ↓
Fetch current weather
          ↓
evaluateIrrigationRules()
          ↓
Build reason and action
          ↓
Recommendation.js
          ↓
Return recommendation

The backend must not generate a recommendation when weather retrieval fails.

17. Standard API Endpoints
Authentication
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
Users
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password
Farms
POST   /api/v1/farms
GET    /api/v1/farms
GET    /api/v1/farms/:farmId
PUT    /api/v1/farms/:farmId
DELETE /api/v1/farms/:farmId
Weather
GET /api/v1/weather/:farmId
GET /api/v1/weather/:farmId/forecast
GET /api/v1/weather/:farmId/history
Recommendations
POST /api/v1/recommendations/:farmId
GET  /api/v1/recommendations/:farmId
GET  /api/v1/recommendations/:farmId/history
18. Validation Rules
Registration
Name required
Valid email required
Email converted to lowercase
Mobile number validated
Password minimum eight characters
Confirm password must match
Role forced to farmer
Login
Email required
Password required
Farm
Farm name required
Crop name required
Area greater than zero
Valid area unit
State required
District required
Village required
Latitude between -90 and 90
Longitude between -180 and 180
Password Change
Current password required
New password validated
Confirmation must match
19. Error Handling Rules

The backend should return safe messages for:

Invalid input
Duplicate email
Invalid credentials
Invalid token
Expired token
Missing farm
Forbidden farm access
MongoDB failure
Weather API failure
Weather timeout
Invalid ObjectId
Unexpected error

Do not return:

Compass stack traces
MongoDB credentials
JWT secret
OpenWeather key
local file paths
20. Security Rules

The backend must:

Hash passwords
Verify JWT signatures
Expire tokens
Validate all protected requests
Verify farm ownership
Prevent role escalation
Store secrets in environment variables
Restrict CORS
Use Helmet
Limit JSON request size
Avoid sensitive logging
Use HTTPS in production
Prevent duplicate submissions where possible
Validate ObjectIds safely
Sanitize or safely handle user input
21. Recommended Missing Backend Files

The current structure is usable, but the following files may improve maintainability:

validators/
├── auth.validator.js
├── farm.validator.js
├── user.validator.js
└── common.validator.js

errors/
└── AppError.js

repositories/
├── user.repository.js
├── farm.repository.js
├── weather.repository.js
└── recommendation.repository.js

tests/
├── auth.test.js
├── farm.test.js
├── weather.test.js
├── recommendation.test.js
└── irrigationRules.test.js

For a small college prototype, repositories are optional.

22. Testing Strategy

Recommended tools:

Jest
Supertest
MongoDB Memory Server
Nock or Axios mocks

Test:

Registration
Duplicate email
Login
Invalid credentials
JWT authentication
Expired token
Profile update
Password change
Farm CRUD
Farm ownership
Invalid ObjectIds
Weather-service success
Weather-service failure
Recommendation rule priority
Recommendation history
Safe API responses

External weather requests must be mocked in automated tests.

23. Development Order
1. package.json
2. .env.example
3. config/db.js
4. config/jwt.js
5. utils/constants.js
6. utils/apiResponse.js
7. utils/logger.js
8. middleware/error.middleware.js
9. models/User.js
10. services/auth.service.js
11. controllers/auth.controller.js
12. routes/auth.routes.js
13. middleware/auth.middleware.js
14. models/Farm.js
15. controllers/farm.controller.js
16. routes/farm.routes.js
17. services/location.service.js
18. models/WeatherHistory.js
19. services/weather.service.js
20. controllers/weather.controller.js
21. routes/weather.routes.js
22. utils/irrigationRules.js
23. models/Recommendation.js
24. services/recommendation.service.js
25. controllers/recommendation.controller.js
26. routes/recommendation.routes.js
27. controllers/user.controller.js
28. routes/user.routes.js
29. app.js
30. server.js
31. Testing
32. Security review
24. Backend Acceptance Criteria

The backend is ready when:

The server starts correctly
MongoDB connects successfully
Registration works
Duplicate emails are rejected
Passwords are hashed
Login returns a valid JWT
Protected routes reject missing tokens
Expired tokens are rejected
Profile APIs work
Farm CRUD works
Farm ownership is enforced
Weather is fetched through the backend
Weather API failures are handled
Weather history is stored
Recommendation rules run in the correct order
Recommendations are saved
No password hashes are returned
No API keys are exposed
Responses follow a consistent format
Critical tests pass
25. Rules for Codex

Codex must:

Use Node.js and Express for this backend structure
Use ES modules consistently
Use MongoDB through Compass
Keep routes thin
Keep controllers focused
Keep external APIs inside services
Keep recommendation rules in one module
Use middleware for authentication and validation
Use standardized responses
Verify farm ownership
Hash passwords securely
Use JWT expiration
Store secrets in .env
Never expose the weather API key
Never return password hashes
Never trust client-provided user IDs
Never fabricate weather
Never generate recommendations without valid weather
Handle invalid ObjectIds
Handle loading-related failures through predictable API responses
Write tests for critical endpoints
Mock external weather requests
Avoid monolithic controller files
Keep documentation synchronized with the actual Node.js backend

Documentation conflict priority:

1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. API.md
5. BACKEND.md
6. TESTING_PLAN.md

Before using this priority, update any document that still incorrectly states that the existing backend uses FastAPI.

26. Final Backend Workflow
React Frontend
      ↓
Express Route
      ↓
Validation Middleware
      ↓
JWT Authentication
      ↓
Controller
      ↓
Service
      ↓
Compass Model or OpenWeather API
      ↓
MongoDB
      ↓
Standard JSON Response

The backend must remain secure, modular, consistent, testable, and suitable for college submission.