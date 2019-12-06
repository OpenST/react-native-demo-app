import {Toast} from "native-base";
import {StyleSheet} from "react-native";
import SizeHelper from "../../helper/SizeHelper";

class AppToast {

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
		marginRight: SizeHelper.layoutPtToPx(30),
		marginLeft: SizeHelper.layoutPtToPx(30),
		backgroundColor: "#168DC1",
		width: "85%",
		borderRadius: SizeHelper.layoutPtToPx(5),
		justifyContent: 'center',
		alignItems: 'center',
		padding: SizeHelper.layoutPtToPx(10),
	},
	toastFailureStyle: {
		marginRight: SizeHelper.layoutPtToPx(30),
		marginLeft: SizeHelper.layoutPtToPx(30),
		backgroundColor: "#ff8485",
		width: "85%",
		borderRadius: SizeHelper.layoutPtToPx(5),
		justifyContent: 'center',
		alignItems: 'center',
		padding: SizeHelper.layoutPtToPx(10),
	},
	toastTextStyle: {color: "#ffffff"}
});
