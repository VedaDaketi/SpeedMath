from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, date
import jwt
import os
from functools import wraps
from enum import Enum

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'q1w2e3r4t5y6u7i8o9p0')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:357951@localhost/speedmath')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Role enumeration
class UserRole(Enum):
    LEARNER = "learner"
    ADMIN = "admin"

ADMIN_USERNAMES = ['akshay', 'pranav', 'veda']  

# User Model with Roles
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    grade_qualification = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.LEARNER)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)

    # Gamification Fields
    total_xp = db.Column(db.Integer, default=0)
    current_level = db.Column(db.Integer, default=1)
    daily_streak = db.Column(db.Integer, default=0)
    longest_streak = db.Column(db.Integer, default=0)
    last_activity_date = db.Column(db.Date)
    points_today = db.Column(db.Integer, default=0)
    total_lessons_completed = db.Column(db.Integer, default=0)
    total_exercises_completed = db.Column(db.Integer, default=0)

    # Relationships
    progress = db.relationship('UserProgress', backref='user', lazy=True)
    achievements = db.relationship('UserAchievement', backref='user', lazy=True)
    quiz_attempts = db.relationship('QuizAttempt', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == UserRole.ADMIN

    def is_learner(self):
        return self.role == UserRole.LEARNER

    def get_id(self):
        return str(self.id)
    
    def generate_token(self):
        payload = {
            'user_id': self.id,
            'username': self.username,
            'role': self.role.value,
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'date_of_birth': self.date_of_birth.isoformat(),
            'grade_qualification': self.grade_qualification,
            'role': self.role.value,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active
        }
    
class DifficultyLevel(Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class ContentType(Enum):
    INTRODUCTION = "introduction"
    TECHNIQUE = "technique"
    EXAMPLE = "example"
    PRACTICE = "practice"
    SUMMARY = "summary"

# Models
class Unit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    order_index = db.Column(db.Integer, nullable=False)
    icon = db.Column(db.String(100))
    color_theme = db.Column(db.String(20))
    estimated_duration = db.Column(db.Integer)
    difficulty = db.Column(db.Enum(DifficultyLevel), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    lessons = db.relationship('Lesson', backref='unit', lazy=True, passive_deletes=True, order_by='Lesson.order_index')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty.value if self.difficulty else None,
            'order_index': self.order_index,
            'color_theme': self.color_theme,
            'estimated_duration': self.estimated_duration,
            'lessons_count': len(self.lessons) if self.lessons else 0
        }

class VedicSutra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    sanskrit_name = db.Column(db.String(100))
    english_translation = db.Column(db.String(200))
    description = db.Column(db.Text)
    applications = db.Column(db.Text)
    order_index = db.Column(db.Integer, nullable=False)
    lessons = db.relationship('LessonSutra', backref='sutra', lazy=True)

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id' , ondelete='SET NULL'), nullable=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    content_json = db.Column(db.JSON, nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    order_index = db.Column(db.Integer, nullable=False)
    xp_reward = db.Column(db.Integer, default=50)
    estimated_time = db.Column(db.Integer)
    learning_objectives = db.Column(db.JSON)
    prerequisites = db.Column(db.JSON)
    vedic_sutras = db.Column(db.JSON)
    thumbnail_image = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_published = db.Column(db.Boolean, default=True)
    exercises = db.relationship('Exercise', backref='lesson', lazy=True , passive_deletes=True)
    sutras = db.relationship('LessonSutra', backref='lesson', lazy=True , passive_deletes=True)
    quizzes = db.relationship('Quiz', backref='lesson', lazy=True , passive_deletes=True)
    progress = db.relationship('UserProgress', backref='lesson', lazy=True, passive_deletes=True)
    def to_dict(self):
        return {
            'id': self.id,
            'unit_id': self.unit_id,
            'title': self.title,
            'description': self.description,
            'content_json': self.content_json,
            'difficulty': self.difficulty,
            'order': self.order_index,
            'xp_reward': self.xp_reward,
            'estimated_time': self.estimated_time,
            'learning_objectives': self.learning_objectives,
            'prerequisites': self.prerequisites,
            'vedic_sutras': self.vedic_sutras,
            'thumbnail_image': self.thumbnail_image,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_published': self.is_published,
            'exercises': [e.to_dict() for e in self.exercises]
        }

class LessonSutra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id', ondelete='SET NULL'), nullable=True)

    sutra_id = db.Column(db.Integer, db.ForeignKey('vedic_sutra.id'), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)

class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id', ondelete='SET NULL'), nullable=True)

    question = db.Column(db.Text, nullable=False)
    correct_answer = db.Column(db.String(100), nullable=False)
    explanation = db.Column(db.Text)
    difficulty = db.Column(db.Enum(DifficultyLevel), nullable=False)
    xp_reward = db.Column(db.Integer, default=10)
    question_type = db.Column(db.String(50), default='calculation')
    options = db.Column(db.Text)
    hints = db.Column(db.Text)
    step_by_step_solution = db.Column(db.Text)
    time_limit = db.Column(db.Integer)
    tags = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'correct_answer': self.correct_answer,
            'explanation': self.explanation,
            'difficulty': self.difficulty.value if self.difficulty else None,
            'xp_reward': self.xp_reward,
            'question_type': self.question_type,
            'options': self.options,
            'hints': self.hints,
            'step_by_step_solution': self.step_by_step_solution,
            'time_limit': self.time_limit,
            'tags': self.tags,
            'created_at': self.created_at.isoformat(),
        }    


class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id', ondelete='SET NULL'), nullable=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    time_limit = db.Column(db.Integer, nullable=False)
    max_attempts = db.Column(db.Integer, default=3)
    passing_score = db.Column(db.Integer, default=70)
    xp_reward = db.Column(db.Integer, default=100)
    questions = db.relationship('QuizQuestion', backref='quiz', lazy=True)
    attempts = db.relationship('QuizAttempt', backref='quiz', lazy=True)

class QuizQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), default='multiple_choice')
    options = db.Column(db.Text)
    correct_answer = db.Column(db.String(100), nullable=False)
    explanation = db.Column(db.Text)
    points = db.Column(db.Integer, default=10)
    order_index = db.Column(db.Integer, nullable=False)

class QuizAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    time_taken = db.Column(db.Integer, nullable=False)
    answers = db.Column(db.Text)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    is_passed = db.Column(db.Boolean, default=False)

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id', ondelete='SET NULL'), nullable=True)

    completed = db.Column(db.Boolean, default=False)
    completion_date = db.Column(db.DateTime)
    score = db.Column(db.Integer)
    time_spent = db.Column(db.Integer)
    attempts = db.Column(db.Integer, default=1)
    content_sections_viewed = db.Column(db.Text)
    exercises_completed = db.Column(db.Integer, default=0)
    exercises_correct = db.Column(db.Integer, default=0)
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow)

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(50))
    badge_image = db.Column(db.String(255))
    xp_reward = db.Column(db.Integer, default=100)
    criteria = db.Column(db.Text)
    category = db.Column(db.String(50))
    rarity = db.Column(db.String(20), default='common')
    is_hidden = db.Column(db.Boolean, default=False)

class UserAchievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey('achievement.id'), nullable=False)
    earned_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_new = db.Column(db.Boolean, default=True)

class Leaderboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    period = db.Column(db.String(20), nullable=False)
    xp_earned = db.Column(db.Integer, nullable=False)
    lessons_completed = db.Column(db.Integer, default=0)
    streak_count = db.Column(db.Integer, default=0)
    rank = db.Column(db.Integer)
    period_start = db.Column(db.Date, nullable=False)
    period_end = db.Column(db.Date, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class DailyChallenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    challenge_date = db.Column(db.Date, nullable=False, unique=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    question = db.Column(db.Text, nullable=False)
    correct_answer = db.Column(db.String(100), nullable=False)
    explanation = db.Column(db.Text)
    difficulty = db.Column(db.Enum(DifficultyLevel), nullable=False)
    xp_reward = db.Column(db.Integer, default=50)
    time_limit = db.Column(db.Integer, default=300)
    attempts = db.relationship('ChallengeAttempt', backref='challenge', lazy=True)

class ChallengeAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey('daily_challenge.id'), nullable=False)
    user_answer = db.Column(db.String(100))
    is_correct = db.Column(db.Boolean, default=False)
    time_taken = db.Column(db.Integer)
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)


