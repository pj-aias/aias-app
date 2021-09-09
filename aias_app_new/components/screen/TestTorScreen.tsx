import {NavigationState} from '@react-navigation/native';
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {NavigationParams, NavigationScreenProp} from 'react-navigation';
import Tor from 'react-native-tor';

interface State {
  json: string;
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export class TestTorScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      json: '',
    };
  }

  async componentDidMount() {
    const tor = Tor();
    await tor.startIfNotStarted();

    // try {
    //   await tor.get('https://api.ipify.org/?format=json').then(resp => {
    //     console.log(resp);
    //     // this.setState({json: JSON.stringify(resp.json)});
    //   });
    // } catch (error) {}
  }

  render() {
    return (
      <View>
        <Text>{this.state.json}</Text>
      </View>
    );
  }
}
