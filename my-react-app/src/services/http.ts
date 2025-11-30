import axios from 'axios';

export const http = axios.create({
    baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // http.interceptors.request.use(
  //   async (config) => {
  //     // Attach an AbortController to the request
  //     const requestToken = generateRequestToken(config);
  //     const abortController = new AbortController();
  //     abortControllers.set(requestToken, abortController);
  //     config.signal = abortController.signal;
  //     // Set timeout for the request
  //     config.timeout = 50000;
  
  //     const { user } = useUser.getState();
  
  //     // Set Authorization header
  //     config.headers.Authorization = `Bearer ${String(user.token)}`;
  //     return config;
  //   },
  //   async (error) => {
  //     return await Promise.reject(error);
  //   }
  // );

export default http;