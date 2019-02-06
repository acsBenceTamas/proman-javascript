// This function is to initialize the application
function init() {
    // init data
    dataHandler.init();
    // loads the boards to the screen
    dom.loadBoards();

    document.getElementById("send-board-button").addEventListener('click',function () {
        dom.addBoard($('#create-board-form').serializeArray()[1]['value']);
        console.log('wut')
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


}

init();
