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
    marginLeft: sizeHelper.layoutPtToPx(20),
    borderBottomWidth: sizeHelper.layoutPtToPx(1),
    borderBottomColor: Colors.whisper,
    paddingVertical: sizeHelper.layoutPtToPx(15)
  },

  heading: {
    color: Colors.valhalla,
    fontSize: 15,
    fontWeight: "700"
  },

  description: {
    color: Colors.grey,
    fontSize: 13,
    marginTop:  sizeHelper.layoutPtToPx(4),
  },

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
