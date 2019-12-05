import {appProvider} from "../../helper/AppProvider";
import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
import ost_wallet_sdk_config from "../../theme/ostsdk/ost-wallet-sdk-config";
import {DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT} from "../../constants/AppConfig";

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
      let user =  await  this.activateUser(response);
      let notifyRes = await  appProvider.getAppServerClient().notifyUserActivate();
      return Promise.resolve(user)
    }catch (err) {
      return Promise.reject(err);
    }
  }

  setupDevice(response) {
    return new Promise((resolve , reject)=> {

      let currentUser = response[response.result_type];
      let userId = currentUser.user_id;
      appProvider.userId = userId;
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

  activateUser(response) {
    return new Promise((resolve , reject)=> {
      let currentUser = response[response.result_type];
      let userId = currentUser.user_id;
      let uiCallback = appProvider.getUICallback();
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
      let entity = await this.setupDevice(response);
      if (entity["entityType"].toLowerCase() === "device") {
        if (entity["entity"].status.toLowerCase() === 'registered') {
          let user = await this.activateUser(response)
        }
      }
      return Promise.resolve(entity)
    }catch (err) {
      return Promise.reject(err);
    }
  }

}

export  {LoginScreenViewModel};