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



}

init();
