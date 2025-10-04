from flask import Flask, jsonify, request
from database import Database
from routes.properties import properties_bp
from routes.agents import agents_bp
from routes.users import users_bp
from routes.inquiries import inquiries_bp
from routes.aggregation import aggregation_bp

app = Flask(__name__)
db = Database()

app.register_blueprint(properties_bp, url_prefix='/api/properties')
app.register_blueprint(agents_bp, url_prefix='/api/agents')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(inquiries_bp, url_prefix='/api/inquiries')
app.register_blueprint(aggregation_bp, url_prefix='/api/aggregation')

@app.route('/')
def home():
    return jsonify({
        "message": "Real Estate Listing Platform API",
        "endpoints": {
            "properties": "/api/properties",
            "agents": "/api/agents",
            "users": "/api/users",
            "inquiries": "/api/inquiries",
            "aggregation": "/api/aggregation"
        }
    })

@app.route('/api/init-db', methods=['POST'])
def init_database():
    try:
        db.create_indexes()
        db.seed_data()
        return jsonify({"message": "Database initialized successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
