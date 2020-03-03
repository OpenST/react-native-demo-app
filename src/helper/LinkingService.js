import {Linking} from "react-native";
import React from 'react';

const LOG_TAG = "LinkingService :: ";
class LinkingService {
  constructor() {
    this.eventReceiver = null;
    this.lastReceivedUrl = null;

    this.subscribeToEvent();
  }

  subscribeToEvent() {
    const oThis = this;

    // getInitialURL when app is closed and is being launched by universal link
    Linking.getInitialURL().then(url => {
      console.log(LOG_TAG, "LINKING : getInitialURL received  : ", url);
      oThis.navigate(url)
    });

    // addEventListener on 'url' when app is in background and launched by universal link
    Linking.addEventListener('url', (event) => {
      console.log(LOG_TAG, "LINKING : event received : ", event.url);
      const url = event.url;
      oThis.navigate(url);
    });

    console.log(LOG_TAG, "LINKING : addEventListener : ");
  }

  navigate(url) {
    const oThis = this;
    console.log(LOG_TAG, "LINKING : eventReceiver : ", oThis.eventReceiver);
    if (oThis.eventReceiver && typeof oThis.eventReceiver === 'function') {
      let params = oThis.getKeysFromParams(url);
      oThis.eventReceiver(url, params);
    }

    oThis.lastReceivedUrl = url;
  }

  setEventReceiver(receiver) {
    this.eventReceiver = receiver;
  }

  getLatReceivedURL() {
    return this.lastReceivedUrl;
  }

  removeLatReceivedURL() {
    this.lastReceivedUrl = null;
  }

  getKeysFromParams(url) {
    const decodeUrl = decodeURIComponent(url);
    console.log(LOG_TAG, "getKeysFromParams : url : ", decodeUrl);

    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match
    ;
    while (match = regex.exec(decodeUrl)) {
      params[match[1]] = match[2];
    }

    return params;
  }

}

export default new LinkingService();