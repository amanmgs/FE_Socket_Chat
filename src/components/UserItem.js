import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default function UserItem({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.dot} />
      <Text style={styles.text}>{item.username}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
});