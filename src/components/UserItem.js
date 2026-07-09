import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function UserItem({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding: 15, flexDirection:'row', justifyContent:'space-between' }}>
        <Text>{item.username}</Text>

        <Text>
          {item.online
            ? '🟢 Online'
            : `Last seen ${new Date(item.lastSeen).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
});
