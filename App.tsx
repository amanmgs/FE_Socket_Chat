import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-get-random-values";

import UserProvider from "./src/context/UserContext";

import LoginScreen from "./src/screens/LoginScreen";
import UsersScreen from "./src/screens/UsersScreen";
import ChatScreen from "./src/screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="Users"
            component={UsersScreen}
          />

          <Stack.Screen
            name="Chat"
            component={ChatScreen}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}