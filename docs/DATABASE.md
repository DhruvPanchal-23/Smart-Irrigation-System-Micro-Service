> Migration note: this folder preserves inherited product documentation. For the current Express service topology, configuration and verification, read [MICROSERVICES.md](MICROSERVICES.md) and [../README.md](../README.md). Historical FastAPI examples are superseded by the user's Express requirement.

Database Documentation
1. Document Purpose

This document defines the database architecture, collections, schemas, relationships, validation rules, indexes, ownership rules, deletion behaviour, timestamps, query patterns, and implementation conventions for the Weather-Based Smart Irrigation Advisory System.

The current backend uses:

MongoDB
Compass 
Node.js
Express.js

The database stores:

User accounts
Farm records
Weather history
Irrigation recommendations

The database must remain consistent with:

BACKEND.md
API.md
REQUIREMENTS.md
ARCHITECTURE.md
DECISIONS.md
2. Database Technology
Selected Database
MongoDB
ODM
Compass
Reason for Selection

MongoDB is suitable for this project because it provides:

Flexible document storage
Simple integration with Node.js
Easy local development
Easy deployment with MongoDB Atlas
Support for indexes
Good support for timestamps
Simple storage of weather snapshots
Simple one-to-many relationships using ObjectId references
3. Database Name

Recommended development database:

smart_irrigation

Recommended test database:

smart_irrigation_test

Recommended production database:

smart_irrigation_prod

Environment variable for MongoDB Atlas:

MONGODB_URI=mongodb+srv://<username>:<url-encoded-password>@<cluster>.mongodb.net/smart_irrigation?retryWrites=true&w=majority

The Atlas database user must have access to `smart_irrigation`, and the application host must be allowed in Atlas Network Access. Special characters in the password must be URL-encoded.

Never commit the real connection string.

4. Database Collections

The application uses four main collections:

users
farms
weatherhistories
recommendations

Compass may automatically pluralize model names.

Recommended explicit collection names:

Compass.model("User", userSchema, "users");
Compass.model("Farm", farmSchema, "farms");
Compass.model("WeatherHistory", weatherHistorySchema, "weatherhistories");
Compass.model("Recommendation", recommendationSchema, "recommendations");

Using explicit collection names prevents confusion.

5. Database Relationship Overview
User
 └── One-to-Many Farms
       ├── One-to-Many Weather History
       └── One-to-Many Recommendations

Reference mapping:

Farm.owner → User._id

WeatherHistory.user → User._id
WeatherHistory.farm → Farm._id

Recommendation.user → User._id
Recommendation.farm → Farm._id
6. Entity Relationship Diagram
+--------------------+
|       users        |
+--------------------+
| _id                |
| name               |
| email              |
| mobile             |
| passwordHash       |
| role               |
| status             |
| createdAt          |
| updatedAt          |
+---------+----------+
          |
          | 1
          |
          | owns
          |
          | many
+---------v----------+
|       farms        |
+--------------------+
| _id                |
| owner              |
| farmName           |
| cropName           |
| area               |
| areaUnit           |
| state              |
| district           |
| village            |
| latitude           |
| longitude          |
| createdAt          |
| updatedAt          |
+---------+----------+
          |
          | 1
          |
          +------------------------+
          |                        |
          | many                   | many
+---------v----------+   +---------v----------+
| weatherhistories  |   | recommendations    |
+--------------------+   +--------------------+
| _id                |   | _id                |
| user               |   | user               |
| farm               |   | farm               |
| temperature        |   | status             |
| feelsLike          |   | title              |
| humidity           |   | reason             |
| windSpeed          |   | recommendedAction  |
| pressure           |   | suggestedDuration  |
| rainProbability    |   | weatherSnapshot    |
| weatherCondition   |   | disclaimer         |
| description        |   | generatedAt        |
| observedAt         |   | createdAt          |
| recordedAt         |   | updatedAt          |
+--------------------+   +--------------------+
7. User Collection
7.1 Purpose

The users collection stores registered farmer and administrator accounts.

7.2 Suggested Document Structure
{
  "_id": "ObjectId",
  "name": "Rahul Patil",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "passwordHash": "$2b$12$...",
  "role": "farmer",
  "status": "active",
  "createdAt": "2026-07-23T10:00:00.000Z",
  "updatedAt": "2026-07-23T10:00:00.000Z"
}
7.3 Fields
Field	Type	Required	Description
_id	ObjectId	Yes	Primary document identifier
name	String	Yes	Full user name
email	String	Yes	Unique login email
mobile	String	Yes	Mobile number
passwordHash	String	Yes	Hashed password
role	String	Yes	farmer or admin
status	String	Yes	active, inactive, or suspended
createdAt	Date	Yes	Creation timestamp
updatedAt	Date	Yes	Last update timestamp
7.4 Validation Rules
Name
Required
Trim whitespace
Minimum 2 characters
Maximum 100 characters
Email
Required
Trim whitespace
Convert to lowercase
Valid email format
Unique
Maximum 254 characters
Mobile
Required
Numbers only
10 digits for Indian mobile number
Stored as String
Password Hash
Required
Never store plain password
Normally exclude from query output
Role

Allowed values:

farmer
admin

Default:

farmer

Public registration must never accept admin.

Status

Allowed values:

active
inactive
suspended

Default:

active
7.5 Recommended Compass Schema
import Compass from "Compass";

const userSchema = new Compass.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"],
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["farmer", "admin"],
      default: "farmer",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
  },
);
7.6 Recommended Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });
7.7 Security Rules
Never return passwordHash.
Never log passwordHash.
Never store raw passwords.
Never allow the client to select the admin role.
Use select("+passwordHash") only during password verification.
Return a generic invalid-credentials error.
8. Farm Collection
8.1 Purpose

The farms collection stores farm records owned by authenticated users.

