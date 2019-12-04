import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  Image
} from 'react-native';

import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';

import styles from './style'
import ostLog from '../../assets/ostLogoBlue.png'

import ost_sdk_theme_config from '../../theme/ostsdk/ost-sdk-theme-config';
import ost_sdk_content_config from '../../theme/ostsdk/ost-sdk-content-config';
import ost_wallet_sdk_config from '../../theme/ostsdk/ost-wallet-sdk-config';

class IntroScreen extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };
  constructor(props) {
    super(props);
  }

  init = async () => {
    OstWalletSdkUI.setThemeConfig(ost_sdk_theme_config);
    OstWalletSdkUI.setContentConfig(ost_sdk_content_config);
    OstWalletSdk.initialize(PLATFORM_API_ENDPOINT, ost_wallet_sdk_config, this.onSdkInitialized);
  };

  onSdkInitialized = (error, success) => {

  };

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.push('LoginScreen', {"navTitle": "Login to your Account", "isSingupView": true})
    }, 1000)
  }

  render() {
    return(
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Image style={styles.ostLogo} source={ostLog}/>
          <Text>Version 1.0.0</Text>
        </SafeAreaView>
      </>
    )
  }
}

export default IntroScreen;
