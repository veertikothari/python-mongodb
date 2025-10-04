from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from database import db_instance

inquiries_bp = Blueprint('inquiries', __name__)

def serialize_inquiry(inquiry):
    if inquiry:
        inquiry['_id'] = str(inquiry['_id'])
        if 'createdAt' in inquiry:
            inquiry['createdAt'] = inquiry['createdAt'].isoformat()
    return inquiry

@inquiries_bp.route('/', methods=['GET'])
def get_inquiries():
    try:
        property_id = request.args.get('propertyId')
        user_id = request.args.get('userId')
        agent_id = request.args.get('agentId')
        status = request.args.get('status')

        query = {}
        if property_id:
            query['propertyId'] = property_id
        if user_id:
            query['userId'] = user_id
        if agent_id:
            query['agentId'] = agent_id
        if status:
            query['status'] = status

        inquiries = list(db_instance.inquiries.find(query))

        for inquiry in inquiries:
            serialize_inquiry(inquiry)

        return jsonify(inquiries), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inquiries_bp.route('/<inquiry_id>', methods=['GET'])
def get_inquiry(inquiry_id):
    try:
        inquiry = db_instance.inquiries.find_one({"_id": ObjectId(inquiry_id)})
        if not inquiry:
            return jsonify({"error": "Inquiry not found"}), 404

        return jsonify(serialize_inquiry(inquiry)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@inquiries_bp.route('/', methods=['POST'])
def create_inquiry():
    try:
        data = request.json
        data['createdAt'] = datetime.utcnow()
        data['status'] = data.get('status', 'Pending')

        result = db_instance.inquiries.insert_one(data)

        new_inquiry = db_instance.inquiries.find_one({"_id": result.inserted_id})

        return jsonify(serialize_inquiry(new_inquiry)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@inquiries_bp.route('/<inquiry_id>', methods=['PUT'])
def update_inquiry(inquiry_id):
    try:
        data = request.json
        data.pop('_id', None)
        data.pop('createdAt', None)

        result = db_instance.inquiries.update_one(
            {"_id": ObjectId(inquiry_id)},
            {"$set": data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Inquiry not found"}), 404

        updated_inquiry = db_instance.inquiries.find_one({"_id": ObjectId(inquiry_id)})

        return jsonify(serialize_inquiry(updated_inquiry)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@inquiries_bp.route('/<inquiry_id>', methods=['DELETE'])
def delete_inquiry(inquiry_id):
    try:
        result = db_instance.inquiries.delete_one({"_id": ObjectId(inquiry_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Inquiry not found"}), 404

        return jsonify({"message": "Inquiry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
