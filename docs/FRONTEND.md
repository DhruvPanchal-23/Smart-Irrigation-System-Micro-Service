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

The backend remains the source of truth for authentication, authorization, farm ownership, user roles, weather retrieval, recommendation generation, and database operations.

3. Frontend Folder Structure

frontend/
├── public/
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
│   │   ├── farm/
│   │   │   ├── FarmCard.jsx
│   │   │   ├── FarmForm.jsx
│   │   │   └── FarmList.jsx
│   │   ├── map/
│   │   │   ├── IndiaMap.jsx
│   │   │   ├── LocationPicker.jsx
│   │   │   └── MarkerPopup.jsx
│   │   ├── recommendation/
│   │   │   ├── RecommendationCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   └── weather/
│   │       ├── ForecastCard.jsx
│   │       ├── WeatherCard.jsx
│   │       ├── WeatherChart.jsx
│   │       └── WeatherDetails.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFarms.js
│   │   └── useWeather.js
│   ├── layouts/
│   │   ├── DashboardLayout.jsx
│   │   └── MainLayout.jsx
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
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── farmService.js
│   │   ├── recommendationService.js
│   │   └── weatherService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── package.json
├── vite.config.js
└── README.md

4. Application Data Flow

Page or Component
       ↓
Custom Hook
       ↓
Service Function
       ↓
Shared Axios Instance
       ↓
FastAPI Backend
       ↓
Response Returned
       ↓
Hook Updates State
       ↓
Component Renders Result

5. File-by-File Responsibilities

components/common/Alert.jsx

Displays success, error, warning, and informational messages. It should support a message, optional title, alert type, close action, and accessible role="alert" behaviour.

components/common/Button.jsx

Reusable button for primary, secondary, danger, outline, and ghost actions. It should support loading, disabled, icons, size, full width, and correct HTML button type.

components/common/Footer.jsx

Public-site footer containing project information, navigation, contact information, technology references, copyright, and the academic disclaimer.

components/common/Loader.jsx

Displays page, section, inline, or button loading states. Use meaningful messages such as “Fetching weather...” or “Saving farm...”.

components/common/Modal.jsx

Reusable accessible modal for confirmations, warnings, and information. It should support keyboard closing, focus trapping, overlay clicks, and background-scroll locking.

components/common/Navbar.jsx

Public navigation containing Home, About, Features, Contact, Login, and Register. It should use NavLink, active states, sticky positioning, and mobile navigation.

components/common/Sidebar.jsx

Protected dashboard navigation containing Dashboard, Add Farm, My Farms, Weather, Recommendation, Profile, and Logout. It should be fixed on desktop and a drawer on mobile.

components/farm/FarmCard.jsx

Displays one farm’s name, crop, area, location, coordinates, and actions such as View, Edit, Delete, Check Weather, and Get Recommendation.

components/farm/FarmForm.jsx

Reusable add/edit farm form. It should use React Hook Form and validate farm name, crop, area, unit, address, latitude, longitude, and selected map location.

components/farm/FarmList.jsx

Displays multiple farm cards and handles loading, error, empty, and no-search-results states.

components/map/IndiaMap.jsx

Base React Leaflet map centred on India using OpenStreetMap tiles.

export const INDIA_CENTER = [20.5937, 78.9629];
export const INDIA_ZOOM = 5;

components/map/LocationPicker.jsx

Captures map clicks using useMapEvents, updates latitude and longitude, and passes the selected position to the parent.

components/map/MarkerPopup.jsx

Displays farm name, coordinates, and optional readable location inside a Leaflet popup.

components/recommendation/RecommendationCard.jsx

Displays recommendation title, status, weather snapshot, reason, action, generated time, and advisory disclaimer. It must not calculate the recommendation itself.

components/recommendation/StatusBadge.jsx

Maps recommendation status codes to readable labels and styles:

Status

Label

no_irrigation

No Irrigation Required

delay_irrigation

Delay Irrigation

irrigate_today

Irrigate Today

monitor_weather

Monitor Weather

components/weather/ForecastCard.jsx

Displays one forecast item with date, minimum and maximum temperatures, humidity, rain probability, condition, and icon.

components/weather/WeatherCard.jsx

Displays one weather metric such as temperature, humidity, wind, pressure, or rain probability.

components/weather/WeatherChart.jsx

Displays weather history using Recharts. It should use ResponsiveContainer, tooltips, formatted dates, and empty states.

components/weather/WeatherDetails.jsx

Displays the complete current-weather summary using multiple WeatherCard components.

context/AuthContext.jsx

Provides global authentication state and operations:

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

