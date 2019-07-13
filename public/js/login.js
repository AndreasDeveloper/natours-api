/* eslint-disable */

// Login Function
const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            alert('Logged In');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }

    } catch (err) {
        alert(err.response.data.message);
    }
};

// DOM Elements
const form = document.querySelector('.form');

// Event Listener on submission of a form
form.addEventListener('submit', e => {
    e.preventDefault();

    // Getting DOM Email & Password Input Field Values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});