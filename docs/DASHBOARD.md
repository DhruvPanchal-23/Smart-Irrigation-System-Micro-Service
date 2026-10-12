> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

Dashboard Documentation

1. Document Purpose

This document defines the dashboard structure, analytical cards, charts, weather panels, recommendation panels, tables, interactions, responsive behaviour, data requirements, and implementation rules for the Weather-Based Smart Irrigation Advisory System.

The dashboard is the main authenticated screen shown after login. It helps the farmer quickly understand:

Registered farms and total farm area

The currently selected farm

Current temperature and humidity

Wind speed and rainfall probability

Irrigation recommendation

Seven-day weather trends

Recommendation distribution

Farm information and location

Recent weather and recommendation history

Important weather alerts

2. Dashboard Main Goal

The dashboard should immediately answer:

Which farm am I viewing?
What is the current weather?
Is rain expected?
What is the wind speed?
Should I irrigate today?
What weather pattern has occurred recently?
What recommendations were generated recently?
Are there any important alerts?

3. Dashboard User Flow

Farmer Logs In
      ↓
Dashboard Loads
      ↓
User Farms Are Retrieved
      ↓
Default or Previously Selected Farm Is Chosen
      ↓
Current Weather Is Retrieved
      ↓
Latest Recommendation Is Retrieved
      ↓
Weather and Recommendation History Are Retrieved
      ↓
Cards, Graphs, Tables, Map, and Alerts Are Displayed

4. Dashboard Layout Overview

┌───────────────────────────────────────────────────────────────┐
│ Sidebar │ Dashboard Header                                   │
│         │ Welcome Message   Farm Selector   Date   Refresh   │
├─────────┼─────────────────────────────────────────────────────┤
│         │ Summary Cards                                       │
│         │ Farms | Area | Temp | Humidity | Rain | Wind       │
├─────────┼─────────────────────────────────────────────────────┤
│         │ Current Weather | 7-Day Trend | Recommendation      │
├─────────┼─────────────────────────────────────────────────────┤
│         │ Rain Chart | Recommendation Pie | Weather Pie       │
├─────────┼─────────────────────────────────────────────────────┤
│         │ Farm Information | Farm Map                         │
├─────────┼─────────────────────────────────────────────────────┤
│         │ Weather History | Recommendation History            │
├─────────┼─────────────────────────────────────────────────────┤
│         │ Quick Actions | Weather Alerts                      │
└─────────┴─────────────────────────────────────────────────────┘

5. Dashboard Header

5.1 Welcome Message

Good morning, Rahul!
Here is what is happening on your farms today.

The greeting may change based on time:

Good morning
Good afternoon
Good evening

5.2 Farm Selector

Selected Farm
Patil Sugarcane Farm ▼

Changing the selected farm must update:

Current weather

Summary cards

Recommendation

Charts

Farm information

Farm location

Recent history

Alerts

5.3 Current Date and Time

23 July 2026, 10:35 AM

5.4 Refresh Button

The refresh button should:

Refresh current weather

Refresh dashboard summaries

Display a loading state

Prevent repeated clicks

Update the last-updated time

Show a safe error if live weather cannot be fetched

6. Summary Cards

Display compact cards across the top.

Card

Example value

Supporting text

Total Farms

3

Active farms

Total Area

18 Acres

Combined farm area

Temperature

34°C

Feels like 36°C

Humidity

68%

Moderate

Rain Probability

40%

Moderate

Wind Speed

12 km/h

Light breeze

Recommendation

Monitor Weather

Stay updated

Last Updated

10:30 AM

23 Jul 2026

Rules:

Do not combine different area units without conversion.

Use backend values for live metrics.

Display Not available for missing values.

Use icons and labels, not colour alone.

7. Current Weather Panel

Purpose

Display the current weather for the selected farm.

Example

Current Weather

34°C
Partly Cloudy

Feels Like: 36°C
Humidity: 68%
Wind Speed: 12 km/h
Pressure: 1008 hPa
Rain Probability: 40%
Sunrise: 6:12 AM
Sunset: 7:08 PM
Last Updated: 10:30 AM

Required Fields

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

Observation time

