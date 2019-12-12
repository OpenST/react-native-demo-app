import {appProvider} from "../../helper/AppProvider";
import {OstWalletSdk, OstWalletSdkUI, OstWalletUIWorkflowCallback} from '@ostdotcom/ost-wallet-sdk-react-native';
import ost_wallet_sdk_config from "../../theme/ostsdk/ost-wallet-sdk-config";
import {DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT} from "../../constants/AppConfig";
import CurrentUser from "../../models/CurrentUser";
import OstSetupDevice from "../../helper/OstSetupDeviceHelper/OstSetupDevice";


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

  // setupDevice() {
  //   return new Promise((resolve , reject) => {
  //     let userId = CurrentUser.getUserId();
  //     appProvider.userId = userId;
  //     let tokenId = CurrentUser.getTokenId();
  //
  //     let workflowCallback = appProvider.getRegisgerDeviceHelper();
  //     workflowCallback.flowInterrupt = (ostWorkflowContext , ostError) => {
  //       reject(ostError)
  //     };
  //     workflowCallback.flowComplete = (ostWorkflowContext , ostContextEntity) => {
  //       resolve(ostContextEntity)
  //     };
  //
  //     OstWalletSdk.setupDevice(userId, tokenId, workflowCallback);
  //
  //   });
  // }


  setupDevice() {
    return new Promise((resolve , reject) => {
      let setupDeviceHelper = null;

      const registerDevice = (apiParams) => {
        let appServerClient = appProvider.getAppServerClient();
        let deviceAddress = apiParams.address || apiParams.device.address;
        let apiSignerAddress = apiParams.api_signer_address || apiParams.device.api_signer_address;

        appServerClient.registerDevice(deviceAddress, apiSignerAddress)
          .then((res) => {
            setupDeviceHelper.onDeviceRegisteredFailed();
            // setupDeviceHelper.onDeviceRegistred(res)
          })
          .catch((err) => {
            setupDeviceHelper.onDeviceRegisteredFailed();
          })
      };

      const flowComplete = (workflowContext, contextEntity) => {
        resolve(contextEntity);
      };

      const flowInterruped = (workflowContext, ostError) => {
        reject(ostError);
      };

      setupDeviceHelper = new OstSetupDevice(CurrentUser.getUserId(), appProvider.getTokenId(), registerDevice, flowComplete, flowInterruped);
      setupDeviceHelper.perform();
    });
  }

  activateUser() {
    return new Promise((resolve , reject) => {
      let userId = CurrentUser.getUserId();
      let uiCallback = appProvider.getOstSdkUIDelegate();

      // uiCallback.flowComplete = (ostWorkflowContext , ostContextEntity) => {
      //   resolve(ostContextEntity)
      // };
      // uiCallback.flowInterrupt = (ostWorkflowContext , ostError) => {
      //   reject(ostError)
      // };
      // uiCallback.requestAcknowledged = (ostWorkflowContext , ostContextEntity) => {
      //   console.log(ostContextEntity)
      // };

      let workflowId = OstWalletSdkUI.activateUser(userId, DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT, uiCallback);

      OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, (workflowContext, contextEntity) => {
        console.log(contextEntity);
      });

      OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (workflowContext, contextEntity) => {
        resolve(contextEntity);
      });

      OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (workflowContext, ostError) => {
        reject(ostError);
      })
    });
  }
}

export  {LoginScreenViewModel};
