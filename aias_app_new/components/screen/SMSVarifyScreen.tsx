import React, { Component } from 'react';
import { TextInput, SafeAreaView, StyleSheet, Button, Alert } from 'react-native';
import { Text, View } from 'react-native';
interface SMSVarifyScreenState {
  codeText: string;
}

export class SMSVarifyScreen extends Component<{}, SMSVarifyScreenState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      codeText: ""
    }

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({codeText: e.target.value});
  }

  private handleSubmit = () => {
    
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>varify code</Text>
          <TextInput
            style={styles.textinput}
            value={this.state.codeText} 
            onChangeText={(text) => this.setState({codeText: text})} 
          />
          <Button
            onPress={this.handleSubmit}
            title="Send"
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