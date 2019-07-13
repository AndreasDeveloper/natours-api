/* eslint-disable */

// Importing Files
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';


// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

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