It restores authentication after refresh, verifies the token through /auth/me, and clears invalid sessions.

hooks/useAuth.js

Convenience hook for consuming AuthContext. It should throw a useful error when used outside AuthProvider.

hooks/useFarms.js

Manages farms, selected farm, loading, errors, pagination, and CRUD operations through farmService.

hooks/useWeather.js

Manages current weather, forecast, history, loading, errors, and refresh operations through weatherService.

layouts/MainLayout.jsx

Public layout:

<>
  <Navbar />
  <main>
    <Outlet />
  </main>
  <Footer />
</>

layouts/DashboardLayout.jsx

Protected layout containing the sidebar, top header, mobile menu control, and <Outlet />.

pages/About.jsx

Explains the project, problem, objectives, solution, technology stack, limitations, and future scope.

pages/AddFarm.jsx

Coordinates FarmForm, IndiaMap, LocationPicker, and farmService.createFarm() to create a farm.

pages/Dashboard.jsx

Displays welcome information, total farms, selected farm, current weather, latest recommendation, recent history, and quick actions.

pages/Home.jsx

Public landing page with hero, features, process, benefits, technologies, and calls to action.

pages/Login.jsx

Authenticates users using email and password. It should use React Hook Form, useAuth, loading states, and generic invalid-credentials errors.

pages/NotFound.jsx

Custom 404 page with Home and Dashboard navigation.

pages/Profile.jsx

Displays and updates name and mobile number, shows account information, and provides password-change functionality.

pages/Recommendation.jsx

Allows a farmer to select a farm, request a recommendation, and display RecommendationCard. It must show an error when weather is unavailable.

pages/Register.jsx

Creates farmer accounts. It must validate input, prevent role selection, and navigate to Login after success.

pages/Weather.jsx

Allows farm selection and displays current weather, forecast, charts, refresh controls, loading states, and retry behaviour.

routes/AppRoutes.jsx

Defines public, protected, nested, and fallback routes.

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

routes/ProtectedRoute.jsx

Checks authentication. While authentication is loading, it shows a loader. Authenticated users receive <Outlet />; unauthenticated users are redirected to /login.

services/api.js

Shared Axios instance with:

VITE_API_BASE_URL

JSON headers

Request timeout

Bearer-token request interceptor

401 response handling

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

services/authService.js

Functions:

register(userData)
login(credentials)
getCurrentUser()
logout()
getProfile()
updateProfile(profileData)
changePassword(passwordData)

services/farmService.js

Functions:

createFarm(farmData)
getFarms(params)
getFarmById(farmId)
updateFarm(farmId, farmData)
deleteFarm(farmId)

Do not send userId; ownership comes from the authenticated backend user.

services/recommendationService.js

Functions:

generateRecommendation(farmId)
getLatestRecommendation(farmId)
getRecommendationHistory(farmId, params)

services/weatherService.js

Functions:

getCurrentWeather(farmId)
getForecast(farmId, days)
getWeatherHistory(farmId, params)

It must call only the project backend, not OpenWeather directly.

utils/constants.js

Stores non-secret shared constants such as map centre, routes, statuses, area units, pagination defaults, and crop options.

utils/formatters.js

Functions for formatting temperature, humidity, wind, pressure, rain probability, area, dates, and coordinates. Missing values should return Not available.

utils/helpers.js

General utilities such as:

getInitials(name)
buildQueryParams(params)
getErrorMessage(error)
debounce(callback, delay)
classNames(...values)

utils/validators.js

Reusable frontend validation for names, emails, mobile numbers, passwords, farm names, crop names, areas, latitude, and longitude.

App.jsx

Top-level application component. It should mainly render AppRoutes and optional global providers.

main.jsx

Bootstraps React, imports global and Leaflet CSS, and wraps the application with BrowserRouter and AuthProvider.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

index.css

Contains Tailwind directives, root font, body background, global focus styles, and minimal global rules.

App.css

Contains only small app-level or third-party overrides not suitable for Tailwind. It should not become a large unstructured stylesheet.

6. Environment Configuration

.env

VITE_API_BASE_URL=http://localhost:8000/api/v1

Rules

Vite variables must start with VITE_

Never store backend secrets in frontend variables

Never store the OpenWeather API key in the frontend

Restart Vite after changing environment variables

7. Recommended Missing Files

To fully match the project requirements, add:

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

8. State Management Rules

Use local state for:

Modal visibility

Mobile menus

Filters

Search text

Selected tabs

Temporary UI values

Use AuthContext for:

Current user

Authentication state

Login

Logout

Session restoration

Use custom hooks for reusable farm, weather, and recommendation data logic.

