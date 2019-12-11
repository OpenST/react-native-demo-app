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
import CurrentUser from "../../models/CurrentUser";
import {SwitchActions} from "react-navigation";
import AppLoader from "../CommonComponent/AppLoader";
import ost_wallet_sdk_config from "../../theme/ostsdk/ost-wallet-sdk-config";
import {appProvider} from "../../helper/AppProvider";
import {LoginScreenViewModel} from "../LoginScreen/LoginScreenViewModel";

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
		// OstWalletSdkUI.setThemeConfig(ost_sdk_theme_config);
		OstWalletSdkUI.setContentConfig(ost_sdk_content_config);
	};


	componentDidMount() {
      	this.initSdk();

		let platformUrl = appProvider.getSaasApiEndpoint();
		OstWalletSdk.initialize(platformUrl, ost_wallet_sdk_config, (err , success ) => {});

		if (CurrentUser.getUserData()) {
          this.showLoader(false);
          this.props.navigation.dispatch(SwitchActions.jumpTo({routeName: 'Wallet'}, {navTitle: "Wallet"}));

		} else {
          this.showLoader(true);
          this.viewModel.setupApplicationUser()
			.then((res) => {
              this.showLoader(false);
              this.props.navigation.dispatch(SwitchActions.jumpTo({routeName: 'Wallet'}, {navTitle: "Wallet"}));

			})
			.catch((err) => {
              this.showLoader(false);
              this.props.navigation.push('LoginScreen', {"navTitle": "Login to your Account", "isSingupView": true})
		  	});
		}
	}

	showLoader(show) {
		this.setState({
			modalVisible: show,
			title: "Trying Auto-Login"
		});
	}

	render() {
		return (
			<>
				<AppLoader modalVisible={this.state.modalVisible} title={this.state.title}/>
				<StatusBar barStyle="dark-content"/>
				<SafeAreaView>
					<Image style={styles.ostLogo} source={ostLog}/>
					<Text>Version 1.0.0</Text>
				</SafeAreaView>
			</>
		)
	}
}

export default IntroScreen;
