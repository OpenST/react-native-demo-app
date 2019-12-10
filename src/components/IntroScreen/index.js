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
	}

	init = async () => {
		OstWalletSdkUI.setThemeConfig(ost_sdk_theme_config);
		OstWalletSdkUI.setContentConfig(ost_sdk_content_config);
	};

	onSdkInitialized = (error, success) => {

	};

	componentDidMount() {
		if (!CurrentUser.getUserData()) {
			this.showLoader(true);
			CurrentUser.initialize()
				.then((res) => {
					this.showLoader(false);
					this.props.navigation.dispatch(SwitchActions.jumpTo({routeName: 'Wallet'}, {navTitle: "Wallet"}));
				}).catch((err) => {
				this.showLoader(false);
				this.props.navigation.push('LoginScreen', {"navTitle": "Login to your Account", "isSingupView": true})
			});
		} else {
			this.showLoader(false);
			this.props.navigation.dispatch(SwitchActions.jumpTo({routeName: 'Wallet'}, {navTitle: "Wallet"}));
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
