// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function () {
        // retrieves boards and makes showBoards called
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    // here comes more features
    addBoard: function (boardTitle) {
        if(boardTitle.length){
            document.getElementById('template-board').getElementsByClassName('board-title')[0].textContent = boardTitle;
            console.log(boardTitle);
            console.log(document.getElementById('template-board'));
            let boardTemplateClone = document.getElementById('template-board').getElementsByClassName('card')[0].cloneNode(true);
            document.getElementById('boards').appendChild(boardTemplateClone);
            document.getElementById('board-title').setAttribute('class','form-control is-valid');
            $('#create-board').modal('hide');
        }else{
            document.getElementById('board-title').setAttribute('class','form-control is-invalid');
        }
    }
    
    // setFormError: function (fieldId, errorCode) {
    // document.getElementById(fieldId).setAttribute('class','form-control is-invalid');
    //
    // }
};
