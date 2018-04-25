import axios from 'axios';

export const HTTP = axios.create({
  //baseURL: `http://jsonplaceholder.typicode.com/`,
  baseURL: `http://localhost:8080/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})