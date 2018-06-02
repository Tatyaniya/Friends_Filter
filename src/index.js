import './style/style.css';
import templateFunc from './templates/friends.hbs';
var listsLeft = document.getElementById('lists-left'),
    listRight = document.getElementById('lists-right'),
    save = document.getElementById('save'),
    notSelected = [], // массив полученных друзей
    selected = []; // массив выбранных друзей

let templates = require('../index.hbs');

import { filter } from './js/filter';
//import { dragging } from './js/dragging';
//import { saveInLS } from './js/saveInLS';

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

promise
    .then(() => {
        return callAPI('friends.get', { v: 5.76, fields: 'first_name, last_name, photo_100' }); 
    })
    .then((data) => {
        notSelected = data.items;
        var template = templateFunc({ items: data.items });

        listsLeft.innerHTML = template;
    }) 

listsLeft.addEventListener('click', (e) => {
    let target = e.target;
    console.log(target);
    if (target.tagName === 'IMG' && target.getAttribute('alt') === 'plus') {
        let id = target.dataset.id;

        calcNewState('add', id);
        console.log(selected);
        console.log(notSelected);
    }
})

function calcNewState(action, id) {
    if (action === 'add') {
        const result = notSelected.reduce((res, current) => {

            if (current.id === id) {
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
        selected = [...selected, result.selected];
    }

    if (action === 'remove') {
        const result = selected.reduce((res, current) => {

            if (current.id === id) {
                res.notSelected.push(current);

                return res;
            }
            res.selected.push(current);

            return res;
        }, {
            notSelected: [],
            selected: []
        })
  
        notSelected = [...notSelected, result.notSelected];
        selected = [...result.selected];
    }
}