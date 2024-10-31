// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://api.bellybasketstore.in"
});
console.log(axiosInstance);

export default axiosInstance;
