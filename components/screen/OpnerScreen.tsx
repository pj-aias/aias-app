import React, { Component } from 'react';
import {
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import { Text, View } from 'react-native';
import { Opner } from '../../util/types/OpnerType';
import OpnerCheckBox from '../uiParts/opnerCheckbox';

interface SMSVerifyScreenState {
  opners: Opner[];
}


type OpnerScreenProps = {
  route: {
    params: {
      redirect: [string]
    }
  }
};

export class OpnerScreen extends Component<OpnerScreenProps, SMSVerifyScreenState> {
  constructor(props: OpnerScreenProps) {
    super(props);

    const redirect = props.route.params.redirect;
    console.log(`redirect: ${redirect}`);

    this.state = {
      opners: [
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
        { name: 'test', serverUrl: 'aaa', isSelected: false },
      ],
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  private toggleSelect(index: number, value: boolean) {
    let opners = [...this.state.opners];
    opners[index].isSelected = value;
    this.setState({ opners: opners });
  }

  private get disableLaunchButton(): boolean {
    return !(this.state.opners.filter(x => x.isSelected).length >= 3);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => { };

  private handleSubmit = () => { };

  render() {
    const renderItem = ({ item, index }: { item: Opner; index: number }) => (
      <OpnerCheckBox
        opner={item}
        index={index}
        toggleCheck={this.toggleSelect}
      />
    );
    return (
      <SafeAreaView style={styles.container}>
        <Text>select opner</Text>
        <Text>you should select 3 opners or higher</Text>
        <FlatList
          style={styles.list}
          data={this.state.opners}
          renderItem={renderItem}
        />
        <Button
          onPress={this.handleSubmit}
          title="Launch"
          disabled={this.disableLaunchButton}
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
    alignItems: 'center',
  },
  textinput: {
    height: 30,
    width: 200,
    backgroundColor: 'white',
    marginTop: 10,
  },
  list: {
    height: '80%',
    width: '60%',
  },
  red: {
    color: 'red',
  },
});
