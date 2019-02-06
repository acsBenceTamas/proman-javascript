from connection import connection_handler
from psycopg2 import sql
import security


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


@connection_handler
def get_board_by_id(cursor, board_id):
    cursor.execute(
        sql.SQL(
            """
            SELECT * from boards
            WHERE id = {board_id}
            """
        ).format(board_id=sql.Literal(board_id))
    )
    return cursor.fetchone()


@connection_handler
def get_statuses_for_board(cursor, board_id):
    cursor.execute(
        sql.SQL(
            """
            SELECT statuses.* FROM 
            boards JOIN boards_statuses ON boards.id = boards_statuses.board_id
            JOIN statuses on boards_statuses.status_id = statuses.id
            WHERE boards.id = {board_id}
            """
        ).format(board_id=sql.Literal(board_id))
    )
    return cursor.fetchall()


@connection_handler
def get_all_statuses(cursor):
    cursor.execute(
        sql.SQL(
            """
            SELECT * FROM statuses
            """
        )
    )
    return cursor.fetchall()


@connection_handler
def get_status_by_id(cursor, status_id):
    cursor.execute(
        sql.SQL(
            """
            SELECT * from boards
            WHERE id = {status_id}
            """
        ).format(status_id=sql.Literal(status_id))
    )
    return cursor.fetchone()


@connection_handler
def get_all_cards_for_user(cursor, user_id=-1):
    cursor.execute(
        sql.SQL(
            """
            SELECT cards.* 
            FROM cards JOIN boards ON cards.board_id = boards.id
            WHERE boards.user_id = {user_id} OR boards.user_id = -1
            """
        ).format(user_id=sql.Literal(user_id))
    )
    return cursor.fetchall()


@connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute(
        sql.SQL(
            """
            SELECT * FROM cards
            WHERE board_id = {board_id}
            """
        ).format(board_id=sql.Literal(board_id))
    )
    return cursor.fetchall()


@connection_handler
def get_card_by_id(cursor, card_id):
    cursor.execute(
        sql.SQL(
            """
            SELECT * FROM cards
            WHERE id = {card_id}
            """
        ).format(card_id=sql.Literal(card_id))
    )
    return cursor.fetchone()

@connection_handler
def user_register(cursor, username, password):
    cursor.execute("INSERT INTO users (username, password) VALUES (%(username)s, %(password)s) RETURNING *",{'username': username, 'password': password})
    return cursor.fetchone()

@connection_handler
def get_user_by_name(cursor, username):
    cursor.execute('SELECT * FROM users WHERE username=%s',(username,))
    return cursor.fetchone()

@connection_handler
def get_usernames(cursor):
    cursor.execute("SELECT username FROM users;")
    users = cursor.fetchall()
    return users

@connection_handler
def get_username(cursor, name):
    cursor.execute('SELECT username FROM users WHERE username=%s',(name,))
    return cursor.fetchone()