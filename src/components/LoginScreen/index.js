import React, {PureComponent} from 'react'
import {Button, View, Image, SafeAreaView, StatusBar, Text, Alert, TouchableOpacity} from 'react-native'

import styles from './style'
import Colors from '../../../src/theme/styles/Colors'

import {OutlinedTextField} from 'react-native-material-textfield';
import BackArrow from '../CommonComponent/BackArrow'
import {LoginScreenViewModel} from './LoginScreenViewModel'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { SwitchActions } from 'react-navigation';

class LoginScreen extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('navTitle', 'Login'),
      headerStyle:  {
        backgroundColor: Colors.brightSky,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        titleColor: Colors.white
      },
      headerTintColor: '#fff',
      headerBackImage: <BackArrow />
    };
  };
  constructor(props) {
    super(props);

    this.viewModel = new LoginScreenViewModel();

    this.viewModel.isSignupView = this.props.navigation.getParam("isSignupView") || false;
    this.username=null;
    this.password=null;
    this.userNamefieldRef = React.createRef();
    this.passwordfieldRef = React.createRef();
    this.economyfieldRef = React.createRef();
    this.state = {
      reRender: false
    }
  }

  componentDidMount() {

  }

  reRenderView() {
    this.setState({
      reRender: !this.state.reRender
    })
  }

  isSignupViewType() {
    return this.viewModel.isSignupView
  }

  getPrimaryActionButtonText = () => {
    if (this.isSignupViewType()) {
      return "Create Account";
    }
    return "Log In";
  };

  getBottomText = () => {
    if (this.isSignupViewType()) {
      return "Already have an account?";
    }
    return "Don’t have an account?";
  };

  getSecondayActionButtonText = () => {
    if (this.isSignupViewType()) {
      return "Log In";
    }
    return "Create Account";
  };

  onSecondayActionButtonTapped = () => {
    this.viewModel.isSignupView = !this.isSignupViewType();
    this.reRenderView()
  };

  onPrimaryActionButtonTapped = () => {
    let oThis = this;
    let { current: userNameField } = this.userNamefieldRef;
    let { current: passwordField } = this.passwordfieldRef;
    this.viewModel.setupUser(userNameField.value(), passwordField.value())
      .then( (res) => {
        console.log("")
      })
      .catch((err) => {
        console.log("")
      })
  };

  onSubmit = (textFiled) => {
    let { current: field } = textFiled;

    if (field === this.userNamefieldRef) {
      this.passwordfieldRef.focus();
    }
  };

  render() {
    return(
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}>
          <View style={styles.safeAreaViewContainer}>
            <View style={{marginTop: 15}}>
              <OutlinedTextField label='Test Economy'
                                 tintColor={Colors.lightGrey}
                                 disabledLineWidth={2}
                                 lineWidth={2}
                                 baseColor={Colors.lightGrey}
                                 editable={false}
                                 ref={this.economyfieldRef}
              />
            </View>

            <View style={{marginTop: 15}}>
              <OutlinedTextField label='Username'
                                 tintColor={Colors.lightGrey}
                                 disabledLineWidth={2}
                                 lineWidth={2}
                                 baseColor={Colors.lightGrey}
                                 ref={this.userNamefieldRef}
                                 onSubmitEditing={() => {
                                   this.onSubmit(this.userNamefieldRef)
                                 }}/>
            </View>

            <View style={{marginTop: 15}}>
              <OutlinedTextField label='Password'
                                 tintColor={Colors.lightGrey}
                                 disabledLineWidth={2}
                                 lineWidth={2}
                                 baseColor={Colors.lightGrey}
                                 ref={this.passwordfieldRef}
                                 onSubmitEditing={() => {
                                   this.onSubmit(this.passwordfieldRef)
                                 }} />
            </View>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={this.onPrimaryActionButtonTapped}
              underlayColor='#fff'>
              <Text style={styles.primaryActionText}>{this.getPrimaryActionButtonText()}</Text>
            </TouchableOpacity>

            <View style={styles.bottomContainer}>
              <Text style={styles.bottomText}>{this.getBottomText()}</Text>
              <Button
                color={Colors.waterBlue}

                title={this.getSecondayActionButtonText()}
                onPress={this.onSecondayActionButtonTapped}
              />
            </View>
          </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>

      </>
    )
  }
}

export default LoginScreen;
