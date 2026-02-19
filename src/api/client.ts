import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://fakestoreapi.com'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)
