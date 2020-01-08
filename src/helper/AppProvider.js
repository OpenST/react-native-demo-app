import AppServerApi from "../services/api/AppServerApi";
import {RegisterDeviceHelper} from "./OstSdkHelpers/RegisterDeviceHelper"
import UIWorkflowDelegate from "./OstSdkHelpers/OstWorkflowDelegate";
import CurrentUser from "../models/CurrentUser";
import PriceOracle from "../services/PriceOracle";
import ECONOMY_DATA from "../constants/demo-server-config.json";

const LOG_TAG = 'helper/AppProvider';

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

  getOstSdkUIDelegate() {
    let ostUserId = CurrentUser.getUserId();
    return new UIWorkflowDelegate(ostUserId, {})
  }

  async getPriceOracle(pricePoint) {
    const token = await CurrentUser.getOstToken();
    return new PriceOracle( token  , pricePoint);
  }

}

const appProvider = new AppProvider();
export {appProvider};
