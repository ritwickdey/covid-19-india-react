import axios from 'axios';

export const authAxios = axios.create({
  baseURL: 'http://142.93.219.44',
  timeout: 120000,
});
