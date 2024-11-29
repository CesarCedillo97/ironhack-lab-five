import axios from "axios";
import { User } from "../types/User";
import SaveToLocalStorage from "../storage/SaveToLocalStorage";
import { StorageKeys } from "../storage/StorageKeys";
import { UsersURL } from "../constants";
import { RetryService } from "../utils/retryServices";

export default async ({
  userName,
}: {
  userName: string;
}): Promise<ApiResponse<User[]>> => {
  const service = async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await axios.get(UsersURL);
      const users = response.data;
      const filteredUsers = users.filter((user: User) =>
        user.name.toLowerCase().includes(userName.toLowerCase())
      );
      await SaveToLocalStorage(StorageKeys.USERS, filteredUsers);
      return { success: true, data: filteredUsers };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        errorMessage: `API request failed: ${JSON.stringify(error)}`,
      };
    }
  };

  return RetryService(service);
};
