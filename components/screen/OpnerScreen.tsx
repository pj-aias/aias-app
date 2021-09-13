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
import type TorType from 'react-native-tor';
import type ProcessedRequestResponse from 'react-native-tor';

import { Router } from '../../util/router';

import { NavigationParams, NavigationScreenProp } from 'react-navigation';
import { NavigationState } from '@react-navigation/native';
import { RSA, RSAKeychain, KeyPair } from 'react-native-rsa-native';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import type { RNSecureStorageStatic } from 'rn-secure-storage';;

interface SMSVerifyScreenState {
  opners: Opner[];
}

interface OpnerScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>,
  route: {
    params: {
      redirect: string[]
    }
  }
}

type IssueCredential = {
  cert: string, pubkey: string, privkey: string
}

type Resp = { json: { nonce: string; }; headers: { [x: string]: any[]; }; respCode: any; };

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
    console.log("submit!");

    const openers = this.state.opners;
    const url = openers[0].serverUrl;

    const domains = openers.map(data => data.serverUrl)
    let privkey: string | null = "";
    let pubkey: string | null = "";
    let cert: string | null = ";"

    try {
      privkey = await RNSecureStorage.get('privkey');
      console.log('privkey=' + privkey);

      pubkey = await RNSecureStorage.get('pubkey');
      console.log('pubkey=' + pubkey);

      cert = await RNSecureStorage.get('cert');
      console.log('cert=' + cert);
    } catch (e) {
      console.error("errror reading credentials");
      console.error(e);
    }

    const cred: IssueCredential = {
      privkey: (privkey as string),
      pubkey: (pubkey as string),
      cert: (cert as string),
    };

    const tor = Tor();
    await tor.startIfNotStarted();

    const usk = [];

    for (const domain of domains) {
      const partial_usk = await this.requestPartialUsk(cred, domains, tor);
      usk.push(partial_usk);
    }

    console.log(`usk: ${JSON.stringify(usk)}`);

    tor.stopIfRunning();
  }

  private requestPartialUsk = async (cred: IssueCredential, domains: string[], tor: any) => {
    let cookie = "";
    let nonce = "";

    await tor.get(`http://${domain}/challenge`).then((resp: Resp) => {
      nonce = resp.json.nonce;
      console.log(nonce);

      const setCookie = resp.headers["set-cookie"][0];
      cookie = setCookie.split(";")[0];
      console.log(`result: ${setCookie}`);
      console.log(`result: ${resp.respCode}`);
    });

    const _signature = await RSA.signWithAlgorithm(nonce, cred.privkey, RSA.SHA256withRSA as any);
    const signature = _signature.replace(/\n/g, "");

    const body = JSON.stringify({ signature, domains, cert: cred.cert, pubkey: cred.pubkey });


    const resp = await tor.post(`http://${domain}/issue`, body, { 'Content-Type': 'text/json', "Cookie": cookie });
    return resp.json
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