Behaviour

Display a weather icon.

Format units consistently.

Show a loading skeleton.

Show a retry action after failure.

Display an empty state when no farm is selected.

Never display fabricated live weather.

8. Irrigation Recommendation Panel

Example

Irrigation Recommendation

Status: Monitor Weather

Reason:
No critical irrigation condition was detected.

Recommended Action:
Continue monitoring weather conditions before irrigating.

Based On:
Temperature: 34°C
Humidity: 68%
Rain Probability: 40%

Generated At:
23 July 2026, 10:35 AM

Required Fields

Status

Title

Reason

Recommended action

Weather snapshot

Generated time

Disclaimer

Status Styles

Status

Display label

Suggested style

no_irrigation

No Irrigation Required

Green

delay_irrigation

Delay Irrigation

Amber

irrigate_today

Irrigate Today

Blue

monitor_weather

Monitor Weather

Sky blue

Error

Weather Unavailable

Red

Disclaimer

This recommendation is based on weather data and predefined rules. It is not a replacement for professional agricultural guidance.

The dashboard must display the recommendation returned by the backend. It must not calculate the official recommendation locally.

9. Temperature and Humidity Trend Chart

Chart Type

Line chart

Title

7-Day Temperature and Humidity Trend

Example Data

[
  { day: "Mon", temperature: 31, humidity: 75 },
  { day: "Tue", temperature: 33, humidity: 70 },
  { day: "Wed", temperature: 35, humidity: 64 },
  { day: "Thu", temperature: 34, humidity: 68 },
  { day: "Fri", temperature: 36, humidity: 60 },
  { day: "Sat", temperature: 32, humidity: 74 },
  { day: "Sun", temperature: 30, humidity: 80 }
]

Requirements

Use Recharts.

Use ResponsiveContainer.

Display temperature and humidity as separate lines.

Display a legend and tooltips.

Use readable day labels.

Show Celsius and percentage units.

Handle an empty dataset.

Avoid hardcoded chart dimensions.

Suggested Recharts components:

ResponsiveContainer
LineChart
CartesianGrid
XAxis
YAxis
Tooltip
Legend
Line

10. Rainfall Probability Chart

Chart Type

Bar chart

Title

7-Day Rainfall Probability

Example Data

[
  { day: "Mon", probability: 20 },
  { day: "Tue", probability: 35 },
  { day: "Wed", probability: 10 },
  { day: "Thu", probability: 40 },
  { day: "Fri", probability: 65 },
  { day: "Sat", probability: 80 },
  { day: "Sun", probability: 55 }
]

Requirements

Use a 0–100 percentage scale.

Display exact percentages in tooltips.

Use day labels.

Use a responsive container.

Show an empty state when history is unavailable.

11. Irrigation Recommendation Summary

Chart Type

Pie chart or doughnut chart

Title

Irrigation Recommendation Summary

Example Period

Last 30 days

Example Data

[
  { name: "Irrigate Today", value: 8 },
  { name: "No Irrigation Required", value: 10 },
  { name: "Delay Irrigation", value: 5 },
  { name: "Monitor Weather", value: 7 }
]

Requirements

Show the total count in the centre for a doughnut chart.

Display a legend.

Display count or percentage in the tooltip.

Do not render a misleading chart when all values are zero.

Show an empty state instead.

12. Weather Condition Distribution

Chart Type

Pie chart or doughnut chart

Title

Weather Condition Distribution

Example Data

[
  { name: "Clear", value: 35 },
  { name: "Cloudy", value: 30 },
  { name: "Rainy", value: 25 },
  { name: "Stormy", value: 10 }
]

Allow a period selector:

Last 7 days
Last 30 days

Use a pie chart only for a part-to-whole summary, not for a daily trend.

13. Wind Speed Trend

Chart Type

Line chart

Title

Wind Speed Trend

Example Data

[
  { time: "6 AM", windSpeed: 5 },
  { time: "9 AM", windSpeed: 8 },
  { time: "12 PM", windSpeed: 12 },
  { time: "3 PM", windSpeed: 16 },
  { time: "6 PM", windSpeed: 10 },
  { time: "9 PM", windSpeed: 7 }
]

