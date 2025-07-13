import os
from flask import Flask, request, jsonify # Corrected import statement
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash # Keep for password hashing
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity
from flask_bcrypt import Bcrypt

app = Flask(__name__)

# --- CORS Configuration (for future frontend connection) ---
CORS(app, resources={r"/*": {"origins": "*"}})

# --- Database Configuration ---
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'agroai.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["JWT_SECRET_KEY"] = "super-secret-agroai-key"
jwt = JWTManager(app)

db = SQLAlchemy(app) # Initialize the SQLAlchemy database object

bcrypt = Bcrypt(app)
# Keep CORS(app) here too, if you want default behavior for all routes outside the specific resource configs.
# If you used 'resources' in the first CORS call, you might not need this second one.

# --- User Model Definition ---
# This defines the structure of our 'users' table in the database
# Make sure your Prediction model is also imported/defined here if you have one,
# so db.create_all() knows about it.
# e.g., from models import User, Prediction if your models are in a separate models.py
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def set_password(self, password):
        # Ensure you use bcrypt.generate_password_hash here if you use Flask-Bcrypt
        # If you're using werkzeug.security, then generate_password_hash is fine.
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


# --- IMPORTANT: NEW/MOVED db.create_all() block for Render deployment ---
# This block will run once when your Flask application starts up on Render (via Gunicorn).
# It attempts to create database tables if they don't already exist.
with app.app_context():
    try:
        db.create_all()
        print("Database tables created/checked successfully on startup.")
    except Exception as e:
        print(f"Error creating/checking database tables on startup: {e}")
        # This error might indicate a problem with DB connection or existing tables.
        # For a new database, it should succeed.
# --- END IMPORTANT BLOCK ---


# --- Basic Flask Routes ---
@app.route('/')
def hello_world():
    return 'Hello from AgroAI Backend!'

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User with this email already exist"}), 409

    new_user = User(email=email)
    new_user.set_password(password) # Use the set_password method
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)

    if not email or not password:
        return jsonify({"message": "Email and Password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.email)
    return jsonify(access_token=access_token), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_email = get_jwt_identity()
    return jsonify(logged_in_as=current_user_email, message="You have access to protected data"), 200

@app.route('/users')
def list_users():
    users = User.query.all()
    user_list = [{"id": user.id, "email": user.email} for user in users]
    return jsonify(user_list) # Use jsonify for returning lists/dicts

if __name__ == '__main__':
    # This block is for local development only.
    # On Render, the app is run by Gunicorn, which skips this block.
    # db.create_all() is now handled by the block above for Render.
    app.run(debug=True)