# Token validation decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user or not current_user.is_active:
                return jsonify({'error': 'Invalid token'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Admin only decorator
def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validation
        required_fields = ['username', 'password', 'date_of_birth', 'grade_qualification']
        for field in required_fields:
            if not data or not data.get(field):
                return jsonify({'error': f'{field.replace("_", " ").title()} is required'}), 400
        
        username = data.get('username').strip()
        password = data.get('password')
        email = data.get('email', '').strip() if data.get('email') else None
        date_of_birth_str = data.get('date_of_birth')
        grade_qualification = data.get('grade_qualification').strip()
        
        # Check password strength
        if len(password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        
        # Validate and parse date of birth
        try:
            date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d').date()
            # Check if user is at least 5 years old (reasonable minimum for math learning)
            min_age_date = date.today() - timedelta(days=5*365)
            if date_of_birth > min_age_date:
                return jsonify({'error': 'User must be at least 5 years old'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409
        
        if email and User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 409
        
        # Determine role based on username
        role = UserRole.ADMIN if username.lower() in [admin.lower() for admin in ADMIN_USERNAMES] else UserRole.LEARNER
        
        # Create new user
        user = User(
            username=username, 
            email=email, 
            date_of_birth=date_of_birth,
            grade_qualification=grade_qualification,
            role=role
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'date_of_birth': user.date_of_birth.isoformat(),
                'grade_qualification': user.grade_qualification,
                'role': user.role.value
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        username = data.get('username').strip()
        password = data.get('password')
        
        # Find user
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate token
        token = user.generate_token()
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role.value
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'date_of_birth': current_user.date_of_birth.isoformat(),
            'grade_qualification': current_user.grade_qualification,
            'role': current_user.role.value,
            'created_at': current_user.created_at.isoformat(),
            'last_login': current_user.last_login.isoformat() if current_user.last_login else None
        }
    })

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    """Admin only: Get all users"""
    users = User.query.all()
    return jsonify({
        'users': [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_of_birth': user.date_of_birth.isoformat(),
            'grade_qualification': user.grade_qualification,
            'role': user.role.value,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat(),
            'last_login': user.last_login.isoformat() if user.last_login else None
        } for user in users]
    })

@app.route('/api/admin/users/<int:user_id>/toggle-status', methods=['POST'])
@admin_required
def toggle_user_status(current_user, user_id):
    """Admin only: Activate/Deactivate a user"""
    user = User.query.get_or_404(user_id)
    
    # Prevent admin from deactivating themselves
    if user.id == current_user.id:
        return jsonify({'error': 'Cannot deactivate your own account'}), 400
    
    user.is_active = not user.is_active
    db.session.commit()
    
    return jsonify({
        'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'is_active': user.is_active
        }
    })

@app.route('/api/admin/users/<int:user_id>/change-role', methods=['POST'])
@admin_required
def change_user_role(current_user, user_id):
    """Admin only: Change user role"""
    data = request.get_json()
    new_role = data.get('role')
    
    if new_role not in [role.value for role in UserRole]:
        return jsonify({'error': 'Invalid role'}), 400
    
    user = User.query.get_or_404(user_id)
    
    # Prevent admin from changing their own role
    if user.id == current_user.id:
        return jsonify({'error': 'Cannot change your own role'}), 400
    
    user.role = UserRole(new_role)
    db.session.commit()
    
    return jsonify({
        'message': 'User role updated successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role.value
        }
    })

