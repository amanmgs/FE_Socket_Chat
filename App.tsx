import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-get-random-values';

import UserProvider from './src/context/UserContext';

import LoginScreen from './src/screens/LoginScreen';
import UsersScreen from './src/screens/UsersScreen';
import ChatScreen from './src/screens/ChatScreen';

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Users: undefined;
  Chat: {
    receiver: string;
  };
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: true }}>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
      />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: true }}>
      <AppStack.Screen
        name="Users"
        component={UsersScreen}
      />

      <AppStack.Screen
        name="Chat"
        component={ChatScreen}
      />
    </AppStack.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const deviceId = await AsyncStorage.getItem('deviceId');

      setLoggedIn(!!(username && deviceId));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={loggedIn ? 'App' : 'Auth'}>
          <RootStack.Screen
            name="Auth"
            component={AuthNavigator}
          />

          <RootStack.Screen
            name="App"
            component={MainNavigator}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}