8.2 Suggested Document Structure
{
  "_id": "ObjectId",
  "owner": "ObjectId",
  "farmName": "Patil Sugarcane Farm",
  "cropName": "Sugarcane",
  "area": 5,
  "areaUnit": "acre",
  "state": "Maharashtra",
  "district": "Pune",
  "village": "Baramati",
  "latitude": 18.1792,
  "longitude": 74.6078,
  "createdAt": "2026-07-23T10:30:00.000Z",
  "updatedAt": "2026-07-23T10:30:00.000Z"
}
8.3 Fields
Field	Type	Required	Description
_id	ObjectId	Yes	Farm identifier
owner	ObjectId	Yes	Reference to owning user
farmName	String	Yes	User-defined farm name
cropName	String	Yes	Main crop
area	Number	Yes	Farm area
areaUnit	String	Yes	Unit of area
state	String	Yes	State
district	String	Yes	District
village	String	Yes	Village
latitude	Number	Yes	Farm latitude
longitude	Number	Yes	Farm longitude
createdAt	Date	Yes	Creation timestamp
updatedAt	Date	Yes	Last update timestamp
8.4 Ownership Rule

The owner must always come from:

req.user.id

The backend must ignore:

req.body.owner
req.body.userId

Ownership verification:

farm.owner.toString() === req.user.id.toString()
8.5 Validation Rules
Farm Name
Required
Trim whitespace
Minimum 2 characters
Maximum 100 characters
Crop Name
Required
Trim whitespace
Minimum 2 characters
Maximum 100 characters
Area
Required
Number
Greater than 0
Area Unit

Allowed values:

acre
hectare
square_metre
State, District, Village
Required
Trim whitespace
Maximum 100 characters
Latitude
Required
Number
Minimum -90
Maximum 90
Longitude
Required
Number
Minimum -180
Maximum 180
8.6 Recommended Compass Schema
import Compass from "Compass";

const farmSchema = new Compass.Schema(
  {
    owner: {
      type: Compass.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    area: {
      type: Number,
      required: [true, "Farm area is required"],
      min: [0.01, "Farm area must be greater than zero"],
    },

    areaUnit: {
      type: String,
      required: true,
      enum: ["acre", "hectare", "square_metre"],
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    village: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "farms",
  },
);
8.7 Recommended Indexes
farmSchema.index({ owner: 1, createdAt: -1 });
farmSchema.index({ owner: 1, farmName: 1 });
farmSchema.index({ owner: 1, cropName: 1 });
farmSchema.index({ owner: 1, state: 1 });

Optional geospatial field:

location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number],
  },
}

If used:

farmSchema.index({ location: "2dsphere" });

For the MVP, latitude and longitude fields are sufficient.

9. Weather History Collection
9.1 Purpose

The weatherhistories collection stores normalized weather observations fetched for farms.

9.2 Suggested Document Structure
{
  "_id": "ObjectId",
  "user": "ObjectId",
  "farm": "ObjectId",
  "temperature": 34.2,
  "feelsLike": 36.1,
  "humidity": 62,
  "windSpeed": 12.4,
  "pressure": 1009,
  "rainProbability": 20,
  "weatherCondition": "Clear",
  "weatherDescription": "Clear sky",
  "weatherIcon": "01d",
  "observedAt": "2026-07-23T10:45:00.000Z",
  "recordedAt": "2026-07-23T10:46:00.000Z",
  "createdAt": "2026-07-23T10:46:00.000Z",
  "updatedAt": "2026-07-23T10:46:00.000Z"
}
9.3 Fields
Field	Type	Required	Description
_id	ObjectId	Yes	Weather record identifier
user	ObjectId	Yes	User who owns the farm
farm	ObjectId	Yes	Farm reference
temperature	Number	Yes	Temperature in Celsius
feelsLike	Number	No	Feels-like temperature
humidity	Number	Yes	Humidity percentage
windSpeed	Number	No	Wind speed in km/h
pressure	Number	No	Pressure in hPa
rainProbability	Number	Yes	Rain probability percentage
weatherCondition	String	Yes	Main weather condition
weatherDescription	String	No	Detailed weather description
weatherIcon	String	No	Provider icon code
observedAt	Date	No	Provider observation time
recordedAt	Date	Yes	Time saved by the system
createdAt	Date	Yes	Compass creation timestamp
updatedAt	Date	Yes	Compass update timestamp
9.4 Validation Rules
Temperature
Number
Reasonable range: -80 to 70
Humidity
Minimum 0
Maximum 100
Wind Speed
Minimum 0
Pressure
Positive number
Rain Probability
Minimum 0
Maximum 100
9.5 Recommended Compass Schema
import Compass from "Compass";

