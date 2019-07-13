/* eslint-disable */

// Importing Files
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateUserData } from './updateSettings';


// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');

// -- Map box setup -- \\
// Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations); // Getting locations from dataset
    displayMap(locations);
}


// Event Listener on submission of a form | Logging in user
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

// Event Listener on logout button click | Logging out user
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Event Listener on submission of a form | Updating user data
if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateUserData(name, email);
    });
}