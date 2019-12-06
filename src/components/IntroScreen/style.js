import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../../src/theme/styles/Colors'
import {sizeHelper} from "../../helper/SizeHelper";

const stylesMap = {
  scrollView: {
    backgroundColor: Colors.primary,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: sizeHelper.layoutPtToPx(32),
    paddingHorizontal: sizeHelper.layoutPtToPx(24),
  },
  sectionTitle: {
    fontSize: sizeHelper.fontPtToPx(24),
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: sizeHelper.layoutPtToPx(8),
    fontSize: sizeHelper.fontPtToPx(18),
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: sizeHelper.fontPtToPx(12),
    fontWeight: '600',
    padding: sizeHelper.layoutPtToPx(4),
    paddingRight: sizeHelper.layoutPtToPx(12),
    textAlign: 'right',
  },

  ostLogo: {
    width: sizeHelper.layoutPtToPx(100),
    height: sizeHelper.layoutPtToPx(55),
    alignSelf: 'center'
  },
  versionText: {
    width: '100%',
    marginTop: sizeHelper.layoutPtToPx(20),
    textAlign: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
