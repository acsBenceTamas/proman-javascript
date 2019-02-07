// This function is to initialize the application
function init() {
    // init data
    dataHandler.init();
    // loads the boards to the screen
    dom.loadBoards();

    document.getElementById("send-board-button").addEventListener('click',function () {
        // dom.addBoardToWindow($('#create-board-form').serializeArray()[1]['value']);
        const title = document.getElementById('board-title').value;
        const isPublic = document.getElementById('board-is-public').checked;
        console.log(title, isPublic);
        dataHandler.createNewBoard(title,isPublic,dom.addBoardToWindow);
        // console.log($('#create-board-form'))
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

    dragulaHandler.init();
}

init();