const weatherHistorySchema = new Compass.Schema(
  {
    user: {
      type: Compass.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    farm: {
      type: Compass.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
      index: true,
    },

    temperature: {
      type: Number,
      required: true,
      min: -80,
      max: 70,
    },

    feelsLike: {
      type: Number,
      min: -80,
      max: 80,
    },

    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    windSpeed: {
      type: Number,
      min: 0,
    },

    pressure: {
      type: Number,
      min: 0,
    },

    rainProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    weatherCondition: {
      type: String,
      required: true,
      trim: true,
    },

    weatherDescription: {
      type: String,
      trim: true,
    },

    weatherIcon: {
      type: String,
      trim: true,
    },

    observedAt: {
      type: Date,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "weatherhistories",
  },
);
9.6 Recommended Indexes
weatherHistorySchema.index({ farm: 1, recordedAt: -1 });
weatherHistorySchema.index({ user: 1, recordedAt: -1 });
weatherHistorySchema.index({ farm: 1, weatherCondition: 1 });
9.7 Duplicate Record Policy

To avoid excessive duplicate history:

Do not save identical weather data every few seconds.
Consider saving at most once every 10–30 minutes per farm.
Manual refresh may return current weather without always inserting a new history document.
The selected policy must be consistent in the service.

Possible rule:

If the newest record for the farm is less than 15 minutes old,
return current weather without inserting another identical record.
10. Recommendation Collection
10.1 Purpose

The recommendations collection stores rule-based irrigation recommendations generated for farms.

10.2 Suggested Document Structure
{
  "_id": "ObjectId",
  "user": "ObjectId",
  "farm": "ObjectId",
  "status": "irrigate_today",
  "title": "Irrigate Today",
  "reason": "The temperature is high and may increase crop water demand.",
  "recommendedAction": "Consider irrigating the farm today.",
  "suggestedDuration": null,
  "weatherSnapshot": {
    "temperature": 36,
    "humidity": 60,
    "rainProbability": 20,
    "weatherCondition": "Clear"
  },
  "disclaimer": "This recommendation is based on weather information and predefined rules.",
  "generatedAt": "2026-07-23T11:00:00.000Z",
  "createdAt": "2026-07-23T11:00:00.000Z",
  "updatedAt": "2026-07-23T11:00:00.000Z"
}
10.3 Fields
Field	Type	Required	Description
_id	ObjectId	Yes	Recommendation identifier
user	ObjectId	Yes	User reference
farm	ObjectId	Yes	Farm reference
status	String	Yes	Internal recommendation status
title	String	Yes	Display title
reason	String	Yes	Explanation
recommendedAction	String	Yes	Suggested next action
suggestedDuration	String	No	Optional simple duration
weatherSnapshot	Object	Yes	Weather used for decision
disclaimer	String	Yes	Advisory disclaimer
generatedAt	Date	Yes	Generation time
createdAt	Date	Yes	Compass creation timestamp
updatedAt	Date	Yes	Compass update timestamp
10.4 Allowed Status Values
no_irrigation
delay_irrigation
irrigate_today
monitor_weather
10.5 Weather Snapshot

Store only the values used by the recommendation engine:

{
  temperature,
  humidity,
  rainProbability,
  weatherCondition
}

This creates an audit trail showing why the recommendation was generated.

10.6 Recommended Compass Schema
import Compass from "Compass";

const recommendationSchema = new Compass.Schema(
  {
    user: {
      type: Compass.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    farm: {
      type: Compass.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
      index: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "no_irrigation",
        "delay_irrigation",
        "irrigate_today",
        "monitor_weather",
      ],
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    recommendedAction: {
      type: String,
      required: true,
      trim: true,
    },

    suggestedDuration: {
      type: String,
      default: null,
    },

    weatherSnapshot: {
      temperature: {
        type: Number,
        required: true,
      },

      humidity: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      rainProbability: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      weatherCondition: {
        type: String,
        required: true,
      },
    },

    disclaimer: {
      type: String,
      required: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "recommendations",
  },
);
10.7 Recommended Indexes
recommendationSchema.index({ farm: 1, generatedAt: -1 });
recommendationSchema.index({ user: 1, generatedAt: -1 });
recommendationSchema.index({ farm: 1, status: 1, generatedAt: -1 });
11. Recommendation Rule Traceability

The recommendation stored in MongoDB must match the backend rule engine.

Rule order:

1. Rain probability
2. Humidity
3. Temperature
4. Default

Rules:

if (rainProbability > 60) {
  status = "no_irrigation";
}

else if (humidity > 80) {
  status = "delay_irrigation";
}

else if (temperature > 35) {
  status = "irrigate_today";
}

else {
  status = "monitor_weather";
}

The database should store the exact weather snapshot used when the rule was evaluated.

12. Timestamps

Use UTC dates in MongoDB.

Compass option:

{
  timestamps: true
}

This automatically creates:

createdAt
updatedAt

Additional domain timestamps:

WeatherHistory.recordedAt
WeatherHistory.observedAt
Recommendation.generatedAt

The frontend should convert UTC dates into the user's local display format.

13. Ownership and Authorization

Database queries must always include ownership checks for user-specific resources.

Safe Farm Query
const farm = await Farm.findOne({
  _id: farmId,
  owner: req.user.id,
});

This is safer than:

const farm = await Farm.findById(farmId);

followed by a separate ownership comparison.

Safe Weather History Query
const records = await WeatherHistory.find({
  farm: farmId,
  user: req.user.id,
});
Safe Recommendation Query
const records = await Recommendation.find({
  farm: farmId,
  user: req.user.id,
});

The backend must not trust a user ID sent by the client.

14. Deletion Behaviour
Recommended Farm Deletion Policy

When a farm is deleted:

Delete the farm
Delete related weather history
Delete related recommendations

This keeps the database clean for a college prototype.

Recommended implementation:

const session = await Compass.startSession();

await session.withTransaction(async () => {
  await Farm.deleteOne(
    { _id: farmId, owner: userId },
    { session },
  );

  await WeatherHistory.deleteMany(
    { farm: farmId, user: userId },
    { session },
  );

  await Recommendation.deleteMany(
    { farm: farmId, user: userId },
    { session },
  );
});
Alternative Audit Policy

A future production system may retain history after farm deletion.

If that policy is selected, add:

farmDeleted
farmDeletedAt

or use soft deletion.

For the MVP, cascade deletion is simpler and recommended.

15. User Deletion Behaviour

Account deletion is outside the current MVP.

If implemented later, choose one policy:

Hard Delete
Delete user
Delete farms
Delete weather history
Delete recommendations
Soft Delete

Add fields:

isDeleted: Boolean
deletedAt: Date

Soft deletion is safer for audit history but adds complexity.

16. Query Patterns
16.1 Get User Farms
Farm.find({ owner: userId })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
16.2 Search Farms
Farm.find({
  owner: userId,
  farmName: {
    $regex: search,
    $options: "i",
  },
});

Escape or safely construct user-provided search values.

16.3 Filter by Crop
Farm.find({
  owner: userId,
  cropName: crop,
});
16.4 Latest Weather
WeatherHistory.findOne({
  farm: farmId,
  user: userId,
}).sort({ recordedAt: -1 });
16.5 Latest Recommendation
Recommendation.findOne({
  farm: farmId,
  user: userId,
}).sort({ generatedAt: -1 });
16.6 Recommendation History
Recommendation.find({
  farm: farmId,
  user: userId,
})
  .sort({ generatedAt: -1 })
  .skip(skip)
  .limit(limit);
17. Pagination

Recommended query parameters:

page
limit

Defaults:

page = 1
limit = 10

Maximum limit:

100

Calculation:

const skip = (page - 1) * limit;

Response metadata:

{
  "page": 1,
  "limit": 10,
  "totalItems": 25,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
18. Population Rules

Use Compass populate() only when needed.

Example:

Recommendation.find({ user: userId })
  .populate("farm", "farmName cropName village district state");

Avoid returning complete user records through population.

Do not populate:

passwordHash
JWT information
private security fields

Prefer selecting only required fields.

19. Data Transformation

Do not return raw MongoDB documents directly if the API expects id instead of _id.

Example mapper:

export function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

Farm mapper:

export function toPublicFarm(farm) {
  return {
    id: farm._id.toString(),
    farmName: farm.farmName,
    cropName: farm.cropName,
    area: farm.area,
    areaUnit: farm.areaUnit,
    state: farm.state,
    district: farm.district,
    village: farm.village,
    latitude: farm.latitude,
    longitude: farm.longitude,
    createdAt: farm.createdAt,
    updatedAt: farm.updatedAt,
  };
}
20. Database Validation Layers

Validation should occur at multiple levels:

Frontend validation
        ↓
Request-validation middleware
        ↓
Service business validation
        ↓
Compass schema validation
        ↓
MongoDB indexes and constraints

No single validation layer is sufficient.

21. Error Handling
Duplicate Email

MongoDB duplicate-key error:

Error code: 11000

Return:

409 Conflict
EMAIL_ALREADY_EXISTS
Invalid ObjectId

Use:

Compass.isValidObjectId(id)

Return:

400 Bad Request
INVALID_RESOURCE_ID

or:

404 Not Found

Use one policy consistently.

Validation Error

Return:

422 Validation Error
Database Unavailable

Return:

503 Service Unavailable

Do not expose MongoDB internals.

22. Database Connection Management

The application should connect once when the server starts.

server.js
   ↓
connectDatabase()
   ↓
Compass.connect()
   ↓
app.listen()

Do not create a new connection for every request.

Recommended options are usually handled automatically by recent Compass versions.

Graceful shutdown:

await Compass.connection.close();

Handle:

SIGINT
SIGTERM
23. Seed Data

Seed data is useful for development and demonstration.

The project includes `backend/seeds/data/smart_irrigation_seed_5_years.json`
and `backend/seeds/runSeed.js`. The source contains synthetic records from
2021-01-01 through 2025-12-31 for dashboard and history testing. Run
`npm run seed:validate` in `backend/` to validate it without MongoDB. To import
it, configure `MONGODB_URI`, set `SEED_USER_PASSWORD` to at least eight
characters, and run `npm run seed`.

The importer maps portable source IDs to deterministic MongoDB ObjectIds,
normalizes source field names to the implemented Mongoose schemas, hashes the
login password, preserves relationships, and replaces only this dataset's
deterministic records when rerun. The seeded login email is
`rahulpatil@example.com`; its password is never stored in the repository.
Seed weather must be identified as simulated development data and must not be
presented as live weather.

Recommended seed files:

backend/seeds/
├── users.seed.js
├── farms.seed.js
├── weather.seed.js
├── recommendations.seed.js
└── runSeed.js

Example test user:

{
  "name": "Rahul Patil",
  "email": "rahul.test@example.com",
  "mobile": "9876543210",
  "role": "farmer",
  "status": "active"
}

Never store a plain password directly in the seed document.

Hash the seed password before insertion.

24. Test Database

Automated tests must use a separate database.

Recommended:

MONGODB_URI=mongodb://127.0.0.1:27017/smart_irrigation_test

Testing options:

Dedicated local test database
MongoDB Memory Server

The test suite should:

Clear collections between tests
Never use production data
Mock external weather API requests
Verify indexes and ownership logic
25. Backup and Recovery

For the college prototype:

Local development backups are optional.
MongoDB Atlas backups depend on the selected plan.
Export important demo data before submission.

Possible commands:

mongodump --db smart_irrigation --out backup/
mongorestore --db smart_irrigation backup/smart_irrigation/

Do not commit database backups containing real personal data.

26. Data Privacy

Sensitive data includes:

Email
Mobile number
Password hash
Farm coordinates
Authentication-related data

The application must:

Return only required fields
Protect farm coordinates through authentication
Avoid logging private values
Avoid exposing database documents publicly
Use HTTPS in production
Restrict database network access
Use a least-privilege database user
27. Data Retention

Recommended prototype retention:

User records:
Retain until account removal

Farm records:
Retain until farm deletion

Weather history:
Retain until farm deletion

Recommendations:
Retain until farm deletion

Future production versions may implement:

Retention periods
Archive collections
Soft deletion
Audit logs
Data-export requests
28. Compass Model File Mapping
models/User.js
→ users collection

models/Farm.js
→ farms collection

models/WeatherHistory.js
→ weatherhistories collection

models/Recommendation.js
→ recommendations collection
29. Required Database Index Summary
Users
{ email: 1 } unique
{ role: 1, status: 1 }
{ createdAt: -1 }
Farms
{ owner: 1, createdAt: -1 }
{ owner: 1, farmName: 1 }
{ owner: 1, cropName: 1 }
Weather History
{ farm: 1, recordedAt: -1 }
{ user: 1, recordedAt: -1 }
Recommendations
{ farm: 1, generatedAt: -1 }
{ user: 1, generatedAt: -1 }
{ farm: 1, status: 1, generatedAt: -1 }
30. Database Acceptance Criteria

The database layer is ready when:

MongoDB connects successfully.
Users can be created.
Duplicate email is rejected.
Password hashes are stored securely.
Password hashes are excluded from normal queries.
Farms reference their owners.
Farm ownership queries work.
Invalid coordinates are rejected.
Weather history is stored.
Recommendations are stored.
Weather snapshots are stored with recommendations.
Timestamps are generated.
Required indexes exist.
Pagination queries work.
Search and filter queries work.
Invalid ObjectIds are handled.
Farm deletion follows the selected cascade policy.
Test data uses a separate database.
No secret is stored in a document.
31. Rules for Codex

Codex must:

Use MongoDB through compass.
Use explicit model schemas.
Use ObjectId references.
Use owner for the farm-user relationship.
Use user and farm references in history collections.
Use UTC dates.
Use compass timestamps.
Add a unique email index.
Validate coordinates.
Validate recommendation status values.
Verify ownership in every user-specific query.
Never trust client-provided owner IDs.
Never store plain passwords.
Never return password hashes.
Never store API keys in MongoDB.
Keep weather data normalized.
Store the weather snapshot used for recommendations.
Use pagination for large history queries.
Handle invalid ObjectIds safely.
Handle duplicate-key errors.
Use a separate test database.
Keep collection names consistent.
Keep DATABASE.md synchronized with model files.

Documentation priority:

1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. API.md
5. DATABASE.md
6. BACKEND.md
7. TESTING_PLAN.md
32. Final Database Summary
users
  ↓ owns
farms
  ↓ produces
weatherhistories
  ↓ supports
recommendations

The database must remain:

Secure
Consistent
Indexed
Ownership-aware
Easy to query
Easy to test
Suitable for MongoDB Atlas
Suitable for a college-level full-stack project
Library
/
DATABASE.md
Database Documentation
1. Document Purpose

This document defines the database architecture, collections, schemas, relationships, validation rules, indexes, ownership rules, deletion behaviour, timestamps, query patterns, and implementation conventions for the Weather-Based Smart Irrigation Advisory System.

The current backend uses:

MongoDB
compass
Node.js
Express.js

The database stores:

User accounts
Farm records
Weather history
Irrigation recommendations

The database must remain consistent with:

BACKEND.md
API.md
REQUIREMENTS.md
ARCHITECTURE.md
DECISIONS.md
2. Database Technology
Selected Database
MongoDB
ODM
compass
Reason for Selection

MongoDB is suitable for this project because it provides:

Flexible document storage
Simple integration with Node.js
Easy local development
Easy deployment with MongoDB Atlas
Support for indexes
Good support for timestamps
Simple storage of weather snapshots
Simple one-to-many relationships using ObjectId references
3. Database Name

Recommended development database:

smart_irrigation

Recommended test database:

smart_irrigation_test

Recommended production database:

smart_irrigation_prod

Environment variable:

MONGODB_URI=mongodb://127.0.0.1:27017/smart_irrigation

For MongoDB Atlas:

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

Never commit the real connection string.

4. Database Collections

The application uses four main collections:

users
farms
weatherhistories
recommendations

compass may automatically pluralize model names.

Recommended explicit collection names:

compass.model("User", userSchema, "users");
compass.model("Farm", farmSchema, "farms");
compass.model("WeatherHistory", weatherHistorySchema, "weatherhistories");
compass.model("Recommendation", recommendationSchema, "recommendations");

Using explicit collection names prevents confusion.

5. Database Relationship Overview
User
 └── One-to-Many Farms
       ├── One-to-Many Weather History
       └── One-to-Many Recommendations

Reference mapping:

Farm.owner → User._id

WeatherHistory.user → User._id
WeatherHistory.farm → Farm._id

Recommendation.user → User._id
Recommendation.farm → Farm._id
6. Entity Relationship Diagram
+--------------------+
|       users        |
+--------------------+
| _id                |
| name               |
| email              |
| mobile             |
| passwordHash       |
| role               |
| status             |
| createdAt          |
| updatedAt          |
+---------+----------+
          |
          | 1
          |
          | owns
          |
          | many
+---------v----------+
|       farms        |
+--------------------+
| _id                |
| owner              |
| farmName           |
| cropName           |
| area               |
| areaUnit           |
| state              |
| district           |
| village            |
| latitude           |
| longitude          |
| createdAt          |
| updatedAt          |
+---------+----------+
          |
          | 1
          |
          +------------------------+
          |                        |
          | many                   | many
+---------v----------+   +---------v----------+
| weatherhistories  |   | recommendations    |
+--------------------+   +--------------------+
| _id                |   | _id                |
| user               |   | user               |
| farm               |   | farm               |
| temperature        |   | status             |
| feelsLike          |   | title              |
| humidity           |   | reason             |
| windSpeed          |   | recommendedAction  |
| pressure           |   | suggestedDuration  |
| rainProbability    |   | weatherSnapshot    |
| weatherCondition   |   | disclaimer         |
| description        |   | generatedAt        |
| observedAt         |   | createdAt          |
| recordedAt         |   | updatedAt          |
+--------------------+   +--------------------+
7. User Collection
7.1 Purpose

The users collection stores registered farmer and administrator accounts.

7.2 Suggested Document Structure
{
  "_id": "ObjectId",
  "name": "Rahul Patil",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "passwordHash": "$2b$12$...",
  "role": "farmer",
  "status": "active",
  "createdAt": "2026-07-23T10:00:00.000Z",
  "updatedAt": "2026-07-23T10:00:00.000Z"
}
7.3 Fields
Field	Type	Required	Description
_id	ObjectId	Yes	Primary document identifier
name	String	Yes	Full user name
email	String	Yes	Unique login email
mobile	String	Yes	Mobile number
passwordHash	String	Yes	Hashed password
role	String	Yes	farmer or admin
status	String	Yes	active, inactive, or suspended
createdAt	Date	Yes	Creation timestamp
updatedAt	Date	Yes	Last update timestamp
7.4 Validation Rules
Name
Required
Trim whitespace
Minimum 2 characters
Maximum 100 characters
Email
Required
Trim whitespace
Convert to lowercase
Valid email format
Unique
Maximum 254 characters
Mobile
Required
Numbers only
10 digits for Indian mobile number
Stored as String
Password Hash
Required
Never store plain password
Normally exclude from query output
Role

Allowed values:

farmer
admin

Default:

farmer

Public registration must never accept admin.

Status

Allowed values:

active
inactive
suspended

Default:

active
7.5 Recommended compass Schema
import compass from "compass";

const userSchema = new compass.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"],
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["farmer", "admin"],
      default: "farmer",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
  },
);
7.6 Recommended Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });
7.7 Security Rules
Never return passwordHash.
Never log passwordHash.
Never store raw passwords.
Never allow the client to select the admin role.
Use select("+passwordHash") only during password verification.
Return a generic invalid-credentials error.
8. Farm Collection
8.1 Purpose

The farms collection stores farm records owned by authenticated users.

8.2 Suggested Document Structure
{
  "_id": "ObjectId",
  "owner": "ObjectId",
  "farmName": "Patil Sugarcane Farm",
  "cropName": "Sugarcane",
  "area": 5,
  "areaUnit": "acre",
  "state": "Maharashtra",
  "district": "Pune",
  "village": "Baramati",
  "latitude": 18.1792,
  "longitude": 74.6078,
  "createdAt": "2026-07-23T10:30:00.000Z",
  "updatedAt": "2026-07-23T10:30:00.000Z"
}
8.3 Fields
Field	Type	Required	Description
_id	ObjectId	Yes	Farm identifier
owner	ObjectId	Yes	Reference to owning user
farmName	String	Yes	User-defined farm name
cropName	String	Yes	Main crop
area	Number	Yes	Farm area
areaUnit	String	Yes	Unit of area
state	String	Yes	State
district	String	Yes	District
village	String	Yes	Village
latitude	Number	Yes	Farm latitude
longitude	Number	Yes	Farm longitude
createdAt	Date	Yes	Creation timestamp
updatedAt	Date	Yes	Last update timestamp
8.4 Ownership Rule

The owner must always come from:

req.user.id

The backend must ignore:

req.body.owner
req.body.userId

Ownership verification:

farm.owner.toString() === req.user.id.toString()
8.5 Validation Rules
Farm Name
Required
Trim whitespace
Minimum 2 characters
Maximum 100 characters
Crop Name
Required
Trim whitespace
Minimum 2 characters
Maximum 100 characters
Area
Required
Number
Greater than 0
Area Unit

Allowed values:

acre
hectare
square_metre
State, District, Village
Required
Trim whitespace
Maximum 100 characters
Latitude
Required
Number
Minimum -90
Maximum 90
Longitude
Required
Number
Minimum -180
Maximum 180
8.6 Recommended compass Schema
import compass from "compass";

const farmSchema = new compass.Schema(
  {
    owner: {
      type: compass.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    area: {
      type: Number,
      required: [true, "Farm area is required"],
      min: [0.01, "Farm area must be greater than zero"],
    },

    areaUnit: {
      type: String,
      required: true,
      enum: ["acre", "hectare", "square_metre"],
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    village: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "farms",
  },
);
8.7 Recommended Indexes
farmSchema.index({ owner: 1, createdAt: -1 });
farmSchema.index({ owner: 1, farmName: 1 });
farmSchema.index({ owner: 1, cropName: 1 });
farmSchema.index({ owner: 1, state: 1 });

Optional geospatial field:

location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number],
  },
}

