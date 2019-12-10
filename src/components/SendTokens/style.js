import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../../src/theme/styles/Colors'
import sizeHelper from "../../helper/SizeHelper";

const styleMap = {
  container: {
    marginTop: sizeHelper.layoutPtToPx(20),
    marginHorizontal: sizeHelper.layoutPtToPx(20),
    flex: 1,
  },
  balanceView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  userContainer: {
    borderRadius: 5,
    backgroundColor: Colors.iceBlue,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 15
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
  },
  subHeading: {
    color: '#34445b',
    fontSize: sizeHelper.layoutPtToPx(13),
    fontWeight: "normal"
  },
  heading: {
    color: '#597a84',
    fontSize: sizeHelper.layoutPtToPx(16),
    fontWeight: "bold",
    alignItems: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(styleMap);
