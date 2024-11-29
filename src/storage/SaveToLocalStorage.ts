import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "./StorageKeys";

export default async <T>(
  key: StorageKeys,
  value: T
): Promise<ApiResponse<T>> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return { success: true, data: value };
  } catch (error) {
    console.error("Failed to save data:", error);
    return {
      success: false,
      errorMessage: "Error al guardar la info: " + JSON.stringify(error),
    };
  }
};
