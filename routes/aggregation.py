from flask import Blueprint, jsonify
from database import db_instance

aggregation_bp = Blueprint('aggregation', __name__)

@aggregation_bp.route('/average-price-by-city', methods=['GET'])
def average_price_by_city():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$city",
                    "averagePrice": {"$avg": "$price"},
                    "propertyCount": {"$sum": 1},
                    "minPrice": {"$min": "$price"},
                    "maxPrice": {"$max": "$price"}
                }
            },
            {
                "$sort": {"averagePrice": -1}
            },
            {
                "$project": {
                    "_id": 0,
                    "city": "$_id",
                    "averagePrice": {"$round": ["$averagePrice", 2]},
                    "propertyCount": 1,
                    "minPrice": 1,
                    "maxPrice": 1
                }
            }
        ]

        result = list(db_instance.properties.aggregate(pipeline))

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@aggregation_bp.route('/most-active-agents', methods=['GET'])
def most_active_agents():
    try:
        pipeline = [
            {
                "$sort": {"activeListings": -1}
            },
            {
                "$limit": 10
            },
            {
                "$project": {
                    "_id": {"$toString": "$_id"},
                    "name": 1,
                    "email": 1,
                    "specialization": 1,
                    "activeListings": 1,
                    "phone": 1
                }
            }
        ]

        result = list(db_instance.agents.aggregate(pipeline))

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@aggregation_bp.route('/properties-by-type', methods=['GET'])
def properties_by_type():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$propertyType",
                    "count": {"$sum": 1},
                    "averagePrice": {"$avg": "$price"},
                    "totalValue": {"$sum": "$price"}
                }
            },
            {
                "$sort": {"count": -1}
            },
            {
                "$project": {
                    "_id": 0,
                    "propertyType": "$_id",
                    "count": 1,
                    "averagePrice": {"$round": ["$averagePrice", 2]},
                    "totalValue": 1
                }
            }
        ]

        result = list(db_instance.properties.aggregate(pipeline))

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@aggregation_bp.route('/inquiry-statistics', methods=['GET'])
def inquiry_statistics():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "status": "$_id",
                    "count": 1
                }
            }
        ]

        result = list(db_instance.inquiries.aggregate(pipeline))

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@aggregation_bp.route('/price-range-distribution', methods=['GET'])
def price_range_distribution():
    try:
        pipeline = [
            {
                "$bucket": {
                    "groupBy": "$price",
                    "boundaries": [0, 300000, 500000, 700000, 1000000, 10000000],
                    "default": "Other",
                    "output": {
                        "count": {"$sum": 1},
                        "properties": {"$push": "$title"}
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "priceRange": {
                        "$switch": {
                            "branches": [
                                {"case": {"$eq": ["$_id", 0]}, "then": "$0 - $300,000"},
                                {"case": {"$eq": ["$_id", 300000]}, "then": "$300,000 - $500,000"},
                                {"case": {"$eq": ["$_id", 500000]}, "then": "$500,000 - $700,000"},
                                {"case": {"$eq": ["$_id", 700000]}, "then": "$700,000 - $1,000,000"},
                                {"case": {"$eq": ["$_id", 1000000]}, "then": "$1,000,000+"}
                            ],
                            "default": "Other"
                        }
                    },
                    "count": 1
                }
            }
        ]

        result = list(db_instance.properties.aggregate(pipeline))

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
