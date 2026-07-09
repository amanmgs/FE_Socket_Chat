import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../theme/colors';

const formatTime = date =>
  new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function MessageBubble({ item, isMe }) {
  const renderTicks = () => {
    if (!isMe) {
      return null;
    }

    if (item.read) {
      return <Text style={styles.readTick}>✓✓</Text>;
    }

    if (item.delivered) {
      return <Text style={styles.tick}>✓✓</Text>;
    }

    return <Text style={styles.tick}>✓</Text>;
  };

  return (
    <View style={[styles.container, isMe ? styles.right : styles.left]}>
      <Text style={styles.message}>{item.message}</Text>

      <View style={styles.footer}>
        {renderTicks()}

        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
  },

  left: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.receiverBubble,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  right: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.senderBubble,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },

  message: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },

  time: {
    marginLeft: 4,
    fontSize: 11,
    color: COLORS.time,
  },

  tick: {
    fontSize: 13,
    color: COLORS.tick,
    fontWeight: '600',
  },

  readTick: {
    fontSize: 13,
    color: COLORS.readTick,
    fontWeight: '600',
  },
});
