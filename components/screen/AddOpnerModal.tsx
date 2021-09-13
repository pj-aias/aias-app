import React, { Component } from 'react';
import { TextInput, SafeAreaView, StyleSheet, Button, Alert } from 'react-native';
import { Text, View } from 'react-native';
import { Opner } from '../../util/types/OpnerType';
import CheckBox from '@react-native-community/checkbox';

interface Props {
  addNewOpner: (opner: Opner) => void;
  closeModal: () => void;
}

interface State {
  name: string;
  serverUrl: string;
}

export default class AddOpnerModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      serverUrl: '',
    };
  }

  private addOpner = () => {
    const sample_opner: Opner = {
      name: this.state.name,
      serverUrl: this.state.serverUrl,
      isSelected: false,
    };
    this.props.addNewOpner(sample_opner);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Add Opner</Text>
        <Text style={styles.margin_20}>Opner Name</Text>
        <TextInput
          style={styles.textinput}
          value={this.state.name}
          onChangeText={text => this.setState({ name: text })}
        />
        <Text style={styles.margin_20}>Server Url</Text>
        <TextInput
          style={styles.textinput}
          value={this.state.serverUrl}
          onChangeText={text => this.setState({ serverUrl: text })}
        />
        <View style={styles.margin_20}>
          <Button
            title="Add opner"
            onPress={this.addOpner}
            disabled={!(this.state.name !== '' && this.state.serverUrl !== '')}
          />
        </View>
        <View style={styles.margin_20}>
          <Button title="Close modal" onPress={this.props.closeModal} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  textinput: {
    height: 30,
    width: 200,
    backgroundColor: 'white',
    marginTop: 10,
    fontSize: 12,
    padding: 0,
  },
  red: {
    color: 'red',
  },
  margin_20: {
    marginTop: 20,
  },
});
