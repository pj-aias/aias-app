import React, {Component} from 'react';
import {TextInput, SafeAreaView, StyleSheet, Button, Alert} from 'react-native';
import {Text, View} from 'react-native';
import {Opner} from '../../util/types/OpnerType';
import CheckBox from '@react-native-community/checkbox';

interface Props {
  opner: Opner;
  index: number;
  toggleCheck: (index: number, value: boolean) => void;
}

export default class OpnerCheckBox extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  private handleSubmit = () => {};

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.opner.name}</Text>
        <CheckBox
          boxType={'square'}
          value={this.props.opner.isSelected}
          onValueChange={newValue =>
            this.props.toggleCheck(this.props.index, newValue)
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
