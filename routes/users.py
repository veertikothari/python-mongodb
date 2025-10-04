from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from database import db_instance

users_bp = Blueprint('users', __name__)

def serialize_user(user):
    if user:
        user['_id'] = str(user['_id'])
        if 'createdAt' in user:
            user['createdAt'] = user['createdAt'].isoformat()
    return user

@users_bp.route('/', methods=['GET'])
def get_users():
    try:
        users = list(db_instance.users.find())

        for user in users:
            serialize_user(user)

        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = db_instance.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(serialize_user(user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@users_bp.route('/', methods=['POST'])
def create_user():
    try:
        data = request.json
        data['createdAt'] = datetime.utcnow()

        result = db_instance.users.insert_one(data)

        new_user = db_instance.users.find_one({"_id": result.inserted_id})

        return jsonify(serialize_user(new_user)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@users_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.json
        data.pop('_id', None)
        data.pop('createdAt', None)

        result = db_instance.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        updated_user = db_instance.users.find_one({"_id": ObjectId(user_id)})

        return jsonify(serialize_user(updated_user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@users_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        result = db_instance.users.delete_one({"_id": ObjectId(user_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
