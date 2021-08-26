import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OnbordingScreen } from './components/screen/OnbordingScreen';
import { SMSInputScreen } from './components/screen/SMSInputScreen';
import { SMSVarifyScreen } from './components/screen/SMSVarifyScreen';
import { Router } from './components/screen/util/router';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={Router.SMSInputScreen}
        >
          <Stack.Screen
            name={Router.OnbordingScreen}
            component={ OnbordingScreen }
          />
          <Stack.Screen
            name={Router.SMSInputScreen}
            component={ SMSInputScreen }
          />
          <Stack.Screen
            name={Router.SMSVarifyScreen}
            component={ SMSVarifyScreen }
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}