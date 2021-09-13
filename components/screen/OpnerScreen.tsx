import React, { Component } from 'react';
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

import AddOpnerModal from './AddOpnerModal';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

interface SMSVerifyScreenState {
  opners: Opner[];
  isModalVisible: boolean;
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
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

type AIASCredential = {
  credential: any,
  pubkey: any,
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
        this.setState({ opners: opners });
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
        this.setState({ isModalVisible: false });
      });
    } catch (e) {
      console.log(e);
    }
  };

  private addNewOpner = async (opner: Opner) => {
    const opners = this.state.opners.concat([opner]);
    this.setState({ opners: opners });
    await this.saveItem();
  };

  private toggleSelect(index: number, value: boolean) {
    let opners = [...this.state.opners];
    opners[index].isSelected = value;
    this.setState({ opners: opners });
  }

  private openModal = () => {
    this.setState({ isModalVisible: true });
  };

  private get disableLaunchButton(): boolean {
    return !(this.state.opners.filter(x => x.isSelected).length == 3);
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => { };

  private handleSubmit = async () => {
    const tor = Tor();

    try {
      await tor.startIfNotStarted();
      this.issue(tor)
    } catch (e) { console.error(e); }

    await tor.stopIfRunning();
  }

  private issue = async (tor: any) => {
    const usk = [];

    const openers = this.state.opners.filter(x => x.isSelected)
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

    const partialGPK = [];
    const allCombinedGPK = [];

    for (const domain of domains) {
      const partial_usk = await this.requestPartialUsk(cred, domain, domains, tor);
      let pubkey;

      try {
        pubkey = await this.requestPubkey(domains, domain, tor);
      }
      catch (e) {
        console.log('----up')
        console.log(e);
        console.log('----')
      }

      usk.push(partial_usk);
      partialGPK.push(pubkey.partial)
      allCombinedGPK.push(pubkey.conbined)
    }

    const combinedGPK = JSON.stringify(allCombinedGPK[0]);
    const filtered = allCombinedGPK.filter(x => JSON.stringify(x) != combinedGPK);

    if (filtered.length !== 0) {
      throw Error("pubkey is wrong");
    }

    console.log(`usk: ${JSON.stringify(usk)}`);
    console.log(`pubkeys: ${JSON.stringify(combinedGPK)}`);

    const redirect = `${this.props.route.params.redirect}/?credential=${JSON.stringify(usk)}&pubkey=${JSON.stringify(pubkey)}`;

    Linking.openURL(redirect);

  }

  private requestPubkey = async (domains: string[], domain: String, tor: any) => {
    console.log(`http://${domain}/pubkey`);

    const resp = await tor.post(`http://${domain}/pubkey`, JSON.stringify({ "domains": domains }), { 'Content-Type': 'text/json' });
    return resp.json
  }

  private requestPartialUsk = async (cred: IssueCredential, domain: string, domains: string[], tor: any) => {
    let cookie = "";
    let nonce = "";

    console.log(`http://${domain}/challenge`);

    const challenge_resp = await tor.get(`http://${domain}/challenge`);
    nonce = challenge_resp.json.nonce;
    console.log(nonce);

    const setCookie = challenge_resp.headers["set-cookie"][0];
    cookie = setCookie.split(";")[0];
    console.log(`result: ${setCookie}`);
    console.log(`result: ${challenge_resp.respCode}`);

    const _signature = await RSA.signWithAlgorithm(nonce, cred.privkey, RSA.SHA256withRSA as any);
    const signature = _signature.replace(/\n/g, "");

    const body = JSON.stringify({ signature, domains, cert: cred.cert, pubkey: cred.pubkey });

    console.log(`http://${domain}/issue`);

    const resp = await tor.post(`http://${domain}/issue`, body, { 'Content-Type': 'text/json', "Cookie": cookie });
    return resp.json
  }

  private closeModal = () => {
    this.setState({ isModalVisible: false });
  };

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
