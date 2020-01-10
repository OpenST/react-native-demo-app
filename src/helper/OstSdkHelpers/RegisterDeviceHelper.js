
import {OstWalletWorkFlowCallback} from '@ostdotcom/ost-wallet-sdk-react-native';
import {appProvider} from '../AppProvider'
import CurrentUser from "../../models/CurrentUser";

class RegisterDeviceHelper extends OstWalletWorkFlowCallback {
  constructor() {
    super()
  }

  registerDevice(apiParams, ostDeviceRegistered) {
    let appServerClient = appProvider.getAppServerClient();
    let deviceAddress = apiParams.address || apiParams.device.address;
    let apiSignerAddress = apiParams.api_signer_address || apiParams.device.api_signer_address;
    appServerClient.registerDevice(deviceAddress, apiSignerAddress)
      .then((res) => {
        this.onRegister(res, ostDeviceRegistered);
      })
      .catch((err) => {
        ostDeviceRegistered.cancel()
      })
  }

  async onRegister(res, ostDeviceRegistered) {
    await CurrentUser.initialize();
    ostDeviceRegistered.deviceRegistered(res[res.result_type], (error) => {
      console.warn(error);
    });
  }
};

export {RegisterDeviceHelper}