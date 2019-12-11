import {appProvider} from "../../helper/AppProvider";
import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
import ost_wallet_sdk_config from "../../theme/ostsdk/ost-wallet-sdk-config";
import {DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT} from "../../constants/AppConfig";
import CurrentUser from "../../models/CurrentUser";


class LoginScreenViewModel {
  constructor() {
    this.isSignupView = false;
    this.uiDelegate = null;
  }

  setUIDelegate(obj) {
    this.uiDelegate = obj
  }

  setupUser(userName, password) {

    let platformUrl = appProvider.getSaasApiEndpoint();
    OstWalletSdk.initialize(platformUrl, ost_wallet_sdk_config, (err , success ) => {});
    if (this.isSignupView) {
      return this.createAccount(userName, password)
    }else {
      return this.loginUser(userName, password)
    }
  }

  async createAccount(userName, password) {
    try {
      let response = await appProvider.getAppServerClient().createAccount(userName, password);
      const device = await this.setupApplicationUser();
      return Promise.resolve(device);
    }catch (err) {
      return Promise.reject(err);
    }
  }

  async loginUser(userName, password) {
    try {
      let response = await appProvider.getAppServerClient().logIn(userName, password);
      const device = await this.setupApplicationUser();
      return Promise.resolve(device);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async setupApplicationUser() {
    try {
      await CurrentUser.initialize();
      let res = await this.setupDevice();
      let device = res.entity;
      let ostDeviceStatus = await CurrentUser.getOstDeviceStatus();
      let ostUserStatus = await CurrentUser.getOstUserStatus();
      if (ostDeviceStatus.toLowerCase() === 'registered'
          && ostUserStatus.toLowerCase() === 'created') {

        await this.activateUser();
        device = await CurrentUser.getOstCurrentDeivce();
      }
      return Promise.resolve(device)
    }catch (err) {
      return Promise.reject(err)
    }
  }

  setupDevice() {
    return new Promise((resolve , reject) => {
      let userId = CurrentUser.getUserId();
      appProvider.userId = userId;
      let tokenId = CurrentUser.getTokenId();

      let workflowCallback = appProvider.getRegisgerDeviceHelper();
      workflowCallback.flowInterrupt = (ostWorkflowContext , ostError) => {
        reject(ostError)
      };
      workflowCallback.flowComplete = (ostWorkflowContext , ostContextEntity) => {
        resolve(ostContextEntity)
      };

      OstWalletSdk.setupDevice(userId, tokenId, workflowCallback);

    });
  }

  activateUser() {
    return new Promise((resolve , reject) => {
      let userId = CurrentUser.getUserId();
      let uiCallback = appProvider.getOstSdkUIDelegate();
      uiCallback.flowComplete = (ostWorkflowContext , ostContextEntity) => {
        resolve(ostContextEntity)
      };
      uiCallback.flowInterrupt = (ostWorkflowContext , ostError) => {
        reject(ostError)
      };
      uiCallback.requestAcknowledged = (ostWorkflowContext , ostContextEntity) => {
        console.log(ostContextEntity)
      };


      OstWalletSdkUI.activateUser(userId, DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT, uiCallback)
    });
  }
}

export  {LoginScreenViewModel};
