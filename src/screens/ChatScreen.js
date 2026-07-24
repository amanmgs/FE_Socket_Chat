import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import COLORS from '../theme/colors';
import socket from '../socket/socket';
import { UserContext } from '../context/UserContext';
import MessageBubble from '../components/MessageBubble';

export default function ChatScreen({ route }) {
  const { receiver, user } = route.params;

  // const { username } = useContext(UserContext);

  const [username, setCurrentUser] = useState('');

  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([]);

  const [typing, setTyping] = useState(false);

  const flatListRef = useRef();

  const timer = useRef();

  const insets = useSafeAreaInsets();

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       keyboardVerticalOffset={-insets.bottom}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {receiver.charAt(0).toUpperCase()}
          </Text>

          <View
            style={[
              styles.onlineDot,
              {
                backgroundColor: user.online ? COLORS.online : COLORS.offline,
              },
            ]}
          />
        </View>

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerName}>{receiver}</Text>

          <Text style={styles.headerStatus}>Chat securely</Text>
        </View>
      </View>
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

      {typing && (
        <View style={styles.typingContainer}>
          <Text style={styles.typing}>{receiver} is typing...</Text>
        </View>
      )}

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <TextInput
          value={message}
          onChangeText={handleTyping}
          placeholder="Type message..."
          style={styles.input}
        />

        <TouchableOpacity style={styles.send} onPress={sendMessage}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.primary,
    paddingBottom: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },

  headerName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },

  headerStatus: {
    color: '#DCEBFF',
    marginTop: 2,
  },

  typingContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },

  typing: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },

  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F4F7FC',
    borderRadius: 24,
    paddingHorizontal: 18,
    fontSize: 16,
    color: COLORS.text,
  },

  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  sendText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },

  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
  },

  backText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '600',
  },
});
