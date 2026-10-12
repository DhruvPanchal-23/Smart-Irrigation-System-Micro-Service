# Frontend Implementation Report

Project: KisanSetu / Smart Irrigation Microservices  
Report date: 12 October 2026  
Scope: Current implementation in `frontend/`, inspected directly from source. This report describes implemented behavior, not planned functionality in inherited documentation.

## 1. Purpose and current behavior

The frontend is a farmer portal for account access, farm registration, geographic location selection, weather viewing, historical analysis, and irrigation advice. It is a React single-page application served locally by Vite on port 5174.

The application combines two data paths. Account, farm, live weather, and history screens communicate with the backend gateway. Dashboard and Recommendation instead read a bundled historical JSON dataset. A newly created MongoDB farm therefore does not automatically appear in those historical screens.

## 2. Technology stack

| Technology | Declared package range | Use |
| --- | --- | --- |
| React / React DOM | ^19.2.7 | Components, rendering, state, effects |
| Vite | ^8.1.1 | Development server and production bundling |
| React Router DOM | ^7.18.1 | Browser routing, nested layouts, redirects |
| Axios | ^1.18.1 | Gateway API requests and interceptors |
| React Hook Form | ^7.82.0 | Profile and password form handling |
| Tailwind CSS / Vite plugin | ^4.3.3 | Styling integration |
| Leaflet | ^1.9.4 | Interactive geographic maps |
| React Leaflet | ^5.0.0 | React map components |
| Recharts | ^3.10.0 | Weather and analytics charts |
| React Icons | ^5.7.0 | Interface icons |
| ESLint | ^10.0.1 | Static code checks |

These are manifest ranges, not a claim about exact installed versions. The code uses JavaScript and JSX; there is no TypeScript compilation setup in the inspected frontend.

## 3. Source organization

```text
frontend/
  public/data/      Bundled historical weather and recommendation dataset
  src/
    main.jsx       React bootstrap, router, authentication provider, CSS
    App.jsx        Root route component
    routes/        AppRoutes and ProtectedRoute
    layouts/       Public and authenticated layouts
    pages/         Route-level screens
    context/       Shared authentication state
    hooks/         Authentication and farm hooks
    services/      Axios client and domain API functions
    components/    Common, farm, map, weather, recommendation, analytics UI
    utils/         Formatting, constants, validation helpers
    assets/        Images and other bundled assets
    index.css      Main visual styles and responsive rules
  vite.config.js   React/Tailwind plugins; port 5174 with strictPort
```

`main.jsx` mounts React StrictMode, BrowserRouter, and AuthProvider. `App.jsx` delegates to AppRoutes. BrowserRouter uses browser history; a production host would need a fallback to `index.html` for direct navigation to application routes.

## 4. Pages and navigation

| Route | Access | Implemented purpose | Data source |
| --- | --- | --- | --- |
| `/` | Public | Product introduction and navigation | Static content |
| `/about` | Public | Project information | Static content |
| `/login` | Public | Email/password login | Identity API |
| `/register` | Public | New farmer account | Identity API |
| `/dashboard` | Authenticated | Historical weather playback and charts | Bundled JSON |
| `/farms` | Authenticated | List owned farms | Farm API |
| `/farms/add` | Authenticated | Farm creation with coordinates | Farm API |
| `/farms/:farmId` | Authenticated | Details, deletion, weather/advice links | Farm API |
| `/weather` | Authenticated | Fetch current weather for a selected farm | Weather API |
| `/recommendation` | Authenticated | Inspect saved advice for a historical record | Bundled JSON |
| `/history` | Authenticated | Combined saved weather/advice history | Weather and recommendation APIs |
| `/profile` | Authenticated | Account details, password, local preferences | Identity/farm/advice APIs and localStorage |
| Unmatched paths | Public fallback | Not-found screen | Static content |

MainLayout supplies public navigation and a footer, omitting the footer on authentication pages. DashboardLayout supplies sidebar navigation, user initials, a top bar, and a mobile menu. The menu closes on navigation, backdrop click, or Escape. The top-bar notification count is a fixed presentation value, not a live notification feed.

## 5. Authentication and session flow

1. Login or registration sends credentials through authService.
2. A successful response supplies a user object and JWT.
3. AuthProvider stores the JWT in localStorage under `irrigation_token` and holds the user in React state.
4. On startup, an existing token is checked through `GET /auth/me`.
5. ProtectedRoute waits for restoration and redirects unauthenticated visitors to `/login`.
6. The Axios request interceptor attaches `Authorization: Bearer <token>`.
7. An API 401 removes the token and dispatches `auth:expired`; AuthProvider clears the user.
8. Logout calls the API and clears local state, even when that API call fails.

Route protection is a navigation feature; authorization is enforced again in the backend. The token is available to page JavaScript because it is stored in localStorage. There is no refresh-token flow in the inspected frontend. Any failure during session restoration clears the session, including temporary backend failures.

## 6. API integration

The shared Axios client in `src/services/api.js` uses `VITE_API_BASE_URL`, defaulting to `http://localhost:8100/api/v1`, with a 15-second timeout. Service functions generally return the nested `response.data.data` payload.

| Module | Operations |
| --- | --- |
| authService | Register, login, current user, profile read/update, password change, logout |
| farmService | List, detail, create, update, delete |
| weatherService | Current weather and saved history |
| recommendationService | Generate via POST, latest advice, saved history |

Although recommendationService exposes a generation API, the current Recommendation page does not call it. Farm list functions discard response pagination metadata, and useFarm requests the default page. There is no complete paginated farm browser in the inspected screen.

## 7. Farm workflow and maps

