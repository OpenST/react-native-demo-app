import { ifIphoneX  , getBottomSpace} from 'react-native-iphone-x-helper';
import { Dimensions, StatusBar , NativeModules } from 'react-native';
import  NotchHelper from "../../helpers/NotchHelper";
import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';


let RNDeviceInfo = NativeModules.RNDeviceInfo;
let modalDeviceName = RNDeviceInfo.model === "Redmi Note 7 Pro" && RNDeviceInfo.brand === "xiaomi";
let btmSpace = modalDeviceName ? 5 : 0;
import { CUSTOM_TAB_Height } from '../../theme/constants';
const statusBarHeight = StatusBar.currentHeight;
const {width, height} = Dimensions.get('window');

const styles = {
    viewContainer: {
        flex:1, backgroundColor: Colors.white
    },
    modalViewContainer: {
      flex:1,
      backgroundColor:  'rgba(0,0,0,0.5)'
    },
    fullScreenVideoSafeAreaContainer: {
      flex:1,  backgroundColor: Colors.darkShadeOfGray,
    },
    fullScreen: {
      width: width,
      ...ifIphoneX(
        {
          height: height - getBottomSpace([true])
        },
        {
          height:
            NotchHelper.hasNotch()
              ? height + statusBarHeight - btmSpace
              : height 
        }
      )
    },

    videoWrapperfullScreen: {
      width: width,
      ...ifIphoneX(
        {
          height: height - CUSTOM_TAB_Height - getBottomSpace([true])
        },
        {
          height:
            NotchHelper.hasNotch()
              ? height + statusBarHeight - CUSTOM_TAB_Height - btmSpace
              : height - CUSTOM_TAB_Height
        }
      )
    },

    fullHeightWidth: {
      width: "100%",
      height: "100%"
    },
};

export default CommonStyle = DefaultStyleGenerator.generate(styles);
