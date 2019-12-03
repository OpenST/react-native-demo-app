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

  createAccount(username, password) {
    let body = {username: username, password: password};
    let res ='/signup';
    return this.post(res, body);
  }

	logIn(username, password) {
		let body = {username: username, password: password};
		let res ='/login';
		return this.post(res, body);
  }

	registerDevice(deviceAddress, apiSignerAddress) {
		let body = {address: deviceAddress, api_signer_address: apiSignerAddress};
		let res ='/devices';
		return this.post(res, body);
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
		return this.get(res, body);
  }
}
