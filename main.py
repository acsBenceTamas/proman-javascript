from flask import Flask, render_template, session
import json
import data_manager

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('boards.html')


@app.route("/boards/")
def boards():
    return json.dumps(data_manager.get_all_boards_for_user(int(session.get("user", -1))))


@app.route("/boards/<int:board_id>")
def board_by_id(board_id):
    return json.dumps(data_manager.get_board_by_id(board_id))


@app.route("/statuses/")
def statuses():
    return json.dumps(data_manager.get_all_statuses())


@app.route("/boards/<int:board_id>/statuses/")
def statuses_for_board(board_id):
    return json.dumps(data_manager.get_statuses_for_board(board_id))


@app.route("/boards/statuses/<int:status_id>")
def status_by_id(status_id):
    return json.dumps(data_manager.get_status_by_id(status_id))


@app.route("/cards/")
def cards():
    return json.dumps(data_manager.get_all_cards())


@app.route("/cards/<int:card_id>")
def cards_by_id(card_id):
    return json.dumps(data_manager.get_card_by_id(card_id))


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
