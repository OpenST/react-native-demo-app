/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import RootNavigationContainer from './RootNavigationContainer'
import {OstWalletSdkEvents} from '@ostdotcom/ost-wallet-sdk-react-native';

export default class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    OstWalletSdkEvents.subscribeEvent();
  }

  componentWillUnmount() {
    OstWalletSdkEvents.unsubscribeEvent();
  }

  render() {
    return <RootNavigationContainer />;
  }
}
