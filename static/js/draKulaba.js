let dragulaHandler = {
    init: function () {
        let dragulaElements = [...document.querySelectorAll('.list-group-flush')];
        dragulaHandler.dragAndDrop = dragula(dragulaElements,{accepts: dragulaHandler.checkIfMoveAble});
        dragulaHandler.dragAndDrop.on('drop',function (el, target, source, sibling) {
            let cardsToChange = [];
            for(let i=0; source.children.length>i; i++){
                cardsToChange.push({id: source.children[i].dataset.id, position: i});
            }
            for(let i=0; target.children.length>i; i++){
                cardsToChange.push({id: target.children[i].dataset.id, position: i});
            }
            cardsToChange.push({id: el.dataset.id, status_id: target.dataset.statusId});
            $.post('/cards/update/', {a: JSON.stringify(cardsToChange)});
        })
    },

    checkIfMoveAble: function(el, target, source, sibling) {
        return target.closest('.board-card').dataset.id === source.closest('.board-card').dataset.id;
    },

    addItem: function (elementToMove) {
        dragulaHandler.dragAndDrop.containers.push(elementToMove);
    },
};