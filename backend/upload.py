import psycopg2
from enum import Enum
from datetime import datetime, timezone
import json

# --- 1. Define Enums and Configuration ---

class DifficultyLevel(Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

# !!! IMPORTANT: Replace with your actual PostgreSQL database credentials !!!
DB_CONFIG = {
    'host': 'localhost',
    'database': 'speedmath',
    'user': 'postgres',
    'password': '357951',
    'port': '5432' # Default PostgreSQL port
}

# --- 2. Prepare Exercise Data ---
# This data is based on the quiz we just generated.

# Note: lesson_id is a foreign key, so ensure a lesson with this ID exists in your 'lesson' table.
# For demonstration, we'll use a placeholder lesson_id.
EXAMPLE_LESSON_ID = 1 # Replace with an actual lesson.id from your database

exercises_data = [
    {
        "question": "Using the Left-to-Right Addition method, what is the exact sum of $475 + 283$?",
        "correct_answer": "758",
        "explanation": "Start with the hundreds: $400 + 200 = 600$. Then add the tens: $70 + 80 = 150$. Add this to the current sum: $600 + 150 = 750$. Finally, add the units: $5 + 3 = 8$. Add this to the running total: $750 + 8 = 758$.",
        "difficulty": DifficultyLevel.INTERMEDIATE,
        "question_type": "calculation",
        "options": None, # No options for numerical questions
        "hints": "Accumulate the sum mentally from left to right, column by column.",
        "step_by_step_solution": "Hundreds: $400 + 200 = 600$. Tens: $70 + 80 = 150$. Sum: $600 + 150 = 750$. Units: $5 + 3 = 8$. Final: $750 + 8 = 758$.",
        "time_limit": 60,
        "tags": "Addition, Left-to-Right"
    },
    {
        "question": "What is the exact sum of $386 + 175 + 249$ using column addition methods (like Dot Method)?",
        "correct_answer": "810",
        "explanation": "1. **Units Column (6+5+9):** $6+5=11$ (write 1, carry 1 dot). $1+9=10$ (write 0, carry 1 dot). The unit digit is 0. Total 2 dots (meaning 2 carried).\n2. **Tens Column (8+7+4 + 2 carries):** $8+7=15$ (write 5, carry 1 dot). $5+4=9$. Add the 2 carried dots: $9+2=11$. Write 1. Total 2 dots (meaning 2 carried).\n3. **Hundreds Column (3+1+2 + 2 carries):** $3+1=4$. $4+2=6$. Add the 2 carried dots: $6+2=8$. Write 8.\nCombining the digits gives 810.",
        "difficulty": DifficultyLevel.INTERMEDIATE,
        "question_type": "calculation",
        "options": None,
        "hints": "Add each column from right to left, using a dot or mental carry-over for sums of 10 or more.",
        "step_by_step_solution": "Units: $6+5+9=20$ (0, carry 2). Tens: $8+7+4+2=21$ (1, carry 2). Hundreds: $3+1+2+2=8$. Result: 810.",
        "time_limit": 60,
        "tags": "Addition, Dot Method, Column Addition"
    },
    {
        "question": "Using the 'All from 9 and the Last from 10' (Nikhilam Navatashcaramam Dashatah) Sutra, what is the numerical complement of $647$ from $1000$?",
        "correct_answer": "353",
        "explanation": "To find the complement from 1000:\n* Subtract the last digit (7) from 10: $10 - 7 = 3$.\n* Subtract the remaining digits (4, then 6) from 9: $9 - 4 = 5$, and $9 - 6 = 3$.\nCombining these results gives 353.",
        "difficulty": DifficultyLevel.BEGINNER,
        "question_type": "calculation",
        "options": None,
        "hints": "Remember to subtract every digit from 9, except the very last one, which comes from 10.",
        "step_by_step_solution": "From 1000: $9-6=3$, $9-4=5$, $10-7=3$. Complement: 353.",
        "time_limit": 45,
        "tags": "Subtraction, Nikhilam, Complement"
    },
    {
        "question": "What is the primary benefit of using the Left-to-Right Addition method?",
        "correct_answer": "C", # Store the option letter
        "explanation": "By starting with the largest place value, the method aligns with how numbers are spoken and thought about, facilitating mental calculation.",
        "difficulty": DifficultyLevel.BEGINNER,
        "question_type": "mcq",
        "options": json.dumps({
            "A": "It's faster for calculations involving decimals.",
            "B": "It eliminates the need for carrying.",
            "C": "It allows for more natural mental calculation.",
            "D": "It is only suitable for single-digit addition."
        }),
        "hints": "Consider how you naturally read and process numbers.",
        "step_by_step_solution": "The primary benefit is mental alignment, making calculations more intuitive.",
        "time_limit": 30,
        "tags": "Addition, Left-to-Right, Theory"
    },
    {
        "question": "In the Dot Method for column addition, what does placing a 'dot' above a digit in the next column signify?",
        "correct_answer": "C",
        "explanation": "Each dot signifies that a sum of 10 or more was reached in the previous column, and that 10 is carried over to the current column's sum.",
        "difficulty": DifficultyLevel.BEGINNER,
        "question_type": "mcq",
        "options": json.dumps({
            "A": "It indicates the digit is prime.",
            "B": "It marks a digit that needs to be subtracted.",
            "C": "It represents a carry-over of a '10' (or multiple of 10) to the next place value.",
            "D": "It highlights a digit that should be ignored."
        }),
        "hints": "Think about what happens when you get a two-digit sum in a single column.",
        "step_by_step_solution": "The dot is a visual cue for a carry-over of 1 (representing 10, 100, etc., depending on place value).",
        "time_limit": 30,
        "tags": "Addition, Dot Method, Theory"
    },
    {
        "question": "When adding the column $8 + 4 + 7 + 6 + 3$, which digits can be grouped to make a multiple of 10 or a sum close to it for easier mental calculation?",
        "correct_answer": "C",
        "explanation": "($7+3=10$) and ($4+6=10$) are perfect groupings. Adding the remaining 8 makes $10+10+8=28$. This simplifies mental addition significantly.",
        "difficulty": DifficultyLevel.INTERMEDIATE,
        "question_type": "mcq",
        "options": json.dumps({
            "A": "($8+4$), ($7+6$), $3$",
            "B": "($8+2$ - by borrowing from others), ($7+3$), $4$",
            "C": "($7+3$), ($4+6$), $8$",
            "D": "($8+7$), ($4+3$), $6$"
        }),
        "hints": "Look for pairs or triplets of digits that sum up to 10, 20, etc.",
        "step_by_step_solution": "Group ($7+3=10$) and ($4+6=10$). Then add $10+10+8=28$.",
        "time_limit": 45,
        "tags": "Addition, Grouping"
    },
    {
        "question": "Using the 'Grouping to 10 or Multiples of 10' method, what is the sum of $17 + 23 + 14 + 16$?",
        "correct_answer": "B",
        "explanation": "Group units digits: $7+3=10$, $4+6=10$. So, $10+10=20$. Group tens digits: $10+20+10+10 = 50$. Total sum: $50 + 20 = 70$. Alternatively, $(17+23) + (14+16) = 40 + 30 = 70$.",
        "difficulty": DifficultyLevel.INTERMEDIATE,
        "question_type": "mcq",
        "options": json.dumps({
            "A": "60",
            "B": "70",
            "C": "75",
            "D": "68"
        }),
        "hints": "Look for pairs of units digits that sum to 10.",
        "step_by_step_solution": "($17+23$) = 40. ($14+16$) = 30. $40+30=70$.",
        "time_limit": 45,
        "tags": "Addition, Grouping"
    },
    {
        "question": "What is the result of $852 - 396$ using the complement method (Nikhilam Navatashcaramam Dashatah)?",
        "correct_answer": "A",
        "explanation": "Find the complement of 396 from 1000 ($1000 - 396 = 604$). Then add this complement to the minuend: $852 + 604 = 1456$. Drop the leading '1' (which accounts for using 1000 as the base) to get 456.",
        "difficulty": DifficultyLevel.INTERMEDIATE,
        "question_type": "mcq",
        "options": json.dumps({
            "A": "456",
            "B": "546",
            "C": "446",
            "D": "556"
        }),
        "hints": "Find the complement of the subtrahend (396) from the next higher power of 10 (1000), then add it to the minuend (852), and finally adjust the result.",
        "step_by_step_solution": "Complement of 396 (from 1000) is 604. $852 + 604 = 1456$. Drop the leading 1. Result: 456.",
        "time_limit": 60,
        "tags": "Subtraction, Complement, Nikhilam"
    },
    {
        "question": "Convert the Vinculum number `32 (bar over 2)` to a standard positive number.",
        "correct_answer": "A",
        "explanation": "The notation `32 (bar over 2)` means the digit 2 is negative, while 3 is positive in the tens place. So, this represents $30 - 2 = 28$.",
        "difficulty": DifficultyLevel.BEGINNER,
        "question_type": "mcq",
        "options": json.dumps({
            "A": "28",
            "B": "32",
            "C": "38",
            "D": "22"
        }),
        "hints": "The 'bar' over a digit indicates a negative value for that digit. Consider its place value.",
        "step_by_step_solution": "3 in tens place is 30. (bar 2) is -2. $30 - 2 = 28$.",
        "time_limit": 30,
        "tags": "Vinculum, Conversion"
    },
    {
        "question": "Which of the following is the Vinculum form of the number $48$?",
        "correct_answer": "A",
        "explanation": "To convert 48 to Vinculum form, we aim to use a negative digit. We can think of 48 as $50 - 2$. In Vinculum, this is represented by increasing the tens digit by one (from 4 to 5) and using the negative equivalent of the unit digit (2, written as `(bar over 2)`).",
        "difficulty": DifficultyLevel.INTERMEDIATE,
        "question_type": "mcq",
        "options": json.dumps({
            "A": "52 (bar over 2)",
            "B": "42 (bar over 2)",
            "C": "52",
            "D": "48 (bar over 8)"
        }),
        "hints": "To convert a number to Vinculum form, look for digits 5 or higher. Convert them by subtracting from 10 and increasing the digit to their left by one.",
        "step_by_step_solution": "48 is $50 - 2$. So, 5 in tens place, and 2 with a bar over it.",
        "time_limit": 45,
        "tags": "Vinculum, Conversion"
    }
]

# --- 3. Database Insertion Logic ---

def insert_exercises(exercises_data, lesson_id_override=None):
    """Inserts a list of exercise dictionaries into the PostgreSQL database."""
    conn = None
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        # SQL INSERT statement
        insert_sql = """
        INSERT INTO exercise (
            lesson_id, question, correct_answer, explanation, difficulty,
            xp_reward, question_type, options, hints, step_by_step_solution,
            time_limit, tags, created_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        ) RETURNING id;
        """

        for exercise in exercises_data:
            # Use the provided lesson_id_override or the default from the exercise data
            current_lesson_id = lesson_id_override if lesson_id_override is not None else EXAMPLE_LESSON_ID

            # Convert Enum to its value string
            difficulty_str = exercise['difficulty'].name

            # Prepare options string (None for numerical questions, JSON string for MCQs)
            options_str = exercise['options']

            # Get current UTC time for created_at
            created_at_utc = datetime.now(timezone.utc)

            # Prepare the data tuple for insertion
            data_to_insert = (
                current_lesson_id,
                exercise['question'],
                exercise['correct_answer'],
                exercise['explanation'],
                difficulty_str,
                exercise.get('xp_reward', 10), # Use .get() for optional fields with defaults
                exercise.get('question_type', 'calculation'),
                options_str,
                exercise.get('hints'),
                exercise.get('step_by_step_solution'),
                exercise.get('time_limit'),
                exercise.get('tags'),
                created_at_utc
            )

            cur.execute(insert_sql, data_to_insert)
            exercise_id = cur.fetchone()[0]
            print(f"Inserted exercise with ID: {exercise_id} - Question: {exercise['question'][:50]}...")

        # Commit the transaction
        conn.commit()
        print("All exercises inserted successfully!")

    except psycopg2.Error as e:
        print(f"Database error: {e}")
        if conn:
            conn.rollback() # Rollback on error
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()
            print("Database connection closed.")

# --- 4. Run the Insertion ---
if __name__ == "__main__":
    print(f"Attempting to insert exercises for lesson_id: {EXAMPLE_LESSON_ID}")
    insert_exercises(exercises_data, lesson_id_override=EXAMPLE_LESSON_ID)