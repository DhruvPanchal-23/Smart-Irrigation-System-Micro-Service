> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

# API Documentation

## 1. Document Purpose

This document defines the REST API for the **Weather-Based Smart Irrigation Advisory System**.

The API is responsible for:

* User registration
* User authentication
* User profile management
* Farm management
* Farm ownership validation
* Weather retrieval
* Irrigation recommendation generation
* Weather history
* Recommendation history

The backend uses:

* Python
* FastAPI
* Pydantic
* MongoDB
* JWT authentication
* OpenWeather API
* HTTPX

The frontend communicates with the backend using JSON over HTTP.

---

# 2. API Overview

## Base URL

### Development

```txt
http://localhost:8000/api/v1
```

### Production

```txt
https://your-backend-domain.com/api/v1
```

## Interactive Documentation

FastAPI automatically provides API documentation.

### Swagger UI

```txt
http://localhost:8000/docs
```

### ReDoc

```txt
http://localhost:8000/redoc
```

---

# 3. API Design Principles

The API must follow these principles:

* Use REST-style endpoints
* Use JSON request and response bodies
* Use API versioning
* Use correct HTTP methods
* Use correct HTTP status codes
* Validate requests with Pydantic
* Use JWT authentication
* Verify resource ownership
* Return consistent response structures
* Keep business logic outside routes
* Never expose sensitive information
* Handle external API failures safely

---

# 4. Content Type

Requests containing JSON must include:

```http
Content-Type: application/json
```

Protected requests must include:

```http
Authorization: Bearer <access_token>
```

---

# 5. Standard Response Format

## 5.1 Successful Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## 5.2 Collection Response

```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 0,
      "totalPages": 0
    }
  }
}
```

## 5.3 Error Response

```json
{
  "success": false,
  "message": "Operation failed",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

## 5.4 Validation Error Response

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

---

# 6. HTTP Status Codes

| Status | Meaning               | Usage                               |
| -----: | --------------------- | ----------------------------------- |
|    200 | OK                    | Successful retrieval or update      |
|    201 | Created               | Resource created                    |
|    204 | No Content            | Successful deletion without body    |
|    400 | Bad Request           | Invalid request or business rule    |
|    401 | Unauthorized          | Missing or invalid authentication   |
|    403 | Forbidden             | Authenticated but not permitted     |
|    404 | Not Found             | Resource does not exist             |
|    409 | Conflict              | Duplicate email or conflicting data |
|    422 | Validation Error      | Invalid request fields              |
|    429 | Too Many Requests     | Rate limit exceeded                 |
|    500 | Internal Server Error | Unexpected backend failure          |
|    502 | Bad Gateway           | External weather API failure        |
|    503 | Service Unavailable   | Database or dependency unavailable  |
|    504 | Gateway Timeout       | External service timeout            |

---

# 7. Authentication

The API uses JWT bearer authentication.

## Authorization Header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Token Payload

A JWT payload may contain:

```json
{
  "sub": "user_id",
  "role": "farmer",
  "exp": 1784726400
}
```

## Authentication Rules

* Tokens must have an expiration time.
* The backend must verify the token signature.
* The backend must load the user from the token subject.
* Inactive or suspended users must be rejected.
* The frontend must not generate or modify tokens.
* The backend remains the source of truth.

---

# 8. Authentication Endpoints

## 8.1 Register User

```http
POST /api/v1/auth/register
```

### Authentication

Not required.

### Request Body

```json
{
  "name": "Rahul Patil",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "password": "Test@1234",
  "confirmPassword": "Test@1234"
}
```

### Validation Rules

* `name` is required.
* `name` must contain 2–100 characters.
* `email` must be valid and unique.
* `email` must be normalized to lowercase.
* `mobile` must contain a valid 10-digit Indian number.
* `password` must contain at least eight characters.
* `confirmPassword` must match `password`.
* Public registration must assign the `farmer` role.

### Success Response

Status:

```txt
201 Created
```

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "687f45a76f2c8f1a2c932101",
      "name": "Rahul Patil",
      "email": "rahul@example.com",
      "mobile": "9876543210",
      "role": "farmer",
      "isActive": true,
      "createdAt": "2026-07-22T10:00:00Z"
    }
  }
}
```

### Error Responses

#### Duplicate Email

Status:

```txt
409 Conflict
```

```json
{
  "success": false,
  "message": "Email is already registered",
  "error": {
    "code": "EMAIL_ALREADY_EXISTS"
  }
}
```

