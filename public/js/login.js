/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
import { setCookie, deleteCookie } from '../utils/cookies';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    // console.log(res);
    // Set the cookie
    setCookie(res);
    if (res.data.status === 'success') {
      showAlert('success', 'You are successfully logged in');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    // Delete cookie
    deleteCookie('jwt');
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
