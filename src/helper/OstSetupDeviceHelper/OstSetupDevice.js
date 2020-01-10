import {OstWalletSdk, OstWalletWorkFlowCallback} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";

export default class OstSetupDevice {
  constructor(userId, tokenId, registerDeviceCallback, flowCompleteCallback, flowInterrupedCallback) {
    this.userId = userId;
    this.tokenId = tokenId;

    if (!registerDeviceCallback || typeof registerDeviceCallback !== 'function') {
      const err = new Error("registerDeviceCallback can not be null and must be a function");
      throw err;
    }
    this.registerDeviceCallback = registerDeviceCallback;

    if (!flowCompleteCallback || typeof flowCompleteCallback !== 'function') {
      const err = new Error("flowCompleteCallback can not be null and must be a function");
      throw err;
    }
    this.flowCompleteCallback = flowCompleteCallback;

    if (!flowInterrupedCallback || typeof flowInterrupedCallback !== 'function') {
      const err = new Error("flowInterrupedCallback can not be null and must be a function");
      throw err;
    }
    this.flowInterrupedCallback = flowInterrupedCallback;

    this.ostDeviceRegisteredCallback = null;

    this.workflowCallback = new OstWalletWorkFlowCallback();
  }

  perform() {
    this.workflowCallback.registerDevice = (apiParams, ostDeviceRegistered) => {
      this.ostDeviceRegisteredCallback = ostDeviceRegistered;
      this.registerDeviceCallback(apiParams);
    };

    this.workflowCallback.flowInterrupt = (ostWorkflowContext , ostError) => {
      this.flowInterrupedCallback(ostWorkflowContext, ostError);
    };
    this.workflowCallback.flowComplete = (ostWorkflowContext , ostContextEntity) => {
      this.flowCompleteCallback(ostWorkflowContext, ostContextEntity);
    };

    OstWalletSdk.setupDevice(this.userId, this.tokenId, this.workflowCallback);
  }

  onDeviceRegistred(params) {
    if (this.ostDeviceRegisteredCallback) {
      this.ostDeviceRegisteredCallback.deviceRegistered(params, (error) => {
        this.ostDeviceRegisteredCallback.cancelFlow();
      });
    }
  }

  onDeviceRegisteredFailed() {
    if (this.ostDeviceRegisteredCallback) {
      this.ostDeviceRegisteredCallback.cancelFlow();
    }
  }
}