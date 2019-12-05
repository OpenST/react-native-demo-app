import {OstWalletUIWorkflowCallback} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";
import OstWalletSdkHelper from "./OstWalletSdkHelper";

class WorkflowDelegate extends OstWalletUIWorkflowCallback {
  constructor(userId, currentUserModel) {
    super();
    this.userId = userId;
    this.currentUserModel = currentUserModel;
  }

  isUserIdValid() {
    return this.currentUserModel.getOstUserId() === this.userId;
  }

  getPassphrase(userId, ostWorkflowContext, passphrasePrefixAccept) {
    _getPassphrase(this.currentUserModel, this, passphrasePrefixAccept);
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

export default WorkflowDelegate;
