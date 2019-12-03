import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import styles from './style'
import ostLog from '../../assets/ostLogoBlue.png'

class IntroScreen extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

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
