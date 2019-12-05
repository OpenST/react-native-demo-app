import {OstWalletUIWorkflowCallback} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";
import OstWalletSdkHelper from "./OstWalletSdkHelper";
import {appProvider} from "../AppProvider";
import deepGet from 'lodash/get';

class UIWorkflowDelegate extends OstWalletUIWorkflowCallback {
  constructor(userId) {
    super();
    this.userId = userId;
  }

  isUserIdValid() {
    //Todo: Sachin - get user id from Current user model
    return appProvider.userId === this.userId;
  }

  getPassphrase(userId, ostWorkflowContext, passphrasePrefixAccept) {
    let ostUserId = appProvider.userId;

    if (this.isUserIdValid && userId === ostUserId) {
      //Todo: Sachin - get user id from Current user model
      _getPassphrase(ostUserId, this, passphrasePrefixAccept);
    }else {
      passphrasePrefixAccept.cancelFlow()
    }
  }

  flowInterrupt(ostWorkflowContext , ostError)  {
    // Check if device is unauthorized.
    if (OstWalletSdkHelper.isDeviceUnauthorizedError(ostError)) {
      this.onUnauthorized(ostWorkflowContext, ostError );
    }

    //TODO: Check if device's clock is out of sync.
    else if (OstWalletSdkHelper.isDeviceTimeOutOfSync(ostError)) {
      this.deviceTimeOutOfSync(ostWorkflowContext, ostError );
    }

    // Check if workflow has been cancelled by user.
    else if (OstWalletSdkHelper.isUserCancelled(ostError)) {
      this.userCancelled(ostWorkflowContext, ostError );
    }

    // Trigger generic error handler.
    else  {
      this.workflowFailed(ostWorkflowContext, ostError);
    }
  }

  onUnauthorized(ostWorkflowContext, ostError) {
    // Others should override this method and logout the user.
  }

  deviceTimeOutOfSync(ostWorkflowContext, ostError) {
    // Others should override this method and logout the user.
  }

  saltFetchFailed( response ) {
    // Others should override this method and show the error.
  }

  inconsistentUserId(workflowUserId, currentUserId) {
    console.log("WorkflowDelegate :: inconsistentUserId received. workflowUserId:", workflowUserId, "currentUserId:", currentUserId);
  }

  userCancelled(ostWorkflowContext, ostError) {
    // Others should override this method and show the error.
  }

  workflowFailed(ostWorkflowContext , ostError) {
    // Others should override this method and show the error.
  }
};

const _getPassphrase = (currentUserOstId, workflowDelegate, passphrasePrefixAccept) => {
  if (!_ensureValidUserId(currentUserOstId, workflowDelegate, passphrasePrefixAccept)) {
    passphrasePrefixAccept.cancelFlow();
    return Promise.resolve();
  }

  const _canFetchSalt = true;

  const fetchSaltPromise = appProvider.getAppServerClient()
    .getLoggedInUserPinSalt()
    .then ((res) => {
      if (!_ensureValidUserId(currentUserOstId, workflowDelegate, passphrasePrefixAccept)) {
        return;
      }

      const resultType = res.result_type
        , passphrasePrefixString = res[resultType]["recovery_pin_salt"];


      if (!passphrasePrefixString) {
        passphrasePrefixAccept.cancelFlow();
        workflowDelegate.saltFetchFailed(res);
        return;
      }

      passphrasePrefixAccept.setPassphrase(passphrasePrefixString, currentUserOstId, () => {
        passphrasePrefixAccept.cancelFlow();
        workflowDelegate.saltFetchFailed(res);
      });
    })
    .catch((err) => {
      passphrasePrefixAccept.cancelFlow();
      return Promise.reject(err)
    });

  return fetchSaltPromise
};

const _ensureValidUserId = (currentUserOstID, workflowDelegate, passphrasePrefixAccept) => {
  if (currentUserOstID === workflowDelegate.userId) {
    return true;
  }

  // Inconsistent UserId.
  passphrasePrefixAccept.cancelFlow();
  workflowDelegate.inconsistentUserId(workflowDelegate.userId, currentUserOstID);
  return false;
};

export default UIWorkflowDelegate;
