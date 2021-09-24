import {DEFAULT_EXTENSIONS} from '@babel/core';
import React, {Component} from 'react';
import {
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  BackHandler,
} from 'react-native';
import {Text, View} from 'react-native';
import Tor from 'react-native-tor';
import {RSA, RSAKeychain} from 'react-native-rsa-native';
import {NavigationStackProp} from 'react-navigation-stack';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import {keyTag} from '../../aias/Core';
import {verifyCode} from '../../aias/Register';
import Spinner from 'react-native-loading-spinner-overlay';

interface SMSVerifyScreenState {
  code: string;
  isLoading: boolean;
}

type SMSVerifyScreenProps = {
  route: {
    params: {
      cookie: string;
    };
  };
};

export class SMSVerifyScreen extends Component<
  SMSVerifyScreenProps,
  SMSVerifyScreenState
> {
  constructor(props: SMSVerifyScreenProps) {
    super(props);
    this.state = {
      code: '',
      isLoading: false,
    };

    // const data = this.props.navigation.getParam('cookie', 'cookie');
    console.log(props.route.params.cookie);

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    this.setState({code: e.nativeEvent.text});
  };

  private handleSubmit = async () => {
    const cookie = this.props.route.params.cookie;
    const code = this.state.code;
    this.setState({isLoading: true});
    console.log(cookie);
    try {
      await verifyCode(code, cookie);
      Alert.alert('Done');
      setTimeout(() => {
        BackHandler.exitApp();
        this.setState({isLoading: false});
      }, 5000);
    } catch (e) {
      this.setState({isLoading: false});
      Alert.alert(e.toString());
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>verify code</Text>
        <TextInput
          style={styles.textinput}
          value={this.state.code}
          onChangeText={text => this.setState({code: text})}
        />
        <Button onPress={this.handleSubmit} title="Send" color="#841584" />
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
    marginBottom: 10,
  },
  red: {
    color: 'red',
  },
});
