import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import NavigationService from './src/services/NavigationService'

import IntroScreen from './src/components/IntroScreen'


const modalStackConfig = {
  headerLayoutPreset: 'center',
  headerMode: 'none',
  mode: 'modal',
  navigationOptions: ({ navigation }) => {
    const routeName = utilities.getLastChildRoutename(navigation.state);
    return {
      tabBarVisible: !customTabHiddenRoutes.includes(routeName)
    };
  }
};

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      introScreen: IntroScreen
    },
    {
      initialRouteName: 'introScreen'
    }
  )
);

const RootNavigationContainer = () => (
    <AppContainer/>
);

export default RootNavigationContainer;