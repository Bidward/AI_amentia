import axios from '@/libs/api.request'
import $qs from 'qs'
import { baseUrl } from '@/api/base.js'

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password
  }
  return axios.request({
    url: baseUrl + '/login',
    data: $qs.stringify(data),
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: baseUrl + '/login/getuser',
    method: 'post',
    data: $qs.stringify(token)
  })
}

export const logout = (token) => {
  return axios.request({
    // url: 'logout',
    url: baseUrl + '/login/removeuser',
    method: 'post',
    data: $qs.stringify(token)
  })
}
