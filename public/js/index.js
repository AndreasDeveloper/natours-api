/* eslint-disable */

// Importing Files
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';


// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

// -- Map box setup -- \\
// Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations); // Getting locations from dataset
    displayMap(locations);
}


// Event Listener on submission of a form
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}