@app.route('/api/logout', methods=['POST'])
@token_required
def logout(current_user):
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/api/admin/lessons', methods=['GET', 'POST'])
@admin_required
def handle_lessons(current_user):
    if request.method == 'GET':
        lessons = Lesson.query.all()
        return jsonify({'lessons': [lesson.to_dict() for lesson in lessons]})

    elif request.method == 'POST':
        data = request.get_json()
        try:
            new_lesson = Lesson(
                unit_id=data.get('unit_id'),
                title=data['title'],
                description=data.get('description'),
                content_json=data['content_json'],
                difficulty=data['difficulty'],
                order_index=data['order_index'],
                xp_reward=data.get('xp_reward', 50),
                learning_objectives=data.get('learning_objectives', []),
                vedic_sutras=data.get('vedic_sutras', [])
            )
            db.session.add(new_lesson)
            db.session.commit()
            return jsonify({'message': 'Lesson created successfully', 'lesson': new_lesson.to_dict()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
@app.route('/api/admin/lessons/<int:lesson_id>', methods=['PUT', 'DELETE'])
@admin_required
def update_delete_lesson(current_user, lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)

    if request.method == 'PUT':
        data = request.get_json()
        try:
            lesson.title = data['title']
            lesson.unit_id = data.get('unit_id')
            lesson.description = data.get('description')
            lesson.content_json = data['content_json']
            lesson.difficulty = data['difficulty']
            lesson.order_index = data['order_index']
            lesson.xp_reward = data.get('xp_reward', 50)
            lesson.learning_objectives = data.get('learning_objectives', [])
            lesson.vedic_sutras = data.get('vedic_sutras', [])
            db.session.commit()
            return jsonify({'message': 'Lesson updated successfully', 'lesson': lesson.to_dict()})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    elif request.method == 'DELETE':
        try:
            db.session.delete(lesson)
            db.session.commit()
            return jsonify({'message': 'Lesson deleted successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

@app.route('/api/admin/quizzes', methods=['GET' , 'POST'])
@admin_required
def handle_quizzes(current_user):
    if request.method == 'GET':
        quizzes = Quiz.query.all()
        return jsonify({
            'quizzes': [{
                'id': quiz.id,
                'title': quiz.title,
                'description': quiz.description,
                'time_limit': quiz.time_limit,
                'max_attempts': quiz.max_attempts,
                'passing_score': quiz.passing_score,
                'xp_reward': quiz.xp_reward,
                'lesson_id': quiz.lesson_id
            } for quiz in quizzes]
        })
    try:
        data = request.get_json()
        quiz = Quiz(
            lesson_id=data.get("lesson_id"),
            title=data["title"],
            description=data.get("description"),
            time_limit=data["time_limit"],
            max_attempts=data.get("max_attempts", 3),
            passing_score=data.get("passing_score", 70),
            xp_reward=data.get("xp_reward", 100)
        )
        db.session.add(quiz)
        db.session.commit()
        return jsonify({"message": "Quiz created successfully", "quiz_id": quiz.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/quizzes/<int:quiz_id>', methods=['PUT', 'DELETE'])
@admin_required
def update_delete_quiz(current_user, quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)

    if request.method == 'PUT':
        try:
            data = request.get_json()
            quiz.title = data.get("title", quiz.title)
            quiz.description = data.get("description", quiz.description)
            quiz.time_limit = data.get("time_limit", quiz.time_limit)
            quiz.max_attempts = data.get("max_attempts", quiz.max_attempts)
            quiz.passing_score = data.get("passing_score", quiz.passing_score)
            quiz.xp_reward = data.get("xp_reward", quiz.xp_reward)
            quiz.lesson_id = data.get("lesson_id", quiz.lesson_id)
            db.session.commit()
            return jsonify({'message': 'Quiz updated successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    elif request.method == 'DELETE':
        try:
            db.session.delete(quiz)
            db.session.commit()
            return jsonify({'message': 'Quiz deleted successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
 

@app.route('/api/admin/questions', methods=['GET'])
@admin_required
def get_all_questions(current_user):
    questions = QuizQuestion.query.all()
    return jsonify({
        "questions": [{
            "id": q.id,
            "quiz_id": q.quiz_id,
            "quiz_title": q.quiz.title if q.quiz else None,
            "question": q.question,
            "question_type": q.question_type,
            "options": q.options,
            "correct_answer": q.correct_answer,
            "explanation": q.explanation,
            "points": q.points,
            "order_index": q.order_index
        } for q in questions]
    })

@app.route('/api/admin/quiz-questions', methods=['POST'])
@admin_required
def create_question(current_user):
    try:
        data = request.get_json()
        question = QuizQuestion(
            quiz_id=data.get('quiz_id'),
            question=data.get('question'),
            question_type=data.get('question_type'),
            correct_answer=data.get('correct_answer'),
            explanation=data.get('explanation'),
            options="\n".join(data.get('options', [])),
            points=data.get('points', 10),
            order_index=data.get('order_index', 1)
        )
        db.session.add(question)
        db.session.commit()
        return jsonify({"message": "Question created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/quiz-questions/<int:question_id>', methods=['PUT'])
@admin_required
def update_question(current_user, question_id):
    try:
        question = QuizQuestion.query.get_or_404(question_id)
        data = request.get_json()
        question.question = data.get('question', question.question)
        question.question_type = data.get('question_type', question.question_type)
        question.correct_answer = data.get('correct_answer', question.correct_answer)
        question.explanation = data.get('explanation', question.explanation)
        question.options = "\n".join(data.get('options', question.options.split('\n')))
        question.points = data.get('points', question.points)
        question.order_index = data.get('order_index', question.order_index)
        db.session.commit()
        return jsonify({"message": "Question updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/quiz-questions/<int:question_id>', methods=['DELETE'])
@admin_required
def delete_question(current_user, question_id):
    try:
        question = QuizQuestion.query.get_or_404(question_id)
        db.session.delete(question)
        db.session.commit()
        return jsonify({"message": "Question deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/units', methods=['GET', 'POST'])
@admin_required
def handle_units(current_user):
    if request.method == 'GET':
        units = Unit.query.all()
        return jsonify({'units': [unit.to_dict() for unit in units]})

    data = request.get_json()
    unit = Unit(
        title=data['title'],
        description=data.get('description'),
        difficulty=DifficultyLevel(data['difficulty'].lower()),
        order_index=data['order_index'],
        color_theme=data.get('color_theme'),
        estimated_duration=data.get('estimated_duration', 60)
    )
    db.session.add(unit)
    db.session.commit()
    return jsonify({'message': 'Unit created successfully', 'unit': unit.to_dict()}), 201

@app.route('/api/admin/users/<int:user_id>/profile', methods=['GET'])
@admin_required
def view_user_profile(current_user, user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_of_birth': user.date_of_birth.isoformat(),
            'grade_qualification': user.grade_qualification,
            'role': user.role.value,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat(),
            'last_login': user.last_login.isoformat() if user.last_login else None,
            'total_xp': user.total_xp,
            'current_level': user.current_level,
            'daily_streak': user.daily_streak,
            'longest_streak': user.longest_streak,
            'total_lessons_completed': user.total_lessons_completed,
            'total_exercises_completed': user.total_exercises_completed,
        }
    })

@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def get_admin_stats(current_user):
    total_users = User.query.count()
    total_lessons = Lesson.query.count()
    total_questions = Exercise.query.count()
    total_quizzes = Quiz.query.count()

    today = date.today()
    active_today = User.query.filter(User.last_login >= datetime(today.year, today.month, today.day)).count()

    return jsonify({
        'totalUsers': total_users,
        'totalLessons': total_lessons,
        'totalQuestions': total_questions,
        'totalQuizzes': total_quizzes,
        'activeUsersToday': active_today
    })

@app.route('/api/admin/units/<int:unit_id>', methods=['PUT'])
@admin_required
def update_unit(current_user, unit_id):
    unit = Unit.query.get_or_404(unit_id)
    data = request.get_json()

    unit.title = data.get('title', unit.title)
    unit.description = data.get('description', unit.description)
    unit.order_index = data.get('order_index', unit.order_index)
    unit.difficulty = DifficultyLevel[data['difficulty'].upper()] if data.get('difficulty') else unit.difficulty
    unit.color_theme = data.get('color_theme', unit.color_theme)
    unit.estimated_duration = data.get('estimated_duration', unit.estimated_duration)

    db.session.commit()
    return jsonify({'message': 'Unit updated successfully', 'unit': unit.to_dict()})
@app.route('/api/admin/units/<int:unit_id>', methods=['DELETE'])
@admin_required
def delete_unit(current_user, unit_id):
    unit = Unit.query.get_or_404(unit_id)
    db.session.delete(unit)
    db.session.commit()
    return jsonify({'message': 'Unit deleted successfully'})
@app.route('/api/admin/units/<int:unit_id>/lessons', methods=['GET'])
@admin_required
def get_unit_lessons(current_user, unit_id):
    unit = Unit.query.get_or_404(unit_id)
    lessons = Lesson.query.filter_by(unit_id=unit.id).all()
    return jsonify({'lessons': [l.to_dict() for l in lessons]})

@app.route('/api/admin/units/<int:unit_id>/lessons/<int:lesson_id>/unlink', methods=['POST'])
@admin_required
def unlink_lesson_from_unit(current_user, unit_id, lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    if lesson.unit_id != unit_id:
        return jsonify({'error': 'Lesson not linked to this unit'}), 400

    lesson.unit_id = None
    db.session.commit()
    return jsonify({'message': 'Lesson unlinked from unit'})

@app.route('/api/user/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    user_data = {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "level": current_user.current_level,
        "xp": current_user.total_xp,
        "xpToNextLevel": 1000,  # Placeholder logic
        "streak": current_user.daily_streak,
        "avatar": None,  # Add field if needed
        "achievements": [
            {
                "id": a.id,
                "name": a.achievement.name,
                "description": a.achievement.description,
                "date": a.earned_date.isoformat()
            }
            for a in current_user.achievements
        ],
        "totalLessonsCompleted": current_user.total_lessons_completed,
        "totalChallengesCompleted": QuizAttempt.query.filter_by(user_id=current_user.id, is_passed=True).count(),
    }
    return jsonify(user_data)

@app.route('/api/user/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    progress = UserProgress.query.filter_by(user_id=current_user.id).all()
    total_time = sum(p.time_spent or 0 for p in progress)
    scores = [p.score for p in progress if p.score is not None]
    
    return jsonify({
        "totalTimeSpent": total_time,
        "averageScore": int(sum(scores) / len(scores)) if scores else 0,
        "problemsSolved": sum(p.exercises_completed for p in progress),
        "currentStreak": current_user.daily_streak,
        "longestStreak": current_user.longest_streak,
        "weeklyProgress": [70, 80, 90, 60, 50, 100, 85]  # Dummy data, replace with actual logic
    })

@app.route('/api/units', methods=['GET'])
@token_required
def get_units(current_user):
    units = Unit.query.order_by(Unit.order_index).all()

    def calculate_unit_progress(unit):
        completed_lessons = 0
        lesson_list = []

        for lesson in unit.lessons:
            is_completed = any(p.user_id == current_user.id and p.completed for p in lesson.progress)
            if is_completed:
                completed_lessons += 1

            lesson_list.append({
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "contentJson": lesson.content_json,
                "difficulty": lesson.difficulty,
                "orderIndex": lesson.order_index,
                "exercises": [e.to_dict() for e in lesson.exercises],
                "xpReward": lesson.xp_reward,
                "duration": lesson.estimated_time,
                "completed": is_completed
            })

        total_lessons = len(lesson_list)

        return {
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "difficulty": unit.difficulty.value,
            "colorTheme": unit.color_theme or 'blue',
            "progress": int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0,
            "completedLessons": completed_lessons,
            "totalLessons": total_lessons,        # ✅ Add totalLessons
            "lessons": lesson_list,               # ✅ Actual lesson list
            "xpReward": total_lessons * 100,
            "isUnlocked": True
        }

    return jsonify([calculate_unit_progress(u) for u in units])

@app.route('/api/challenges', methods=['GET'])
@token_required
def get_quiz_challenges(current_user):
    quiz_attempts = QuizAttempt.query.filter_by(user_id=current_user.id).all()
    completed_quiz_ids = {a.quiz_id for a in quiz_attempts if a.is_passed}

    quizzes = Quiz.query.all()
    quiz_results = []
    for q in quizzes:
        quiz_results.append({
            "id": q.id,
            "title": q.title,
            "description": q.description or "Lesson Quiz Challenge",
            "difficulty": "intermediate", 
            "xpReward": q.xp_reward,
            "participants": len(q.attempts),
            "timeLimit": q.time_limit,
            "isUnlocked": True,
            "isCompleted": q.id in completed_quiz_ids
        })

    return jsonify(quiz_results)

@app.route('/api/lessons', methods=['GET'])
@token_required
def get_all_lessons(current_user):
    lessons = Lesson.query.filter_by(is_published=True).all()
    data = []
    for lesson in lessons:
        user_progress = next(
            (p for p in lesson.progress if p.user_id == current_user.id),
            None
        )
        completed = user_progress.completed if user_progress else False

        data.append({
            "id": lesson.id,
            "title": lesson.title,
            "description": lesson.description,
            "unit_id": lesson.unit_id,
            "difficulty": lesson.difficulty,
            "xp_reward": lesson.xp_reward,
            "completed": completed,
            "order_index": lesson.order_index,
        })
    return jsonify(data)

@app.route('/api/user/check-username/<username>', methods=['GET'])
def check_username(username):
    user = User.query.filter_by(username=username).first()
    return jsonify({'available': user is None})



@app.route('/api/user/delete-account', methods=['DELETE'])
@token_required
def delete_account(current_user):
    db.session.delete(current_user)
    db.session.commit()
    return jsonify({'message': 'Account deleted successfully'})

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    