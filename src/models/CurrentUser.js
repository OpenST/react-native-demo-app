import {appProvider} from "../helper/AppProvider";
import {Alert} from "react-native";

import {OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';

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

  getOstUser() {
    return new Promise((resolve, reject) => {
      OstWalletSdk.getUser(this.getUserId(), (user) => {
        if (user) {
          resolve(user);
        }
      })
    })
  }

  getOstCurrentDeivce() {
    return new Promise((resolve, reject) => {
      OstWalletSdk.getCurrentDeviceForUserId(this.getUserId(), (device) => {
        resolve(device)
      });
    });
  }

  getOstToken() {
    return new Promise((resolve, reject) => {
      OstWalletSdk.getToken(this.getTokenId(), (token) => {
        resolve(token)
      });
    });
  }

  async getOstUserStatus() {
    let user = await this.getOstUser();
	return user.status
  }

  async getOstDeviceStatus() {
    let device = await this.getOstCurrentDeivce();
    return device.status
  }


  logoutUser() {
    let apiService = appProvider.getAppServerClient();
    return apiService.logoutUser()
  }
}


export default new CurrentUser();
