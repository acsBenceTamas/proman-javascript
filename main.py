from flask import Flask, render_template, session
from functools import wraps
import json
import data_manager

app = Flask(__name__)


app.secret_key = "CTjad5+=513V@Cxa356+6LrDC#Y<23/5=_._@@&%/=seeZu3%4!"


def need_login(**login_kwargs):
    def decorator(server_function):
        @wraps(server_function)
        def wrapper(*args, **kwargs):
            if session.get('user_id'):
                if login_kwargs.get("user_id", -1):
                    valid = True
                else:
                    return "Access Denied"
                if valid:
                    return server_function(*args, **kwargs)
            else:
                return "Requires Login"
        return wrapper
    return decorator


@app.route("/")
def index():
    return render_template('boards.html')


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
