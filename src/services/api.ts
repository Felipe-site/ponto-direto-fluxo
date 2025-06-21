import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api", 
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Interceptador: Token inválido ou expirado. Fazendo logout.");

      localStorage.removeItem("token");

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
