import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://classmate-five.vercel.app/api',
})
