from flask import Flask, render_template, session, escape, request
from functools import wraps
import json
import data_manager

app = Flask(__name__)
app.secret_key = "CTjad5+=513V@Cxa356+6LrDC#Y<23/5=_._@@&%/=seeZu3%4!"


def check_login():
    if request.method == 'POST':
        if request.form['type'] == 'register':
            # status = database.user_register(request.form['username'], request.form['password'])
            # if status == 'success':
            #     session['username'] = request.form['username']
            #     return {'redirect': '/'}
            # else:
            #     session['registration'] = status
            #     return {'redirect': '/register'}
            return {'redirect': '/'}
        elif request.form['type'] == 'login':
            # if database.user_login(request.form['username'], request.form['password']):
            #     session['username'] = request.form['username']
            #     return {'redirect': '/'}
            # else:
            #     session['login'] = 'error'
            #     return {'redirect': '/login'}
            return {'redirect': '/'}
    # user logged in check
    if 'username' in session:
        return {'okey': True, 'username': escape(session['username'])}
    else:
        return {'okey': False}


@app.route("/", methods=['GET', 'POST'])
def index():
    login_data = check_login()
    return render_template('boards.html', login_data=login_data)

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


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
