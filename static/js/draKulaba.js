let dragulaHandler = {
    init: function () {
        let dragulaElements = [...document.querySelectorAll('.list-group-flush')];
        dragulaHandler.dragAndDrop = dragula(dragulaElements,{accepts: dragulaHandler.checkValidTarget, moves: dragulaHandler.checkIfMoveAble, revertOnSpill: true});
        dragulaHandler.dragAndDrop.on('drop',function (el, target, source, sibling) {
            if (target.classList.contains('card-trash')) {
                $.get('/cards/delete/'+el.dataset.id);
                el.remove();
            } else if (target.classList.contains('archive-card-field')) {
                $.get('/cards/archive/'+el.dataset.id);
                el.remove();
            } else {
                let cardsToChange = [];
                for(let i=0; source.children.length>i; i++){
                    cardsToChange.push({id: source.children[i].dataset.id, position: i});
                }
                for(let i=0; target.children.length>i; i++){
                    cardsToChange.push({id: target.children[i].dataset.id, position: i});
                }
                cardsToChange.push({id: el.dataset.id, status_id: target.dataset.statusId});
                $.post('/cards/update/', {a: JSON.stringify(cardsToChange)});
            }
        })
    },

    checkValidTarget: function(el, target, source, sibling) {
        return target.closest('.board-card').dataset.id === source.closest('.board-card').dataset.id;
    },

    checkIfMoveAble: function(el, target, source, sibling) {
        return el.tagName === 'LI';
    },

    addItem: function (elementToMove) {
        dragulaHandler.dragAndDrop.containers.push(elementToMove);
    },
};