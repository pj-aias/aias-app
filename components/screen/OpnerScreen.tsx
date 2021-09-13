import React, {Component} from 'react';
import {
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Settings,
} from 'react-native';
import {Text, View} from 'react-native';
import {Opner} from '../../util/types/OpnerType';
import OpnerCheckBox from '../uiParts/opnerCheckbox';
import AddOpnerModal from './AddOpnerModal';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {Router} from '../../util/router';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

interface SMSVerifyScreenState {
  opners: Opner[];
  isModalVisible: boolean;
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export class OpnerScreen extends Component<Props, SMSVerifyScreenState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      opners: [
        {name: 'default1', serverUrl: 'aaa', isSelected: false},
        {name: 'default2', serverUrl: 'aaa', isSelected: false},
        {name: 'default3', serverUrl: 'aaa', isSelected: false},
      ],
      isModalVisible: false,
    };

    this.loadItem();
    this.handleOnChange = this.handleOnChange.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  loadItem = async () => {
    try {
      const opnerString = await AsyncStorage.getItem('opners');
      if (opnerString) {
        const opners = JSON.parse(opnerString) as Opner[];
        this.setState({opners: opners});
      }
    } catch (e) {
      console.log(e);
    }
  };

  saveItem = async () => {
    try {
      let _opners = this.state.opners;
      _opners.forEach(x => (x.isSelected = false));
      const opnerString = JSON.stringify(_opners);
      await AsyncStorage.setItem('opners', opnerString).then(_ => {
        this.setState({isModalVisible: false});
      });
    } catch (e) {
      console.log(e);
    }
  };

  private addNewOpner = async (opner: Opner) => {
    const opners = this.state.opners.concat([opner]);
    this.setState({opners: opners});
    await this.saveItem();
  };

  private toggleSelect(index: number, value: boolean) {
    let opners = [...this.state.opners];
    opners[index].isSelected = value;
    this.setState({opners: opners});
  }

  private openModal = () => {
    this.setState({isModalVisible: true});
  };

  private get disableLaunchButton(): boolean {
    return !(this.state.opners.filter(x => x.isSelected).length >= 3);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  private handleSubmit = () => {};

  private closeModal = () => {
    this.setState({isModalVisible: false});
  };

  render() {
    const renderItem = ({item, index}: {item: Opner; index: number}) => (
      <OpnerCheckBox
        opner={item}
        index={index}
        toggleCheck={this.toggleSelect}
      />
    );
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>
          <Text>select opner</Text>
          <Text>you should select 3 opners or higher</Text>
        </View>
        <FlatList
          style={styles.list}
          data={this.state.opners}
          renderItem={renderItem}
        />
        <View style={styles.button}>
          <Button
            onPress={this.handleSubmit}
            title="Launch"
            disabled={this.disableLaunchButton}
            color="#841584"
          />
        </View>
        <View style={styles.button}>
          <Button onPress={this.openModal} title="Add Opner" color="#841584" />
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View>
            <AddOpnerModal
              addNewOpner={this.addNewOpner}
              closeModal={this.closeModal}
            />
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
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
    height: '60%',
    width: '60%',
  },
  red: {
    color: 'red',
  },
  button: {
    marginTop: 20,
  },
});
