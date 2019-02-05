from flask import Flask, render_template
import json
import data_manager

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('boards.html')


@app.route("/boards/")
def boards():
    return json.dumps(data_manager.get_all_boards_for_user(-1))


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
