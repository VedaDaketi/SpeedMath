"""Add gamification fields to User

Revision ID: 831670efb0af
Revises: 213a40bc1fe3
Create Date: 2025-06-30 13:24:20.979982

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '831670efb0af'
down_revision = '213a40bc1fe3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_xp', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('current_level', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('daily_streak', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('longest_streak', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('last_activity_date', sa.Date(), nullable=True))
        batch_op.add_column(sa.Column('points_today', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('total_lessons_completed', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('total_exercises_completed', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('total_exercises_completed')
        batch_op.drop_column('total_lessons_completed')
        batch_op.drop_column('points_today')
        batch_op.drop_column('last_activity_date')
        batch_op.drop_column('longest_streak')
        batch_op.drop_column('daily_streak')
        batch_op.drop_column('current_level')
        batch_op.drop_column('total_xp')

    # ### end Alembic commands ###
