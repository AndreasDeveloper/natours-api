/* eslint-disable */

// Importing Files
import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserData = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/users/updateMe',
            data: {
                name,
                email
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Data updated successfully');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};