// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(dom.showBoards);
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        for(let board of boards){
            let boardTemplateClone = document.getElementById('template-board').getElementsByClassName('card')[0].cloneNode(true);
            boardTemplateClone.getElementsByClassName('board-title')[0].textContent = board.title;
            boardTemplateClone.id = 'board-id-'+board.id;
            boardTemplateClone.dataset.id = board.id;
            document.getElementById('boards').appendChild(boardTemplateClone);
            boardTemplateClone.addEventListener('click', function (event) {
                document.querySelector('#card-form-board-id').value = board.id;
            });
            for(let dragulaStatusElement of document.querySelector('#board-id-'+board.id).querySelectorAll('.list-group-flush')){
                dragulaHandler.addItem(dragulaStatusElement);
            }
            dom.loadCards(board.id);
        }
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, dom.showCards);
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        if(cards)
            for(let card of cards){
                console.log('showCard');
                dom.addCardToWindow(card);
            }
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
        newCard.setAttribute('class', 'list-group-item');
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
            boardTemplateClone.dataset.id = board.id;
            boardTemplateClone.addEventListener('click', function (event) {
                document.querySelector('#card-form-board-id').value = board.id;
            });
            document.getElementById('boards').appendChild(boardTemplateClone);
            document.getElementById('board-title').setAttribute('class','form-control is-valid');
            $('#create-board').modal('hide');
            dom.removeFormError('board-create-error');
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