Summary:

Current Wind Speed: 12 km/h
Maximum Today: 16 km/h
Minimum Today: 5 km/h

14. Farm Information Panel

Example

Farm Information

Farm Name: Patil Sugarcane Farm
Crop Type: Sugarcane
Area: 8 Acres
Village: Malegaon
District: Pune
State: Maharashtra
Latitude: 18.1517
Longitude: 74.5777

Actions

View farm

Edit farm

Open map

Check weather

Generate recommendation

Behaviour

Update when the selected farm changes.

Format area and coordinates correctly.

Avoid displaying undefined values.

Display an empty state when no farms exist.

15. Farm Location Map

Display the selected farm on OpenStreetMap.

Example:

Patil Sugarcane Farm
18.1517, 74.5777
Malegaon, Baramati, Pune, Maharashtra

Requirements:

Use React Leaflet.

Use OpenStreetMap tiles.

Display a farm marker and popup.

Display zoom controls.

Use a responsive map container.

Include an Open in Map action.

Show loading and error states.

16. Recent Weather History Table

Date and time

Temperature

Humidity

Wind speed

Rain probability

Condition

23 Jul, 10:30 AM

34°C

68%

12 km/h

40%

Cloudy

22 Jul, 10:15 AM

36°C

60%

14 km/h

20%

Clear

21 Jul, 9:50 AM

31°C

78%

8 km/h

65%

Rainy

Action:

View Complete Weather History

Behaviour:

Show the latest 3–5 records.

Sort newest first.

Support horizontal scrolling on mobile.

Display an empty state when no history exists.

17. Recent Recommendation History Table

Date

Status

Temperature

Humidity

Rain probability

23 Jul

Monitor Weather

34°C

68%

40%

22 Jul

Irrigate Today

36°C

60%

20%

21 Jul

No Irrigation Required

31°C

78%

65%

Action:

View All Recommendations

Behaviour:

Show newest records first.

Use status badges.

Display 3–5 recent records.

Display an empty state when no recommendations exist.

18. Quick Actions Panel

Include:

Add Farm
Check Weather
Generate Recommendation
View Farms
View History
View Alerts
Update Profile

Each action should:

Use a Lucide icon.

Have a visible text label.

Navigate to the correct route.

Support keyboard navigation.

Use clear hover and focus states.

19. Weather Alerts Panel

High Temperature Alert

High Temperature Alert
Temperature is above 35°C.
Check the irrigation recommendation.

Heavy Rain Alert

Heavy Rain Expected
Rain probability has reached 80%.
Irrigation may not be required.

High Humidity Alert

High Humidity
Humidity is above 80%.
Consider delaying irrigation.

Weather Service Alert

Weather Service Unavailable
Live weather information could not be fetched.
Please try again.

Rules:

Show only relevant alerts.

Derive alerts from backend weather values.

Do not fabricate alerts.

Use an icon and text, not colour alone.

20. Dashboard Data Sources

Use:

GET /api/v1/farms
GET /api/v1/weather/:farmId
GET /api/v1/weather/:farmId/history
GET /api/v1/recommendations/:farmId
GET /api/v1/recommendations/:farmId/history

An optional combined endpoint may be added:

GET /api/v1/dashboard

It may return:

User summary

Farm statistics

Selected farm

Current weather

Latest recommendation

Weather trends

Recommendation summary

Recent history

Alerts

21. Suggested Dashboard Data Object

