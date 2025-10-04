from pymongo import MongoClient, ASCENDING, DESCENDING
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        self.client = MongoClient(mongodb_uri)
        self.db = self.client['real_estate_platform']

        self.properties = self.db['properties']
        self.agents = self.db['agents']
        self.users = self.db['users']
        self.inquiries = self.db['inquiries']

    def create_indexes(self):
        self.properties.create_index([('city', ASCENDING)])
        self.properties.create_index([('price', ASCENDING)])
        self.properties.create_index([('propertyType', ASCENDING)])
        self.properties.create_index([('city', ASCENDING), ('price', ASCENDING)])

        self.agents.create_index([('email', ASCENDING)], unique=True)
        self.users.create_index([('email', ASCENDING)], unique=True)
        self.inquiries.create_index([('propertyId', ASCENDING)])

        print("Indexes created successfully")

    def seed_data(self):
        if self.properties.count_documents({}) > 0:
            print("Database already seeded")
            return

        sample_agents = [
            {
                "name": "John Smith",
                "email": "john.smith@realty.com",
                "phone": "+1-555-0101",
                "specialization": "Residential",
                "activeListings": 15,
                "createdAt": datetime.utcnow()
            },
            {
                "name": "Sarah Johnson",
                "email": "sarah.johnson@realty.com",
                "phone": "+1-555-0102",
                "specialization": "Commercial",
                "activeListings": 8,
                "createdAt": datetime.utcnow()
            },
            {
                "name": "Michael Brown",
                "email": "michael.brown@realty.com",
                "phone": "+1-555-0103",
                "specialization": "Luxury",
                "activeListings": 12,
                "createdAt": datetime.utcnow()
            }
        ]

        agent_result = self.agents.insert_many(sample_agents)
        agent_ids = agent_result.inserted_ids

        sample_properties = [
            {
                "title": "Modern Downtown Apartment",
                "description": "Stunning 2-bedroom apartment in the heart of downtown",
                "price": 450000,
                "propertyType": "Apartment",
                "bedrooms": 2,
                "bathrooms": 2,
                "size": 1200,
                "city": "New York",
                "address": "123 Main St, New York, NY 10001",
                "agentId": str(agent_ids[0]),
                "status": "Available",
                "createdAt": datetime.utcnow()
            },
            {
                "title": "Spacious Family Home",
                "description": "Beautiful 4-bedroom house with a large backyard",
                "price": 650000,
                "propertyType": "House",
                "bedrooms": 4,
                "bathrooms": 3,
                "size": 2500,
                "city": "Los Angeles",
                "address": "456 Oak Ave, Los Angeles, CA 90001",
                "agentId": str(agent_ids[1]),
                "status": "Available",
                "createdAt": datetime.utcnow()
            },
            {
                "title": "Luxury Penthouse Suite",
                "description": "Exclusive penthouse with panoramic city views",
                "price": 1200000,
                "propertyType": "Penthouse",
                "bedrooms": 3,
                "bathrooms": 3,
                "size": 3000,
                "city": "New York",
                "address": "789 Park Ave, New York, NY 10021",
                "agentId": str(agent_ids[2]),
                "status": "Available",
                "createdAt": datetime.utcnow()
            },
            {
                "title": "Cozy Studio Apartment",
                "description": "Perfect studio for young professionals",
                "price": 280000,
                "propertyType": "Apartment",
                "bedrooms": 1,
                "bathrooms": 1,
                "size": 650,
                "city": "Chicago",
                "address": "321 Lake St, Chicago, IL 60601",
                "agentId": str(agent_ids[0]),
                "status": "Available",
                "createdAt": datetime.utcnow()
            },
            {
                "title": "Commercial Office Space",
                "description": "Prime office location in business district",
                "price": 850000,
                "propertyType": "Commercial",
                "bedrooms": 0,
                "bathrooms": 2,
                "size": 4000,
                "city": "Los Angeles",
                "address": "555 Business Blvd, Los Angeles, CA 90017",
                "agentId": str(agent_ids[1]),
                "status": "Available",
                "createdAt": datetime.utcnow()
            }
        ]

        property_result = self.properties.insert_many(sample_properties)
        property_ids = property_result.inserted_ids

        sample_users = [
            {
                "name": "Alice Cooper",
                "email": "alice.cooper@email.com",
                "phone": "+1-555-0201",
                "createdAt": datetime.utcnow()
            },
            {
                "name": "Bob Wilson",
                "email": "bob.wilson@email.com",
                "phone": "+1-555-0202",
                "createdAt": datetime.utcnow()
            }
        ]

        user_result = self.users.insert_many(sample_users)
        user_ids = user_result.inserted_ids

        sample_inquiries = [
            {
                "propertyId": str(property_ids[0]),
                "userId": str(user_ids[0]),
                "agentId": str(agent_ids[0]),
                "message": "I'm interested in scheduling a viewing",
                "status": "Pending",
                "createdAt": datetime.utcnow()
            },
            {
                "propertyId": str(property_ids[1]),
                "userId": str(user_ids[1]),
                "agentId": str(agent_ids[1]),
                "message": "Can you provide more details about the property?",
                "status": "Responded",
                "createdAt": datetime.utcnow()
            }
        ]

        self.inquiries.insert_many(sample_inquiries)

        print("Database seeded successfully")

db_instance = Database()
