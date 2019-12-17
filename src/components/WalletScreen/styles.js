import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import sizeHelper from "../../helper/SizeHelper";

let stylesMap = {

	walletComponent: {
		marginHorizontal: sizeHelper.layoutPtToPx(10),
	},

	walletWrapStyle: {
		flexDirection: "row",
	},

	walletBalanceStyle: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},

	walletScreenStyle: {
		flex: 1,
		marginTop: sizeHelper.layoutPtToPx(20),
		height: sizeHelper.layoutPtToPx(120),
		borderRadius: sizeHelper.layoutPtToPx(10),
	},

	heading: {
		marginTop: sizeHelper.layoutPtToPx(15),
		color: Colors.black,
		fontSize: sizeHelper.layoutPtToPx(14),
		fontWeight: "bold"
	},
	tokenTextStyle: {
		color: '#34445b',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: sizeHelper.fontPtToPx(28),
	},
	fiatTextStyle: {
		color:'#34445b',
		textAlign:'center',
		fontSize: sizeHelper.fontPtToPx(16),
	},
	flatListStyle: {
		marginTop: sizeHelper.layoutPtToPx(10),
	},

	txnComponent: {
		flex: 9,
		flexDirection: "row",
		justifyContent: 'center',
		borderBottomWidth: sizeHelper.layoutPtToPx(1),
		borderBottomColor: Colors.whisper,
		paddingVertical: sizeHelper.layoutPtToPx(10),
	},

	imageStyle: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f4f4f4',
		borderColor: '#9b9b9b',
		marginRight: sizeHelper.layoutPtToPx(5),
		width: sizeHelper.layoutPtToPx(50),
		height: sizeHelper.layoutPtToPx(50),
		borderRadius: sizeHelper.layoutPtToPx(25),
		borderWidth: sizeHelper.layoutPtToPx(2),
	},

	txnHeading: {
		color: '#597a84',
		fontSize: sizeHelper.layoutPtToPx(16),
		fontWeight: "bold"
	},

	subHeading: {
		color: '#34445b',
		fontSize: sizeHelper.layoutPtToPx(13),
		fontWeight: "normal"
	},

	valueStyle: {
		flex: 2,
		textAlign: 'right',
		fontSize: sizeHelper.layoutPtToPx(15),
		marginTop:sizeHelper.layoutPtToPx(5),
	}
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
