import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://6364ac837b209ece0f4b06db.mockapi.io/'
})

export const getUserList = async () => {
  const response = await api.get('/userList')
  return response
}

export const getUserDetail = async (data) => {
  const response = await api.get('/users', data)
  return response
}

export const getFormData = async (data) => {
  const response = await axios.get('https://63f4666955677ef68bbb0bf3.mockapi.io/form')
  return response
}
