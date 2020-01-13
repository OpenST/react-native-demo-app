import BigNumber from 'bignumber.js';
import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';

import CurrentUser from "../models/CurrentUser";
import {ostSdkErrors, WORKFLOW_CANCELLED_MSG} from '../services/OstSdkErrors';
import {appProvider} from "./AppProvider";
import {
  DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT, HIGH_SPEND_SESSION_KEY_EXPIRY_TIME, MAX_SPENDING_LIMIT,
  MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME
} from "../constants/AppConfig";


const ON_USER_CANCLLED_ERROR_MSG = WORKFLOW_CANCELLED_MSG;
const DEVICE_UNAUTHORIZED_ERROR_MSG = "Your device is not authorized to perform transactions";
const bnDefaultSpendingLimit = new BigNumber(DEFAULT_SPENDING_LIMIT);
const bnMaxSpendingLimit = new BigNumber(MAX_SPENDING_LIMIT);
const bnOne = new BigNumber(1);

const ensureDeivceAndSession = (userId, btAmount, deviceUnauthorizedCallback, callback) => {
  _hasAuthorizedDevice(userId, ( hasAuthorizedDevice, device ) => {
    if ( !hasAuthorizedDevice ) {
      let errorMessage = DEVICE_UNAUTHORIZED_ERROR_MSG;
      return deviceUnauthorizedCallback(device, errorMessage, false);
    }
    _onHasAuthoirizedDevice(userId, btAmount, callback);
  });
};

const _hasAuthorizedDevice = function (userId, deviceCallback) {
  OstWalletSdk.getCurrentDeviceForUserId(userId, (device) => {
    if (device && "AUTHORIZED" === device.status) {
      deviceCallback(true, device);
    } else {
      deviceCallback(false, device);
    }
  });
};

const _onHasAuthoirizedDevice = (userId, btAmount, callback) => {
  _hasSessions(userId, btAmount, ( hasSessions ) => {
    if ( hasSessions ) {
      // Session is present.
      return callback(null, true);
    }
    _onNoSessions(userId, btAmount, callback);

  })
};

const _hasSessions = function (userId, btAmount, haveSessionCallback) {
  OstWalletSdk.getActiveSessionsForUserId(userId, btAmount, (activeSessions) => {
    if (activeSessions && activeSessions.length > 0) {
      haveSessionCallback(true);
    } else {
      haveSessionCallback(false);
    }
  });
};

const _onNoSessions = (userId, btAmount, callback) => {
  let spendingLimit = DEFAULT_SPENDING_LIMIT;
  let sessionKeyExpiryTime = DEFAULT_SESSION_KEY_EXPIRY_TIME;

  let bnBtAmount = new BigNumber(btAmount);

  if ( bnBtAmount.gt(bnMaxSpendingLimit) ) {
    //Create a short-lived session.
    spendingLimit = bnBtAmount.plus( bnOne ).toString( 10 );
    sessionKeyExpiryTime = HIGH_SPEND_SESSION_KEY_EXPIRY_TIME;
  } else if ( bnBtAmount.gt(bnDefaultSpendingLimit) ) {
    // Create a medium-lived session
    spendingLimit = bnMaxSpendingLimit.toString( 10 );
    sessionKeyExpiryTime = MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME;
  } else {
    spendingLimit = bnDefaultSpendingLimit.toString( 10 );
    sessionKeyExpiryTime = DEFAULT_SESSION_KEY_EXPIRY_TIME;
  }

  let workflowDelegate = _getWorkflowDelegate(callback);
  OstWalletSdkUI.addSession(userId, sessionKeyExpiryTime, spendingLimit, workflowDelegate);
};

const _getWorkflowDelegate = function (callback) {
  let delegate = appProvider.getOstSdkUIDelegate();
  delegate.flowComplete = (ostWorkflowContext, ostContextEntity) => {
    callback(null, true);
  };

  const onSdkError = (ostWorkflowContext, ostError) => {
    // LoadingModal.hide();
    let errorMessage = ostSdkErrors.getErrorMessage(ostWorkflowContext, ostError);
    callback(errorMessage, false);
  };

  delegate.onUnauthorized = onSdkError;
  delegate.deviceTimeOutOfSync = onSdkError;
  delegate.workflowFailed = onSdkError;
  delegate.userCancelled = (ostWorkflowContext, ostError) => {
    //Do nothing.
    // LoadingModal.hide();
    callback(ON_USER_CANCLLED_ERROR_MSG, false);
  };

  delegate.saltFetchFailed = ( response ) => {
    // LoadingModal.hide();
    let errorMessage = "unable to fetch salt.";
    callback(errorMessage, false);
  };

  return delegate;
};

export {ensureDeivceAndSession, ON_USER_CANCLLED_ERROR_MSG, DEVICE_UNAUTHORIZED_ERROR_MSG}
