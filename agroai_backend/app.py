# app.py (or main.py)
from flask import Flask, request, jsonify # Corrected import statement
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os # To help with path for database file
from flask_cors import CORS # This will be used in a later step (Step 3/4)
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity
app = Flask(__name__)

# --- CORS Configuration (for future frontend connection) ---
# Allow requests from your React frontend (e.g., http://localhost:3000)
# In production, replace '*' with your actual frontend domain(s) for security
CORS(app, resources={r"/*": {"origins": "*"}}) # Allow all origins for development ease initially

# --- Database Configuration ---
# Get the absolute path to the directory where app.py (or main.py) is located
basedir = os.path.abspath(os.path.dirname(__file__))
# Configure the SQLite database URI
# The database file will be named 'agroai.db' and will be in the same directory as this script
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'agroai.db')
# Suppress a warning that will be shown in the console (recommended setting)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["JWT_SECRET_KEY"] = "super-secret-agroai-key"
jwt = JWTManager(app)

# Initialize the SQLAlchemy database object
db = SQLAlchemy(app)

# --- User Model Definition ---
# This defines the structure of our 'users' table in the database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False) # Stores the hashed password

    def __repr__(self):
        # Provides a readable representation of a User object, useful for debugging
        return f'<User {self.email}>'

    # Method to hash the password before storing it
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Method to check a provided password against the stored hash
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# --- Basic Flask Routes (for initial testing) ---
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
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password',None)

    if not email or not password:
        return jsonify({"message": "Email and Password are required"}), 400
    
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=user.email)
    return jsonify(access_token=access_token),200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_email = get_jwt_identity()
    return jsonify(logged_in_as=current_user_email, message="You have access to protected data"), 200

# Optional: A temporary route to list all users (will be empty initially)
@app.route('/users')
def list_users():
    # This route will work fully after we add register/login logic
    users = User.query.all()
    user_list = [{"id": user.id, "email": user.email} for user in users]
    # Flask will automatically convert this list of dicts to JSON when we add jsonify import
    return user_list


if __name__ == '__main__':
    # This block is crucial for creating the database file and tables.
    # It runs only when you execute app.py (or main.py) directly.
    with app.app_context():
        db.create_all() # This command creates all tables defined by db.Model (like 'User')
    app.run(debug=True)