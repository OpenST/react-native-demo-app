import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {Root} from "native-base";
import { createBottomTabNavigator } from 'react-navigation-tabs';

import {OstWalletSetting} from '@ostdotcom/ost-wallet-sdk-react-native';

import IntroScreen from './src/components/IntroScreen'
import LoginScreen from './src/components/LoginScreen'
import SettingScreen from './src/components/Setting'

import {
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  View
} from 'react-native';



const Onboarding = createStackNavigator(
  {
    IntroScreen: IntroScreen,
    LoginScreen: LoginScreen
  }
);

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

const UsersStack = createStackNavigator(
  {
    IntroScreen: IntroScreen,
    LoginScreen: LoginScreen
  }
);

const WalletStack = createStackNavigator(
  {
    IntroScreen: IntroScreen,
    LoginScreen: LoginScreen
  }
);

const SettingStack = createStackNavigator(
  {
    SettingScreen: SettingScreen,
    WalletSettingScreen: OstWalletSetting
  }
);

const Wallet = createBottomTabNavigator({
  Users: UsersStack,
  Wallet: WalletStack,
  Settings: SettingStack
});


const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Onboarding: Onboarding,
      Wallet: Wallet
    },
    {
      initialRouteName: 'Onboarding',
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
    }
  )
);

const RootNavigationContainer = () => (
	<Root>
		<AppContainer/>
	</Root>
);

export default RootNavigationContainer;
