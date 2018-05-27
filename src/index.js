import './style.css';
require('../index.hbs');

VK.init({
    apiId: 6490248
});

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

auth().then(() => console.log('ok'));