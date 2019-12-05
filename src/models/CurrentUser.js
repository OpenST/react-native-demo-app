import {logoutUser, updateCurrentUser} from '../actions';
import {navigateTo} from "../helpers/navigateTo";
import {ostSdkErrors} from '../services/OstSdkErrors';
import {appProvider} from "../helper/AppProvider";
import {Alert} from "react-native";

// Used require to support all platforms
const RCTNetworking = require('RCTNetworking');

class CurrentUser {
	constructor() {
		this.userData = null;
	}

	initialize() {
		//Provide user js obj in  a promise.
		return appProvider.getAppServerClient().getLoggedInUser()
			.then(res => res.json())
			.then(responseData => {
				let userData = responseData.data && responseData.data[responseData.data.result_type];
				if (!userData) {
					this.userData = null;
					Alert.alert("User not found");
					return Promise.reject(responseData);
				}
				this.userData = userData;
				return Promise.resolve(responseData);

			}).catch(e => {
				Alert.alert("Something went wrong" + JSON.stringify(e));
				return Promise.reject(e);
			});
	}

	getUserData() {
		return this.userData;
	}

}


export default new CurrentUser();
