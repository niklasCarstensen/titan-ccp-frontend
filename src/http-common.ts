import axios from 'axios';

export const HTTP = axios.create({
  //baseURL: `http://jsonplaceholder.typicode.com/`,
  baseURL: `http://localhost:31102/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})

export const HTTP_CONFIGURATION = axios.create({
  //baseURL: `http://jsonplaceholder.typicode.com/`,
  baseURL: `http://localhost:31101/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})