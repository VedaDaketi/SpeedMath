""" 

Revision ID: 56ca3d4c6d2d
Revises: 6ff335e210e8
Create Date: 2025-07-06 19:09:54.692897

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '56ca3d4c6d2d'
down_revision = '6ff335e210e8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('exercise', schema=None) as batch_op:
        batch_op.alter_column('lesson_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_constraint(batch_op.f('exercise_lesson_id_fkey'), type_='foreignkey')
        batch_op.create_foreign_key(None, 'lesson', ['lesson_id'], ['id'], ondelete='SET NULL')

    with op.batch_alter_table('lesson_sutra', schema=None) as batch_op:
        batch_op.alter_column('lesson_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_constraint(batch_op.f('lesson_sutra_lesson_id_fkey'), type_='foreignkey')
        batch_op.create_foreign_key(None, 'lesson', ['lesson_id'], ['id'], ondelete='SET NULL')

    with op.batch_alter_table('quiz', schema=None) as batch_op:
        batch_op.alter_column('lesson_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_constraint(batch_op.f('quiz_lesson_id_fkey'), type_='foreignkey')
        batch_op.create_foreign_key(None, 'lesson', ['lesson_id'], ['id'], ondelete='SET NULL')

    with op.batch_alter_table('user_progress', schema=None) as batch_op:
        batch_op.alter_column('lesson_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_constraint(batch_op.f('user_progress_lesson_id_fkey'), type_='foreignkey')
        batch_op.create_foreign_key(None, 'lesson', ['lesson_id'], ['id'], ondelete='SET NULL')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_progress', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('user_progress_lesson_id_fkey'), 'lesson', ['lesson_id'], ['id'])
        batch_op.alter_column('lesson_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('quiz', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('quiz_lesson_id_fkey'), 'lesson', ['lesson_id'], ['id'])
        batch_op.alter_column('lesson_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('lesson_sutra', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('lesson_sutra_lesson_id_fkey'), 'lesson', ['lesson_id'], ['id'])
        batch_op.alter_column('lesson_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('exercise', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('exercise_lesson_id_fkey'), 'lesson', ['lesson_id'], ['id'])
        batch_op.alter_column('lesson_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###
