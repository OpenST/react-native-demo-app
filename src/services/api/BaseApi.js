import AssignIn from 'lodash/assignIn';
import qs from 'qs';
import NetInfo from '@react-native-community/netinfo';
import FormData from 'form-data';
import {Alert} from 'react-native'
import NavigationService from "../NavigationService";
const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking');

const LOG_TAG = 'services/BaseApi';

export default class BaseApi {
  constructor(url) {
    this.url = url;
    this.defaultParams = {};
    this._cleanUrl();
    this._parseParams();
    this.formData = new FormData();
  }

  setFormData( data = null ) {
    if (data == '') {
      this.formData = {};
      return;
    }

    if (typeof data === 'object') {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          this.formData.append(key, data[key])
        }
      }
    }
  }

  get(res, q = '') {
    let query = typeof q !== 'string' ? qs.stringify(q) : q;
    this.parsedParams = AssignIn(this.parsedParams, {
      method: 'GET'
    });
    this.cleanedUrl += res;
    this.cleanedUrl += query.length > 0 ? (this.cleanedUrl.indexOf('?') > -1 ? `&${query}` : `?${query}`) : '';

    return this._perform();
  }

  post(res, body = '') {
    this.setFormData(body);
    this.parsedParams = AssignIn(this.parsedParams, {
      method: 'POST',
      body: this.formData
    });
		this.cleanedUrl += res;
    return this._perform();
  }

  _cleanUrl() {
    this.cleanedUrl = this.url;
  }

  _parseParams() {
    this.parsedParams = AssignIn(this.defaultParams);
  }

  _getIDList(resultData, key = 'id') {
    return resultData.map((item) => item[key]);
  }

  _getIDListFromObj(resultObj) {
    return Object.keys(resultObj);
  }

  _getEntityFromObj(resultObj, key = 'id') {
    const entity = {},
      id = `${key}_${resultObj.id}`;
    entity[id] = resultObj;
    return entity;
  }

  _perform() {
    console.log("performing request");
    return new Promise(async (resolve, reject) => {
      try {
        let netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          console.log(`Error requesting ${this.cleanedUrl}. ${ostErrors.getUIErrorMessage('no_internet')}`);
          //Todo:: Show toast when toast helper available
          // Toast.show({
          //   text: ostErrors.getUIErrorMessage('no_internet'),
          //   icon: 'error'
          // });

          // Cosider using reject here.
          throw UIWhitelistedErrorCode['no_internet'];
        }

        let t1 = Date.now();
        console.log(`Requesting ${this.cleanedUrl} with options:`, this.parsedParams);

        let requestOptions = AssignIn(this.parsedParams,{
          credentials: 'include',
          headers: {
            'Content-Type': 'multipart/form-data'
          }});

        let response = await fetch(this.cleanedUrl, requestOptions),
          responseStatus = parseInt(response.status),
          responseJSON = await response.json();

        let t2 = Date.now();
        console.log(
          `Response for ${this.cleanedUrl} resolved in ${t2 - t1} ms, Status: ${responseStatus}, JSON payload:`,
          responseJSON
        );

        switch (responseStatus) {
          case 200:
            this.logoutOn401();
            throw "Dummy Error";
            break;
          case 301:
          case 302:
          case 304:
          case 400:
          case 404:
          case 409:
            break;
          case 401:
            this.logoutOn401();
            break;
          default:
            //Todo: show toast error
            break;
        }

        return resolve(responseJSON);
      } catch (err) {
        console.log('Fetch exception', err);
        return reject(err);
      }
    });
  }

  clearCookies() {
    return new Promise(function (resolve) {
      console.log("Clearing cookies");
      RCTNetworking.clearCookies((...args) => {
        console.log("RCTNetworking.clearCookies callback. args", args);
        return resolve();
      });
    });
  }

  async logoutOn401() {
    // Clear the cookies.
    await this.clearCookies();
    console.log("Cookies should be cleared. Going to Onboarding");
    NavigationService.navigate("Onboarding");
  }
}
