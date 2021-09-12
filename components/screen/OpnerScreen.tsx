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
import Tor from 'react-native-tor';
import { Router } from '../../util/router';

import { NavigationParams, NavigationScreenProp } from 'react-navigation';
import { NavigationState } from '@react-navigation/native';

interface SMSVerifyScreenState {
  opners: Opner[];
}

interface OpnerScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>,
  route: {
    params: {
      redirect: [string]
    }
  }
}

export class OpnerScreen extends Component<OpnerScreenProps, SMSVerifyScreenState> {
  constructor(props: OpnerScreenProps) {
    super(props);

    const redirect = props.route.params.redirect;
    console.log(`redirect: ${redirect}`);

    this.state = {
      opners: [
        { name: 'Test', serverUrl: 'q5qkbkl7sqy4v2wgttsaq2nkpw7qhrcz6u7lofwesenpmy7qhtu4uuyd.onion', isSelected: true },
        { name: 'Test', serverUrl: 'q5qkbkl7sqy4v2wgttsaq2nkpw7qhrcz6u7lofwesenpmy7qhtu4uuyd.onion', isSelected: true },
        { name: 'Test', serverUrl: 'q5qkbkl7sqy4v2wgttsaq2nkpw7qhrcz6u7lofwesenpmy7qhtu4uuyd.onion', isSelected: true },
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

  private handleSubmit = async () => {
    const openers = this.state.opners;
    const url = openers[0].serverUrl;

    const domains = openers.map(data => data.serverUrl)
    const body = JSON.stringify({ domains: domains });

    const tor = Tor();
    await tor.startIfNotStarted();

    let cookie = "";
    let challenge = "";

    try {
      await tor.get(`http://${domains[0]}/challenge`).then(resp => {
        challenge = resp.json.nonce;
        console.log(challenge);

        const setCookie = resp.headers["set-cookie"][0];
        cookie = setCookie.split(";")[0];
        console.log(`result: ${setCookie}`);
        console.log(`result: ${resp.respCode}`);
      });
    } catch (error) {
      console.log(error);
      tor.stopIfRunning();
      return;
    }

    // try {
    //   await tor.post(url, body, { 'Content-Type': 'text/json', "Cookie": cookie }).then(resp => {
    //     console.log(`result: ${resp.respCode}`);
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    tor.stopIfRunning();
  }

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