#### Password Mismatch

Status:

```txt
422 Validation Error
```

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "confirmPassword",
      "message": "Passwords do not match"
    }
  ]
}
```

---

## 8.2 Login User

```http
POST /api/v1/auth/login
```

### Authentication

Not required.

### Request Body

```json
{
  "email": "rahul@example.com",
  "password": "Test@1234"
}
```

### Success Response

Status:

```txt
200 OK
```

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_access_token",
    "tokenType": "bearer",
    "expiresIn": 3600,
    "user": {
      "id": "687f45a76f2c8f1a2c932101",
      "name": "Rahul Patil",
      "email": "rahul@example.com",
      "mobile": "9876543210",
      "role": "farmer",
      "isActive": true
    }
  }
}
```

### Error Response

Status:

```txt
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": {
    "code": "INVALID_CREDENTIALS"
  }
}
```

The response must not reveal whether the email or password was incorrect.

---

## 8.3 Get Current User

```http
GET /api/v1/auth/me
```

### Authentication

Required.

### Success Response

```json
{
  "success": true,
  "message": "Authenticated user retrieved successfully",
  "data": {
    "user": {
      "id": "687f45a76f2c8f1a2c932101",
      "name": "Rahul Patil",
      "email": "rahul@example.com",
      "mobile": "9876543210",
      "role": "farmer",
      "isActive": true,
      "createdAt": "2026-07-22T10:00:00Z",
      "updatedAt": "2026-07-22T10:00:00Z"
    }
  }
}
```

### Invalid Token

Status:

```txt
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Authentication is required",
  "error": {
    "code": "INVALID_OR_EXPIRED_TOKEN"
  }
}
```

---

## 8.4 Logout User

```http
POST /api/v1/auth/logout
```

### Authentication

Required.

### Behaviour

For stateless JWT authentication, logout mainly clears the token on the frontend.

If token blacklisting is implemented, the backend may invalidate the current token.

### Success Response

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

# 9. User Profile Endpoints

## 9.1 Get Profile

```http
GET /api/v1/users/profile
```

### Authentication

Required.

### Success Response

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "687f45a76f2c8f1a2c932101",
      "name": "Rahul Patil",
      "email": "rahul@example.com",
      "mobile": "9876543210",
      "role": "farmer",
      "isActive": true,
      "farmCount": 2,
      "createdAt": "2026-07-22T10:00:00Z",
      "updatedAt": "2026-07-22T10:00:00Z"
    }
  }
}
```

---

## 9.2 Update Profile

```http
PUT /api/v1/users/profile
```

### Authentication

Required.

### Request Body

```json
{
  "name": "Rahul P. Patil",
  "mobile": "9876543210"
}
```

### Editable Fields

* `name`
* `mobile`

Email changes are optional and should require additional verification if implemented.

### Success Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "687f45a76f2c8f1a2c932101",
      "name": "Rahul P. Patil",
      "email": "rahul@example.com",
      "mobile": "9876543210",
      "role": "farmer",
      "updatedAt": "2026-07-22T11:00:00Z"
    }
  }
}
```

---

## 9.3 Change Password

```http
PUT /api/v1/users/change-password
```

### Authentication

Required.

### Request Body

