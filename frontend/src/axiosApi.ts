import axios, {AxiosHeaders} from "axios";
import {baseURL} from "./globalConstants.ts";
import {RootState} from "./app/store.ts";
import {Store} from "@reduxjs/toolkit";

export const addInterceptors = (store: Store<RootState>) => {
  axiosApi.interceptors.request.use((config) => {
    const token = store.getState().users.user?.token;
    if(!token) return config;
    const headers = config.headers as AxiosHeaders;
    headers.set ("Authorization", "Bearer " + token);
    return config;
  });
};

const axiosApi = axios.create({
  baseURL: baseURL,
});

export default axiosApi;