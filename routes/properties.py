from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from database import db_instance

properties_bp = Blueprint('properties', __name__)

def serialize_property(prop):
    if prop:
        prop['_id'] = str(prop['_id'])
        if 'createdAt' in prop:
            prop['createdAt'] = prop['createdAt'].isoformat()
    return prop

@properties_bp.route('/', methods=['GET'])
def get_properties():
    try:
        sort_by = request.args.get('sortBy', 'createdAt')
        order = request.args.get('order', 'desc')
        city = request.args.get('city')
        property_type = request.args.get('propertyType')
        min_price = request.args.get('minPrice', type=int)
        max_price = request.args.get('maxPrice', type=int)

        query = {}
        if city:
            query['city'] = city
        if property_type:
            query['propertyType'] = property_type
        if min_price is not None or max_price is not None:
            query['price'] = {}
            if min_price is not None:
                query['price']['$gte'] = min_price
            if max_price is not None:
                query['price']['$lte'] = max_price

        sort_order = -1 if order == 'desc' else 1

        properties = list(db_instance.properties.find(query).sort(sort_by, sort_order))

        for prop in properties:
            serialize_property(prop)

        return jsonify(properties), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@properties_bp.route('/<property_id>', methods=['GET'])
def get_property(property_id):
    try:
        prop = db_instance.properties.find_one({"_id": ObjectId(property_id)})
        if not prop:
            return jsonify({"error": "Property not found"}), 404

        return jsonify(serialize_property(prop)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@properties_bp.route('/', methods=['POST'])
def create_property():
    try:
        data = request.json
        data['createdAt'] = datetime.utcnow()
        data['status'] = data.get('status', 'Available')

        result = db_instance.properties.insert_one(data)

        new_property = db_instance.properties.find_one({"_id": result.inserted_id})

        return jsonify(serialize_property(new_property)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@properties_bp.route('/<property_id>', methods=['PUT'])
def update_property(property_id):
    try:
        data = request.json
        data.pop('_id', None)
        data.pop('createdAt', None)

        result = db_instance.properties.update_one(
            {"_id": ObjectId(property_id)},
            {"$set": data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Property not found"}), 404

        updated_property = db_instance.properties.find_one({"_id": ObjectId(property_id)})

        return jsonify(serialize_property(updated_property)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@properties_bp.route('/<property_id>', methods=['DELETE'])
def delete_property(property_id):
    try:
        result = db_instance.properties.delete_one({"_id": ObjectId(property_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Property not found"}), 404

        return jsonify({"message": "Property deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
