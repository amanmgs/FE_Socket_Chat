import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import socket from '../socket/socket';
import { UserContext } from '../context/UserContext';
import MessageBubble from '../components/MessageBubble';

export default function ChatScreen({ route }) {
  const { receiver } = route.params;

  // const { username } = useContext(UserContext);

  const [username, setCurrentUser] = useState('');

  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([]);

  const [typing, setTyping] = useState(false);

  const flatListRef = useRef();

  const timer = useRef();

  useEffect(() => {
    const loadUser = async () => {
      const storedUsername = await AsyncStorage.getItem('username');

      if (storedUsername) {
        setCurrentUser(storedUsername);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    socket.on('private_message', data => {
      const belongsToChat =
        (data.from === username && data.to === receiver) ||
        (data.from === receiver && data.to === username);

      if (belongsToChat) {
        setMessages(prev => [...prev, data]);

        if (data.from === receiver) {
          socket.emit('read_message', {
            messageId: data._id || data.id,
            from: receiver,
          });
        }
      }
    });

    return () => socket.off('private_message');
  }, [receiver, username]);

  useEffect(() => {
    socket.on('typing', data => {
      if (data.from === receiver) {
        setTyping(true);

        clearTimeout(timer.current);

        timer.current = setTimeout(() => {
          setTyping(false);
        }, 1500);
      }
    });

    return () => socket.off('typing');
  }, []);

  useEffect(() => {
    socket.emit('get_messages', {
      from: username,
      to: receiver,
    });
  }, [username, receiver]);

  useEffect(() => {
    const handleChatHistory = history => {
      setMessages(history);
    };

    socket.on('chat_history', handleChatHistory);

    return () => {
      socket.off('chat_history', handleChatHistory);
    };
  }, []);

  useEffect(() => {
    const handleRead = ({ messageId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId || msg.id === messageId
            ? { ...msg, read: true }
            : msg,
        ),
      );
    };

    socket.on('message_read', handleRead);

    return () => {
      socket.off('message_read', handleRead);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('private_message', {
      from: username,
      to: receiver,
      message: message,
    });

    setMessage('');
  };

  const handleTyping = text => {
    setMessage(text);

    console.log('@123', text);

    socket.emit('typing', {
      from: username,
      to: receiver,
    });
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
          <MessageBubble item={item} isMe={item.from === username} />
        )}
      />

      {typing && <Text style={styles.typing}>{receiver} is typing...</Text>}

      <View style={styles.bottom}>
        <TextInput
          value={message}
          onChangeText={handleTyping}
          placeholder="Type message..."
          style={styles.input}
        />

        <TouchableOpacity style={styles.send} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },

  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 45,
  },

  send: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },

  sendText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
