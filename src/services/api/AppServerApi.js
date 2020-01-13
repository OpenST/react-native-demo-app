import BaseApi from "./BaseApi";
import {API_CONSTANT} from "../../constants/AppConfig";
// Used require to support all platforms
const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking');

const LOG_TAG = 'services/AppServerApi';

export default class AppServerApi extends BaseApi{
  constructor(url) {
    super(url);
    this.defaultParams = {
      credentials: 'include',
      headers: {
        'Content-Type': API_CONSTANT.CONTENT_TYPE,
        'User-Agent': API_CONSTANT.USER_AGENT
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
    let body = {username: username, password: password};
    let res ='/signup';
    return this.post(res, body)
	  .then(this.thenFunction)
	  .catch(this.catchFunction);
  }

  logIn(username, password) {
    let body = {username: username, password: password};
    let res ='/login';
    return this.post(res, body)
      .then(this.thenFunction)
      .catch(this.catchFunction);
  }

  registerDevice(deviceAddress, apiSignerAddress) {
    let body = {address: deviceAddress, api_signer_address: apiSignerAddress};
    let res ='/devices';
    return this.post(res, body)
      .then(this.thenFunction)
      .catch(this.catchFunction);
  }

  getLoggedInUserPinSalt() {
    let res ='/users/current-user-salt';
    return this.get(res)
      .then(this.thenFunction)
      .catch(this.catchFunction);
  }

  getLoggedInUser() {
    let res ='/users/current-user';
    return this.get(res);
  }

  notifyUserActivate() {
    let res ='/notify/user-activate';
    return this.post(res)
      .then(this.thenFunction)
      .catch(this.catchFunction);
  }

  getCurrentUserTransactions(nextPayload) {
    let body = {page: nextPayload};
    let res ='/users/ledger';
    return this.get(res, body)
      .then(this.thenFunction)
      .catch(this.catchFunction)
  }

  getUserList(nextPayload) {
    let body = {page: nextPayload};
    let res ='/users';
    return this.get(res, body)
	  .then(this.thenFunction)
	  .catch(this.catchFunction)
  }

  logoutUser() {
    let res = '/users/logout';
    const oThis = this;
    return this.post(res)
      .then(function(res) {
				return oThis.clearCookies();
      })
      .catch(function (err) {
				return oThis.clearCookies();
      });
  }
}
