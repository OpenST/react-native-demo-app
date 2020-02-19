import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Image} from "react-native";
import settingsIcon from './src/assets/settings_icon.png';
import walletIcon from './src/assets/wallet_icon.png';
import usersIcon from './src/assets/users_icon.png';
import sizeHelper from "./src/helper/SizeHelper";
import Colors from "./src/theme/styles/Colors";
import {Root} from "native-base";

import {createBottomTabNavigator} from 'react-navigation-tabs';
import {OstWalletSettingsComponent, OstRedeemableSkus, OstRedeemableSkuDetails} from '@ostdotcom/ost-wallet-sdk-react-native';
import IntroScreen from './src/components/IntroScreen'
import LoginScreen from './src/components/LoginScreen'
import SettingScreen from './src/components/Setting'
import SendTokens from './src/components/SendTokens'
import WalletScreen from './src/components/WalletScreen/index'
import UserScreen from "./src/components/UsersScreen";
import NavigationService from "./src/services/NavigationService";


const customTabHiddenRoutes = [
  'SendTokens',
  'WalletSettingScreen'
];

let recursiveMaxCount = 0;

getLastChildRoutename = (state) => {
  if (!state) return null;
  let index = state.index,
    routes = state.routes;
  if (!routes || recursiveMaxCount > 50) {
    recursiveMaxCount = 0;
    return state.routeName;
  }
  recursiveMaxCount++;
  return getLastChildRoutename(routes[index]);
};

const modalStackConfig = {
  navigationOptions: ({ navigation }) => {
    const routeName = getLastChildRoutename(navigation.state);
    return {
      tabBarVisible: !customTabHiddenRoutes.includes(routeName)
    };
  },
  headerLayoutPreset: 'center'
};

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
  },
  {
    ...modalStackConfig
  }
);

const WalletStack = createStackNavigator(
  {
    WalletScreen: WalletScreen,
    LoginScreen: LoginScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const SettingStack = createStackNavigator(
  {
    SettingScreen: SettingScreen,
    WalletSettingScreen: OstWalletSettingsComponent,
    RedeemableSkusScreen: OstRedeemableSkus,
    RedeemableSkuDetails: OstRedeemableSkuDetails
  },
  {
    ...modalStackConfig
  }
);

const Wallet = createBottomTabNavigator({
    Users: UsersStack,
    Wallet: WalletStack,
    Settings: SettingStack
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        if (routeName === 'Settings') {
          iconPath = settingsIcon;
          height = sizeHelper.layoutPtToPx(27);
          width = sizeHelper.layoutPtToPx(28);
        } else if (routeName === 'Users') {
          iconPath = usersIcon;
          height = sizeHelper.layoutPtToPx(20);
          width = sizeHelper.layoutPtToPx(28);
        } else {
          iconPath = walletIcon;
          height = sizeHelper.layoutPtToPx(24);
          width = sizeHelper.layoutPtToPx(19);
        }

        // You can return any component that you like here!
        return <Image source={iconPath} style={{
          width: width,
          height: height,
          tintColor: tintColor
        }}/>;
      },
    }),
    tabBarOptions: {
      activeTintColor: Colors.brightSky,
      inactiveTintColor: Colors.grey,
    },
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
    <AppContainer
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
  </Root>
);

export default RootNavigationContainer;
