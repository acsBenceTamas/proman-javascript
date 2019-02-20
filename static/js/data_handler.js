// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    keyInLocalStorage: 'proman-data', // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _loadData: function () {
        this._data = JSON.parse(localStorage.getItem(this.keyInLocalStorage));
    },
    _saveData: function () {
        localStorage.setItem(this.keyInLocalStorage, JSON.stringify(this._data))
    },
    init: function () {
        this._loadData();
    },
    getBoards: function (callback) {
        fetch('/boards/')
            .then((response) => response.json())
            .then((data) => callback(data))
    },
    getBoard: function (boardId, callback) {
        fetch(`/boards/${boardId}`)
            .then((response) => response.json())
            .then((data) => callback(data))
    },
    getStatuses: function (callback) {
        fetch('/status/')
            .then((response) => response.json())
            .then((data) => callback(data))
    },
    getStatusesByBoardId: function (boardId) {
        $.get('/boards/'+boardId+'/statuses/', function (data) {
            data = JSON.parse(data);
            if(data){
                for(let status of data){
                    dom.addStatusToBoard(boardId, status.name, status.id);
                }
                dom.loadCards(boardId);
            }

        });
    },
    getStatus: function (statusId, callback) {
        fetch(`/status/${statusId}`)
            .then((response) => response.json())
            .then((data) => callback(data))
    },
    getCardsByBoardId: function (boardId, callback) {
        fetch(`/board/${boardId}/cards/`)
            .then((response) => response.json())
            .then((data) => callback(data))
    },
    getCard: function (cardId, callback) {
        fetch(`/cards/${cardId}`)
            .then((response) => response.json())
            .then((data) => callback(data))
    },
    createNewBoard: function (boardTitle, isPublic, callback) {
        let form = new FormData();
        form.set("title", boardTitle);
        form.set("public", isPublic);
        fetch('/boards/create/',
            {method: 'POST',
            body: form}
            )
            .then((response) =>response.json())
            .then((data) => callback(data))
    },
    createNewCard: function (cardTitle, boardId, statusId, position, callback) {
        let form = new FormData();
        form.set("title", cardTitle);
        form.set("board_id", boardId);
        form.set("status_id", statusId);
        form.set("position", position);
        fetch('/cards/create/',
            {method: 'POST',
                body: form}
        )
            .then((response) =>response.json())
            .then((data) => callback(data))
    },
    createNewStatus: function (statusName, boardId, callback) {
        let form = new FormData();
        form.set("name", statusName);
        form.set("board_id", boardId);
        fetch('/statuses/create/',
            {method: 'POST',
                body: form}
        )
            .then((response) =>response.json())
            .then((data) => callback(boardId, statusName, data))
    },
    renameBoard: function (boardId, newTitle) {
        $.post('/boards/rename/', {board_id: boardId, new_title: newTitle}, function (data) {
            data = JSON.parse(data);
            if(data){
                document.querySelector('#board-title-input-'+boardId).dataset.title = newTitle;
            }else{
                document.querySelector('#board-title-input-'+boardId).value = document.querySelector('#board-title-input-'+boardId).dataset.title;
            }
        });
    },
    renameStatus: function (statusId, boardId, newName) {
        $.post('/statuses/rename/', {status_id: statusId, board_id: boardId, new_name: newName}, function (data) {
            data = JSON.parse(data);
            dom.renameStatus(data, statusId);
        });
    },
    renameCard: function (cardId, boardId, newTitle) {
        $.post('/cards/rename/', {card_id: cardId, board_id: boardId, new_title: newTitle}, function (data) {
            data = JSON.parse(data);
            dom.renameCard(data, cardId);
        });
    },
    // here comes more features
};