```json
{
  "currentPassword": "Test@1234",
  "newPassword": "NewTest@5678",
  "confirmNewPassword": "NewTest@5678"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

### Incorrect Current Password

Status:

```txt
400 Bad Request
```

```json
{
  "success": false,
  "message": "Current password is incorrect",
  "error": {
    "code": "INVALID_CURRENT_PASSWORD"
  }
}
```

---

# 10. Farm Endpoints

## 10.1 Create Farm

```http
POST /api/v1/farms
```

### Authentication

Required.

### Request Body

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

### Validation Rules

* Farm name is required.
* Crop name is required.
* Area must be greater than zero.
* Area unit must be valid.
* State, district, and village are required.
* Latitude must be between -90 and 90.
* Longitude must be between -180 and 180.
* Ownership must come from the authenticated user.
* The frontend must not assign `userId`.

### Success Response

Status:

```txt
201 Created
```

```json
{
  "success": true,
  "message": "Farm created successfully",
  "data": {
    "farm": {
      "id": "687f49fd6f2c8f1a2c932202",
      "farmName": "Patil Sugarcane Farm",
      "cropName": "Sugarcane",
      "area": 5,
      "areaUnit": "acre",
      "state": "Maharashtra",
      "district": "Pune",
      "village": "Baramati",
      "latitude": 18.1792,
      "longitude": 74.6078,
      "createdAt": "2026-07-22T11:15:00Z",
      "updatedAt": "2026-07-22T11:15:00Z"
    }
  }
}
```

---

## 10.2 Get User Farms

```http
GET /api/v1/farms
```

### Authentication

Required.

### Query Parameters

| Parameter   | Type    |     Default | Description         |
| ----------- | ------- | ----------: | ------------------- |
| `page`      | Integer |           1 | Current page        |
| `limit`     | Integer |          10 | Records per page    |
| `search`    | String  |       Empty | Search by farm name |
| `crop`      | String  |       Empty | Filter by crop      |
| `state`     | String  |       Empty | Filter by state     |
| `sortBy`    | String  | `createdAt` | Sort field          |
| `sortOrder` | String  |      `desc` | `asc` or `desc`     |

### Example Request

```http
GET /api/v1/farms?page=1&limit=10&search=Patil&crop=Sugarcane
```

### Success Response

```json
{
  "success": true,
  "message": "Farms retrieved successfully",
  "data": {
    "items": [
      {
        "id": "687f49fd6f2c8f1a2c932202",
        "farmName": "Patil Sugarcane Farm",
        "cropName": "Sugarcane",
        "area": 5,
        "areaUnit": "acre",
        "state": "Maharashtra",
        "district": "Pune",
        "village": "Baramati",
        "latitude": 18.1792,
        "longitude": 74.6078,
        "createdAt": "2026-07-22T11:15:00Z",
        "updatedAt": "2026-07-22T11:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

Only farms belonging to the authenticated user may be returned.

---

## 10.3 Get Farm by ID

```http
GET /api/v1/farms/{farm_id}
```

### Authentication

Required.

### Path Parameter

```txt
farm_id: MongoDB ObjectId
```

### Success Response

```json
{
  "success": true,
  "message": "Farm retrieved successfully",
  "data": {
    "farm": {
      "id": "687f49fd6f2c8f1a2c932202",
      "farmName": "Patil Sugarcane Farm",
      "cropName": "Sugarcane",
      "area": 5,
      "areaUnit": "acre",
      "state": "Maharashtra",
      "district": "Pune",
      "village": "Baramati",
      "latitude": 18.1792,
      "longitude": 74.6078,
      "createdAt": "2026-07-22T11:15:00Z",
      "updatedAt": "2026-07-22T11:15:00Z"
    }
  }
}
```

### Farm Not Found

Status:

```txt
404 Not Found
```

```json
{
  "success": false,
  "message": "Farm not found",
  "error": {
    "code": "FARM_NOT_FOUND"
  }
}
```

### Ownership Failure

Status:

```txt
403 Forbidden
```

```json
{
  "success": false,
  "message": "You do not have permission to access this farm",
  "error": {
    "code": "FARM_ACCESS_FORBIDDEN"
  }
}
```

---

## 10.4 Update Farm

```http
PUT /api/v1/farms/{farm_id}
```

### Authentication

Required.

### Request Body

All fields are optional, but at least one must be provided.

```json
{
  "farmName": "Updated Patil Farm",
  "cropName": "Sugarcane",
  "area": 6,
  "areaUnit": "acre",
  "state": "Maharashtra",
  "district": "Pune",
  "village": "Baramati",
  "latitude": 18.181,
  "longitude": 74.61
}
```

### Success Response

```json
{
  "success": true,
  "message": "Farm updated successfully",
  "data": {
    "farm": {
      "id": "687f49fd6f2c8f1a2c932202",
      "farmName": "Updated Patil Farm",
      "cropName": "Sugarcane",
      "area": 6,
      "areaUnit": "acre",
      "state": "Maharashtra",
      "district": "Pune",
      "village": "Baramati",
      "latitude": 18.181,
      "longitude": 74.61,
      "updatedAt": "2026-07-22T12:00:00Z"
    }
  }
}
```

---

## 10.5 Delete Farm

```http
DELETE /api/v1/farms/{farm_id}
```

### Authentication

Required.

### Success Response Option 1

Status:

```txt
200 OK
```

```json
{
  "success": true,
  "message": "Farm deleted successfully",
  "data": null
}
```

### Success Response Option 2

Status:

```txt
204 No Content
```

Use only one deletion-response style consistently.

### Related Data

The implementation must decide whether related weather and recommendation records are:

* Deleted with the farm, or
* Retained for audit history

The selected behaviour must be documented in `DATABASE.md`.

---

# 11. Weather Endpoints

## 11.1 Get Current Weather

```http
GET /api/v1/weather/{farm_id}
```

### Authentication

Required.

### Backend Flow

```txt
Verify token
    ↓
Load farm
    ↓
Verify farm ownership
    ↓
Read latitude and longitude
    ↓
Call OpenWeather API
    ↓
Normalize weather response
    ↓
Store weather history
    ↓
Return weather
```

### Success Response

```json
{
  "success": true,
  "message": "Weather retrieved successfully",
  "data": {
    "farm": {
      "id": "687f49fd6f2c8f1a2c932202",
      "farmName": "Patil Sugarcane Farm",
      "latitude": 18.1792,
      "longitude": 74.6078
    },
    "weather": {
      "temperature": 34.2,
      "feelsLike": 36.1,
      "humidity": 62,
      "windSpeed": 12.4,
      "pressure": 1009,
      "rainProbability": 20,
      "weatherCondition": "Clear",
      "weatherDescription": "Clear sky",
      "weatherIcon": "01d",
      "sunrise": "2026-07-22T00:42:00Z",
      "sunset": "2026-07-22T13:35:00Z",
      "observedAt": "2026-07-22T12:15:00Z",
      "unit": "metric"
    }
  }
}
```

### Weather Service Failure

Status:

```txt
502 Bad Gateway
```

```json
{
  "success": false,
  "message": "Unable to fetch weather information",
  "error": {
    "code": "WEATHER_SERVICE_ERROR"
  }
}
```

### Weather Timeout

Status:

```txt
504 Gateway Timeout
```

```json
{
  "success": false,
  "message": "The weather service did not respond in time",
  "error": {
    "code": "WEATHER_SERVICE_TIMEOUT"
  }
}
```

The API must not return fabricated weather data.

---

## 11.2 Get Weather Forecast

```http
GET /api/v1/weather/{farm_id}/forecast
```

### Authentication

Required.

### Query Parameters

| Parameter | Type    | Default | Description             |
| --------- | ------- | ------: | ----------------------- |
| `days`    | Integer |       5 | Number of forecast days |

### Success Response

```json
{
  "success": true,
  "message": "Weather forecast retrieved successfully",
  "data": {
    "farm": {
      "id": "687f49fd6f2c8f1a2c932202",
      "farmName": "Patil Sugarcane Farm"
    },
    "forecast": [
      {
        "date": "2026-07-23",
        "minimumTemperature": 25,
        "maximumTemperature": 34,
        "humidity": 67,
        "rainProbability": 35,
        "weatherCondition": "Clouds",
        "weatherDescription": "Scattered clouds",
        "weatherIcon": "03d"
      }
    ]
  }
}
```

This endpoint is optional for the MVP.

---

## 11.3 Get Weather History

```http
GET /api/v1/weather/{farm_id}/history
```

### Authentication

Required.

### Query Parameters

| Parameter   | Type    | Default |
| ----------- | ------- | ------: |
| `page`      | Integer |       1 |
| `limit`     | Integer |      10 |
| `startDate` | Date    |   Empty |
| `endDate`   | Date    |   Empty |
| `sortOrder` | String  |  `desc` |

### Example

```http
GET /api/v1/weather/687f49fd6f2c8f1a2c932202/history?page=1&limit=10
```

### Success Response

```json
{
  "success": true,
  "message": "Weather history retrieved successfully",
  "data": {
    "items": [
      {
        "id": "weather_history_id",
        "farmId": "687f49fd6f2c8f1a2c932202",
        "temperature": 34.2,
        "humidity": 62,
        "windSpeed": 12.4,
        "pressure": 1009,
        "rainProbability": 20,
        "weatherCondition": "Clear",
        "weatherDescription": "Clear sky",
        "recordedAt": "2026-07-22T12:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

# 12. Recommendation Endpoints

## 12.1 Generate Recommendation

```http
POST /api/v1/recommendations/{farm_id}
```

### Authentication

Required.

### Request Body

No request body is required for the normal workflow.

The backend must:

1. Load the farm.
2. Verify ownership.
3. Fetch current weather.
4. Apply recommendation rules.
5. Save the recommendation.
6. Return the result.

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
    status = "no_irrigation"
    recommendation = "No Irrigation Required"

elif humidity > 80:
    status = "delay_irrigation"
    recommendation = "Delay Irrigation"

elif temperature > 35:
    status = "irrigate_today"
    recommendation = "Irrigate Today"

else:
    status = "monitor_weather"
    recommendation = "Monitor Weather"
```

### Success Response

```json
{
  "success": true,
  "message": "Irrigation recommendation generated successfully",
  "data": {
    "recommendation": {
      "id": "recommendation_id",
      "farmId": "687f49fd6f2c8f1a2c932202",
      "farmName": "Patil Sugarcane Farm",
      "status": "irrigate_today",
      "title": "Irrigate Today",
      "reason": "The temperature is above 35°C and rainfall probability is low.",
      "recommendedAction": "Consider irrigating the farm today.",
      "suggestedDuration": null,
      "weatherSnapshot": {
        "temperature": 36,
        "humidity": 60,
        "rainProbability": 20,
        "weatherCondition": "Clear"
      },
      "generatedAt": "2026-07-22T12:30:00Z",
      "disclaimer": "This recommendation is based on weather information and predefined rules. It is not a replacement for professional agricultural guidance."
    }
  }
}
```

### Recommendation Values

| Status             | Title                  |
| ------------------ | ---------------------- |
| `no_irrigation`    | No Irrigation Required |
| `delay_irrigation` | Delay Irrigation       |
| `irrigate_today`   | Irrigate Today         |
| `monitor_weather`  | Monitor Weather        |

### Weather Failure

Status:

```txt
502 Bad Gateway
```

```json
{
  "success": false,
  "message": "Recommendation could not be generated because weather information is unavailable",
  "error": {
    "code": "RECOMMENDATION_WEATHER_UNAVAILABLE"
  }
}
```

The backend must not create a recommendation when weather retrieval fails.

---

## 12.2 Get Latest Recommendation

```http
GET /api/v1/recommendations/{farm_id}
```

### Authentication

Required.

### Success Response

```json
{
  "success": true,
  "message": "Latest recommendation retrieved successfully",
  "data": {
    "recommendation": {
      "id": "recommendation_id",
      "farmId": "687f49fd6f2c8f1a2c932202",
      "farmName": "Patil Sugarcane Farm",
      "status": "irrigate_today",
      "title": "Irrigate Today",
      "reason": "The temperature is above 35°C and rainfall probability is low.",
      "recommendedAction": "Consider irrigating the farm today.",
      "weatherSnapshot": {
        "temperature": 36,
        "humidity": 60,
        "rainProbability": 20
      },
      "generatedAt": "2026-07-22T12:30:00Z"
    }
  }
}
```

### No Recommendation

Status:

```txt
404 Not Found
```

```json
{
  "success": false,
  "message": "No recommendation is available for this farm",
  "error": {
    "code": "RECOMMENDATION_NOT_FOUND"
  }
}
```

---

## 12.3 Get Recommendation History

```http
GET /api/v1/recommendations/{farm_id}/history
```

### Authentication

Required.

### Query Parameters

| Parameter   | Type    | Default |
| ----------- | ------- | ------: |
| `page`      | Integer |       1 |
| `limit`     | Integer |      10 |
| `status`    | String  |   Empty |
| `startDate` | Date    |   Empty |
| `endDate`   | Date    |   Empty |
| `sortOrder` | String  |  `desc` |

### Success Response

```json
{
  "success": true,
  "message": "Recommendation history retrieved successfully",
  "data": {
    "items": [
      {
        "id": "recommendation_id",
        "farmId": "687f49fd6f2c8f1a2c932202",
        "status": "irrigate_today",
        "title": "Irrigate Today",
        "reason": "The temperature is above 35°C and rainfall probability is low.",
        "recommendedAction": "Consider irrigating the farm today.",
        "weatherSnapshot": {
          "temperature": 36,
          "humidity": 60,
          "rainProbability": 20,
          "weatherCondition": "Clear"
        },
        "generatedAt": "2026-07-22T12:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

---

# 13. Combined History Endpoint

An optional combined history endpoint may be added.

```http
GET /api/v1/history
```

### Authentication

Required.

### Query Parameters

| Parameter   | Description                           |
| ----------- | ------------------------------------- |
| `farmId`    | Filter by farm                        |
| `type`      | `weather`, `recommendation`, or `all` |
| `startDate` | Start date                            |
| `endDate`   | End date                              |
| `status`    | Recommendation status                 |
| `page`      | Current page                          |
| `limit`     | Page size                             |

This endpoint is optional because separate history endpoints already exist.

---

# 14. Dashboard Endpoint

An optional dashboard endpoint can reduce multiple frontend requests.

```http
GET /api/v1/dashboard
```

### Authentication

Required.

### Success Response

```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "user": {
      "name": "Rahul Patil"
    },
    "statistics": {
      "totalFarms": 2,
      "weatherRecords": 15,
      "recommendations": 10
    },
    "selectedFarm": {
      "id": "687f49fd6f2c8f1a2c932202",
      "farmName": "Patil Sugarcane Farm"
    },
    "currentWeather": {
      "temperature": 34,
      "humidity": 62,
      "rainProbability": 20,
      "weatherCondition": "Clear"
    },
    "latestRecommendation": {
      "status": "monitor_weather",
      "title": "Monitor Weather"
    },
    "recentWeather": [],
    "recentRecommendations": []
  }
}
```

This endpoint is optional. The dashboard may also use existing APIs independently.

---

# 15. Administrator Endpoints

Administrator endpoints are optional for the MVP.

All administrator routes require:

```txt
role = admin
```

## 15.1 Get Users

```http
GET /api/v1/admin/users
```

## 15.2 Get User by ID

```http
GET /api/v1/admin/users/{user_id}
```

## 15.3 Update User Status

```http
PUT /api/v1/admin/users/{user_id}/status
```

### Request Body

```json
{
  "status": "inactive"
}
```

Allowed statuses:

```txt
active
inactive
suspended
```

## 15.4 Get All Farms

```http
GET /api/v1/admin/farms
```

## 15.5 Get Weather Records

```http
GET /api/v1/admin/weather-records
```

## 15.6 Get Recommendations

```http
GET /api/v1/admin/recommendations
```

A farmer attempting to access an admin endpoint must receive:

```txt
403 Forbidden
```

---

# 16. Health Check Endpoint

## Basic Health Check

```http
GET /health
```

### Authentication

Not required.

### Success Response

```json
{
  "status": "healthy",
  "service": "smart-irrigation-api",
  "timestamp": "2026-07-22T12:30:00Z"
}
```

## Detailed Health Check

Optional:

```http
GET /api/v1/health
```

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "api": "available",
    "database": "connected",
    "weatherService": "available"
  }
}
```

Do not expose private configuration details.

---

# 17. Pagination Standards

Paginated endpoints should accept:

```txt
page
limit
```

## Rules

* `page` must be greater than or equal to 1.
* `limit` must be between 1 and 100.
* Default `limit` should be 10.
* Results should include pagination metadata.

## Pagination Response

```json
{
  "page": 1,
  "limit": 10,
  "totalItems": 25,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

# 18. Sorting Standards

Supported sorting parameters:

```txt
sortBy
sortOrder
```

Allowed sort order:

```txt
asc
desc
```

The backend must validate allowed sort fields.

Do not directly pass uncontrolled user values into database sorting operations.

---

# 19. Date Filtering

Date-based endpoints may accept:

```txt
startDate
endDate
```

Recommended date format:

```txt
YYYY-MM-DD
```

Example:

```http
GET /api/v1/weather/{farm_id}/history?startDate=2026-07-01&endDate=2026-07-22
```

Store dates in UTC and convert them for display in the frontend.

---

# 20. API Error Codes

## Authentication Codes

```txt
AUTHENTICATION_REQUIRED
INVALID_OR_EXPIRED_TOKEN
INVALID_CREDENTIALS
ACCOUNT_INACTIVE
ACCOUNT_SUSPENDED
```

## User Codes

```txt
USER_NOT_FOUND
EMAIL_ALREADY_EXISTS
INVALID_CURRENT_PASSWORD
PROFILE_UPDATE_FAILED
```

## Farm Codes

```txt
FARM_NOT_FOUND
FARM_ACCESS_FORBIDDEN
FARM_CREATE_FAILED
FARM_UPDATE_FAILED
FARM_DELETE_FAILED
INVALID_FARM_LOCATION
```

## Weather Codes

```txt
WEATHER_SERVICE_ERROR
WEATHER_SERVICE_TIMEOUT
WEATHER_DATA_INVALID
WEATHER_HISTORY_NOT_FOUND
```

## Recommendation Codes

```txt
RECOMMENDATION_NOT_FOUND
RECOMMENDATION_GENERATION_FAILED
RECOMMENDATION_WEATHER_UNAVAILABLE
```

## General Codes

```txt
VALIDATION_ERROR
DATABASE_ERROR
INTERNAL_SERVER_ERROR
RESOURCE_NOT_FOUND
RATE_LIMIT_EXCEEDED
```

---

# 21. Validation Requirements

## User Validation

### Name

```txt
Minimum: 2 characters
Maximum: 100 characters
```

### Email

```txt
Valid email format
Lowercase
Unique
```

### Mobile

```txt
10 digits
Numbers only
```

### Password

```txt
Minimum 8 characters
At least one uppercase letter
At least one lowercase letter
At least one number
```

## Farm Validation

### Farm Name

```txt
Minimum 2 characters
Maximum 100 characters
```

### Area

```txt
Greater than 0
```

### Area Unit

Allowed values:

```txt
acre
hectare
square_metre
```

### Latitude

```txt
Minimum: -90
Maximum: 90
```

### Longitude

```txt
Minimum: -180
Maximum: 180
```

---

# 22. Security Requirements

The API must:

* Hash passwords using bcrypt.
* Validate JWT tokens.
* Check token expiration.
* Load the authenticated user from the token.
* Verify farm ownership.
* Reject public role escalation.
* Store secrets in environment variables.
* Restrict CORS.
* Avoid exposing stack traces.
* Avoid logging tokens and passwords.
* Use HTTPS in production.
* Validate request body size.
* Apply rate limiting in future deployment.
* Reject malformed MongoDB ObjectIds safely.

---

# 23. CORS Configuration

## Development

Allowed origin:

```txt
http://localhost:5173
```

## Production

Allowed origin:

```txt
https://your-frontend-domain.com
```

Recommended configuration:

* Allow required methods only.
* Allow required headers only.
* Allow credentials only when needed.
* Do not use wildcard origin in production.

---

# 24. Environment Variables

Required backend variables:

```env
APP_NAME=Smart Irrigation API
APP_ENV=development
DEBUG=true

MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=smart_irrigation

JWT_SECRET_KEY=replace_with_secure_random_value
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

OPENWEATHER_API_KEY=replace_with_openweather_key
OPENWEATHER_BASE_URL=https://api.openweathermap.org

FRONTEND_URL=http://localhost:5173
```

The real `.env` file must not be committed.

Create:

```txt
.env.example
```

with placeholder values.

---

# 25. FastAPI Route Structure

Recommended route files:

```txt
backend/app/routes/
├── auth.py
├── users.py
├── farms.py
├── weather.py
├── recommendations.py
├── history.py
├── dashboard.py
└── admin.py
```

## Router Prefixes

```python
auth_router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])
user_router = APIRouter(prefix="/api/v1/users", tags=["Users"])
farm_router = APIRouter(prefix="/api/v1/farms", tags=["Farms"])
weather_router = APIRouter(prefix="/api/v1/weather", tags=["Weather"])
recommendation_router = APIRouter(
    prefix="/api/v1/recommendations",
    tags=["Recommendations"]
)
```

---

# 26. Route Responsibility Rules

Routes should:

* Define endpoint paths
* Define HTTP methods
* Accept validated input
* Inject dependencies
* Call controllers or services
* Return structured responses

Routes must not:

* Query MongoDB directly
* Hash passwords directly
* Call OpenWeather directly
* Apply irrigation rules directly
* Contain complex business logic

---

# 27. API Request Flow

```txt
Frontend Request
      │
      ▼
