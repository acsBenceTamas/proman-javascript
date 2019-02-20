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
            SELECT * FROM 
            statuses
            WHERE board_id = {board_id}
            ORDER BY id;
            """
        ).format(board_id=sql.Literal(board_id))
    )
    return cursor.fetchall()


@connection_handler
def add_status(cursor,form):
    cursor.execute('INSERT INTO statuses (name, board_id) VALUES (%s, %s) RETURNING id;',(form['name'],form['board_id']))
    return cursor.fetchone()['id']


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
def get_archived_cards_for_board(cursor, board_id):
    cursor.execute(
        sql.SQL(
            """
            SELECT * FROM cards
            WHERE board_id = {board_id} AND archived = true
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
    print(repr(user_id))
    print(board['public'])
    if board['public'] == 'true':
        user_id = -1
    cursor.execute(
        sql.SQL(
            """
            INSERT INTO boards (title, user_id)
            VALUES ({title}, {user_id})
            RETURNING *
            """
        ).format(
            title=sql.Literal(board['title']),
            user_id=sql.Literal(user_id),
        )
    )
    return cursor.fetchone()

@connection_handler
def update_cards(cursor, form):
    sql_string = []
    for elem in form:
        id = elem.pop('id')
        set = ",".join(("=".join([pair[0], str(pair[1])]) for pair in elem.items()))
        string = f'''
        UPDATE cards
        SET {set}
        WHERE id = {id};
        '''
        sql_string.append(string)
    cursor.execute(
        " ".join(sql_string)
    )


@connection_handler
def toggle_archived_state_for_card(cursor, card_id):
    cursor.execute(
        sql.SQL(
            """
            UPDATE cards
            SET archived = NOT(archived)
            WHERE id = {card_id}
            RETURNING *
            """
        ).format(card_id=sql.Literal(card_id))
    )
    return cursor.fetchone()


@connection_handler
def delete_card(cursor, card_id):
    cursor.execute("DELETE FROM cards WHERE id=%s",(card_id,))

@connection_handler
def delete_board(cursor, board_id):
    cursor.execute("DELETE FROM boards WHERE id=%s",(board_id,))

@connection_handler
def rename_board(cursor, board_id, board_title):
    cursor.execute("UPDATE boards SET title = %s WHERE id=%s;",(board_title,board_id))
    return True

@connection_handler
def rename_status(cursor, status_id, status_name):
    cursor.execute("UPDATE statuses SET name = %s WHERE id=%s;", (status_name, status_id))
    return True

@connection_handler
def rename_card(cursor, card_id, card_title):
    print(card_id)
    cursor.execute("UPDATE cards SET title = %s WHERE id=%s;",(card_title, card_id))
    return True

@connection_handler
def user_register(cursor, username, password):
    cursor.execute("INSERT INTO users (username, password) VALUES (%(username)s, %(password)s) RETURNING *",{'username': username, 'password': password})
    return cursor.fetchone()


@connection_handler
def get_user_by_name(cursor, username):
    cursor.execute('SELECT * FROM users WHERE LOWER(username)=LOWER(%s)', (username,))
    return cursor.fetchone()


@connection_handler
def get_username(cursor, username):
    cursor.execute('SELECT username FROM users WHERE username=%s', (username,))
    return cursor.fetchone()
