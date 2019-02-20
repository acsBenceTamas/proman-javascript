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
            dom.addBoardToWindow(board);
            dom.loadStatuses(board.id);
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
                dom.addCardToWindow(card);
            }
    },
    loadStatuses: function (boardId) {
        dataHandler.getStatusesByBoardId(boardId)
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
        if(card.error){
            document.getElementById('card-title').setAttribute('class','form-control is-invalid');
            dom.setFormError('card-create-error', card.error);
        }else if (card.archived === false) {
            let newCard = document.createElement('li');
            newCard.setAttribute('class', 'list-group-item bg-dark');
            newCard.innerText = card.title;
            newCard.dataset.statusId = card.status_id;
            newCard.dataset.id = card.id;
            newCard.dataset.posistion = card.position;
            newCard.dataset.boardId = card.board_id;
            document.querySelector('#board-id-'+card.board_id+' .status-id-'+card.status_id).appendChild(newCard);
            document.getElementById('card-title').setAttribute('class','form-control is-valid');
            dom.removeFormError('card-create-error');
            $('#create-card').modal('hide');
        }
    },

    addBoardToWindow: function (board) {
        if(board.error){
            document.getElementById('board-title').setAttribute('class','form-control is-invalid');
            dom.setFormError('board-create-error', board.error);
        } else{
            let boardTemplateClone = document.getElementById('template-board').getElementsByClassName('card')[0].cloneNode(true);
            boardTemplateClone.getElementsByClassName('board-title')[0].value = board.title;
            boardTemplateClone.getElementsByClassName('board-title')[0].dataset.title = board.title;
            boardTemplateClone.getElementsByClassName('board-title')[0].id = 'board-title-input-'+board.id;
            boardTemplateClone.id = 'board-id-'+board.id;
            boardTemplateClone.dataset.id = board.id;
            if(document.querySelector('#user-data').dataset.userId){
                boardTemplateClone.querySelector('.btn-board-delete').addEventListener('click', function (event) {
                    document.querySelector('#delete-board-confirmation').dataset.boardId=board.id;
                    document.querySelector('#delete-board-name').textContent = board.title;
                    $('#delete-board-confirmation').modal('show');
                });
            }
            boardTemplateClone.querySelector('.archive-card-field').addEventListener('click', function (event) {
                $.get(`/cards/archive/board/${board.id}/`, function (data) {
                    data = JSON.parse(data);
                    let listContainer = document.querySelector('#archived-cards-list');
                    if (data) {
                        listContainer.textContent = "";
                        dom.generateArchivedCardList(data, listContainer);
                    } else {
                        listContainer.textContent = "No archived cards for this board.";
                    }
                    $('#archived-cards').modal('show');
                })
            });
            boardTemplateClone.addEventListener('click', function (event) {
                document.querySelector('#card-form-board-id').value = board.id;
                document.querySelector('#status-form-board-id').value = board.id;
            });
            document.getElementById('boards').appendChild(boardTemplateClone);
            document.getElementById('board-title').setAttribute('class','form-control is-valid');
            for(let dragulaStatusElement of document.querySelector('#board-id-'+board.id).querySelectorAll('.list-group-flush')){
                dragulaHandler.addItem(dragulaStatusElement);
            }
            dragulaHandler.addItem(document.querySelector('#board-id-'+board.id+' .card-trash'));
            dragulaHandler.addItem(document.querySelector('#board-id-'+board.id+' .archive-card-field'));

            $('#create-board').modal('hide');
            dom.removeFormError('board-create-error');

            $('#board-title-input-'+board.id).blur(function (event) {
                dataHandler.renameBoard(board.id, event.target.value);
            })
        }
    },

    addStatusToBoard: function (boardId, statusName, statusId) {
        let cardDecksSpace = document.querySelector('#board-id-'+boardId).querySelector('.card-deck-space');
        if(cardDecksSpace.children.length === 0){
                let newCardDeck = document.createElement('div');
                newCardDeck.setAttribute('class', 'card-deck');
                cardDecksSpace.appendChild(newCardDeck);
        }
        let cardDecks = [];
        for(let cNode of cardDecksSpace.childNodes)
            if(cNode.tagName === 'DIV')
                cardDecks.push(cNode);
        if(cardDecks[cardDecks.length-1].children.length < 4 || cardDecks[0].children.length < 4){
            let newStatus = document.querySelector('#template-status').getElementsByClassName('card')[0].cloneNode(true);
            newStatus.querySelector('.list-group').dataset.statusId = statusId;
            newStatus.querySelector('.list-group').classList.add('status-id-'+statusId);
            newStatus.querySelector('.card-title').textContent = statusName;

            cardDecks[cardDecks.length-1].appendChild(newStatus);
        }else{
            let newCardDeck = document.createElement('div');
            newCardDeck.setAttribute('class', 'card-deck mt-3');

            let newStatus = document.querySelector('#template-status').getElementsByClassName('card')[0].cloneNode(true);
            newStatus.querySelector('.list-group').dataset.statusId = statusId;
            newStatus.querySelector('.list-group').classList.add('status-id-'+statusId);
            newStatus.querySelector('.card-title').textContent = statusName;

            cardDecksSpace.appendChild(newCardDeck).appendChild(newStatus);
        }
        dragulaHandler.addItem(document.querySelector('#board-id-'+boardId+' .status-id-'+statusId));
    },
    
    setFormError: function (fieldId, errorCode) {
        document.getElementById(fieldId).setAttribute('class','text-capitalize alert alert-danger');
        document.getElementById(fieldId).innerHTML = errorCode;
    },

    removeFormError: function (fieldId) {
        document.getElementById(fieldId).setAttribute('class','');
        document.getElementById(fieldId).innerHTML = '';

    },

    generateArchivedCardList: function (cards, listContainer) {
        let list = listContainer.querySelector('ul');
        if (list) list.remove();
        list = document.createElement('ul');
        for (let card of cards) {
            row = document.createElement('li');
            row.innerHTML=
                `<button class="btn btn-success" data-card-id="${card.id}">Unarchive Card</button> ${card.title}`;
            list.appendChild(row);
        }
        listContainer.appendChild(list)
    },
};