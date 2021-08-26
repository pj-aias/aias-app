import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OnbordingScreen } from './components/screen/OnbordingScreen';
import { SMSInputScreen } from './components/screen/SMSInputScreen';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login/Register"
        >
          <Stack.Screen
            name=" "
            component={ OnbordingScreen }
          />
          <Stack.Screen
            name="Login/Register"
            component={ SMSInputScreen }
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}