Do not place every state value in global context.

9. Loading, Empty, and Error States

Every data-driven page must include:

Loading state
Success state
Empty state
Error state

Examples:

Loading farms...
Fetching weather...
Generating recommendation...
No farms added yet.
No recommendation has been generated yet.
Unable to connect to the server.
Unable to fetch weather information.

Do not display raw Axios, MongoDB, or backend stack-trace errors.

10. Styling Rules

Use the approved blue design system:

Primary: #2563EB
Primary Dark: #1D4ED8
Secondary: #0EA5E9
Sidebar: #0F172A
Background: #F8FAFC
Cards: #FFFFFF

Common card style:

rounded-2xl border border-slate-200 bg-white p-5 shadow-sm

Common button style:

rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700

Common input style:

w-full rounded-lg border border-slate-300 px-4 py-2.5
focus:border-blue-500 focus:ring-2 focus:ring-blue-100

11. Responsive Design Rules

Test at:

320px
375px
425px
768px
1024px
1280px
1440px

On mobile:

Sidebar becomes a drawer

Forms use one column

Cards stack

Tables scroll horizontally

Maps remain interactive

Buttons remain touch-friendly

On desktop:

Sidebar remains fixed

Dashboard uses multiple columns

Maps and charts use larger spaces

Content remains readable and balanced

12. Accessibility Rules

The frontend should:

Use semantic HTML

Use visible form labels

Use keyboard navigation

Show focus states

Add alt text

Add aria-label to icon buttons

Avoid colour-only status communication

Make modals keyboard accessible

Use understandable error messages

13. Security Rules

The frontend must:

Never expose passwords or hashes

Never contain JWT secrets

Never contain the OpenWeather key

Clear authentication data on logout

Handle expired sessions

Confirm destructive actions

Prevent duplicate submissions

Avoid unsafe HTML rendering

Treat backend authorization as final

14. Development Order

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
13. Common components
14. Login.jsx
15. Register.jsx
16. Dashboard.jsx
17. Farm components
18. Map components
19. AddFarm.jsx
20. Weather components
21. Weather.jsx
22. Recommendation components
23. Recommendation.jsx
24. Profile.jsx
25. Home.jsx
26. About.jsx
27. NotFound.jsx
28. Responsive improvements
29. Accessibility improvements
30. Testing

15. Frontend Acceptance Criteria

The frontend is ready when:

Public navigation works

Registration and login work

Logout works

Authentication survives refresh

Protected routes redirect correctly

Dashboard loads user data

Farmers can add farms

Map selection updates coordinates

Weather displays with correct units

Weather errors are handled

Recommendations display status, reason, action, and disclaimer

Profile updates work

Loading, empty, and error states are implemented

Mobile navigation works

No API key or sensitive value is exposed

Components are reusable

API calls remain inside services

16. Rules for Codex

Codex must:

Preserve the documented folder structure

Use functional React components

Use hooks and React Router

Use Tailwind CSS

Use the shared Axios instance

Keep API logic in services

Keep authentication in AuthContext

Use custom hooks for reusable data logic

Use React Hook Form for major forms

Keep page components focused

Use React Leaflet for maps

Keep the weather API key out of the frontend

Never generate official recommendations in React

Include loading, empty, success, and error states

Protect private routes

Use accessible labels

Disable buttons during requests

Avoid monolithic files

Avoid duplicate API functions

Avoid Bootstrap

Avoid hardcoded live weather

Avoid displaying raw backend errors

Documentation conflict priority:

1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. API.md
5. FRONTEND.md
6. UI_GUIDELINES.md
7. FEATURES.md

17. Final Frontend Workflow

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

The frontend must remain responsive, modular, accessible, secure, reusable, testable, and consistent with the backend API.
## Dashboard Analytics Implementation

The farmer dashboard loads
`/data/smart_irrigation_seed_5_years.json` once from the frontend public
directory. This is synthetic demonstration data and the dashboard always shows a
visible `Simulated Weather Data` badge. The dashboard does not call an external
weather API.

The selected farm ID filters and sorts its weather and stored recommendation
records. React state tracks the current record, while memoized transformations
build the selected day plus six previous available readings. Previous, play,
pause, next, and speed controls update every weather card, the simulation date,
the matching stored recommendation, and all responsive Recharts analytics.

The dashboard never recalculates the official irrigation recommendation. It
matches the current weather record to the seed recommendation using
`weatherSnapshot.weatherHistoryId`. A dataset load failure shows an error and
does not fabricate fallback weather.

The Weather and Recommendation pages continue to use the secured backend API for
their normal live-weather workflow.
