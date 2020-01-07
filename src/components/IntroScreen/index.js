import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View, Alert
} from 'react-native';

import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';

import styles from './style'
import ostLog from '../../assets/ostLogoBlue.png'
import ostIntroImage from '../../assets/ostIntroImage.png'

import ost_sdk_theme_config from '../../theme/ostsdk/ost-sdk-theme-config';
import ost_wallet_sdk_config from "../../theme/ostsdk/ost-wallet-sdk-config";
import ost_sdk_content_config from '../../theme/ostsdk/ost-sdk-content-config';
import ost_sdk_settings_config from '../../theme/ostsdk/ost-sdk-settings-config';

import CurrentUser from "../../models/CurrentUser";

import AppLoader from "../CommonComponent/AppLoader";
import {appProvider} from "../../helper/AppProvider";

import {LoginScreenViewModel} from "../LoginScreen/LoginScreenViewModel";
import WalletScreen from "../WalletScreen";

import sizeHelper from "../../helper/SizeHelper";
import {OstWalletSettings} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";



class IntroScreen extends PureComponent {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);
    this.state = {modalVisible: false, title: ""};
    this.viewModel = new LoginScreenViewModel()
  }

  initSdk() {
    OstWalletSdkUI.setThemeConfig(ost_sdk_theme_config);
    OstWalletSdkUI.setContentConfig(ost_sdk_content_config);
    OstWalletSettings.setMasterConfig(ost_sdk_settings_config);
  };

  componentDidMount() {
    this.initSdk();

    let platformUrl = appProvider.getSaasApiEndpoint();
    OstWalletSdk.initialize(platformUrl, ost_wallet_sdk_config, (err , success ) => {});

    if (CurrentUser.getUserData()) {
     this.onSetupDeviceSuccess();
    } else {
     this.showLoader(true);
     this.viewModel.setupApplicationUser()
    	.then((res) => {
          this.onSetupDeviceSuccess(res);
    	})
    	.catch((err) => {
         this.showLoader(false);
      	});
    }
  }

  async onSetupDeviceSuccess(res) {
    this.showLoader(false);

    const isDeviceRegistered = await CurrentUser.isDeviceStatusRegistered();
    const isUserActivated = await CurrentUser.isUserStatusActivated();

    if (isDeviceRegistered && isUserActivated) {
      this.showAlertToAuthorizeDevice()
    }else {
      this.jumpToWalletScreen()
    }
  }

  showAlertToAuthorizeDevice() {
    Alert.alert("Registered Device",
      "Your device is in registered state. Please authorized your device",
      [
        {
          text: 'Go to settings',
          onPress: () => {
            this.jumpToWalletSettingsScreen()
          },
          style: 'cancel'
        },
        {
          text: 'Cancel',
          onPress: () => {
            this.jumpToWalletScreen()
          }
        }
      ],
      {cancelable: false}
    );
  }

  jumpToWalletScreen() {
    let navigationScreen = 'WalletScreen';
    let navigationParams = {'activateUserWorkflowId': this.viewModel.activateUserWorkflowId};

    setTimeout(() => {
      this.props.navigation.navigate(navigationScreen, navigationParams);
    }, 500);
  }

  jumpToWalletSettingsScreen() {
    const navigationScreen =  'WalletSettingScreen';
    const navigationParams = {'ostUserId': CurrentUser.getUserId(), 'ostWalletUIWorkflowCallback': appProvider.getOstSdkUIDelegate()};

    setTimeout(() => {
      this.props.navigation.navigate(navigationScreen, navigationParams);
    }, 500);
  }

  showLoader(show) {
    this.setState({
      modalVisible: show,
      title: "Trying Auto-Login"
    });
  }

  onLoginPress = () => {
    this.props.navigation.push('LoginScreen', {"navTitle": "Login to your Account", "isSignupView": false})
  };

  onCreateAccountPress = () => {
    this.props.navigation.push('LoginScreen', {"navTitle": "Create Account", "isSignupView": true})
  };
  render() {
    return (
		<>
          <AppLoader modalVisible={this.state.modalVisible} title={this.state.title}/>
          <StatusBar barStyle="dark-content"/>
          <SafeAreaView style={{flex: 1, marginHorizontal: sizeHelper.layoutPtToPx(20), justifyContent: 'space-between'}}>
			<React.Fragment>
              <Image style={styles.ostLogo} source={ostLog}/>
              <Text style={styles.versionText}>Version 0.1.0(testnet)</Text>
			</React.Fragment>

            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{height: '80%', width: '80%'}} resizeMode="contain" source={ostIntroImage}/>
			</View>

		  <View style={{marginBottom: sizeHelper.layoutPtToPx(20)}}>
			<Text style={styles.descriptionText}>This beta release enables users to join Brand Token economies, to send and receive tokens, and to access wallet security and recovery features.</Text>

			<TouchableOpacity
			  style={styles.primaryActionButton}
			  onPress={this.onCreateAccountPress}
			  underlayColor='#fff'>
			  <Text style={styles.primaryActionText}>Create Account</Text>
			</TouchableOpacity>

			<TouchableOpacity
			  style={styles.secondaryActionButton}
			  onPress={this.onLoginPress}
			  underlayColor='#fff'>
			  <Text style={[styles.secondayActionText]}>Log in</Text>
			</TouchableOpacity>
		  </View>

          </SafeAreaView>
		</>
    )
  }
}

export default IntroScreen;
