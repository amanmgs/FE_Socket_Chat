import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import socket from "../socket/socket";
import { UserContext } from "../context/UserContext";
import MessageBubble from "../components/MessageBubble";

export default function ChatScreen({ route }) {

  const { receiver } = route.params;

  const { username } = useContext(UserContext);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const flatListRef = useRef();

  useEffect(() => {

    socket.on("private_message", (data) => {

      const belongsToChat =
        (data.from === username && data.to === receiver) ||
        (data.from === receiver && data.to === username);

      if (belongsToChat) {
        setMessages((prev) => [...prev, data]);
      }

    });

    return () => socket.off("private_message");

  }, [receiver, username]);

  const sendMessage = () => {

    if (!message.trim()) return;

    socket.emit("private_message", {
      from: username,
      to: receiver,
      message: message,
    });

    setMessage("");

  };

  return (
    <View style={styles.container}>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => (
          <MessageBubble
            item={item}
            isMe={item.from === username}
          />
        )}
      />

      <View style={styles.bottom}>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type message..."
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.send}
          onPress={sendMessage}
        >
          <Text style={styles.sendText}>
            Send
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFF",
  },

  bottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 45,
  },

  send: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },

  sendText: {
    color: "#FFF",
    fontWeight: "bold",
  },

});