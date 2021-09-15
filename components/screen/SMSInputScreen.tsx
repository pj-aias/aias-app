import React, { Component } from 'react';
import { TextInput, SafeAreaView, StyleSheet, Button, Alert, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { Text, View } from 'react-native';
import { NavigationParams, NavigationScreenProp } from 'react-navigation';
import { NavigationState } from '@react-navigation/native';
import { Router } from '../../util/router';
import { sendPhoneNumber } from '../../aias/Register';


export type RequestHeaders = { [header: string]: string } | {};

const ISSUER_URL = "http://2jz6o2vhsfb55tk2lv73gauoxjmh2uisra65umzkg22yq67mzkvg6ayd.onion/send_code";

interface State {
  phoneNumber: string;
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export class SMSInputScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      phoneNumber: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.setState({ phoneNumber: e.nativeEvent.text });
  };

  private handleSubmit = async () => {
    //request verify
    const cookie = await sendPhoneNumber(this.state.phoneNumber);
    this.props.navigation.navigate(Router.SMSVerifyScreen, { cookie: cookie });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Enter phone number to signin/signup</Text>
        <TextInput
          style={styles.textinput}
          value={this.state.phoneNumber}
          onChangeText={text => this.setState({ phoneNumber: text })}
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
    height: 40,
    width: 200,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10
  },
  red: {
    color: 'red',
  },
});
