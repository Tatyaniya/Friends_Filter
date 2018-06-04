import './style/style.css';
import templateFunc from './templates/friends.hbs';
import { isMatching } from './js/filter';

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

// ДНД слева направо
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

// ДНД справа налево
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

// добавление/удаление элементов в массивы
function calcNewState(action, id) {
    if (action === 'add') {
        const result = notSelected.reduce((res, current) => {

            if (current.id == id) {
                res.selected.push(current);

                return res;
            }
            res.notSelected.push(current);

            return res;
        }, {
            notSelected: [],
            selected: []
        })
  
        notSelected = [...result.notSelected];
        selected = [...selected, ...result.selected];
    }

    if (action === 'remove') {
        const result = selected.reduce((res, current) => {

            if (current.id == id) {
                res.notSelected.push(current);

                return res;
            }
            res.selected.push(current);

            return res;
        }, {
            notSelected: [],
            selected: []
        })
  
        notSelected = [...notSelected, ...result.notSelected];
        selected = [...result.selected];
    }
}

// фильтрация
function searchAffect(which) {
    if (which === 'left') {
        let value = searchLeft.value;

        return notSelected.filter((friend) => {
            return isMatching(friend.first_name, value) || isMatching(friend.last_name, value); 
        })
    }
    if (which === 'right') {
        let value = searchRight.value;

        return selected.filter((friend) => {
            return isMatching(friend.first_name, value) || isMatching(friend.last_name, value); 
        })
    }
}

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