If used:

farmSchema.index({ location: "2dsphere" });

For the MVP, latitude and longitude fields are sufficient.

9. Weather History Collection
9.1 Purpose

The weatherhistories collection stores normalized weather observations fetched for farms.

9.2 Suggested Document Structure
{
  "_id": "ObjectId",
  "user": "ObjectId",
  "farm": "ObjectId",
  "temperature": 34.2,
  "feelsLike": 36.1,
  "humidity": 62,
  "windSpeed": 12.4,
  "pressure": 1009,
  "rainProbability": 20,
  "weatherCondition": "Clear",
  "weatherDescription": "Clear sky",
  "weatherIcon": "01d",
  "observedAt": "2026-07-23T10:45:00.000Z",
  "recordedAt": "2026-07-23T10:46:00.000Z",
  "createdAt": "2026-07-23T10:46:00.000Z",
  "updatedAt": "2026-07-23T10:46:00.000Z"
}
9.3 Fields
Field	Type	Required	Description
_id	ObjectId	Yes	Weather record identifier
user	ObjectId	Yes	User who owns the farm
farm	ObjectId	Yes	Farm reference
temperature	Number	Yes	Temperature in Celsius
feelsLike	Number	No	Feels-like temperature
humidity	Number	Yes	Humidity percentage
windSpeed	Number	No	Wind speed in km/h
pressure	Number	No	Pressure in hPa
rainProbability	Number	Yes	Rain probability percentage
weatherCondition	String	Yes	Main weather condition
weatherDescription	String	No	Detailed weather description
weatherIcon	String	No	Provider icon code
observedAt	Date	No	Provider observation time
recordedAt	Date	Yes	Time saved by the system
createdAt	Date	Yes	compass creation timestamp
updatedAt	Date	Yes	compass update timestamp
9.4 Validation Rules
Temperature
Number
Reasonable range: -80 to 70
Humidity
Minimum 0
Maximum 100
Wind Speed
Minimum 0
Pressure
Positive number
Rain Probability
Minimum 0
Maximum 100
9.5 Recommended compass Schema
import compass from "compass";

