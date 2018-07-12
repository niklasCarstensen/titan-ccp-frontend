import axios from 'axios';

export const HTTP = axios.create({
  baseURL: `http://localhost:31100/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})