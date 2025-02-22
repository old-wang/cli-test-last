import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:7001'

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})

const onSuccess = (res) => {
  return res.data
}

const onFailed = (err) => {
  return Promise.reject(err)
}

service.interceptors.response.use(onSuccess, onFailed)

export default service