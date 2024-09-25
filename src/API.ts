import axios, { AxiosRequestConfig, AxiosResponse, Method, InternalAxiosRequestConfig } from "axios";

// Create an Axios instance with base URL
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string, // Ensure the environment variable is typed as string
});

// Interceptor to add Authorization header if token exists
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => { // Use InternalAxiosRequestConfig here
    const user = localStorage.getItem("user");

    if (user) {
      try {
        const userObj = JSON.parse(user);
        const token = userObj?.token;

        if (token) {
          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else {
          console.error("Token not found in the user object.");
        }
      } catch (error) {
        console.error("Error parsing user object from localStorage:", error);
      }
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Type definitions for API calls
interface ApiResponse<T = any> {
  data: T;
}

export const Api = {
  get: <T = any>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiInstance.get<ApiResponse<T>>(endpoint, { params });
  },

  post: <T = any>(
    endpoint: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiInstance.post<ApiResponse<T>>(endpoint, data, config);
  },

  put: <T = any>(
    endpoint: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiInstance.put<ApiResponse<T>>(endpoint, data, config);
  },

  delete: <T = any>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiInstance.delete<ApiResponse<T>>(endpoint, { params });
  },

  call: <T = any>(
    method: Method,
    endpoint: string,
    data?: any,
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiInstance({
      method,
      url: endpoint,
      data,
      params,
    });
  },
};
