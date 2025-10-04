# Real Estate Listing Platform 🏠

A comprehensive Real Estate Listing Platform built with Flask and MongoDB (pymongo) that allows managing properties, agents, users, and inquiries.

## Features

- **CRUD Operations** for Properties, Agents, Users, and Inquiries
- **Sorting** properties by price, size, or location
- **Filtering** properties by city, property type, and price range
- **Indexing** on city, price, and propertyType for optimized queries
- **Aggregation** pipelines for analytics:
  - Average property price by city
  - Most active agents
  - Properties by type
  - Inquiry statistics
  - Price range distribution

## Collections

- **properties**: Real estate listings with details like price, location, type, and size
- **agents**: Real estate agents managing listings
- **users**: Platform users interested in properties
- **inquiries**: User inquiries about specific properties

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure MongoDB is running locally on `mongodb://localhost:27017/`

3. Update the `.env` file if your MongoDB URI is different

## Running the Application

Start the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Initialize Database

To create indexes and seed sample data:
```bash
POST http://localhost:5000/api/init-db
```

## API Endpoints

### Properties

- `GET /api/properties` - Get all properties (supports filtering and sorting)
  - Query params: `sortBy`, `order`, `city`, `propertyType`, `minPrice`, `maxPrice`
- `GET /api/properties/<id>` - Get a specific property
- `POST /api/properties` - Create a new property
- `PUT /api/properties/<id>` - Update a property
- `DELETE /api/properties/<id>` - Delete a property

### Agents

- `GET /api/agents` - Get all agents
  - Query params: `specialization`
- `GET /api/agents/<id>` - Get a specific agent
- `POST /api/agents` - Create a new agent
- `PUT /api/agents/<id>` - Update an agent
- `DELETE /api/agents/<id>` - Delete an agent

### Users

- `GET /api/users` - Get all users
- `GET /api/users/<id>` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/<id>` - Update a user
- `DELETE /api/users/<id>` - Delete a user

### Inquiries

- `GET /api/inquiries` - Get all inquiries
  - Query params: `propertyId`, `userId`, `agentId`, `status`
- `GET /api/inquiries/<id>` - Get a specific inquiry
- `POST /api/inquiries` - Create a new inquiry
- `PUT /api/inquiries/<id>` - Update an inquiry
- `DELETE /api/inquiries/<id>` - Delete an inquiry

### Aggregation

- `GET /api/aggregation/average-price-by-city` - Get average property prices by city
- `GET /api/aggregation/most-active-agents` - Get agents with most active listings
- `GET /api/aggregation/properties-by-type` - Get property statistics by type
- `GET /api/aggregation/inquiry-statistics` - Get inquiry status statistics
- `GET /api/aggregation/price-range-distribution` - Get properties distributed by price ranges

## Example Requests

### Create a Property
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Villa",
    "description": "Spacious villa with garden",
    "price": 750000,
    "propertyType": "House",
    "bedrooms": 5,
    "bathrooms": 3,
    "size": 3500,
    "city": "Miami",
    "address": "123 Beach Rd, Miami, FL",
    "agentId": "agent_id_here",
    "status": "Available"
  }'
```

### Sort Properties by Price
```bash
curl "http://localhost:5000/api/properties?sortBy=price&order=asc"
```

### Filter Properties by City and Price Range
```bash
curl "http://localhost:5000/api/properties?city=New%20York&minPrice=400000&maxPrice=800000"
```

### Get Average Price by City
```bash
curl http://localhost:5000/api/aggregation/average-price-by-city
```

## Database Indexes

The following indexes are automatically created for optimized queries:

- `properties.city` (ascending)
- `properties.price` (ascending)
- `properties.propertyType` (ascending)
- `properties.city + price` (compound index)
- `agents.email` (unique)
- `users.email` (unique)
- `inquiries.propertyId` (ascending)

## Technologies Used

- **Flask** - Python web framework
- **PyMongo** - MongoDB driver for Python
- **MongoDB** - NoSQL database
- **python-dotenv** - Environment variable management
