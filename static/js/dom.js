// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(dom.showBoards);
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        console.log(boards);
        for(let board of boards){
            let boardTemplateClone = document.getElementById('template-board').getElementsByClassName('card')[0].cloneNode(true);
            boardTemplateClone.getElementsByClassName('board-title')[0].textContent = board.title;
            boardTemplateClone.id = 'board-id-'+board.id;
            document.getElementById('boards').appendChild(boardTemplateClone);
            boardTemplateClone.addEventListener('click', function (event) {
                if(event.target.classList.contains('send-card-button')){
                    console.log('B');
                    const cardTitle = document.getElementById('card-title').value;
                    const cardStatus = document.getElementById('card-status').value;
                    dataHandler.createNewCard(cardTitle, board.id, cardStatus, 0, dom.addCardToWindow)
                }
            })
        }
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

    addCardToWindow: function(card){
        //  <li class="list-group-item">Test 1</li>
        let newCard = document.createElement('li');
        newCard.innerText = card.title;
        newCard.dataset.statusId = card.status_id;
        newCard.dataset.id = card.id;
        newCard.dataset.posistion = card.position;
        newCard.dataset.boardId = card.board_id;
        document.querySelector('#board-id-'+card.board_id+' .status-id-'+card.status_id).appendChild(newCard);
    },

    addBoardToWindow: function (board) {
        if(board.error){
            document.getElementById('board-title').setAttribute('class','form-control is-invalid');
            dom.setFormError('board-create-error', board.error);
        } else{
            let boardTemplateClone = document.getElementById('template-board').getElementsByClassName('card')[0].cloneNode(true);
            boardTemplateClone.getElementsByClassName('board-title')[0].textContent = board.title;
            boardTemplateClone.id = 'board-id-'+board.id;
            document.getElementById('boards').appendChild(boardTemplateClone);
            document.getElementById('board-title').setAttribute('class','form-control is-valid');
            $('#create-board').modal('hide');
            dom.removeFormError('board-create-error');
        }
    },

    addCardsToBoard: function (cards){
        for(let card of cards){
            let newListObject
        }
    },
    
    setFormError: function (fieldId, errorCode) {
        document.getElementById(fieldId).setAttribute('class','text-capitalize alert alert-danger');
        document.getElementById(fieldId).innerHTML = errorCode;
    },

    removeFormError: function (fieldId) {
        document.getElementById(fieldId).setAttribute('class','');
        document.getElementById(fieldId).innerHTML = '';

    }
};
