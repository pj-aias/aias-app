import React, {Component} from 'react';
import {
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Linking,
  Settings,
} from 'react-native';
import {Text, View} from 'react-native';
import {Opner as Opener} from '../../util/types/OpnerType';
import Tor from 'react-native-tor';
import type TorType from 'react-native-tor';
import type ProcessedRequestResponse from 'react-native-tor';

import OpenerCheckBox from '../uiParts/opnerCheckbox';
import {issue} from '../../aias/Issue';

import {Router} from '../../util/router';

import {NavigationParams, NavigationScreenProp} from 'react-navigation';
import {NavigationState} from '@react-navigation/native';
import {RSA, RSAKeychain, KeyPair} from 'react-native-rsa-native';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import type {RNSecureStorageStatic} from 'rn-secure-storage';

import AddOpenerModal from './AddOpnerModal';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

interface SMSVerifyScreenState {
  openers: Opener[];
  isModalVisible: boolean;
  isLoading: boolean;
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface openerscreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: {
    params: {
      redirect: string[];
    };
  };
}

type Resp = {
  json: {nonce: string};
  headers: {[x: string]: any[]};
  respCode: any;
};

export class openerscreen extends Component<
  openerscreenProps,
  SMSVerifyScreenState
> {
  constructor(props: openerscreenProps) {
    super(props);

    const redirect = props.route.params.redirect;

    console.log(`redirect: ${redirect}`);

    this.state = {
      openers: [
        {
          name: 'Test',
          serverUrl:
            'q5qkbkl7sqy4v2wgttsaq2nkpw7qhrcz6u7lofwesenpmy7qhtu4uuyd.onion',
          isSelected: true,
        },
        {
          name: 'Test',
          serverUrl:
            'q5qkbkl7sqy4v2wgttsaq2nkpw7qhrcz6u7lofwesenpmy7qhtu4uuyd.onion',
          isSelected: true,
        },
        {
          name: 'Test',
          serverUrl:
            'q5qkbkl7sqy4v2wgttsaq2nkpw7qhrcz6u7lofwesenpmy7qhtu4uuyd.onion',
          isSelected: true,
        },
      ],
      isModalVisible: false,
      isLoading: false,
    };

    this.loadItem();
    this.handleOnChange = this.handleOnChange.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  loadItem = async () => {
    const openerstring = await AsyncStorage.getItem('openers');
    if (openerstring) {
      const openers = JSON.parse(openerstring) as Opener[];
      this.setState({openers: openers});
    }
  };

  saveItem = async () => {
    let _openers = this.state.openers;
    _openers.forEach(x => (x.isSelected = false));
    const openerstring = JSON.stringify(_openers);

    try {
      await AsyncStorage.setItem('openers', openerstring).then(_ => {
        this.setState({isModalVisible: false});
      });
    } catch (e) {
      console.log(e);
    }
  };

  private addNewOpener = async (Opener: Opener) => {
    const openers = this.state.openers.concat([Opener]);
    this.setState({openers: openers});
    await this.saveItem();
  };

  private toggleSelect(index: number, value: boolean) {
    let openers = [...this.state.openers];
    openers[index].isSelected = value;
    this.setState({openers: openers});
  }

  private openModal = () => {
    this.setState({isModalVisible: true});
  };

  private get disableLaunchButton(): boolean {
    return !(this.state.openers.filter(x => x.isSelected).length == 3);
  }

  private get disableRemoveOpenerButton(): boolean {
    return this.state.openers.filter(x => x.isSelected).length == 0;
  }

  private removeOpener = async () => {
    let openers = this.state.openers;
    openers.forEach((opener, index) => {
      if (opener.isSelected) {
        openers.splice(index, 1);
      }
    });
    openers.forEach((_, index) => {
      openers[index].isSelected = false;
    });
    this.setState({openers: openers});
    await this.saveItem();
  };

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  private handleSubmit = async () => {
    this.setState({isLoading: true});
    const openers = this.state.openers.filter(x => x.isSelected);
    const domains = openers.map(data => data.serverUrl);

    try {
      const redirect = `${this.props.route.params.redirect}/${await issue(
        domains,
      )}`;
      this.setState({isLoading: false});
      Linking.openURL(redirect);
    } catch (e) {
      console.error(e);
      this.setState({isLoading: false});
      Alert.alert(e.toString());
    }
  };

  private closeModal = () => {
    this.setState({isModalVisible: false});
  };

  render() {
    const renderItem = ({item, index}: {item: Opener; index: number}) => (
      <OpenerCheckBox
        opner={item}
        index={index}
        toggleCheck={this.toggleSelect}
      />
    );
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>
          <Text>select Opener</Text>
          <Text>you should select 3 openers or higher</Text>
        </View>
        <FlatList
          style={styles.list}
          data={this.state.openers}
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
          <Button onPress={this.openModal} title="Add Opener" color="#841584" />
        </View>
        <View style={styles.button}>
          <Button
            onPress={this.removeOpener}
            title="Remove Selected Opener"
            disabled={this.disableRemoveOpenerButton}
            color="red"
          />
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View>
            <AddOpenerModal
              addNewOpner={this.addNewOpener}
              closeModal={this.closeModal}
            />
          </View>
        </Modal>
        <Spinner visible={this.state.isLoading} />
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
    height: 40,
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
