import OstWalletSdkHelper from "../helper/OstWalletSdkHelper"

//NEVER COMMIT WITH developerMode true.
const developerMode = false;
const logErrorMessage = false;
const DEFAULT_ERROR_MSG = "Something went wrong";
const WORKFLOW_CANCELLED_MSG = "WORKFLOW_CANCELLED";
const DEFAULT_CONTEXT = "__DEFAULT_CONTEXT";
const DEVICE_OUT_OF_SYNC = "DEVICE_OUT_OF_SYNC";
const API_RESPONSE_ERROR = "API_RESPONSE_ERROR";
const USER_UNAUTHORIZED = "USER_UNAUTHORIZED";

let sdkErrorMessages = require('../SdkErrors.json');
/**
 * OstSdkErrors
 * To get Message of OstError based on workflow type.
 */
class OstSdkErrors {
    constructor() {

    }

    getErrorMessage(ostWorkflowContext, ostError) {
      let errMsg = this._getErrorMessage(ostWorkflowContext, ostError);
      if ( logErrorMessage ) {
        if ( WORKFLOW_CANCELLED_MSG !== errMsg ) {
          try {
           // this._postErrorDetails(ostWorkflowContext, ostError, errMsg);
          } catch(e) {
            //ignore.
          }
        }
      }
      return errMsg;
    }

    _getErrorMessage(ostWorkflowContext, ostError) {
      let errMsg;
      // Parameter validation
      if (!ostError) {
        return DEFAULT_ERROR_MSG;
      }

      let errorCode = ostError.getErrorCode();

      let workflowType = ostWorkflowContext ? ostWorkflowContext.WORKFLOW_TYPE : null;
      workflowType = workflowType || DEFAULT_CONTEXT;

      if (OstWalletSdkHelper.isDeviceTimeOutOfSync(ostError)) {
        errorCode = DEVICE_OUT_OF_SYNC;

        if ( sdkErrorMessages[workflowType] ) {
          errMsg = sdkErrorMessages[workflowType][ errorCode ];
        }

        if ( !errMsg ) {
          errMsg = sdkErrorMessages[DEFAULT_CONTEXT][ errorCode ];
        }

        if ( developerMode ) {
          errMsg = errMsg + "\n\n(" + ostError.getApiInternalId() + ")"
        }

        return errMsg || DEFAULT_ERROR_MSG;
      }

      if ( OstWalletSdkHelper.isDeviceUnauthorizedError(ostError)) {
        errorCode = USER_UNAUTHORIZED;

        if ( sdkErrorMessages[workflowType] ) {
          errMsg = sdkErrorMessages[workflowType][ errorCode ];
        }

        if ( !errMsg ) {
          errMsg = sdkErrorMessages[DEFAULT_CONTEXT][ errorCode ];
        }

        if ( developerMode ) {
          errMsg = errMsg + "\n\n(" + ostError.getApiInternalId() + ")"
        }

        return errMsg || DEFAULT_ERROR_MSG;
      }

      if ( ostError.isApiError() ) {
        if ( !errMsg ) {
          let errData = ostError.getApiErrorData();
          if (errData && errData.length > 0) {
            let firstErrMsg = errData[0];
            errMsg = firstErrMsg.msg || DEFAULT_ERROR_MSG;
          }else {
            errMsg = ostError.getApiErrorMessage();
          }
        }

        if ( developerMode ) {
          errMsg = errMsg + "\n\n(" + ostError.getApiInternalId() + ")"
        }

        return errMsg || DEFAULT_ERROR_MSG;
      }

      if ( !errorCode ) {
        return DEFAULT_ERROR_MSG;
      }

      if ( sdkErrorMessages[workflowType] ) {
        errMsg = sdkErrorMessages[workflowType][ errorCode ];
      }

      if ( !errMsg ) {
        errMsg = sdkErrorMessages[DEFAULT_CONTEXT][ errorCode ];
      }

      if ( developerMode && errorCode) {
        if ( !errMsg ) {
          errMsg = errMsg || DEFAULT_ERROR_MSG;
        }

        errMsg = errMsg + "\n\n (" + errorCode + "," + ostError.getInternalErrorCode() + ")";
      }

      return errMsg || DEFAULT_ERROR_MSG;
    }
}

const ostSdkErrors = new OstSdkErrors();

export {ostSdkErrors};
