import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_LOCAL_URL = 'http://10.22.22.158:5000';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_LOCAL_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
