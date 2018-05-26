import './style.css';
require('../index.hbs');

VK.init({
    apiId: 6490248
});
const save = document.getElementById('#save');

save.addEventListener('click', () => {
    save.style.backgroundColor = 'red';
})