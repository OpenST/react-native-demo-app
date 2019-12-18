import React, {PureComponent} from 'react'
import {Button, View, Image, SafeAreaView, StatusBar, Text, Alert, TouchableOpacity, TouchableHighlight, Modal, PixelRatio} from 'react-native'

import styles from './style'
import Colors from '../../../src/theme/styles/Colors'

import {OutlinedTextField} from 'react-native-material-textfield';
import BackArrow from '../CommonComponent/BackArrow'
import {LoginScreenViewModel} from './LoginScreenViewModel'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { SwitchActions } from 'react-navigation';
import AppLoader from '../CommonComponent/AppLoader'
import {appProvider} from "../../helper/AppProvider";
import sizeHelper from "../../helper/SizeHelper";
import AppToast from "../CommonComponent/AppToast";
import CurrentUser from "../../models/CurrentUser";

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
      reRender: false,
      modalVisible: false,
      isKeyboardShown: false
    }


    this.containerFlex = {
      flex: 1
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
    this.props.navigation.setParams({'navTitle': this.viewModel.isSignupView ? "Create Account" : "Login to your Account"});
    this.reRenderView()
  };

  onPrimaryActionButtonTapped = () => {
    let oThis = this;

    this.setModalVisible(true, this.getLoaderLanguage());

    let { current: userNameField } = this.userNamefieldRef;
    let { current: passwordField } = this.passwordfieldRef;
    this.viewModel.setupUser(userNameField.value(), passwordField.value())
      .then( (res) => {
        this.onSetupDeviceSuccess(res)
      })
      .catch((err) => {
        this.onFailure(err);
      })
  };

  async onSetupDeviceSuccess(res) {

    const isDeviceRegistered = await CurrentUser.isDeviceStatusRegistered();
    const isUserActivated = await CurrentUser.isUserStatusActivated();

    let navigationScreen = 'WalletScreen';
    let navigationParams = {'activateUserWorkflowId': this.viewModel.activateUserWorkflowId};

    if (isDeviceRegistered && isUserActivated) {
      navigationScreen =  'WalletSettingScreen';
      navigationParams = {'ostUserId': CurrentUser.getUserId(), 'ostWalletUIWorkflowCallback': appProvider.getOstSdkUIDelegate()};
    }

    setTimeout(() => {
      this.setModalVisible(false);
      this.props.navigation.navigate(navigationScreen, navigationParams);
    }, 500);
  }

  onFailure(err) {
    this.setModalVisible(false);
    setTimeout(() => {
      let msg = err.msg || 'Something went wrong';
      AppToast.showFailureToast(msg);
    }, 100);
  }

  getLoaderLanguage() {
    return this.viewModel.isSignupView ? "Signing Up" : "Logging In"
  }

  onSubmit = (textField) => {
    let { current: field } = textField;

    if (field === this.userNamefieldRef) {
      this.passwordfieldRef.focus();
    }
  };

  setModalVisible = (val, title) => {
    this.setState({
      title: title,
      modalVisible: val
    })
  };

  onKeyboardWillShow = () => {
    this.setState({
      isKeyboardShown: true
    })
  };

  onKeyboardWillHide = () => {
    this.setState({
      isKeyboardShown: false
    })
  };

  render() {
    return(
      <>
        <StatusBar barStyle="dark-content" />

        <AppLoader modalVisible={this.state.modalVisible} title={this.state.title}/>

        <KeyboardAwareScrollView
          contentContainerStyle={[styles.safeAreaViewContainer, {justifyContent: 'space-between'}, this.state.isKeyboardShown ? {} : this.containerFlex]}
          showsVerticalScrollIndicator={false}
          onKeyboardWillShow={this.onKeyboardWillShow}
          onKeyboardWillHide={this.onKeyboardWillHide}
        >
          <React.Fragment>
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
                                 secureTextEntry={true}
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
          </React.Fragment>

          <View style={[styles.bottomContainer,{flex: 1, justifyContent: "flex-end", alignItems: "center"}, this.state.isKeyboardShown ? {marginTop: sizeHelper.layoutPtToPx(20)} : {}]}>
            <Text style={styles.bottomText}>{this.getBottomText()}</Text>

            <Text style={{color:Colors.waterBlue, textAlign:'center', padding: 5}}
                  onPress={this.onSecondayActionButtonTapped}>{this.getSecondayActionButtonText()}
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </>
    )
  }
}

export default LoginScreen;