FastAPI Route
      │
      ▼
Authentication Dependency
      │
      ▼
Pydantic Validation
      │
      ▼
Controller
      │
      ▼
Service
      │
      ├── Repository
      │      ▼
      │    MongoDB
      │
      └── External Weather API
             │
             ▼
Standardized Response
```

---

# 28. OpenWeather Integration Rules

The weather service must:

* Use `httpx.AsyncClient`
* Define a timeout
* Pass latitude and longitude
* Request metric units
* Parse only required values
* Normalize provider-specific fields
* Handle missing values
* Handle HTTP errors
* Handle timeouts
* Avoid exposing the provider API key

Example external request structure:

```txt
GET /data/2.5/weather
```

Parameters:

```txt
lat
lon
appid
units=metric
```

Provider-specific URLs should remain inside the weather service.

---

# 29. Recommendation Service Rules

The recommendation service must:

* Accept normalized weather data
* Apply conditions in priority order
* Return a status
* Return a title
* Return a reason
* Return a recommended action
* Include the weather snapshot
* Save the record
* Include the advisory disclaimer

The recommendation logic must not be duplicated across routes or frontend pages.

---

# 30. API Logging

Log:

* Request method
* Request path
* Response status
* Processing duration
* Database failures
* External service failures
* Authentication failures without sensitive information

Do not log:

* Passwords
* Password hashes
* JWT tokens
* Authorization headers
* API keys
* MongoDB connection strings

---

# 31. Testing Requirements

API testing must cover:

* Successful requests
* Validation failures
* Missing authentication
* Invalid authentication
* Expired tokens
* Resource ownership
* Missing resources
* Database failures
* Weather API failures
* Recommendation rule boundaries
* Pagination
* Filtering
* Sorting
* Sensitive-field protection

Testing tools:

* Pytest
* FastAPI TestClient
* HTTPX
* Postman
* Swagger UI

External weather calls must be mocked during automated tests.

---

# 32. Postman Collection Structure

Recommended folders:

```txt
Smart Irrigation API
├── Authentication
│   ├── Register
│   ├── Login
│   ├── Current User
│   └── Logout
│
├── Profile
│   ├── Get Profile
│   ├── Update Profile
│   └── Change Password
│
├── Farms
│   ├── Create Farm
│   ├── Get Farms
│   ├── Get Farm
│   ├── Update Farm
│   └── Delete Farm
│
├── Weather
│   ├── Current Weather
│   ├── Forecast
│   └── Weather History
│
└── Recommendations
    ├── Generate Recommendation
    ├── Latest Recommendation
    └── Recommendation History
