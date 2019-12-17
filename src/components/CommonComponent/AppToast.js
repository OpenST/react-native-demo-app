import {Toast} from "native-base";
import {StyleSheet} from "react-native";
import SizeHelper from "../../helper/SizeHelper";

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

export default new AppToast();

const toastStyle = StyleSheet.create({
	toastSuccessStyle: {
		backgroundColor: "#168DC1",
		borderRadius: SizeHelper.layoutPtToPx(5),
		justifyContent: 'center',
		alignItems: 'center',
		padding: SizeHelper.layoutPtToPx(20),
	},
	toastFailureStyle: {
      backgroundColor: "#168DC1",
      borderRadius: SizeHelper.layoutPtToPx(5),
      justifyContent: 'center',
      alignItems: 'center',
      padding: SizeHelper.layoutPtToPx(20)
	},
	toastTextStyle: {color: "#ffffff"}
});
