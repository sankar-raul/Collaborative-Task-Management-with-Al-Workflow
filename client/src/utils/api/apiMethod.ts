import { headers } from "../../config/config";
import API from "./api";

export const get = async <T = unknown>(
  endPoint: string,
  filter?: object,
  token?: string
): Promise<T> => {
  try {
    const queryString = new URLSearchParams(filter as Record<string, string>).toString();
    if (!token) {
      const response = await API.get<T>(`${endPoint}?${queryString}`);
      return response.data;
    } else {
      const response = await API.get<T>(`${endPoint}?${queryString}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
      });
      return response.data;
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Something Went Wrong");
  }
};

export const post = async <T = unknown>(
  endPoint: string,
  payload: object,
  token?: string,
  customHeaders?: object
): Promise<T> => {
  try {
    const requestHeaders = {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    };

    if (!token && !customHeaders) {
      const response = await API.post<T>(endPoint, payload);
      return response.data;
    } else {
      const response = await API.post<T>(endPoint, payload, {
        headers: requestHeaders,
      });
      return response.data;
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Something Went Wrong");
  }
};

export const patch = async <T = unknown>(
  endPoint: string,
  payload: object,
  token?: string
): Promise<T> => {
  try {
    if (!token) {
      const response = await API.patch<T>(endPoint, payload);
      return response.data;
    } else {
      const response = await API.patch<T>(endPoint, payload, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
      });
      return response.data;
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Something Went Wrong");
  }
};

export const put = async <T = unknown>(
  endPoint: string,
  payload: object,
  token?: string
): Promise<T> => {
  try {
    if (!token) {
      const response = await API.put<T>(endPoint, payload);
      return response.data;
    } else {
      const response = await API.put<T>(endPoint, payload, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
      });
      return response.data;
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Something Went Wrong");
  }
};

export const deleteRequest = async <T = unknown>(
  endPoint: string,
  token?: string,
  data?: object
): Promise<T> => {
  try {
    if (!token) {
      const response = await API.delete<T>(endPoint, { data });
      return response.data;
    } else {
      const response = await API.delete<T>(endPoint, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        data,
      });
      return response.data;
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Something Went Wrong");
  }
};
