from connection import connection_handler
from psycopg2 import sql


@connection_handler
def get_all_boards_for_user(cursor, user_id=-1):
    cursor.execute(
        sql.SQL(
            """
            SELECT * from boards
            WHERE user_id = {user_id} OR user_id = -1
            """
        ).format(user_id=sql.Literal(user_id))
    )
    return cursor.fetchall()
