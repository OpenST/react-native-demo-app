import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../../src/theme/styles/Colors'
import sizeHelper from "../../helper/SizeHelper";

const stylesMap = {
  safeAreaViewContainer: {
    marginHorizontal: sizeHelper.layoutPtToPx(20),
    marginTop: sizeHelper.layoutPtToPx(10)
  },

  primaryActionButton: {
    marginTop: sizeHelper.layoutPtToPx(10),
    paddingVertical: sizeHelper.layoutPtToPx(10),
    backgroundColor:Colors.waterBlue,
    borderRadius:sizeHelper.layoutPtToPx(10),
    borderWidth: sizeHelper.layoutPtToPx(1),
    borderColor: Colors.white
  },
  primaryActionText: {
    color:Colors.white,
    textAlign:'center',
    fontWeight: "bold",
    fontSize: sizeHelper.fontPtToPx(16),
  },

  secondaryActionButton: {
    paddingVertical: sizeHelper.layoutPtToPx(10),
    color: Colors.waterBlue,
    fontSize: sizeHelper.fontPtToPx(17),
    fontWeight: "900"
  },

  bottomContainer: {
    marginTop: sizeHelper.layoutPtToPx(10),
    marginBottom: sizeHelper.layoutPtToPx(10),
    justifyContent: "flex-end", 
    alignItems: "center"
  },

  bottomText: {
    textAlign:'center',
    fontSize: sizeHelper.fontPtToPx(14),
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
