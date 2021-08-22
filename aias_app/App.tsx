import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OnbordingScreen } from './components/screen/OnbordingScreen';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name=" "
            component={ OnbordingScreen }
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}