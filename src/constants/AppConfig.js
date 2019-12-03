import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';


export default {
  api_constants : {
		USER_AGENT : `ost-sdk-android-${Platform.OS}-${DeviceInfo.getVersion()}`,
    CONTENT_TYPE : "application/x-www-form-urlencoded"
  }
};
