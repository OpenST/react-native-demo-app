import AppServerApi from "../services/api/AppServerApi";
import {RegisterDeviceHelper} from "./OstSdkHelpers/RegisterDeviceHelper"
import UIWorkflowDelegate from "./OstSdkHelpers/OstWorkflowDelegate";
import CurrentUser from "../models/CurrentUser";

const LOG_TAG = 'helper/AppProvider';

const ECONOMY_DATA = {token_id: 1129, token_name:"MyApp2",token_symbol:"MyApp",url_id:"3213e2cfeed268d4ff0e067aa9f5f528d85bdf577e30e3a266f22556865db23a",mappy_api_endpoint:"https://demo-mappy.stagingost.com/demo/",saas_api_endpoint:"https://api.stagingost.com/testnet/v2/",view_api_endpoint:"https://view.stagingost.com/testnet/"};
class AppProvider {
  constructor(economyData) {
    this.economyData = economyData || ECONOMY_DATA;
    this.userId = ""
  }

  setQRData(data) {
    this.economyData = data;
  }

  getTokenName() {
    let tokenName = this.economyData["token_name"];
    if (!tokenName) {
      throw "Token Name is null";
    }
    return tokenName;
  }

  getTokenId() {
    let tokenId = this.economyData["token_id"];
    if (!tokenId) {
      throw "Token Id is null";
    }
    return tokenId;
  }

  getTokenSymbol() {
    let tokenSymbol = this.economyData["token_symbol"];
    if (!tokenSymbol) {
      throw "Token symbol is null";
    }
    return tokenSymbol;
  }

  getSaasApiEndpoint() {
    let saasEndpoint = this.economyData["saas_api_endpoint"];
    if (!saasEndpoint) {
      throw "Saas api endpoint is null";
    }
    return saasEndpoint;
  }

  getMappyApiEndpoint() {
    let mappyEndpoint = this.economyData["mappy_api_endpoint"];
    if (!mappyEndpoint) {
      throw "mappy api endpoint is null";
    }
    return mappyEndpoint;
  }

  getViewApiEndpoint() {
    let viewApiEndpoint = this.economyData["view_api_endpoint"];
    if (!viewApiEndpoint) {
      throw "view endpoint is null";
    }
    return viewApiEndpoint;
  }

  getUrlId() {
    let url_id = this.economyData["url_id"];
    if (!url_id) {
      throw "url_id is null";
    }
    return url_id;
  }

  getAppServerClient() {
    let url = `${this.getMappyApiEndpoint()}api/${this.getTokenId()}/${this.getUrlId()}`;
    return new AppServerApi(url);
  }

  getRegisgerDeviceHelper() {
    return new RegisterDeviceHelper()
  }

  getUICallback() {
    let ostUserId = CurrentUser.getUserId();
    return new UIWorkflowDelegate(ostUserId, {})
  }

}

const appProvider = new AppProvider();
export {appProvider};
