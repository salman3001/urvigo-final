import axios from 'axios'
const apiBaseUrl = 'http://127.0.0.1:3333'
const api = axios.create({
  baseURL: apiBaseUrl,
})

export default api
