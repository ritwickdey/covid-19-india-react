import axios from 'axios';

export const authAxios = axios.create({
  baseURL: 'http://localhost:5566',
  timeout: 120000,
});
