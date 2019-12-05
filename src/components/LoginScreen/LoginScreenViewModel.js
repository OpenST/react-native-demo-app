import {appProvider} from "../../helper/AppProvider";
import {OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';
import ost_wallet_sdk_config from "../../theme/ostsdk/ost-wallet-sdk-config";

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
      let entity = await this.setupDevice(response);
      return Promise.resolve(entity)
    }catch (err) {
      return Promise.reject(err);
    }
  }

  setupDevice(response) {
    return new Promise((resolve , reject)=> {

      let currentUser = response[response.result_type];
      let userId = currentUser.user_id;
      let tokenId = currentUser.token_id;

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


  async loginUser(userName, password) {

    try {
      let response = await appProvider.getAppServerClient().logIn(userName, password);
      let entity = await this.setupDevice(response);
      return Promise.resolve(entity)
    }catch (err) {
      return Promise.reject(err);
    }
  }

}

export  {LoginScreenViewModel};