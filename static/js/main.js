// This function is to initialize the application
function init() {
    // init data
    dataHandler.init();

    const refreshPeriods = [
        {'milliseconds': 15000, 'display': '15 seconds', 'index': 0},
        {'milliseconds': 30000, 'display': '30 seconds', 'index': 1},
        {'milliseconds': 60000, 'display': '60 seconds', 'index': 2},
        {'milliseconds': 120000, 'display': '2 minutes', 'index': 3},
        {'milliseconds': 300000, 'display': '5 minutes', 'index': 4},
        {'milliseconds': 600000, 'display': '10 minutes', 'index': 5},
    ];

    // loads the boards to the screen
    synchronize();

    document.getElementById("send-board-button").addEventListener('click',function () {
        const title = document.getElementById('board-title').value;
        const isPublic = document.getElementById('board-is-public').checked;
        dataHandler.createNewBoard(title,isPublic,dom.addBoardToWindow);
        $('#create-board').modal('hide');
    });

    document.getElementById("login-button").addEventListener('click', function () {
        $.post('/login', $('#login-form').serialize(), function(data){
            if(data.redirect){
                location.reload(true);
            }
            else{
                dom.setFormError('user-login-error',data.error)
            }
        },'json')
    });

    document.getElementById("register-button").addEventListener('click', function () {
        $.post('/register', $('#register-form').serialize(), function(data){
            if(data.redirect){
                location.reload(true);
            }
            else{
                dom.setFormError('user-register-error',data.error)
            }
        },'json')
    });

    document.querySelector('#send-card-button').addEventListener('click',function () {
        const cardTitle = document.getElementById('card-title').value;
        const cardStatus = document.getElementById('card-status').value;
        const boardId = document.getElementById('card-form-board-id').value;
        dataHandler.createNewCard(cardTitle, boardId, cardStatus, 0, dom.addCardToWindow);
        $('#create-card').modal('hide');
    });

    document.querySelector('#send-status-button').addEventListener('click',function () {
        const statusName = document.getElementById('status-title').value;
        const boardId = document.getElementById('status-form-board-id').value;
        dataHandler.createNewStatus(statusName, boardId, dom.addStatusToBoard);
        $('#create-status').modal('hide');
    });

    document.querySelector('#btn-delete-board-ok').addEventListener('click', function (event) {
        const boardId = document.querySelector('#delete-board-confirmation').dataset.boardId;
        $.get('/boards/delete/'+boardId);
        document.querySelector('#board-id-'+boardId).remove();
    });

    document.querySelector('#archived-cards-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            $.get(`/cards/archive/${event.target.dataset.cardId}/`, function (data) {
                let card = JSON.parse(data);
                if (!data.error) {
                    event.target.closest('li').remove();
                    dom.addCardToWindow(card);
                }
            })
        }
    });

    $('#create-card').on('shown.bs.modal', function () {
        let select = document.querySelector('#card-status');
        $.get('/boards/'+document.querySelector('#card-form-board-id').value+'/statuses/', function (data) {
            let statuses = JSON.parse(data);
            for(let status of statuses){
                let newOption = document.createElement('option');
                newOption.textContent = status.name;
                newOption.value = status.id;
                select.appendChild(newOption);
            }
            document.querySelector('#send-card-button').removeAttribute('disabled');
        })
    });

    document.querySelector('#refresh-period').addEventListener('mouseup', function (event) {
        const refreshPeriod = refreshPeriods[event.target.value];
        localStorage.setItem('refresh_period', JSON.stringify(refreshPeriod));
        document.querySelector('#refresh-period-display').textContent = refreshPeriod.display;
        clearInterval(refreshTimer);
        refreshTimer = window.setInterval(synchronize, refreshPeriod.milliseconds);
    });

    document.querySelector('#btn-manual-sync').addEventListener('click', synchronize);

    let refreshTimer = setupRefreshPeriod();

    dragulaHandler.init();
}

let setupRefreshPeriod = function() {
    const refreshPeriod = JSON.parse(localStorage.getItem('refresh_period'));
    document.querySelector('#refresh-period-display').textContent =
        refreshPeriod ? refreshPeriod.display : '15 seconds';
    document.querySelector('#refresh-period').value =
        refreshPeriod ? refreshPeriod.index : 0;
    return window.setInterval(
        synchronize,
        refreshPeriod ? refreshPeriod.milliseconds : 15000);
};

let synchronize = function() {
    if(!dom.inEditMode){
        dom.loadProgress(true);
        let promises = [];
        let boardData;
        let statusDataCollection = [];
        let cardDataCollection = [];
        const getBoards = dataHandler.getBoards(function (data) {
            boardData = data;
            for (const board of boardData) {
                const getStatusData = dataHandler.getStatusesByBoardId(board.id, function (data) {
                    statusDataCollection.push(data);
                });
                promises.push(getStatusData);
                const getCardData = dataHandler.getCardsByBoardId(board.id, function (data) {
                    cardDataCollection.push(data);
                });
                promises.push(getCardData);
            }
            Promise.all(promises).then(
                function () {
                    if(dom.inEditMode)
                        return;
                    dom.removeBoards();
                    for (const board of boardData) {
                        dom.addBoardToWindow(board);
                    }
                    for (let statusData of statusDataCollection) {
                        for (let status of statusData) {
                            dom.addStatusToBoard(status.board_id, status.name, status.id);
                        }
                    }
                    for (let statusData of cardDataCollection) {
                        for (let card of statusData) {
                            dom.addCardToWindow(card);
                        }
                    }
                    dom.loadProgress(false);
                }
            )
        });
        promises.push(getBoards);
    }
};

init();
