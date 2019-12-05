import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';


export const API_CONSTANT = {
  USER_AGENT : `ost-sdk-${Platform.OS}-${DeviceInfo.getVersion()}`,
  CONTENT_TYPE : "application/x-www-form-urlencoded"
};

export const DEFAULT_SESSION_KEY_EXPIRY_TIME =  60 * 60 * 24 * 365;
export const HIGH_SPEND_SESSION_KEY_EXPIRY_TIME =  60 * 60;
export const MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME =  60 * 60;
export const DEFAULT_SPENDING_LIMIT = '1000000000000000000000';
export const MAX_SPENDING_LIMIT = '1000000000000000000000';
