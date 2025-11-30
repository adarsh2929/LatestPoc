import type { AxiosError } from "axios";
import http from "./http";
import { enqueueSnackbar } from 'notistack';



// export const CreateCategory = async (data: any) => {
//     try {
//       const response = await http.post(`/points-recognition/categories`, data);
//       return response;
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<any>;
//       console.log(axiosError.response?.data.message);
//     }
//   };


export const getHome = async (query?: string) => {
    try {
      const response = await http.get('/todos/1');
      return response;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<any>;
      enqueueSnackbar(axiosError.response?.data.message, { variant: 'error' });
    }
  };

//   export const editCategory = async (
//     id: string,
//     data: ICreateCategoryPayload
//   ) => {
//     try {
//       const response = await http.put(
//         `/points-recognition/categories/${id}`,
//         data
//       );
//       return response;
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<ApiErrorData>;
//       enqueueSnackbar(axiosError.response?.data.message, { variant: 'error' });
//     }
//   };
  
  