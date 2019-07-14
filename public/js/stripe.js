/* eslint-disable */

// Importing Files
import axios from 'axios';
import { showAlert } from './alerts';
// Getting Stripe object
const stripe = Stripe('pk_test_C6zIlfBGWa7JVoHwvUtU7ssR00cXuRurZh');

// Function for booking tours
export const bookTour = async tourId => {
    try {
        // Get the checkout session from the server
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);

        // Create checkout form & charge the credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        showAlert('error', err);
    }
};