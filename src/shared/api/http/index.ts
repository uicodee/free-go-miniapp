import axios, { type AxiosRequestConfig } from 'axios';

const api = axios.create({
  responseType: 'json',
  withCredentials: false,
  baseURL: import.meta.env.VITE_API_URL,
});

export const createInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const r = await api({
    ...config,
    ...options,
  });
  return r.data;
};

export type BodyType<Data> = Data;