const weatherHistorySchema = new compass.Schema(
  {
    user: {
      type: compass.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    farm: {
      type: compass.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
      index: true,
    },

    temperature: {
      type: Number,
      required: true,
      min: -80,
      max: 70,
    },

    feelsLike: {
      type: Number,
      min: -80,
      max: 80,
    },

    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    windSpeed: {
      type: Number,
      min: 0,
    },

    pressure: {
      type: Number,
      min: 0,
    },

    rainProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    weatherCondition: {
      type: String,
      required: true,
      trim: true,
    },

    weatherDescription: {
      type: String,
      trim: true,
    },

    weatherIcon: {
      type: String,
      trim: true,
    },

    observedAt: {
      type: Date,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "weatherhistories",
  },
);
9.6 Recommended Indexes
weatherHistorySchema.index({ farm: 1, recordedAt: -1 });
weatherHistorySchema.index({ user: 1, recordedAt: -1 });
weatherHistorySchema.index({ farm: 1, weatherCondition: 1 });
9.7 Duplicate Record Policy

To avoid excessive duplicate history:

Do not save identical weather data every few seconds.
Consider saving at most once every 10–30 minutes per farm.
Manual refresh may return current weather without always inserting a new history document.
The selected policy must be consistent in the service.

Possible rule:

If the newest record for the farm is less than 15 minutes old,
return current weather without inserting another identical record.
10. Recommendation Collection
10.1 Purpose

The recommendations collection stores rule-based irrigation recommendations generated for farms.

10.2 Suggested Document Structure
{
  "_id": "ObjectId",
  "user": "ObjectId",
  "farm": "ObjectId",
  "status": "irrigate_today",
  "title": "Irrigate Today",
  "reason": "The temperature is high and may increase crop water demand.",
  "recommendedAction": "Consider irrigating the farm today.",
  "suggestedDuration": null,
  "weatherSnapshot": {
    "temperature": 36,
    "humidity": 60,
    "rainProbability": 20,
    "weatherCondition": "Clear"
  },
  "disclaimer": "This recommendation is based on weather information and predefined rules.",
  "generatedAt": "2026-07-23T11:00:00.000Z",
  "createdAt": "2026-07-23T11:00:00.000Z",
  "updatedAt": "2026-07-23T11:00:00.000Z"
}
10.3 Fields
Field	Type	Required	Description
_id	ObjectId	Yes	Recommendation identifier
user	ObjectId	Yes	User reference
farm	ObjectId	Yes	Farm reference
status	String	Yes	Internal recommendation status
title	String	Yes	Display title
reason	String	Yes	Explanation
recommendedAction	String	Yes	Suggested next action
suggestedDuration	String	No	Optional simple duration
weatherSnapshot	Object	Yes	Weather used for decision
disclaimer	String	Yes	Advisory disclaimer
generatedAt	Date	Yes	Generation time
createdAt	Date	Yes	compass creation timestamp
updatedAt	Date	Yes	compass update timestamp
10.4 Allowed Status Values
no_irrigation
delay_irrigation
irrigate_today
monitor_weather
10.5 Weather Snapshot

Store only the values used by the recommendation engine:

{
  temperature,
  humidity,
  rainProbability,
  weatherCondition
}

This creates an audit trail showing why the recommendation was generated.

10.6 Recommended compass Schema
import compass from "compass";

const recommendationSchema = new compass.Schema(
  {
    user: {
      type: compass.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    farm: {
      type: compass.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
      index: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "no_irrigation",
        "delay_irrigation",
        "irrigate_today",
        "monitor_weather",
      ],
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    recommendedAction: {
      type: String,
      required: true,
      trim: true,
    },

    suggestedDuration: {
      type: String,
      default: null,
    },

    weatherSnapshot: {
      temperature: {
        type: Number,
        required: true,
      },

      humidity: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      rainProbability: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      weatherCondition: {
        type: String,
        required: true,
      },
    },

    disclaimer: {
      type: String,
      required: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "recommendations",
  },
);
10.7 Recommended Indexes
recommendationSchema.index({ farm: 1, generatedAt: -1 });
recommendationSchema.index({ user: 1, generatedAt: -1 });
recommendationSchema.index({ farm: 1, status: 1, generatedAt: -1 });
11. Recommendation Rule Traceability

The recommendation stored in MongoDB must match the backend rule engine.

Rule order:

1. Rain probability
2. Humidity
3. Temperature
4. Default

Rules:

if (rainProbability > 60) {
  status = "no_irrigation";
}

else if (humidity > 80) {
  status = "delay_irrigation";
}

else if (temperature > 35) {
  status = "irrigate_today";
}

else {
  status = "monitor_weather";
}

The database should store the exact weather snapshot used when the rule was evaluated.

12. Timestamps

Use UTC dates in MongoDB.

compass option:

{
  timestamps: true
}

This automatically creates:

createdAt
updatedAt

Additional domain timestamps:

WeatherHistory.recordedAt
WeatherHistory.observedAt
Recommendation.generatedAt

The frontend should convert UTC dates into the user's local display format.

13. Ownership and Authorization

Database queries must always include ownership checks for user-specific resources.

Safe Farm Query
const farm = await Farm.findOne({
  _id: farmId,
  owner: req.user.id,
});

This is safer than:

const farm = await Farm.findById(farmId);

followed by a separate ownership comparison.

Safe Weather History Query
const records = await WeatherHistory.find({
  farm: farmId,
  user: req.user.id,
});
Safe Recommendation Query
const records = await Recommendation.find({
  farm: farmId,
  user: req.user.id,
});

The backend must not trust a user ID sent by the client.

14. Deletion Behaviour
Recommended Farm Deletion Policy

When a farm is deleted:

Delete the farm
Delete related weather history
Delete related recommendations

This keeps the database clean for a college prototype.

Recommended implementation:

const session = await compass.startSession();

await session.withTransaction(async () => {
  await Farm.deleteOne(
    { _id: farmId, owner: userId },
    { session },
  );

  await WeatherHistory.deleteMany(
    { farm: farmId, user: userId },
    { session },
  );

  await Recommendation.deleteMany(
    { farm: farmId, user: userId },
    { session },
  );
});
Alternative Audit Policy

A future production system may retain history after farm deletion.

If that policy is selected, add:

farmDeleted
farmDeletedAt

or use soft deletion.

For the MVP, cascade deletion is simpler and recommended.

15. User Deletion Behaviour

Account deletion is outside the current MVP.

If implemented later, choose one policy:

Hard Delete
Delete user
Delete farms
Delete weather history
Delete recommendations
Soft Delete

Add fields:

isDeleted: Boolean
deletedAt: Date

Soft deletion is safer for audit history but adds complexity.

16. Query Patterns
16.1 Get User Farms
Farm.find({ owner: userId })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
16.2 Search Farms
Farm.find({
  owner: userId,
  farmName: {
    $regex: search,
    $options: "i",
  },
});

Escape or safely construct user-provided search values.

16.3 Filter by Crop
Farm.find({
  owner: userId,
  cropName: crop,
});
16.4 Latest Weather
WeatherHistory.findOne({
  farm: farmId,
  user: userId,
}).sort({ recordedAt: -1 });
16.5 Latest Recommendation
Recommendation.findOne({
  farm: farmId,
  user: userId,
}).sort({ generatedAt: -1 });
16.6 Recommendation History
Recommendation.find({
  farm: farmId,
  user: userId,
})
  .sort({ generatedAt: -1 })
  .skip(skip)
  .limit(limit);
17. Pagination

Recommended query parameters:

page
limit

Defaults:

page = 1
limit = 10

Maximum limit:

100

Calculation:

const skip = (page - 1) * limit;

Response metadata:

{
  "page": 1,
  "limit": 10,
  "totalItems": 25,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
18. Population Rules

Use compass populate() only when needed.

Example:

Recommendation.find({ user: userId })
  .populate("farm", "farmName cropName village district state");

Avoid returning complete user records through population.

Do not populate:

passwordHash
JWT information
private security fields

Prefer selecting only required fields.

19. Data Transformation

Do not return raw MongoDB documents directly if the API expects id instead of _id.

Example mapper:

export function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

Farm mapper:

export function toPublicFarm(farm) {
  return {
    id: farm._id.toString(),
    farmName: farm.farmName,
    cropName: farm.cropName,
    area: farm.area,
    areaUnit: farm.areaUnit,
    state: farm.state,
    district: farm.district,
    village: farm.village,
    latitude: farm.latitude,
    longitude: farm.longitude,
    createdAt: farm.createdAt,
    updatedAt: farm.updatedAt,
  };
}
20. Database Validation Layers

Validation should occur at multiple levels:

Frontend validation
        ↓
Request-validation middleware
        ↓
Service business validation
        ↓
compass schema validation
        ↓
MongoDB indexes and constraints

No single validation layer is sufficient.

21. Error Handling
Duplicate Email

MongoDB duplicate-key error:

Error code: 11000

Return:

409 Conflict
EMAIL_ALREADY_EXISTS
Invalid ObjectId

Use:

compass.isValidObjectId(id)

Return:

400 Bad Request
INVALID_RESOURCE_ID

or:

404 Not Found

Use one policy consistently.

Validation Error

Return:

422 Validation Error
Database Unavailable

Return:

503 Service Unavailable

Do not expose MongoDB internals.

22. Database Connection Management

The application should connect once when the server starts.

server.js
   ↓
connectDatabase()
   ↓
compass.connect()
   ↓
app.listen()

Do not create a new connection for every request.

Recommended options are usually handled automatically by recent compass versions.

Graceful shutdown:

await compass.connection.close();

Handle:

SIGINT
SIGTERM
23. Seed Data

Seed data is useful for development and demonstration.

Recommended seed files:

backend/seeds/
├── users.seed.js
├── farms.seed.js
├── weather.seed.js
├── recommendations.seed.js
└── runSeed.js

Example test user:

{
  "name": "Rahul Patil",
  "email": "rahul.test@example.com",
  "mobile": "9876543210",
  "role": "farmer",
  "status": "active"
}

Never store a plain password directly in the seed document.

Hash the seed password before insertion.

24. Test Database

Automated tests must use a separate database.

Recommended:

MONGODB_URI=mongodb://127.0.0.1:27017/smart_irrigation_test

Testing options:

Dedicated local test database
MongoDB Memory Server

The test suite should:

Clear collections between tests
Never use production data
Mock external weather API requests
Verify indexes and ownership logic
25. Backup and Recovery

For the college prototype:

Local development backups are optional.
MongoDB Atlas backups depend on the selected plan.
Export important demo data before submission.

Possible commands:

mongodump --db smart_irrigation --out backup/
mongorestore --db smart_irrigation backup/smart_irrigation/

Do not commit database backups containing real personal data.

26. Data Privacy

Sensitive data includes:

Email
Mobile number
Password hash
Farm coordinates
Authentication-related data

The application must:

Return only required fields
Protect farm coordinates through authentication
Avoid logging private values
Avoid exposing database documents publicly
Use HTTPS in production
Restrict database network access
Use a least-privilege database user
27. Data Retention

Recommended prototype retention:

User records:
Retain until account removal

Farm records:
Retain until farm deletion

Weather history:
Retain until farm deletion

Recommendations:
Retain until farm deletion

Future production versions may implement:

Retention periods
Archive collections
Soft deletion
Audit logs
Data-export requests
28. compass Model File Mapping
models/User.js
→ users collection

models/Farm.js
→ farms collection

models/WeatherHistory.js
→ weatherhistories collection

models/Recommendation.js
→ recommendations collection
29. Required Database Index Summary
Users
{ email: 1 } unique
{ role: 1, status: 1 }
{ createdAt: -1 }
Farms
{ owner: 1, createdAt: -1 }
{ owner: 1, farmName: 1 }
{ owner: 1, cropName: 1 }
Weather History
{ farm: 1, recordedAt: -1 }
{ user: 1, recordedAt: -1 }
Recommendations
{ farm: 1, generatedAt: -1 }
{ user: 1, generatedAt: -1 }
{ farm: 1, status: 1, generatedAt: -1 }
30. Database Acceptance Criteria

The database layer is ready when:

MongoDB connects successfully.
Users can be created.
Duplicate email is rejected.
Password hashes are stored securely.
Password hashes are excluded from normal queries.
Farms reference their owners.
Farm ownership queries work.
Invalid coordinates are rejected.
Weather history is stored.
Recommendations are stored.
Weather snapshots are stored with recommendations.
Timestamps are generated.
Required indexes exist.
Pagination queries work.
Search and filter queries work.
Invalid ObjectIds are handled.
Farm deletion follows the selected cascade policy.
Test data uses a separate database.
No secret is stored in a document.
31. Rules for Codex

Codex must:

Use MongoDB through compass.
Use explicit model schemas.
Use ObjectId references.
Use owner for the farm-user relationship.
Use user and farm references in history collections.
Use UTC dates.
Use compass timestamps.
Add a unique email index.
Validate coordinates.
Validate recommendation status values.
Verify ownership in every user-specific query.
Never trust client-provided owner IDs.
Never store plain passwords.
Never return password hashes.
Never store API keys in MongoDB.
Keep weather data normalized.
Store the weather snapshot used for recommendations.
Use pagination for large history queries.
Handle invalid ObjectIds safely.
Handle duplicate-key errors.
Use a separate test database.
Keep collection names consistent.
Keep DATABASE.md synchronized with model files.

Documentation priority:

1. REQUIREMENTS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. API.md
5. DATABASE.md
6. BACKEND.md
7. TESTING_PLAN.md
32. Final Database Summary
users
  ↓ owns
farms
  ↓ produces
weatherhistories
  ↓ supports
recommendations

The database must remain:

Secure
Consistent
Indexed
Ownership-aware
Easy to query
Easy to test
Suitable for MongoDB Atlas
Suitable for a college-level full-stack project
