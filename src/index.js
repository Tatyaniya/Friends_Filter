import './style/style.css';
import templateFunc from './templates/friends.hbs';
import { isMatching } from './js/filter';
//import { dragging } from './js/dragging';
//import { saveInLS } from './js/saveInLS';

var listsLeft = document.getElementById('lists-left'),
    listsRight = document.getElementById('lists-right'),
    save = document.getElementById('save'),
    notSelected = localStorage.friends ? 
        JSON.parse(localStorage.friends).notSelected : 
        [{
            first_name:"Andrey",
            id: 646143,
            last_name: "Lakhmanets",
            online: 0,
            photo_100: "https://pp.userapi.com/c10115/u646143/d_25304ef1.jpg?ava=1"
        },
        {
            first_name:"tyrty",
            id: 666643,
            last_name: "Lats",
            online: 0,
            photo_100: "https://pp.userapi.com/c10115/u646143/d_25304ef1.jpg?ava=1"
        },
        {
            first_name:"Arey",
            id: 6678883,
            last_name: "Lakhmts",
            online: 0,
            photo_100: "https://pp.userapi.com/c10115/u646143/d_25304ef1.jpg?ava=1"
        },
        {
            first_name:"fghdlh",
            id: 6673333,
            last_name: "Lakhmanets",
            online: 0,
            photo_100: "https://pp.userapi.com/c10115/u646143/d_25304ef1.jpg?ava=1"
        },
        {
            first_name:"tert",
            id: 667555,
            last_name: "Lakhmanets",
            online: 0,
            photo_100: "https://pp.userapi.com/c10115/u646143/d_25304ef1.jpg?ava=1"
        },
        {
            first_name:"vczxvczx",
            id: 6671222,
            last_name: "Lakhmanets",
            online: 0,
            photo_100: "https://pp.userapi.com/c10115/u646143/d_25304ef1.jpg?ava=1"
        },
        {
            first_name:"oipoip",
            id: 611143,
            last_name: "Lakhmanets",
            online: 0,
            photo_100: "https://pp.userapi.com/c10115/u646143/d_25304ef1.jpg?ava=1"
        }], // массив полученных друзей
    selected = localStorage.friends ? JSON.parse(localStorage.friends).selected : []; // массив выбранных друзей
const searchLeft = document.getElementById('search-left');
const searchRight = document.getElementById('search-right');
let templates = require('../index.hbs');

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
/*if (localStorage.friends) {
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
}*/

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

function render() {
    const notSelected = searchAffect('left');
    const selected = searchAffect('right');

    listsLeft.innerHTML = templateFunc({ items: notSelected });
    listsRight.innerHTML = templateFunc({ items: selected });
    
}

searchLeft.addEventListener('keyup', (e) => {
    render();
})

searchRight.addEventListener('keyup', (e) => {
    render();
})

function searchAffect(which) {
    if (which === 'left') {
        let value = searchLeft.value;

        return notSelected.filter((friend) => {
            return isMatching(friend.first_name, value); 
        })
    }
    if (which === 'right') {
        let value = searchRight.value;

        return selected.filter((friend) => {
            return isMatching(friend.first_name, value); 
        })
    }
}

// ДНД слева
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
render();