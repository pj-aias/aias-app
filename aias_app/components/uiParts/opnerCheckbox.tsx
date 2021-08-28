import React, { Component } from 'react';
import { TextInput, SafeAreaView, StyleSheet, Button, Alert } from 'react-native';
import { Text, View } from 'react-native';
import { Opner } from '../../util/types/OpnerType';
import CheckBox from '@react-native-community/checkbox';

interface Props {
    isChecked: boolean
    opner: Opner
    toggleCheck: Function
}

export class checkbox extends Component<Props> {

  constructor(props: Props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  }

  private handleSubmit = () => {

  }

  render() {
    return (
      <View style={styles.container}>
          <Text>
            {this.props.opner.name}
          </Text>
          <CheckBox
            value={this.props.isChecked}
            onValueChange={(newValue) => this.props.toggleCheck(newValue)}
          />
      </View>
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