```

Recommended Postman variables:

```txt
base_url
access_token
farm_id
```

---

# 33. API Acceptance Criteria

The API is considered ready when:

* Registration works.
* Duplicate email returns 409.
* Login returns a valid token.
* Protected endpoints reject missing tokens.
* Expired tokens return 401.
* Profile retrieval works.
* Farm CRUD works.
* Farm ownership is enforced.
* Weather is fetched through the backend.
* Weather failures are handled.
* Weather history is stored.
* Recommendation rules work in the correct order.
* Recommendations are stored.
* History endpoints support pagination.
* No password hash is returned.
* No API key is exposed.
* Standard response formats are used.
* Critical API tests pass.

---

# 34. Endpoint Summary

## Authentication

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

## Users

```txt
GET /api/v1/users/profile
PUT /api/v1/users/profile
PUT /api/v1/users/change-password
```

## Farms

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

## Recommendations

```txt
POST /api/v1/recommendations/{farm_id}
GET  /api/v1/recommendations/{farm_id}
GET  /api/v1/recommendations/{farm_id}/history
```

## Optional

```txt
GET /api/v1/dashboard
GET /api/v1/history
GET /api/v1/admin/users
GET /health
```

---

# 35. Rules for Codex

Codex must:

* Follow the endpoint paths in this document.
* Use `/api/v1`.
* Use FastAPI routers.
* Use Pydantic schemas.
* Use JWT dependencies.
* Verify farm ownership.
* Use standardized responses.
* Use correct HTTP status codes.
* Keep routes thin.
* Put business logic in services.
* Put database operations in repositories where implemented.
* Call OpenWeather only from the backend.
* Use HTTPX timeouts.
* Never fabricate weather data.
* Never generate recommendations without weather data.
* Store recommendation rules in one backend module.
* Never return password hashes.
* Never expose API keys.
* Use environment variables.
* Handle invalid ObjectIds.
* Support loading and errors through clear API responses.
* Write tests for all P0 endpoints.
* Mock external APIs in automated tests.
* Keep API documentation synchronized with implementation.

---

# 36. Final API Flow

```txt
Farmer
   │
   ▼
React Frontend
   │
   ▼
Axios Request
   │
   ▼
FastAPI Endpoint
   │
   ▼
JWT Validation
   │
   ▼
Ownership Verification
   │
   ▼
Controller and Service
   │
   ├── MongoDB
   ├── OpenWeather API
   └── Irrigation Rules
          │
          ▼
Structured JSON Response
          │
          ▼
Frontend Dashboard
```

The API must remain secure, predictable, modular, testable, and consistent with the project requirements.
## Dashboard Frontend Data Usage

The implemented dashboard uses the existing authenticated farm-specific
endpoints:

```http
GET /api/v1/farms
GET /api/v1/weather/:farmId/history
GET /api/v1/recommendations/:farmId/history
```

The optional combined `GET /api/v1/dashboard` endpoint is not required by the
current frontend. Date-range filtering and chart aggregation operate only on
records returned by these endpoints; the frontend does not invent weather or
recommendation records.
