import React, {Component} from 'react';
import {TextInput, SafeAreaView, StyleSheet, Button, Alert} from 'react-native';
import {Text, View} from 'react-native';
import {NavigationParams, NavigationScreenProp} from 'react-navigation';
import {NavigationState} from '@react-navigation/native';
import {Router} from '../../util/router';

interface State {
  codeText: string;
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export class SMSInputScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      codeText: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({codeText: e.target.value});
  };

  private handleSubmit = () => {
    //request verify
    this.props.navigation.navigate(Router.SMSVerifyScreen, {});
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Enter phone number to signin/signup</Text>
        <TextInput
          style={styles.textinput}
          value={this.state.codeText}
          onChangeText={text => this.setState({codeText: text})}
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
