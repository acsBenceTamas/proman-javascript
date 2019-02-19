// This function is to initialize the application
function init() {
    // init data
    dataHandler.init();
    // loads the boards to the screen
    dom.loadBoards();

    document.getElementById("send-board-button").addEventListener('click',function () {
        const title = document.getElementById('board-title').value;
        const isPublic = document.getElementById('board-is-public').checked;
        console.log(title, isPublic);
        dataHandler.createNewBoard(title,isPublic,dom.addBoardToWindow);
    });

    document.getElementById("login-button").addEventListener('click', function () {
        $.post('/login', $('#login-form').serialize(), function(data){
            console.log(data);
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
            console.log(data);
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
        dataHandler.createNewCard(cardTitle, boardId, cardStatus, 0, dom.addCardToWindow)
    });

    document.querySelector('#btn-delete-board-ok').addEventListener('click', function (event) {
        const boardId = document.querySelector('#delete-board-confirmation').dataset.boardId;
        $.get('/boards/delete/'+boardId);
        document.querySelector('#board-id-'+boardId).remove();
    });

    document.querySelector('#archived-cards-list').addEventListener('click', function (event) {
        console.log(event.target.tagName);
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

    dragulaHandler.init();
}

init();
