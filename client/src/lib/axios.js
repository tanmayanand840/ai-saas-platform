import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API request failed", {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      response: error.response?.data,
    });

    // Axios otherwise exposes only "Request failed with status code 403",
    // hiding the useful message returned by the API.
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) {
      error.message = apiMessage;
    }

    return Promise.reject(error);
  }
);

export default api;
