import './style/style.css';
import templateFunc from './templates/friends.hbs';
var listsLeft = document.getElementById('lists-left'),
    listRight = document.getElementById('lists-right'),
    save = document.getElementById('save'),
    notSelected = [], // массив полученных друзей
    selected = []; // массив выбранных друзей

    console.log(notSelected);

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
        console.log(notSelected);
        var template = templateFunc({ items: data.items });

        listsLeft.innerHTML = template;
    }) 
    console.log(notSelected);

listsLeft.addEventListener('click', (e) => {
    let target = e.target;

    if (target.tagName === 'IMG' && target.getAttribute('alt') === 'plus') {
        // target.parentNode.classList.add('hidden');
        //target.parentNode.parentNode.removeChild(target.parentNode);
        let id = target.dataset.id; // получить id пользователя
        console.log(id);

        for (let i = 0; i < notSelected.length; i++) {
            if (notSelected[i].id == id) {
                return i;
                console.log(i);
            }
        }

        console.log(i);
        notSelected.splice(indexOf[i], 1);
        selected.push[i];
    }
})