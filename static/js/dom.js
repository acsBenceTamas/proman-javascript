// It uses data_handler.js to visualize elements
let dom = {
    inEditMode: false,

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
        dataHandler.getStatusesByBoardId(boardId, function (data) {
            if(data){
                for(let status of data){
                    dom.addStatusToBoard(boardId, status.name, status.id);
                }
                dom.loadCards(boardId);
            }
        })
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
            newCard.innerHTML =`<p class="text-secondary border-0 bg-transparent align-bottom mb-0">${card.title}</p>`;
            newCard.id = 'card-id-'+card.id;
            newCard.dataset.statusId = card.status_id;
            newCard.dataset.id = card.id;
            newCard.dataset.posistion = card.position;
            newCard.dataset.boardId = card.board_id;
            document.querySelector('#board-id-'+card.board_id+' .status-id-'+card.status_id).appendChild(newCard);
            document.getElementById('card-title').setAttribute('class','form-control is-valid');
            dom.removeFormError('card-create-error');
            $('#create-card').modal('hide');

            let cardEditElement = document.querySelector('#card-id-'+card.id);
            cardEditElement.dataset.title = card.title;
            cardEditElement.addEventListener('click', function (event) {
                if(event.target.tagName === 'P'){
                    dom.inEditMode = true;
                    let titleForEdit = cardEditElement.firstElementChild.textContent;
                    cardEditElement.firstElementChild.remove();

                    let newEditableCard = document.createElement('input');
                    newEditableCard.setAttribute('class', 'text-secondary w-100 border-0 bg-transparent align-bottom');
                    newEditableCard.value = titleForEdit;
                    newEditableCard.id = 'current-edit';
                    cardEditElement.appendChild(newEditableCard).focus();
                    $('#current-edit').blur(function (event) {
                        let titleForEdit = cardEditElement.firstElementChild.value;
                        dataHandler.renameCard(card.id, card.board_id, titleForEdit);
                    });
                }
            });
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

    removeBoards: function() {
        let boards = document.querySelectorAll('.board-card:not(#template-board-main-card)');
        for (let i = boards.length; i > 0; i--) {
            boards[i-1].remove();
        }
    },

    addStatusToBoard: function (boardId, statusName, statusId) {
        let cardDecksSpace = document.querySelector('#board-id-'+boardId).querySelector('.card-deck-space');
        let cardDecks = [];
        for(let cNode of cardDecksSpace.childNodes)
            if(cNode.tagName === 'DIV')
                cardDecks.push(cNode);

        let newStatus = document.querySelector('#template-status').getElementsByClassName('card')[0].cloneNode(true);
        newStatus.querySelector('.list-group').dataset.statusId = statusId;
        newStatus.querySelector('.list-group').id = 'status-id-'+statusId;
        newStatus.querySelector('.list-group').classList.add('status-id-'+statusId);
        newStatus.querySelector('.card-title').textContent = statusName;
        newStatus.querySelector('.card-body').id = 'status-name-id-'+statusId;
        newStatus.querySelector('.card-body').dataset.name = statusName;

        if(cardDecks[cardDecks.length-1].children.length < 4 || cardDecks[0].children.length < 4){
            cardDecks[cardDecks.length-1].appendChild(newStatus);
        }else{
            let newCardDeck = document.createElement('div');
            newCardDeck.setAttribute('class', 'card-deck mt-3');
            cardDecksSpace.appendChild(newCardDeck).appendChild(newStatus);
        }
        dragulaHandler.addItem(document.querySelector('#board-id-'+boardId+' .status-id-'+statusId));

        let statusEditElement = document.querySelector('#status-name-id-'+statusId);
        statusEditElement.addEventListener('click', function (event) {
            if(event.target.tagName === 'H3'){
                dom.inEditMode = true;
                let nameForEdit = statusEditElement.firstElementChild.textContent;
                statusEditElement.firstElementChild.remove();

                let newEditableStatus = document.createElement('input');
                newEditableStatus.setAttribute('class', 'card-title h3 border-0 bg-transparent align-bottom status-title');
                newEditableStatus.value = nameForEdit;
                newEditableStatus.id = 'current-edit';
                statusEditElement.appendChild(newEditableStatus).focus();
                $('#current-edit').blur(function (event) {
                    let nameForEdit = statusEditElement.firstElementChild.value;

                    dataHandler.renameStatus(statusId, boardId, nameForEdit);
                });
            }
        });
    },

    renameStatus: function (changeOk, statusId){
        let statusEditElement = document.querySelector('#status-name-id-'+statusId);
        let newName = statusEditElement.firstElementChild.value;
        statusEditElement.firstElementChild.remove();
        if(changeOk){
            statusEditElement.dataset.name = newName;
            let newEditableStatus = document.createElement('h3');
            newEditableStatus.setAttribute('class', 'card-title h3');
            newEditableStatus.textContent = newName;
            statusEditElement.appendChild(newEditableStatus);
            dom.hideAlert();
        }else{
            let newEditableStatus = document.createElement('h3');
            newEditableStatus.setAttribute('class', 'card-title h3');
            newEditableStatus.textContent = statusEditElement.dataset.name;
            statusEditElement.appendChild(newEditableStatus);
            dom.showAlert('Incorrect input.');
        }
        dom.inEditMode = false;
    },

    renameCard: function (changeOk, cardId){
        let cardEditElement = document.querySelector('#card-id-'+cardId);
        let newTitle = cardEditElement.firstElementChild.value;
        cardEditElement.firstElementChild.remove();
        if(changeOk){
            cardEditElement.dataset.title = newTitle;
            let newEditableStatus = document.createElement('p');
            newEditableStatus.setAttribute('class', 'text-secondary border-0 bg-transparent align-bottom mb-0');
            newEditableStatus.textContent = newTitle;
            cardEditElement.appendChild(newEditableStatus);
            dom.hideAlert();
        }else{
            let newEditableStatus = document.createElement('p');
            newEditableStatus.setAttribute('class', 'text-secondary border-0 bg-transparent align-bottom mb-0');
            newEditableStatus.textContent = cardEditElement.dataset.title;
            cardEditElement.appendChild(newEditableStatus);
            dom.showAlert('Incorrect input.');
        }
        dom.inEditMode = false;
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

    loadProgress: function (state) {
        let syncBtn = document.querySelector('#btn-manual-sync');
        if(state){
            syncBtn.setAttribute('disabled',true);
            syncBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        }else{
            syncBtn.removeAttribute('disabled');
            syncBtn.innerHTML = 'Synchronize';
        }
    },

    showAlert: function (errorCode='Oh snap! Something went wrong please try again.') {
        let alertSpace = document.querySelector('#alert-space');
        document.querySelector('#error-message').textContent = errorCode;
        if(alertSpace.children.length !== 0)
            alertSpace.firstElementChild.remove();
        let newError = document.querySelector('#template-alert').firstElementChild.cloneNode(true);
        alertSpace.appendChild(newError);
    },

    hideAlert: function () {
        let alertSpace = document.querySelector('#alert-space');
        if(alertSpace.children.length !== 0)
            alertSpace.firstElementChild.remove();
    },
};