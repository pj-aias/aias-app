import React, {Component} from 'react';
import {
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import {Text, View} from 'react-native';
import {Opner} from '../../util/types/OpnerType';
import OpnerCheckBox from '../uiParts/opnerCheckbox';

interface SMSVarifyScreenState {
  opners: Opner[];
}

export class OpnerScreen extends Component<{}, SMSVarifyScreenState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      opners: [{name: 'test', serverUrl: 'aaa'}],
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  private handleSubmit = () => {};

  render() {
    const renderItem = ({item}: {item: Opner}) => (
      <OpnerCheckBox
        opner={item}
        isChecked={false}
        toggleCheck={this.handleSubmit}
      />
    );
    return (
      <SafeAreaView style={styles.container}>
        <Text>add opner</Text>
        <FlatList data={this.state.opners} renderItem={renderItem} />
        <Button onPress={this.handleSubmit} title="Submit" color="#841584" />
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
