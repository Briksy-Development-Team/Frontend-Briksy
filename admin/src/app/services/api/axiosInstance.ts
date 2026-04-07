import axios from 'axios'
import {getAuth} from '../../modules/auth/core/AuthHelpers'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'https://briksy.elsolveit.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const auth = getAuth()

  if (auth?.api_token) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>).Authorization = `Bearer ${auth.api_token}`
  }

  return config
})

export default axiosInstance
