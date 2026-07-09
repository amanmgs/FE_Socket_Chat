import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import socket from '../socket/socket';
import { UserContext } from '../context/UserContext';
import UserItem from '../components/UserItem';
import COLORS from '../theme/colors';

export default function UsersScreen({ navigation }) {
  const { username } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const registerUser = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const deviceId = await AsyncStorage.getItem('deviceId');

      if (!storedUsername || !deviceId) {
        return;
      }

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

      const filtered = data.filter(
        user => user.username !== storedUsername,
      );

      setUsers(filtered);
      setRefreshing(false);
    };

    socket.on('online_users', handleUsers);

    return () => socket.off('online_users', handleUsers);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    const storedUsername = await AsyncStorage.getItem('username');

    socket.emit('get_users', {
      username: storedUsername,
    });
  };

  const filteredUsers = users.filter(user =>
    user.username
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const openChat = user => {
    navigation.navigate('Chat', {
      receiver: user.username,
      user,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>

        <Text style={styles.count}>
          {filteredUsers.length} Users
        </Text>
      </View>

      <TextInput
        placeholder="Search user..."
        placeholderTextColor={COLORS.placeholder}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No users available
            </Text>
          </View>
        }
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
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '700',
  },

  count: {
    marginTop: 5,
    color: COLORS.text,
    fontSize: 15,
  },

  search: {
    height: 50,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 16,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 20,
    fontWeight:'500'
  },
});