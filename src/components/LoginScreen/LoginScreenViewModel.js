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
      await CurrentUser.initialize();
      let entity = await this.setupDevice(response);
      await  this.activateUser(response);
      appProvider.getAppServerClient().notifyUserActivate();
      return Promise.resolve(entity)
    }catch (err) {
      return Promise.reject(err);
    }
  }

  setupDevice(response) {
    return new Promise((resolve , reject)=> {

      let currentUser = response[response.result_type];
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

  activateUser(response) {
    return new Promise((resolve , reject)=> {
      let currentUser = response[response.result_type];
      let userId = currentUser.user_id;
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


  async loginUser(userName, password) {
    try {
      let response = await appProvider.getAppServerClient().logIn(userName, password);
      await CurrentUser.initialize();
      let entity = await this.setupDevice(response);
      let ostDeviceStatus = await CurrentUser.getOstDeviceStatus();
      let ostUserStatus = await CurrentUser.getOstUserStatus();
      if (ostDeviceStatus.toLowerCase() === 'registered' && ostUserStatus.toLowerCase() === 'created') {
        let user = await this.activateUser(response);
        appProvider.getAppServerClient().notifyUserActivate();
      }
      return Promise.resolve(entity)
    }catch (err) {
      return Promise.reject(err);
    }
  }

}

export  {LoginScreenViewModel};
