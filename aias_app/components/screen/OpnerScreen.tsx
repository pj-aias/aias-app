import React, { Component } from 'react';
import { TextInput, SafeAreaView, StyleSheet, Button, Alert } from 'react-native';
import { Text, View } from 'react-native';
import { Opner } from '../../util/types/OpnerType';

interface SMSVarifyScreenState {
  opners: Opner[];
}

export class SMSVarifyScreen extends Component<{}, SMSVarifyScreenState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      opners: []
    }

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  }

  private handleSubmit = () => {

  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>add opner</Text>
          <TextInput
          />
          <Button
            onPress={this.handleSubmit}
            title="Submit"
            color="#841584"
          />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    display: 'flex',
    alignItems: 'center'
  },
  textinput: {
    height: 30,
    width: 200,
    backgroundColor: 'white',
    marginTop: 10
  },
  red: {
    color: 'red',
  },
});