FarmForm collects farm name, crop type, area, acre/hectare unit, address, latitude, and longitude. Submission converts area and coordinates to numbers. HTML required/minimum controls and a finite-number check provide basic validation; backend schema validation supplies geographic bounds and further constraints.

LocationPicker starts with an India-centered map at approximately latitude 22.5 and longitude 79, zoom 5. OpenStreetMap tiles render the background. Clicking updates coordinates to six decimal places and displays a marker. External tile access is required for the map background.

FarmDetails loads one farm, displays crop/area/location, and confirms before deletion. Its weather/advice links pass `?farm=<id>`. The recommendation screen only accepts IDs present in the bundled dataset and falls back to a dataset farm, so an API-created farm may not be the farm displayed by that link.

The backend and service wrapper support updates, but the inspected routes do not expose a dedicated farm-edit page.

## 8. Historical dashboard

Dashboard fetches `/data/smart_irrigation_seed_5_years.json`, checks the presence of farm, weather, and recommendation arrays, and selects the first dataset farm. It filters and sorts weather by record date, matches advice by `weatherSnapshot.weatherHistoryId`, and displays weather measurements, farm details, and advice.

Timeline playback advances one record every four seconds and stops at the final record. Changing farms resets playback. Charts use up to seven visible records. The chart label says 7-Day, but the implementation takes seven records; that label assumes daily sampling rather than verifying it.

This screen does not query the signed-in user's MongoDB records. The public dataset is downloaded as a static asset and is accessible independently of the protected route.

## 9. Recommendation screen

The advisor loads the same JSON file and provides farm, date, time, and record controls. Its record selector displays up to 365 records, while date/time matching searches the farm's full record list. Clicking Generate waits 350 milliseconds and retrieves a stored recommendation matching the selected weather record. It does not fetch live weather, execute the server rule engine, or write a new database recommendation.

The result includes advice, supporting weather, predefined instructions, threshold explanations, a heuristic confidence score, and browser printing. The confidence score is calculated from local checks and completeness; it is not a calibrated predictive probability. Date/time inputs use UTC ISO slices while other labels use locale formatting, which can produce timezone inconsistencies.

## 10. Weather, history, and profile

Weather uses owned farms and fetches live conditions on button click. Selecting another farm clears the previous weather. Busy/error states prevent duplicate actions and explain failures. A provider key is required in the backend for this feature.

History requests weather and recommendation history concurrently, merges them with type labels, and sorts newest first. The backend caps each history list at 50, so this is a recent combined view rather than a full archive.

Profile loads user details and farms concurrently, then optionally loads the first farm's latest advice. Name and mobile edits are persisted by the API; email is disabled. Password change uses current/new password fields and frontend confirmation with an eight-character minimum.

Notification switches, language, address, units, and default farm are saved in `profile_notifications` and `profile_preferences` localStorage entries. These keys are not scoped per user. They do not establish email/SMS delivery, translation, or a global unit-conversion system. Photo upload is unavailable. Account deletion displays an unavailable dialog because no deletion API exists.

## 11. Styling and accessibility

The interface uses custom CSS alongside Tailwind integration, card-based layouts, status colors, icons, responsive grids, a mobile navigation drawer, and dedicated login/profile/advisor designs. Leaflet CSS is loaded globally.

Existing accessibility features include form labels, button labels, selected status/alert regions, switch roles, and Escape dismissal for navigation. A full keyboard, contrast, focus-management, and screen-reader audit was not performed. Modal focus trapping and consistent error handling remain useful review areas.

## 12. Local setup and commands

Run from `C:\Users\dhruv\microservices`:

```powershell
npm.cmd --prefix frontend ci
npm.cmd --prefix frontend run dev
```

Set `frontend/.env` to:

```dotenv
VITE_API_BASE_URL=http://localhost:8100/api/v1
```

Open `http://localhost:5174`. Run the backend separately using `npm.cmd run dev`. Keep the backend `FRONTEND_URL` aligned with the browser origin; `localhost` and `127.0.0.1` are different origins. Restart Vite after changing environment settings. Values with the `VITE_` prefix are client configuration and should not contain secrets.

```powershell
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run build
```

Build output is written to `frontend/dist`. Port 5174 is strict: a conflicting listener causes startup to fail rather than move to another port.

## 13. Current limitations and recommended work

| Priority | Finding | Suggested improvement |
| --- | --- | --- |
| High | Historical advice and API farms have separate identities/data | Choose and clearly label historical versus live workflows; connect live advice to the generation API if intended |
| High | FarmDetails lacks a request-error path | Add explicit error/retry states for load and deletion |
| Medium | Farm listing drops pagination metadata | Add page controls and preserve metadata |
| Medium | Profile preferences are browser-wide | Scope storage by user and implement actual preference effects |
| Medium | Profile total area sums mixed units | Normalize acreage/hectares before summing |
| Medium | Profile member-since is unavailable from safeUser | Supply a supported createdAt field from the identity API |
| Medium | Date/time controls mix UTC and local display | Use one explicit timezone convention |
| Medium | Notifications and photo/deletion controls are incomplete | Implement services or keep availability clearly stated |
| Medium | No configured component/browser test suite | Add tests for auth restoration, farm submission, dataset selection, and failed requests |

## 14. Evidence and verification scope

Primary sources: `src/main.jsx`, `routes/`, `layouts/`, `context/AuthContext.jsx`, `services/`, the inspected page components, `components/map/LocationPicker.jsx`, `components/farm/FarmForm.jsx`, `index.css`, and the package/Vite/environment example files.

Earlier in this session, the development frontend responded with HTTP 200 and the gateway reported MongoDB connected. Those checks do not establish every screen's correctness. This report was prepared through source inspection; no additional frontend build, lint, browser, or accessibility checks were run for report generation.
