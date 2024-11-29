import { View, Text, StyleSheet } from "react-native";
import React, { memo } from "react";
import { User } from "../types/User";

const ListItem = ({ name, phone, company }: User) => {
  return (
    <View style={styles.container}>
      <View style={styles.firstrow}>
        <Text style={styles.primarytext}>{name}</Text>
        <Text style={styles.secondaryText}>{phone}</Text>
      </View>
      <View style={styles.secondRow}>
        <Text style={styles.rightText}>{company.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: "5%",
    flexDirection: "row",
  },
  firstrow: { width: "65%" },
  secondRow: {
    width: "35%",
    justifyContent: "center",
  },
  primarytext: {
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryText: {
    fontSize: 16,
  },
  rightText: {
    textAlign: "right",
    fontSize: 12,
  },
});

export default memo(ListItem);
