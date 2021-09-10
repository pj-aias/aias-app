import { DEFAULT_EXTENSIONS } from '@babel/core';
import React, { Component } from 'react';
import { TextInput, SafeAreaView, StyleSheet, Button, Alert, NativeSyntheticEvent, TextInputChangeEventData, BackHandler } from 'react-native';
import { Text, View } from 'react-native';
import Tor from 'react-native-tor';
import { RSA, RSAKeychain } from 'react-native-rsa-native';
import { NavigationStackProp } from 'react-navigation-stack';

const ISSUER_URL = "http://2jz6o2vhsfb55tk2lv73gauoxjmh2uisra65umzkg22yq67mzkvg6ayd.onion/verify_code";

interface SMSVerifyScreenState {
  code: string;
}

type SMSVerifyScreenProps = {
  route: {
    params: {
      cookie: [string]
    }
  }
  // navigation: NavigationStackProp<{ cookie: string }>;
};

export class SMSVerifyScreen extends Component<SMSVerifyScreenProps, SMSVerifyScreenState> {
  constructor(props: SMSVerifyScreenProps) {
    super(props);
    this.state = {
      code: '',
    };

    // const data = this.props.navigation.getParam('cookie', 'cookie');
    console.log(props.route.params.cookie);

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.setState({ code: e.nativeEvent.text });
  };

  private handleSubmit = async () => {
    const keys = await RSA.generateKeys(2048)

    const body = JSON.stringify({ code: this.state.code, pubkey: keys.public });
    const headers = { 'Content-Type': 'text/json', "Cookie": this.props.route.params.cookie };

    console.log(body);
    console.log(headers);

    const tor = Tor();
    await tor.startIfNotStarted();

    try {
      await tor.post(ISSUER_URL, body, headers).then(resp => {
        console.log(`body: ${resp.json}`);

        tor.stopIfRunning();
        BackHandler.exitApp();
      });
    } catch (error) {
      console.log(error);
    }

    tor.stopIfRunning();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>verify code</Text>
        <TextInput
          style={styles.textinput}
          value={this.state.code}
          onChangeText={text => this.setState({ code: text })}
        />
        <Button onPress={this.handleSubmit} title="Send" color="#841584" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    display: 'flex',
    alignItems: 'center',
  },
  textinput: {
    height: 30,
    width: 200,
    backgroundColor: 'white',
    marginTop: 10,
  },
  red: {
    color: 'red',
  },
});
