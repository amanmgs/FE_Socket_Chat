import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import socket from '../socket/socket';
import { UserContext } from '../context/UserContext';
import UserItem from '../components/UserItem';

export default function UsersScreen({ navigation }) {
  const { username } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const registerUser = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const deviceId = await AsyncStorage.getItem('deviceId');

      if (!storedUsername || !deviceId) return;

      socket.emit('register', {
        name: storedUsername,
        deviceId,
      });
    };

    registerUser();

    socket.on('connect', registerUser);

    return () => {
      socket.off('connect', registerUser);
    };
  }, []);

  useEffect(() => {
    const handleUsers = async data => {
      const storedUsername = await AsyncStorage.getItem('username');

      const filtered = data.filter(user => user.username !== storedUsername);

      setUsers(filtered);
    };

    socket.on('online_users', handleUsers);

    return () => socket.off('online_users', handleUsers);
  }, []);

  const openChat = user => {
    console.log('@user', user);
    navigation.navigate('Chat', {
      receiver: user?.username,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Online Users</Text>

      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <UserItem item={item} onPress={() => openChat(item)} />
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
