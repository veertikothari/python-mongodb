from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from database import db_instance

agents_bp = Blueprint('agents', __name__)

def serialize_agent(agent):
    if agent:
        agent['_id'] = str(agent['_id'])
        if 'createdAt' in agent:
            agent['createdAt'] = agent['createdAt'].isoformat()
    return agent

@agents_bp.route('/', methods=['GET'])
def get_agents():
    try:
        specialization = request.args.get('specialization')

        query = {}
        if specialization:
            query['specialization'] = specialization

        agents = list(db_instance.agents.find(query))

        for agent in agents:
            serialize_agent(agent)

        return jsonify(agents), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@agents_bp.route('/<agent_id>', methods=['GET'])
def get_agent(agent_id):
    try:
        agent = db_instance.agents.find_one({"_id": ObjectId(agent_id)})
        if not agent:
            return jsonify({"error": "Agent not found"}), 404

        return jsonify(serialize_agent(agent)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@agents_bp.route('/', methods=['POST'])
def create_agent():
    try:
        data = request.json
        data['createdAt'] = datetime.utcnow()
        data['activeListings'] = data.get('activeListings', 0)

        result = db_instance.agents.insert_one(data)

        new_agent = db_instance.agents.find_one({"_id": result.inserted_id})

        return jsonify(serialize_agent(new_agent)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@agents_bp.route('/<agent_id>', methods=['PUT'])
def update_agent(agent_id):
    try:
        data = request.json
        data.pop('_id', None)
        data.pop('createdAt', None)

        result = db_instance.agents.update_one(
            {"_id": ObjectId(agent_id)},
            {"$set": data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Agent not found"}), 404

        updated_agent = db_instance.agents.find_one({"_id": ObjectId(agent_id)})

        return jsonify(serialize_agent(updated_agent)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@agents_bp.route('/<agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    try:
        result = db_instance.agents.delete_one({"_id": ObjectId(agent_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Agent not found"}), 404

        return jsonify({"message": "Agent deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
