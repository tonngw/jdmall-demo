import axios from 'axios'

// encapsulate axios instance
const http = axios.create({
  baseURL: 'http://localhost:8091/',
  timeout: 3000,
  headers: { 'X-Custom-Header': 'smallbaitiao' }
});

export default http;