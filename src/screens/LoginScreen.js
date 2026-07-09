import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import LottieView from 'lottie-react-native';

import socket from '../socket/socket';
import { UserContext } from '../context/UserContext';
import COLORS from '../theme/colors';

const deviceId = uuidv4();

export default function LoginScreen({ navigation }) {
  const { setUsername } = useContext(UserContext);

  const [name, setName] = useState('');

  const login = async () => {
    if (!name.trim()) return;

    await AsyncStorage.setItem('username', name.trim());
    await AsyncStorage.setItem('deviceId', deviceId);

    socket.emit('register', {
      name: name.trim(),
      deviceId,
    });

    setUsername(name.trim());

    navigation.replace('App');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.logoContainer}>
        <LottieView
          source={require('../assets/lottie/message.json')}
          autoPlay
          loop
          style={styles.lottie}
        />

        <Text style={styles.title}>One-to-One Chat</Text>

        <Text style={styles.subtitle}>Fast • Secure • Real-time Messaging</Text>
      </View>

      <TextInput
        placeholder="Enter your username"
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={login}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop:Dimensions.get('screen').height * 0.23
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  logoText: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.text,
    marginTop:-50
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  input: {
    height: 55,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
  },

  button: {
    height: 55,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: COLORS.offline,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
  },

  lottie: {
    width: 220,
    height: 220,
    alignSelf: 'center',
  },
});
