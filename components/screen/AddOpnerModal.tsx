import React, {Component} from 'react';
import {TextInput, SafeAreaView, StyleSheet, Button, Alert} from 'react-native';
import {Text, View} from 'react-native';
import {Opner} from '../../util/types/OpnerType';
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
        <Text>裁判員を追加</Text>
        <Text style={styles.margin_20}>裁判員 名前</Text>
        <TextInput
          style={styles.textinput}
          value={this.state.name}
          onChangeText={text => this.setState({name: text})}
        />
        <Text style={styles.margin_20}>裁判員URL</Text>
        <TextInput
          style={styles.textinput}
          value={this.state.serverUrl}
          onChangeText={text => this.setState({serverUrl: text})}
        />
        <View style={styles.margin_20}>
          <Button
            title="追加"
            onPress={this.addOpner}
            disabled={!(this.state.name !== '' && this.state.serverUrl !== '')}
          />
        </View>
        <View style={styles.margin_20}>
          <Button title="閉じる" onPress={this.props.closeModal} />
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
