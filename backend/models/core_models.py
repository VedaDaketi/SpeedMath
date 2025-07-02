from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from enum import Enum

# Initialize SQLAlchemy
db = SQLAlchemy()

# Enums
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
    lessons = db.relationship('Lesson', backref='unit', lazy=True, order_by='Lesson.order_index')

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
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
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
    exercises = db.relationship('Exercise', backref='lesson', lazy=True)
    sutras = db.relationship('LessonSutra', backref='lesson', lazy=True)
    quizzes = db.relationship('Quiz', backref='lesson', lazy=True)

class LessonSutra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
    sutra_id = db.Column(db.Integer, db.ForeignKey('vedic_sutra.id'), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)

class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
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

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
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
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
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

def init_sample_data():
    sutras_data = [
        ("Ekadhikena Purvena", "By One More than Previous", "Used for squaring numbers ending in 5"),
        ("Nikhilam Navatashcaramam Dashatah", "All from 9, Last from 10", "Subtraction from powers of 10"),
        ("Urdhva-Tiryagbhyam", "Vertically and Crosswise", "Multiplication technique"),
        ("Paravartya Yojayet", "Transpose and Apply", "Division method"),
        ("Shunyam Saamyasamuccaye", "When the Sum is Zero", "For factorization"),
        ("Anurupye Shunyamanyat", "If One is in Ratio, the Other is Zero", "Proportional operations"),
        ("Sankalana-Vyavakalanabhyam", "By Addition and Subtraction", "Basic arithmetic"),
        ("Puranapuranabhyam", "By Addition and Subtraction", "Quadratic equations"),
        ("Chalana-Kalanabhyam", "Differences and Similarities", "Recurring decimals"),
        ("Yaavadunam", "Whatever the Extent of Deficiency", "Percentage calculations"),
        ("Vyashtisamanstih", "Part and Whole", "Ratio and proportion"),
        ("Shesanyankena Charamena", "The Remainder by Last Digit", "Large number calculations"),
        ("Sopaantyadvaya Mantyam", "Ultimate and Twice the Penultimate", "Coordinate geometry"),
        ("Ekanyunena Purvena", "By One Less than Previous", "Advanced arithmetic"),
        ("Gunitasamuchyah", "The Product of Sums", "Area calculations"),
        ("Gunakasamuchyah", "The Factors of Sum", "Verification techniques")
    ]
    for i, (name, translation, description) in enumerate(sutras_data, 1):
        db.session.add(VedicSutra(
            name=name,
            english_translation=translation,
            description=description,
            order_index=i
        ))

    achievements_data = [
        ("First Steps", "Complete your first lesson", "🎯", "common", {"lessons_completed": 1}),
        ("Speed Learner", "Complete 5 lessons", "⚡", "common", {"lessons_completed": 5}),
        ("Math Enthusiast", "Complete 20 lessons", "📚", "rare", {"lessons_completed": 20}),
        ("Vedic Master", "Complete all 30 lessons", "👑", "legendary", {"lessons_completed": 30}),
        ("Streak Master", "Maintain a 7-day streak", "🔥", "rare", {"daily_streak": 7}),
        ("Dedication", "Maintain a 30-day streak", "💎", "epic", {"daily_streak": 30}),
        ("Perfect Score", "Get 100% on any quiz", "⭐", "common", {"perfect_quiz": 1}),
        ("Quick Thinker", "Complete an exercise in under 30 seconds", "💨", "rare", {"quick_solve": 30})
    ]
    for name, desc, icon, rarity, criteria in achievements_data:
        db.session.add(Achievement(
            name=name,
            description=desc,
            icon=icon,
            rarity=rarity,
            criteria=str(criteria)
        ))

    db.session.commit()
