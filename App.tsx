import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar as RNStatusBar,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { User } from "./src/types/User";
import GetLocalStorageData from "./src/storage/GetLocalStorageData";
import { StorageKeys } from "./src/storage/StorageKeys";
import getUsers from "./src/services/getUsers";
import { PageStatus } from "./src/constants";
import ListItem from "./src/components/ListItem";
import { debounce } from "lodash";

export default function App() {
  const [usersList, setUsersList] = useState<User[] | []>([]);
  const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.LOADING);
  const [searchText, setSearchText] = useState<string>("");
  useEffect(() => {
    getUsersList("");
  }, []);

  const getUsersList = async (userName: string) => {
    const lowerCaseUserName = userName.toLowerCase();
    setPageStatus(PageStatus.LOADING);
    const localData = await GetLocalStorageData<User[]>(StorageKeys.USERS);
    if (localData.success && localData.data) {
      const filteredData = localData.data.filter((user: User) =>
        user.name.toLowerCase().includes(lowerCaseUserName)
      );
      setUsersList(filteredData);
      setPageStatus(PageStatus.IDLE);
    } else {
      const usersResponse = await getUsers({ userName: lowerCaseUserName });
      if (usersResponse.success && usersResponse.data) {
        setUsersList(usersResponse.data);
        setPageStatus(PageStatus.IDLE);
      } else setPageStatus(PageStatus.ERROR);
    }
  };

  const debouncedGetUsersList = useMemo(
    () =>
      debounce((userName: string) => {
        getUsersList(userName);
      }, 500),
    []
  );

  const handleOnChange = (text: string) => {
    setSearchText(text);
    debouncedGetUsersList(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="auto" />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar usuario"
          value={searchText}
          onChange={({ nativeEvent: { text } }) => handleOnChange(text)}
        />
      </View>
      <View style={styles.container}>
        {pageStatus === PageStatus.LOADING && (
          <View>
            <ActivityIndicator />
            <Text>Obteniendo usuarios</Text>
          </View>
        )}
        {pageStatus === PageStatus.ERROR && (
          <View>
            <Text>Hubo un error al obtener los usuarios</Text>
          </View>
        )}
        {pageStatus === PageStatus.IDLE && (
          <FlatList
            data={usersList}
            renderItem={({ item }) => <ListItem {...item} key={item.id} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0, // Asegura espacio para el StatusBar
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    width: "100%",
    backgroundColor: "#ebebeb",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: "5%",
  },
});
