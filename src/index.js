import './style/style.css';
import templateFunc from './templates/friends.hbs';
import { isMatching, searchAffect } from './js/filter';
import { calcNewState } from './js/calcNewState.js';
import { dndLeft, dndRight } from './js/dnd.js';
dndLeft();
dndRight();

var templates = require('../index.hbs'),
    listsLeft = document.getElementById('lists-left'),
    listsRight = document.getElementById('lists-right'),
    searchLeft = document.getElementById('search-left'),
    searchRight = document.getElementById('search-right'),
    save = document.getElementById('save'),
    notSelected = [], // массив полученных друзей
    selected = []; // массив выбранных друзей

// авторизоваться
const promise = new Promise((resolve, reject) => {
    VK.init({
        apiId: 6491689
    });

    VK.Auth.login(data => {
        if (data.session) {
            resolve(data);
        } else {
            reject(new Error('Не удалось авторизоваться'));
        }
    }, 2);
});

function callAPI(method, params) {

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    });
}
if (localStorage.friends) {
    const friends = JSON.parse(localStorage.friends);

    notSelected = friends.notSelected;
    selected = friends.selected;
    render();
} else {
    promise
        .then(() => {
            return callAPI('friends.get', { v: 5.76, fields: 'first_name, last_name, photo_100' }); 
        })
        .then((data) => {
            notSelected = data.items;
            var template = templateFunc({ items: data.items });

            listsLeft.innerHTML = template;
        })
}

// клик по левому списку
listsLeft.addEventListener('click', (e) => {
    let target = e.target;

    if (target.tagName === 'IMG' && target.getAttribute('alt') === 'plus') {
        let id = target.dataset.id;

        calcNewState('add', id);
        render();   
    }
});

// клик по правому списку
listsRight.addEventListener('click', (e) => {
    let target = e.target;

    if (target.tagName === 'IMG' && target.getAttribute('alt') === 'plus') {
        let id = target.dataset.id;

        calcNewState('remove', id);
        render();
    }
});

// отрисовка
function render() {
    const notSelected = searchAffect('left');
    const selected = searchAffect('right');

    listsLeft.innerHTML = templateFunc({ items: notSelected });
    listsRight.innerHTML = templateFunc({ items: selected });
    
}

// поиск
searchLeft.addEventListener('keyup', () => {
    render();
})

searchRight.addEventListener('keyup', () => {
    render();
})

// сохранение
function saveToLocalStorage() {
    localStorage.friends = JSON.stringify({
        notSelected,
        selected
    });
    alert('сохранено');
}

save.addEventListener('click', (e) => {
    saveToLocalStorage();
})

export {
    render,
    calcNewState
}