import urlJoin from 'url-join'
import axios from 'axios'

const getNpmInfo = (npmName) => {
  const registy = 'https://registry.npmjs.org'
  const url = urlJoin(registy, npmName)
  return axios.get(url).then(res => {
    try {
      return res.data
    } catch(err) {
      return Promise.reject(err)
    }
  })
}

export const getLatestVersion = (npmName) => {
  return getNpmInfo(npmName).then(data => {
    const latest = data['dist-tags']?.latest
    if(!latest) {
      log.error('没有最新版本号')
      return Promise.reject(new Error('没有最新版本号'))
    }

    return latest
  })
}