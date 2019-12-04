import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  Image
} from 'react-native';

import styles from './style'
import ostLog from '../../assets/ostLogoBlue.png'

class IntroScreen extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.push('LoginScreen', {"navTitle": "Login to your Account", "isSingupView": true})
    }, 1000)
  }

  render() {
    return(
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Image style={styles.ostLogo} source={ostLog}/>
          <Text>Version 1.0.0</Text>
        </SafeAreaView>
      </>
    )
  }
}

export default IntroScreen;
