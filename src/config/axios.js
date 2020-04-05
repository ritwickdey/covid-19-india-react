import axios from 'axios';

export const authAxios = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  timeout: 120000,
});
