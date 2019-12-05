import BaseApi from "./BaseApi";
import AppConfig from "../../constants/AppConfig";

const LOG_TAG = 'services/AppServerApi';

export default class AppServerApi extends BaseApi{
  constructor(url) {
    super(url);
    this.defaultParams = {
      credentials: 'include',
      headers: {
        'Content-Type': AppConfig.api_constants.CONTENT_TYPE,
        'User-Agent': AppConfig.api_constants.USER_AGENT
      }
    };
  }

  thenFunction(res) {
    const success = res["success"];

	if (res && (success || success === 'true')) {
  		return Promise.resolve( res["data"] )
	}
    return Promise.reject(res)
  }

  catchFunction(err) {
  	return Promise.reject(err)
  }

  createAccount(username, password) {
    let oThis = this;
    let body = {username: username, password: password};
    let res ='/signup';
    return this.post(res, body)
	  .then(oThis.thenFunction)
	  .catch(oThis.catchFunction);
  }

  logIn(username, password) {
  	let oThis = this;
    let body = {username: username, password: password};
    let res ='/login';
    return this.post(res, body)
      .then(oThis.thenFunction)
      .catch(oThis.catchFunction);
  }

  registerDevice(deviceAddress, apiSignerAddress) {
    let oThis = this;
    let body = {address: deviceAddress, api_signer_address: apiSignerAddress};
    let res ='/devices';
    return this.post(res, body)
      .then(oThis.thenFunction)
      .catch(oThis.catchFunction);
  }

  getLoggedInUserPinSalt() {
    let res ='/users/current-user-salt';
    return this.get(res);
  }

  getLoggedInUser() {
    let res ='/users/current-user';
    return this.get(res);
  }

  notifyUserActivate() {
    let res ='/notify/user-activate';
    return this.post(res);
  }

  getCurrentUserTransactions(nextPayload) {
    let body = {next_page_payload: nextPayload};
    let res ='/users/ledger';
    return this.get(res, body);
  }

  getUserList(nextPayload) {
    let body = {next_page_payload: nextPayload};
    let res ='/users';
    return this.get(res, body)
	  .then(function(res) {
	  	// const data =
        // return Promise.resolve(err)
	  })
	  .catch(function (err) {
		return Promise.reject(err)
      });
  }
}
