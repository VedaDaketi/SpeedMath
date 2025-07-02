from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models here to register with SQLAlchemy metadata
from .user import User, UserRole
from .core_models import (
    Unit, VedicSutra, Lesson, LessonSutra,
    Exercise, Quiz, QuizQuestion, QuizAttempt,
    UserProgress, Achievement, UserAchievement,
    Leaderboard, DailyChallenge, ChallengeAttempt,
    DifficultyLevel, ContentType
)
