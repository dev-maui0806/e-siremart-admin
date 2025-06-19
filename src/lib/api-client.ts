import axios from 'axios';
import { getSiteURL } from './get-site-url';

const apiClient = axios.create({
  baseURL: getSiteURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
