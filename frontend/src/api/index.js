import axios from 'axios';
import {logoutUser, setUser, updateAccessToken} from "../store/userSlice";
import store from "../store/store";


const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.user.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // console.debug('api.interceptors.response originalRequest', originalRequest);

    // Получаем текущее состояние из хранилища
    const state = store.getState();

    // Проверяем, что ошибка 401 и запрос не был повторен ранее.
    if (!originalRequest._retry && error.response?.status === 401 && state.user.refreshToken) {
      originalRequest._retry = true;

      try {
        // console.debug('api.interceptors.response update token');
        // Запрос на обновление токена
        const response = await axios.post(
          `${API_URL}/api/v1/account/token/refresh/`,
          {refresh: state.user.refreshToken},
          );

        const { access } = response.data;

        // Обновляем токен в глобальном состоянии
        store.dispatch(updateAccessToken({ accessToken: access }));

        // Устанавливаем новый токен в заголовки оригинального запроса
        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        // Повторяем оригинальный запрос с новым токеном
        return api(originalRequest);

      } catch (refreshError) {
        console.debug('api.interceptors.response catch', refreshError);

        // Logout при провале обновления токена
        store.dispatch(logoutUser());
      }
    }

    // Если ошибка не связана с токеном или обновление токена провалилось
    // console.debug('api.interceptors.response Promise')
    return Promise.reject(error);
  }
);

export default api;
