import axios from 'axios';

export const HTTP = axios.create({
  //baseURL: `http://jsonplaceholder.typicode.com/`,
  baseURL: `http://localhost:8081/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})

export const HTTP_CONFIGURATION = axios.create({
  //baseURL: `http://jsonplaceholder.typicode.com/`,
  baseURL: `http://localhost:8082/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})