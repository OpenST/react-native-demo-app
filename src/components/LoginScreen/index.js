import React, {PureComponent} from 'react'
import {Image, SafeAreaView, StatusBar, Text} from 'react-native'
import Colors from '../../../src/theme/styles/Colors'
import ostLog from '../../assets/ostLogoBlue.png'
import {OutlinedTextField} from 'react-native-material-textfield';

import { SwitchActions } from 'react-navigation';

class LoginScreen extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('navTitle', 'Aniket'),
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
    };
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    // setTimeout(() => {
    //   this.props.navigation.setParams({title: "ANiket1"});
    //   this.props.navigation.dispatch(SwitchActions.jumpTo({routeName:'Wallet'}));
    // }, 1000)
  }

  render() {
    return(
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Image source={ostLog}/>
          <Text>Version 1.0.0</Text>
          <OutlinedTextField label='Phone number'/>
        </SafeAreaView>

      </>
    )
  }
}

export default LoginScreen;
  