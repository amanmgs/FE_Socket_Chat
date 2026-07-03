import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import socket from "../socket/socket";
import { UserContext } from "../context/UserContext";
import UserItem from "../components/UserItem";

export default function UsersScreen({ navigation }) {

  const { username } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {

    socket.on("online_users", (data) => {

      // remove self from list
      const filtered = data.filter(u => u !== username);

      setUsers(filtered);

    });

    return () => socket.off("online_users");

  }, []);

  const openChat = (user) => {

    navigation.navigate("Chat", {
      receiver: user
    });

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Online Users
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <UserItem
            item={item}
            onPress={() => openChat(item)}
          />
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});