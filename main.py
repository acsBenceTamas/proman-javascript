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
    return json.dumps(data_manager.get_all_boards_for_user(int(session.get("user", -1))))


@app.route("/boards/<int:board_id>")
def board_by_id(board_id):
    board = data_manager.get_board_by_id(board_id)
    if board["user_id"] == session["user_id"]:
        return json.dumps(board)

    return json.dumps(False)


@app.route("/statuses/")
def statuses():
    return json.dumps(data_manager.get_all_statuses())


@app.route("/boards/<int:board_id>/statuses/")
def statuses_for_board(board_id):
    if data_manager.get_board_by_id(board_id).get("user_id") == session.get("user_id"):
        return json.dumps(data_manager.get_statuses_for_board(board_id))

    return json.dumps(False)


@app.route("/statuses/<int:status_id>")
def status_by_id(status_id):
    return json.dumps(data_manager.get_status_by_id(status_id))


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


@app.route("/board/<int:board_id>/cards/")
def cards_by_board_id(board_id):
    board = data_manager.get_board_by_id(board_id)
    if board:
        if board.get('user_id', -1) == session.get('user_id'):
            return json.dumps(data_manager.get_cards_by_board_id(board_id))

    return json.dumps(False)


@app.route("/cards/create", methods=["POST"])
def create_new_card():
    return data_manager.create_new_card(request.form)


@app.route("/boards/create", methods=["POST"])
def create_new_board():
    print(request.form)
    # data_manager.create_new_board(request.form, session.get('user_id'))
    return "done"


@app.route("/test/")
def test():
    pass


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
