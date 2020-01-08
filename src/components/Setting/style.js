import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../../src/theme/styles/Colors'
import sizeHelper from "../../helper/SizeHelper";

const stylesMap = {
  list: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop:sizeHelper.layoutPtToPx(4)
  },

  listComponent: {
    flex: 1,
    paddingLeft: sizeHelper.layoutPtToPx(20),
    borderBottomWidth: sizeHelper.layoutPtToPx(1),
    borderBottomColor: Colors.whisper,
    paddingVertical: sizeHelper.layoutPtToPx(10)
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


  heading: {
    color: Colors.valhalla,
    fontSize: 16
  },

  userNameHeading: {
    color: '#597a84',
    fontSize: sizeHelper.layoutPtToPx(16),
    fontWeight: "bold"
  },

  userIdsubHeading: {
    color: '#34445b',
    fontSize: sizeHelper.layoutPtToPx(13),
    fontWeight: "normal"
  },

  description: {
    color: Colors.grey,
    fontSize: 13,
    marginTop:  sizeHelper.layoutPtToPx(4),
  },

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
