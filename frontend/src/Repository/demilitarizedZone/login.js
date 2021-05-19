import axios from 'axios';
import { API_URI } from '../../Constants';

export async function login(nickname, password) {
  try {
    const res = await axios({
      timeout: 60 * 60 * 1000,
      method: 'POST',
      url: `${API_URI}api/demilitarized-zone/login`,
      data: {
        username: nickname,
        password: password,
      },
    });
    return res.data;
  } catch(error) {
    return error.response.data;
  }
}
