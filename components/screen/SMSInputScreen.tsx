import React, { Component } from 'react';
import {
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { Text, View } from 'react-native';
import { NavigationParams, NavigationScreenProp } from 'react-navigation';
import { NavigationState } from '@react-navigation/native';
import { Router } from '../../util/router';
import { sendPhoneNumber } from '../../aias/Register';
import Spinner from 'react-native-loading-spinner-overlay';


export type RequestHeaders = { [header: string]: string } | {};

interface State {
  phoneNumber: string;
  isLoading: boolean;
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export class SMSInputScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      phoneNumber: '',
      isLoading: false,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.setState({ phoneNumber: e.nativeEvent.text });
  };

  private handleSubmit = async () => {
    //request verify
    this.setState({ isLoading: true });
    try {
      const cookie = await sendPhoneNumber(this.state.phoneNumber);
      this.setState({ isLoading: false });
      this.props.navigation.navigate(Router.SMSVerifyScreen, { cookie: cookie });
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
      Alert.alert(e.toString());
    }
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
        <Button onPress={this.handleSubmit} title="送信" color="#841584" />
        <Spinner visible={this.state.isLoading} />
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
