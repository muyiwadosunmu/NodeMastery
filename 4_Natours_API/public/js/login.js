import axios from 'axios';
import { showAlert } from './alerts';

const headers = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Content-Type': 'application/json',
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      headers,
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('successs', 'Logged In successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });
    if ((res.data.success = 'success')) location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out, Try again');
  }
};
