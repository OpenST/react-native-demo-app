import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';
import { Platform } from 'react-native';

let styles = {
  textInputStyle: {
    borderColor: Colors.seaMist,
    borderWidth: 1.2,
    borderRadius: 3,
    fontSize: 17,
    fontWeight: '300',
    padding: 5,
    paddingLeft: 15,
    marginTop: 5,
    color: Colors.dark,
    height: 46
  },

  labelStyle:{
    color: Colors.valhalla,
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'AvenirNext-Medium'
  }
};

export default TextInput = DefaultStyleGenerator.generate(styles);
