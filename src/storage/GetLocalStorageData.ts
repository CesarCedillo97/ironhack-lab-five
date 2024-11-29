import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "./StorageKeys";

export default async <T>(key: StorageKeys): Promise<ApiResponse<T>> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return { success: true, data: JSON.parse(value) as T };
    }
    return {
      success: false,
      errorMessage: "No info found",
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: "Error al consultar Storage: " + JSON.stringify(error),
    };
  }
};
