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
def get_cards_by_board_id(cursor, board_id):
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
def create_new_card(cursor, card):
    print("card?")
    cursor.execute(
        sql.SQL(
            """
            INSERT INTO cards (title, board_id, status_id, position)
            VALUES ({title}, {board_id}, {status_id}, {position})
            RETURNING *
            """
        ).format(
            title=sql.Literal(card['title']),
            board_id=sql.Literal(card['board_id']),
            status_id=sql.Literal(card['status_id']),
            position=sql.Literal(card['position']),
        )
    )
    return cursor.fetchone()


@connection_handler
def create_new_board(cursor, board, user_id):
    cursor.execute(
        sql.SQL(
            """
            INSERT INTO boards (title, user_id)
            VALUES ({title}, {user_id})
            RETURNING *
            """
        ).format(
            title=sql.Literal(board['title']),
            user_id=sql.Literal(user_id if not board['public'] else -1),
        )
    )
    return cursor.fetchone()
