import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import IntroScreen from './src/components/IntroScreen'
import LoginScreen from './src/components/LoginScreen'


const Onboarding = createStackNavigator(
  {
    IntroScreen: IntroScreen,
    LoginScreen: LoginScreen
  }
);

const Wallet = createStackNavigator(
  {
    LoginScreen: LoginScreen
  }
);

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
    <AppContainer/>
);

export default RootNavigationContainer;