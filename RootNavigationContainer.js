import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {Root} from "native-base";

import {createBottomTabNavigator} from 'react-navigation-tabs';
import {OstWalletSettingsComponent} from '@ostdotcom/ost-wallet-sdk-react-native';

import IntroScreen from './src/components/IntroScreen'
import LoginScreen from './src/components/LoginScreen'
import SettingScreen from './src/components/Setting'
import SendTokens from './src/components/SendTokens'
import WalletScreen from './src/components/WalletScreen/index'
import UserScreen from "./src/components/UsersScreen";

const Onboarding = createStackNavigator(
  {
    IntroScreen: IntroScreen,
    LoginScreen: LoginScreen
  }
);


const UsersStack = createStackNavigator(
  {
    UsersScreen: UserScreen,
    SendTokens: SendTokens
  }
);

const WalletStack = createStackNavigator(
  {
    WalletScreen: WalletScreen,
    LoginScreen: LoginScreen
  }
);

const SettingStack = createStackNavigator(
  {
    SettingScreen: SettingScreen,
    WalletSettingScreen: OstWalletSettingsComponent
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
