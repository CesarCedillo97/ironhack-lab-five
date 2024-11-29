import { MaxRetrys } from "../constants";

export const RetryService = async <T>(
  service: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  let attempts = 0;

  while (attempts < MaxRetrys) {
    const serviceResponse = await service();
    if (serviceResponse.success) {
      return serviceResponse;
    }

    attempts++;
  }

  return {
    success: false,
    errorMessage: `Error después de ${MaxRetrys} intentos`,
  };
};