const dashboardData = {
  user: {
    name: "Rahul Patil",
  },

  selectedFarm: {
    id: "farm-id",
    farmName: "Patil Sugarcane Farm",
    cropName: "Sugarcane",
    area: 8,
    areaUnit: "acre",
    village: "Malegaon",
    district: "Pune",
    state: "Maharashtra",
    latitude: 18.1517,
    longitude: 74.5777,
  },

  statistics: {
    totalFarms: 3,
    totalArea: 18,
    areaUnit: "acre",
    weatherRecords: 25,
    recommendations: 20,
  },

  currentWeather: {
    temperature: 34,
    feelsLike: 36,
    humidity: 68,
    windSpeed: 12,
    pressure: 1008,
    rainProbability: 40,
    weatherCondition: "Clouds",
    weatherDescription: "Partly cloudy",
    sunrise: "6:12 AM",
    sunset: "7:08 PM",
    observedAt: "2026-07-23T10:30:00Z",
  },

  latestRecommendation: {
    status: "monitor_weather",
    title: "Monitor Weather",
    reason: "No critical irrigation condition was detected.",
    recommendedAction:
      "Continue monitoring weather conditions before irrigating.",
    weatherSnapshot: {
      temperature: 34,
      humidity: 68,
      rainProbability: 40,
      weatherCondition: "Clouds",
    },
    generatedAt: "2026-07-23T10:35:00Z",
    disclaimer:
      "This recommendation is based on weather data and predefined rules.",
  },

  weatherTrend: [
    { day: "Mon", temperature: 31, humidity: 75 },
    { day: "Tue", temperature: 33, humidity: 70 },
    { day: "Wed", temperature: 35, humidity: 64 },
    { day: "Thu", temperature: 34, humidity: 68 },
    { day: "Fri", temperature: 36, humidity: 60 },
    { day: "Sat", temperature: 32, humidity: 74 },
    { day: "Sun", temperature: 30, humidity: 80 },
  ],

  rainTrend: [
    { day: "Mon", probability: 20 },
    { day: "Tue", probability: 35 },
    { day: "Wed", probability: 10 },
    { day: "Thu", probability: 40 },
    { day: "Fri", probability: 65 },
    { day: "Sat", probability: 80 },
    { day: "Sun", probability: 55 },
  ],

  recommendationSummary: [
    { name: "Irrigate Today", value: 8 },
    { name: "No Irrigation Required", value: 10 },
    { name: "Delay Irrigation", value: 5 },
    { name: "Monitor Weather", value: 7 },
  ],

  weatherConditionSummary: [
    { name: "Clear", value: 35 },
    { name: "Cloudy", value: 30 },
    { name: "Rainy", value: 25 },
    { name: "Stormy", value: 10 },
  ],
};

22. Recommended React Component Structure

pages/
└── Dashboard.jsx

components/dashboard/
├── DashboardHeader.jsx
├── FarmSelector.jsx
├── SummaryCard.jsx
├── SummaryGrid.jsx
├── CurrentWeatherPanel.jsx
├── RecommendationPanel.jsx
├── TemperatureHumidityChart.jsx
├── RainProbabilityChart.jsx
├── WindSpeedChart.jsx
├── RecommendationPieChart.jsx
├── WeatherConditionPieChart.jsx
├── FarmInformationPanel.jsx
├── FarmMapPanel.jsx
├── RecentWeatherTable.jsx
├── RecentRecommendationTable.jsx
├── QuickActions.jsx
└── WeatherAlerts.jsx

These components may be added to the current frontend structure.

23. Dashboard Page Responsibilities

pages/Dashboard.jsx should:

Read the authenticated user.

Fetch owned farms.

Select a default farm.

Manage selected farm ID.

Fetch dashboard data.

Coordinate dashboard components.

Handle page-level loading.

Handle partial failures.

Avoid containing chart implementation details.

Avoid direct Axios configuration.

24. Suggested Dashboard State

