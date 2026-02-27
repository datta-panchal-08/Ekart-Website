import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ekart-shopee.onrender.com/api/v1",
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const get = (url) => axiosInstance.get(url);
export const post = (url, data) => axiosInstance.post(url, data);
export const put = (url, data) => axiosInstance.put(url, data);
export const del = (url, data) => axiosInstance.delete(url, { data });