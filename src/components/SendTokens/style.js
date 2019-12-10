import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../../src/theme/styles/Colors'
import sizeHelper from "../../helper/SizeHelper";

const styleMap = {
  container: {
    marginTop: sizeHelper.layoutPtToPx(20),
    marginHorizontal: sizeHelper.layoutPtToPx(20),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  balanceView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  userContainer: {
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: Colors.iceBlue
  },
  amountContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginTop: 15
  },
  actionButton:{
    alignItems:'center',
    backgroundColor: Colors.waterBlue,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 15
  }
};

export default styles = DefaultStyleGenerator.generate(styleMap);
