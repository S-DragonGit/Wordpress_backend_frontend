import axios from "axios";

const AxiosInstance = (token: string | null) => {
  const instance = axios.create({
    // baseURL: "http://localhost/wordpress/index.php/api/wp",
    baseURL: "https://rafiki.momoagency.co/index.php/api/wp1",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      config.headers = config.headers || {};

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      config.headers["Content-Type"] = "application/json";
      // Log the request
      console.log("Request:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });

      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      console.log("Response:", response);
      return response;
    },
    (error) => {
      console.error("Response error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      return Promise.reject(error);
    }
  );

  return instance;
};

export default AxiosInstance;
