import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../../src/theme/styles/Colors'

const stylesMap = {
  safeAreaView: {
    marginHorizontal: 20
  },
  safeAreaViewContainer: {
    marginTop: 20
  },
  primaryActionButton: {
    marginTop: 40,
    paddingVertical: 10,
    backgroundColor:Colors.waterBlue,
    borderRadius:10,
    borderWidth: 1,
    borderColor: Colors.white
  },
  secondayActionButton: {
    paddingVertical: 10,
    color: Colors.waterBlue,
    fontSize: 17,
    fontWeight: "900"
  },

  bottomContainer: {
    marginTop: 80,
    marginBottom: 20,
  },
  primaryActionText: {
    color:Colors.white,
    textAlign:'center',
    fontWeight: "bold",
    fontSize: 17
  },
  bottomText: {
    textAlign:'center',
    fontSize: 14
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
