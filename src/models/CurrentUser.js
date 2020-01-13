import {appProvider} from "../helper/AppProvider";
import {Alert} from "react-native";
import NavigationService from "../services/NavigationService";
import {OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';
import BaseApi from "../services/api/BaseApi";

class CurrentUser {
  constructor() {
    this.userData = null;
    this.userBalance = null;
    BaseApi.set401Callback( (reponse) => {
      this.on401Callback();
    });
    this.on401Timer = null;
  }

  initialize() {
    //Provide user js obj in  a promise.
    return appProvider.getAppServerClient().getLoggedInUser()
      .then(responseData => {
        let userData = responseData.data && responseData.data[responseData.data.result_type];
        if (!userData) {
          this.userData = null;
          return Promise.reject(responseData);
        }
        this.userData = userData;
        return responseData;
      }).catch(e => {
        return Promise.reject(e);
      });
  }

  getUserData() {
    return this.userData;
  }

  resetUserData() {
    this.userData = null;
    this.userBalance = null;
  }

  getUserId() {
    let userId = this.getUserData()["user_id"];
    return userId.toString();
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
      OstWalletSdk.getToken(this.getTokenId().toString(), (token) => {
        resolve(token)
      });
    });
  }

  getUserBalance() {
    return this.userBalance || {};
  }

  setUserBalance(userBalance) {
    let resultType = userBalance.result_type;
    this.userBalance = userBalance[resultType];
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
    this.resetUserData();
    let apiService = appProvider.getAppServerClient();
    return apiService.logoutUser()
      .then((res) => {
        this.resetUserData();
        return Promise.resolve(res)
      })
      .catch((err) => {
        // Ignore the error.
        
      })
      .then(() => {
        // Always clear cookie.
        return BaseApi.clearCookies();
      })
  }

  on401Callback() {
    clearTimeout(this.on401Timer);
    this.on401Timer = setTimeout(async () => {

       this.resetUserData();
            await BaseApi.clearCookies();
            NavigationService.navigate("IntroScreen", {"isAutoLogout": true});
    }, 500);
  }

  async isUserStatusActivated() {
    let userStatus = await this.getOstUserStatus();
    return userStatus.toUpperCase() === 'CREATED';
  }

  async isUserStatusActivated() {
    let userStatus = await this.getOstUserStatus();
    return userStatus.toUpperCase() === 'ACTIVATED';
  }

  async isDeviceStatusAuthorized() {
    let deviceStatus = await this.getOstDeviceStatus();
    return deviceStatus.toUpperCase() === 'AUTHORIZED'
  }

  async isDeviceStatusRegistered() {
    let deviceStatus = await this.getOstDeviceStatus();
    return deviceStatus.toUpperCase() === 'REGISTERED'
  }
}


export default new CurrentUser();
