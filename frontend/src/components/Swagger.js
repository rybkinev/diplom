import React, { useMemo } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import {useDispatch, useSelector} from 'react-redux';
import api, {API_URL} from "../api";
import axios from "axios";
import {logoutUser, updateAccessToken} from "../store/userSlice";

const Swagger = () => {
  const token = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();

  const swaggerOptions = useMemo(() => ({
    url: `${API_URL}/api/v1/schemas`,
    requestInterceptor: async (req) => {
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      return req;
    },
    responseInterceptor: async (response) => {
      if (response.status === 401 && refreshToken) {
        try {
          const { data } = await axios.post(
            `${API_URL}/api/v1/account/token/refresh/`,
            { refresh: refreshToken }
          );
          const newAccessToken = data.access;
          dispatch(updateAccessToken({ accessToken: newAccessToken }));

          const retryOriginalRequest = {
            ...response.config,
            headers: {
              ...response.config.headers,
              'Authorization': `Bearer ${newAccessToken}`,
            },
          };
          return api(retryOriginalRequest);
        } catch (error) {
          dispatch(logoutUser());
        }
      }
      return response;
    },
  }), [token]);

  return <SwaggerUI {...swaggerOptions} />;
};

export default Swagger;