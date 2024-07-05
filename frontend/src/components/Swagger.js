import React, { useMemo } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useSelector } from 'react-redux';
import api from "../api";

const Swagger = () => {
  const token = useSelector((state) => state.user.accessToken);

  const swaggerOptions = useMemo(() => ({
    url: 'http://localhost:8000/api/v1/schemas',
    requestInterceptor: async (req) => {
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      return req;
    },
    request: (request) => {
      return api({
        method: request.method,
        url: request.url,
        data: request.body,
        headers: request.headers,
      })
        .then((response) => {
          return {
            ok: true,
            url: request.url,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            text: response.data,
          };
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    },
  }), [token]);

  return <SwaggerUI {...swaggerOptions} />;
};

export default Swagger;