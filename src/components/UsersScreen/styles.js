import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import {Dimensions} from "react-native";
import sizeHelper from "../../helper/SizeHelper";

let stylesMap = {

  descriptionText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

	heading: {
		color: '#597a84',
		fontSize: sizeHelper.layoutPtToPx(16),
		fontWeight: "bold"
	},

  subHeading: {
		color: '#34445b',
		fontSize: sizeHelper.layoutPtToPx(13),
		fontWeight: "normal"
	},

	userComponent: {
		flex: 9,
		flexDirection: "row",
      justifyContent: 'center',
		marginLeft: sizeHelper.layoutPtToPx(5),
		borderBottomWidth: sizeHelper.layoutPtToPx(1),
		borderBottomColor: Colors.whisper,
      paddingVertical: sizeHelper.layoutPtToPx(10),
      paddingLeft: sizeHelper.layoutPtToPx(10)
	},

	textStyle: {
		color:'#168DC1',
        fontWeight : '500',
		textAlign:'center'
  },

	buttonStyle: {
		flex: 1,
		justifyContent: 'center',
		marginTop:sizeHelper.layoutPtToPx(5),
      marginRight:sizeHelper.layoutPtToPx(10),
      height:sizeHelper.layoutPtToPx(40),
		// backgroundColor:'#168DC1',
		borderRadius:sizeHelper.layoutPtToPx(10),
		borderWidth: sizeHelper.layoutPtToPx(1),
		borderColor: '#168DC1'
  },

  txtWrapper: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 0, /* The remaining 10 px is assigned for icon click area. */
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  imageStyleSkipFont: {
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    width: 40
  },

  numericInnerWrapper: {
    marginLeft: 6,
    justifyContent: 'center',
    color: Colors.white,
    flexDirection: 'row'
  },
  numericInfoText: {
    color: Colors.wildWatermelon2,
    fontFamily: 'AvenirNext-DemiBold',
    minWidth: 18,
    paddingLeft: 3
  },
  imageIconSkipFont: {
    width: 12,
    height: 12,
    marginTop: 2
  },
  timeStamp: {
    color: Colors.darkGray2,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    marginLeft: 5
  },

  posterImageSkipFont: {
    aspectRatio: 3 / 4,
    width: 40,
    marginLeft: 'auto',
    justifyContent: 'center',
    backgroundColor: Colors.gainsboro
  },
  playIconSkipFont: {
    height: 14,
    width: 14,
    alignSelf: 'center'
  },
  sayThanksButton: {
    width: 120,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 50,
    marginBottom: 10,
    marginTop: 2,
    borderColor: Colors.rhino,
    justifyContent: 'center'
  },
  sayThanksText: {
    alignSelf: 'center',
    color: Colors.rhino,
    fontFamily: 'AvenirNext-Medium'
  },
  systemNotificationIconSkipFont: {
    height: 30,
    width: 30,
    borderRadius: 15
  },
  sectionHeaderTitle: {
    color: '#34445b',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 18,
    fontWeight: '600'
  },

  sectionHeaderView: {
    // borderTopColor: '#eee',
    // borderTopWidth: 1,
    marginHorizontal: 15,
    paddingTop: 15,
    marginTop: 5
  },


  backgroundStyle: {
    //backgroundColor: 'rgba(0,0,0,0.80)',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: Dimensions.get('screen').height,

  },
  headerText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 24,
    fontFamily: 'AvenirNext-Medium',
    textAlign: 'center'
  },
  smallText: {
    color: 'white',
    fontSize: 18, marginTop: 14,
    fontFamily: 'AvenirNext-Medium',
    textAlign: 'center'
  },

  wrappedView: {
    padding: 40,
    backgroundColor: 'rgba(0,0,0,0.80)',
    height:Dimensions.get('screen').height,
    alignItems: 'center',
    justifyContent: 'center'
  },

  headingText: {
    fontWeight: '600',
    fontFamily: 'AvenirNext-Medium'
  },
  activityIcon :{
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 0,
    width: 46
  }



};

export default styles = DefaultStyleGenerator.generate(stylesMap);
