/* eslint-disable */

// Removing Alert Function
export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

// Show Alert Function | Displaying Error/Success Messages | Flash Messages
export const showAlert = (type, msg) => {
    // Hide all previous alerts
    hideAlert();

    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

    window.setTimeout(hideAlert, 5000);
};