import {Toast} from "native-base";
import {StyleSheet} from "react-native";
import SizeHelper from "../../helper/SizeHelper";
import Colors from "../../theme/styles/Colors";


class AppToast {

  showSuccessToast(msg) {
    this.showToast(msg, true);
  }

  showFailureToast(msg) {
    this.showToast(msg, false);
  }

  showToast(toastMsg, success) {
    Toast.show({
      text: toastMsg,
      style: success ? toastStyle.toastSuccessStyle : toastStyle.toastFailureStyle,
      textStyle: toastStyle.toastTextStyle,
      position: "top"
    })
  }
}

const toastStyle = StyleSheet.create({
  toastSuccessStyle: {
    backgroundColor: Colors.waterBlue,
    borderRadius: SizeHelper.layoutPtToPx(5),
    justifyContent: 'center',
    padding: SizeHelper.layoutPtToPx(20),
  },
  toastFailureStyle: {
    backgroundColor: Colors.punchPink,
    borderRadius: SizeHelper.layoutPtToPx(5),
    justifyContent: 'center',
    padding: SizeHelper.layoutPtToPx(20)
  },
  toastTextStyle: {color: "#ffffff"}
});

export default new AppToast();