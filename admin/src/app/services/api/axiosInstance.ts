import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.yourapp.com',
})

export default axiosInstance