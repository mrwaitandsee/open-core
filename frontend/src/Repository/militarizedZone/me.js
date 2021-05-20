import axios from 'axios';
import { API_URI } from '../../Constants';
import { storage } from '../Storage';

export async function me() {
  try {
    const res = await axios({
      timeout: 60 * 60 * 1000,
      method: 'POST',
      url: `${API_URI}api/militarized-zone/me`,
      headers: {
        authorization: `Bearer ${storage.getToken()}`
      },
    });
    return res.data;
  } catch(error) {
    return error.response.data;
  }
}