const [farms, setFarms] = useState([]);
const [selectedFarmId, setSelectedFarmId] = useState("");
const [currentWeather, setCurrentWeather] = useState(null);
const [latestRecommendation, setLatestRecommendation] = useState(null);
const [weatherHistory, setWeatherHistory] = useState([]);
const [recommendationHistory, setRecommendationHistory] = useState([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState("");

Prefer existing custom hooks rather than duplicating state logic.

25. Loading States

Required loading messages:

Loading dashboard...
Loading farms...
Fetching current weather...
Loading weather trends...
Loading recommendation...
Refreshing dashboard...

Use:

Skeleton summary cards

Skeleton chart cards

Spinner in refresh button

Inline loaders for individual panels

Do not hide the complete dashboard when only one section is refreshing.

26. Empty States

No Farms

No farms added yet.
Add your first farm to view weather information and irrigation recommendations.

Action:

Add Farm

No Weather History

No weather history is available for this farm.

No Recommendation

No recommendation has been generated yet.

Action:

Generate Recommendation

No Alerts

No active weather alerts.

27. Error States

Unable to load dashboard information.
Unable to fetch current weather.
Unable to load the latest recommendation.
Unable to display the farm location.
Unable to connect to the server.

Each recoverable error should provide a retry action.

28. Partial Failure Behaviour

The dashboard must not fail completely when one section fails.

Example:

Farms load successfully
Weather fails
Recommendation history loads successfully

Expected behaviour:

Show farm information.

Show recommendation history.

Show a weather error only in the weather panel.

Keep all unaffected sections visible.

29. Responsive Design

Mobile

Collapse the sidebar into a drawer.

Stack summary cards.

Use a one-column layout.

Keep charts readable.

Allow tables to scroll horizontally.

Make the farm selector full width.

Keep the map usable.

Use touch-friendly controls.

Tablet

Use a two-column card layout.

Stack large charts when required.

Keep recommendation and weather panels readable.

Desktop

Use a fixed sidebar.

Use multiple summary cards per row.

Use a multi-column chart layout.

Place current weather, trend, and recommendation side by side where space allows.

Test widths:

320px
375px
425px
768px
1024px
1280px
1440px

30. Accessibility Rules

The dashboard should:

Use semantic headings.

Add labels to the farm selector.

Add aria-label to the refresh button.

Use text and icons for status.

Avoid colour-only meaning.

Support keyboard navigation.

Provide visible focus states.

Use readable contrast.

Use proper table headings.

Announce important errors.

Provide accessible chart descriptions where possible.

31. Performance Rules

Avoid duplicate API requests.

Fetch farm-specific data only after a valid farm is selected.

Cache the farm list in state.

Avoid recreating chart data unnecessarily.

Limit recent history rows.

Paginate full history pages.

Avoid saving duplicate weather history during rapid refreshes.

Lazy-load heavy chart components where useful.

32. Security Rules

The dashboard must:

Display only the authenticated user's farms.

Use protected API endpoints.

Rely on backend ownership verification.

Never display password hashes.

Never expose the weather API key.

Clear private data after logout.

Handle expired authentication safely.

33. Dashboard Acceptance Criteria

The dashboard is ready when:

Welcome message displays correctly.

Farm selector loads owned farms.

Selected farm updates all relevant sections.

Total farms and total area display correctly.

Temperature, humidity, rain probability, and wind speed display.

Current weather panel works.

Latest recommendation displays.

Temperature and humidity chart works.

Rainfall chart works.

Recommendation pie chart works.

Weather condition pie chart works.

Farm information displays.

Farm map displays.

Recent weather history displays.

Recent recommendation history displays.

Quick actions navigate correctly.

Alerts display correctly.

Refresh works.

Loading, empty, and error states exist.

Errors are isolated by section.

Mobile layout works.

No fake live weather is shown.

No unauthorized farm data is shown.

34. Rules for Codex

Codex must:

Follow this dashboard structure.

Use reusable components.

Use backend data for live weather.

Use MongoDB history for charts.

Use backend recommendation data.

Add a farm selector.

Add summary cards.

Add weather and recommendation panels.

Add line, bar, and pie charts with Recharts.

Add recent-history tables.

Add OpenStreetMap.

Add quick actions and alerts.

Add loading, empty, and error states.

Support partial failures.

Use accessible labels.

Follow the approved blue theme.

Avoid a monolithic Dashboard.jsx.

Avoid hardcoded live values.

Avoid duplicate API requests.

Never calculate the official recommendation in React.

Keep DASHBOARD.md, FRONTEND.md, and API.md synchronized.

35. Final Dashboard Summary

The dashboard provides an analytical overview of:

Farms
Farm area
Current weather
Temperature
Humidity
Wind speed
Rainfall probability
Irrigation recommendation
Weather trends
Recommendation trends
Farm location
Recent history
Weather alerts
Quick actions

The dashboard must remain:

Analytical

Easy to understand

Responsive

Accessible

Data-driven

Farm-specific

Secure

Suitable for demonstration

Consistent with the project documentation