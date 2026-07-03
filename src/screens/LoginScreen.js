import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import socket from "../socket/socket";
import { UserContext } from "../context/UserContext";

export default function LoginScreen({ navigation }) {

  const { setUsername } = useContext(UserContext);

  const [name, setName] = useState("");

  const login = () => {

    if (!name.trim()) return;

    socket.emit("register", name);

    setUsername(name);

    navigation.replace("Users");

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        One-to-One Chat
      </Text>

      <TextInput
        placeholder="Enter Username"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={login}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },

});