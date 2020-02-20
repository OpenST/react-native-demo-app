import {OstWalletSettingsComponent} from '@ostdotcom/ost-wallet-sdk-react-native';
import {Button} from "react-native";
import React from "react";

class CustomWalletSettingsComponent extends OstWalletSettingsComponent {

	static navigationOptions = (navigationProps) => {
		// Get navigation options from sdk.
		let sdkNavigationOptions = OstWalletSettingsComponent.navigationOptions(navigationProps);

		// Do custom stuff.
		let navigation = navigationProps.navigation;
		let navigationParams = {
			title: navigation.getParam('navTitle', 'Wallet Settings'),
			headerStyle: {
				borderBottomWidth: 0,
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 2
				},
				shadowOpacity: 0.1,
				shadowRadius: 6
			},
			headerLeft: (<Button title = "LEFT" onPress={() => alert('Left button!')}/>),
			headerTitle: (<Button title = "CENTER" onPress={() => alert('Center button!')}/>),
			headerRight: (<Button title = "RIGHT" onPress={() => alert('Right button!')}/>)
		};

		// Merge the navigation options.
		return Object.assign(sdkNavigationOptions, navigationParams);
	};

	constructor(props) {
		super(props);
	}
}

export default CustomWalletSettingsComponent;
