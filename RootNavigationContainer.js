import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {Root} from "native-base";
import {createBottomTabNavigator} from 'react-navigation-tabs';
import IntroScreen from './src/components/IntroScreen'
import LoginScreen from './src/components/LoginScreen'
import SettingScreen from './src/components/Setting'

import UserScreen from "./src/components/UsersScreen";

// import {OstWalletSetting} from '@ostdotcom/ost-wallet-sdk-react-native';

const Onboarding = createStackNavigator(
  {
    IntroScreen: IntroScreen,
    LoginScreen: LoginScreen
  }
);


const UsersStack = createStackNavigator(
  {
    UsersScreen: UserScreen
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
    // WalletSettingScreen: OstWalletSetting
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
