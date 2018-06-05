import { calcNewState } from './js/calcNewState.js';
import { render } from '../index.js';
import listsLeft from '../index.js';
import listsRight from '../index.js';

// ДНД слева направо
function dndLeft() {
    listsLeft.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("Text", e.target.querySelector('.friend_plus').dataset.id );
    })

    listsRight.addEventListener('drop', (e) => {
        const userId = e.dataTransfer.getData("Text");

        calcNewState('add', userId);
        render();
    })

    listsRight.addEventListener('dragenter', (e) => {
        e.preventDefault();
    })

    listsRight.addEventListener('dragleave', (e) => {
        e.preventDefault();
    })

    listsRight.addEventListener('dragover', (e) => {
        e.preventDefault();
    })

    listsLeft.addEventListener('dragend', (e) => {
        e.preventDefault();
    })
}

// ДНД справа налево
function dndRight() {
    listsRight.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("Text", e.target.querySelector('.friend_plus').dataset.id );
    })

    listsLeft.addEventListener('drop', (e) => {
        const userId = e.dataTransfer.getData("Text");

        calcNewState('remove', userId);
        render();
    })

    listsLeft.addEventListener('dragenter', (e) => {
        e.preventDefault();
    })

    listsLeft.addEventListener('dragleave', (e) => {
        e.preventDefault();
    })

    listsLeft.addEventListener('dragover', (e) => {
        e.preventDefault();
    })

    listsRight.addEventListener('dragend', (e) => {
        e.preventDefault();
    })
}

export {
    dndLeft,
    dndRight
}