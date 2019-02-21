from flask import Flask, render_template, session, escape, request, redirect
import json
import data_manager
import security

app = Flask(__name__)
app.secret_key = "CTjad5+=513V@Cxa356+6LrDC#Y<23/5=_._@@&%/=seeZu3%4!"


def get_login_info():
    if 'username' in session:
        return {'okey': True, 'username': escape(session['username']), 'user_id': escape(session['user_id'])}
    else:
        return {'okey': False}


@app.route("/")
def index():
    login_data = get_login_info()
    return render_template('boards.html', login_data=login_data)


@app.route('/register', methods=['POST'])
def register():
    if len(request.form['username']) == 0 or len(request.form['password']) == 0:
        return json.dumps({'error': 'username or password is empty'})

    if security.check_text_validity(request.form['username']):
        if not security.check_password_validity(request.form['password']):
            return json.dumps({'error': 'invalid character in password'})
        if data_manager.get_username(request.form['username']):
            return json.dumps({'error': 'username already exists'})

        password = security.hash_password(request.form['password'])
        user = data_manager.user_register(request.form['username'], password)
        print(user)
        session['username'] = user['username']
        session['user_id'] = user['id']
        return json.dumps({'redirect': True})
    return json.dumps({'error': 'invalid character in username'})


@app.route('/login', methods=['POST'])
def login():
    user = data_manager.get_user_by_name(request.form['username'])
    if user and security.verify_password(request.form['password'], user['password']):
        session['username'] = user['username']
        session['user_id'] = user['id']
        return json.dumps({'redirect': True})
    else:
        return json.dumps({'error': 'username/password incorrect'})


@app.route('/logout')
def logout():
    session.pop('username')
    session.pop('user_id')
    return redirect('/')


@app.route("/boards/")
def boards():
    return json.dumps(data_manager.get_all_boards_for_user(int(session.get("user_id", -1))))


@app.route("/boards/<int:board_id>")
def board_by_id(board_id):
    board = data_manager.get_board_by_id(board_id)
    if board["user_id"] == session["user_id"]:
        return json.dumps(board)

    return json.dumps(False)


@app.route("/statuses/")
def statuses():
    return json.dumps(data_manager.get_all_statuses())

@app.route("/statuses/create/", methods=['POST'])
def statuses_create():
    return json.dumps(data_manager.add_status(request.form))

@app.route("/boards/<int:board_id>/statuses/")
def statuses_for_board(board_id):
    if data_manager.get_board_by_id(board_id).get("user_id") == session.get("user_id"):
        return json.dumps(data_manager.get_statuses_for_board(board_id))

    return json.dumps(False)


@app.route("/statuses/<int:status_id>")
def status_by_id(status_id):
    return json.dumps(data_manager.get_status_by_id(status_id))

@app.route("/statuses/rename/", methods=['POST'])
def status_rename():
    board = data_manager.get_board_by_id(request.form['board_id'])
    if session['user_id'] == board['user_id'] or board['user_id'] == -1:
        if security.check_text_validity(request.form['new_name'], extra_characters=" "):
            return json.dumps(data_manager.rename_status(request.form['status_id'], request.form['new_name']))
        return json.dumps(False)
    return json.dumps(False)

@app.route("/cards/")
def cards():
    return json.dumps(data_manager.get_all_cards_for_user(session.get("user_id"), -1))


@app.route("/cards/<int:card_id>")
def cards_by_id(card_id):
    card = data_manager.get_card_by_id(card_id)
    if card:
        board = data_manager.get_board_by_id(card.get("board_id"))
        if board.get("user_id") == session.get("user_id", -1):
            return json.dumps(data_manager.get_card_by_id(card_id))

    return json.dumps(False)

@app.route("/cards/update/", methods=['POST'])
def cards_update():
    data_manager.update_cards(json.loads(request.form['a']))
    return json.dumps(True)

@app.route('/cards/delete/<int:card_id>')
def card_delete(card_id):
    card = data_manager.get_card_by_id(card_id)
    board = data_manager.get_board_by_id(card['board_id'])
    if board['user_id'] == session.get('user_id') or board['user_id'] == -1:
        data_manager.delete_card(card_id)
        return json.dumps(True)
    return json.dumps(False)

@app.route("/cards/rename/", methods=['POST'])
def card_rename():
    board = data_manager.get_board_by_id(request.form['board_id'])
    if session['user_id'] == board['user_id'] or board['user_id'] == -1:
        if security.check_text_validity(request.form['new_title'], extra_characters=" "):
            return json.dumps(data_manager.rename_card(request.form['card_id'], request.form['new_title']))
        return json.dumps(False)
    return json.dumps(False)

@app.route("/boards/delete/<int:board_id>")
def board_delete(board_id):
    board = data_manager.get_board_by_id(board_id)
    if board['user_id'] == session.get('user_id') or board['user_id'] == -1:
        data_manager.delete_board(board_id)
        return json.dumps(True)
    return json.dumps(False)

@app.route("/boards/rename/", methods=['POST'])
def board_rename():
    board = data_manager.get_board_by_id(request.form['board_id'])
    if session['user_id'] == board['user_id'] or board['user_id'] == -1:
        if security.check_text_validity(request.form['new_title'], extra_characters=" "):
            return json.dumps(data_manager.rename_board(request.form['board_id'], request.form['new_title']))
        return json.dumps(False)
    return json.dumps(False)


@app.route("/board/<int:board_id>/cards/")
def cards_by_board_id(board_id):
    board = data_manager.get_board_by_id(board_id)
    if board:
        if board.get('user_id') == session.get('user_id') or board.get('user_id') == -1:
            return json.dumps(data_manager.get_cards_by_board_id(board_id))

    return json.dumps(False)


@app.route("/cards/create/", methods=["POST"])
def create_new_card():
    if security.check_text_validity(request.form['title'], extra_characters=' '):
        return json.dumps(data_manager.create_new_card(request.form))
    return json.dumps({'error': 'incorrect name'})


@app.route("/boards/create/", methods=["POST"])
def create_new_board():
    if security.check_text_validity(request.form['title'], extra_characters=' '):
        return json.dumps(data_manager.create_new_board(request.form, session.get('user_id',-1)))
    return json.dumps({'error': 'incorrect name'})


@app.route("/cards/archive/<int:card_id>/")
def archive_card(card_id):
    card = data_manager.get_card_by_id(card_id)
    board = data_manager.get_board_by_id(card.get('board_id'))
    if not board.get('user_id'):
        return json.dumps({'error': 'card not found'})
    if board.get('user_id') == session.get("user_id") or board.get('user_id') == -1:
        return json.dumps(data_manager.toggle_archived_state_for_card(card_id))
    return json.dumps({'error': 'invalid user'})


@app.route("/cards/archive/board/<int:board_id>/")
def get_card_archive(board_id):
    board = data_manager.get_board_by_id(board_id)
    if board.get('user_id') == session.get('user_id') or board.get('user_id') == -1:
        return json.dumps(data_manager.get_archived_cards_for_board(board_id))
    return json.dumps({'error': 'invalid user'})


@app.route("/test/")
def test():
    login_data = get_login_info()
    return render_template('test.html', login_data=login_data)


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
