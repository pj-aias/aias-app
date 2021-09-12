import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OnbordingScreen } from './components/screen/OnbordingScreen';
import { SMSInputScreen } from './components/screen/SMSInputScreen';
import { SMSVerifyScreen } from './components/screen/SMSVerifyScreen';
import { Router } from './util/router';
import { OpnerScreen } from './components/screen/OpnerScreen';
import { TestTorScreen } from './components/screen/TestTorScreen';
import { Text } from 'react-native';

const Stack = createStackNavigator();
const config = {
  screens: {
    [Router.OpnerScreen]: 'key_gen',
  },
};

const linking = {
  prefixes: ['https://aias.com', 'aias://'],
  config,
};

export default class App extends Component {
  render() {
    return (<NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator>
        <Stack.Screen
          name={Router.SMSInputScreen}
          component={SMSInputScreen}
        />
        <Stack.Screen
          name={Router.SMSVerifyScreen}
          component={SMSVerifyScreen}
        />
        <Stack.Screen
          name={Router.OnbordingScreen}
          component={OnbordingScreen}
        />

        <Stack.Screen name={Router.OpnerScreen} component={OpnerScreen} />
        <Stack.Screen name={Router.TestTorScreen} component={TestTorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    )
  }
}
