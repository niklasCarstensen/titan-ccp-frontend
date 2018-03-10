import axios from 'axios';

export const HTTP = axios.create({
  //baseURL: `http://jsonplaceholder.typicode.com/`,
  baseURL: `http://localhost:4567/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})