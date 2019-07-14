/* eslint-disable */

// Importing Files
import axios from 'axios';
import { showAlert } from './alerts';

// Function for updating user settings
export const updateSettings = async (data, type) => { // data - object of data to be updated. type - password or data
    try {
        const url = type === 'password' ? 'http://localhost:3000/api/v1/users/updatePassword' : 'http://localhost:3000/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};