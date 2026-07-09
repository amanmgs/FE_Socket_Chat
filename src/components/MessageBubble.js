import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function MessageBubble({ item, isMe }) {
  console.log('@item', item);

  const getTick = () => {
  if (!isMe) return "";

  if (item.read) {
    return "✔✔";
  }

  if (item.delivered) {
    return "✔";
  }

  return "";
};
  return (
    <View style={[styles.container, isMe ? styles.right : styles.left]}>
      <Text style={styles.message}>{item.message}</Text>

      <Text style={styles.time}>
        {getTick()}
        {formatTime(item.createdAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },

  left: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },

  right: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },

  message: {
    fontSize: 16,
  },

  time: {
    marginTop: 5,
    fontSize: 11,
    color: '#666',
    alignSelf: 'flex-end',
  },
});
