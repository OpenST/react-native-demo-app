import {appProvider} from "../helper/AppProvider";
import {Alert} from "react-native";

class CurrentUser {
	constructor() {
		this.userData = null;
	}

	initialize() {
		//Provide user js obj in  a promise.
		return appProvider.getAppServerClient().getLoggedInUser()
			.then(responseData => {
				let userData = responseData.data && responseData.data[responseData.data.result_type];
				if (!userData) {
					this.userData = null;
					Alert.alert("User not found");
					return Promise.reject(responseData);
				}
				this.userData = userData;
				return responseData;
			}).catch(e => {
				Alert.alert("Something went wrong" + JSON.stringify(e));
				return Promise.reject(e);
			});
	}

	getUserData() {
		return this.userData;
	}

	getUserId() {
		return this.getUserData()["user_id"];
	}

	getTokenId() {
		return this.getUserData()["token_id"];
	}

	getAppUserId() {
		return this.getUserData()["app_user_id"];
	}

	getUserName() {
		return this.getUserData()["username"];
	}

	getTokenHolderAddress() {
		return this.getUserData()["token_holder_address"];
	}

	getStatus() {
		return this.getUserData()["status"];
	}

}


export default new CurrentUser();
