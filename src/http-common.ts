import axios from 'axios';

export const HTTP = axios.create({
  //baseURL: `http://jsonplaceholder.typicode.com/`,
  baseURL: `http://localhost:31100/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})

export const HTTP_CONFIGURATION = axios.create({
  //baseURL: `http://jsonplaceholder.typicode.com/`,
  baseURL: `http://localhost:31100/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})