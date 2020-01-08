import React, {PureComponent} from 'react'
import {View, SafeAreaView, StatusBar, Text, Alert, TouchableOpacity, TouchableHighlight, Modal, PixelRatio} from 'react-native'

import styles from './style'

import {OutlinedTextField} from 'react-native-material-textfield';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {OstTransactionHelper, OstJsonApi, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';

import Colors from "../../theme/styles/Colors";
import BackArrow from '../CommonComponent/BackArrow'
import {appProvider} from "../../helper/AppProvider";
import CurrentUser from '../../models/CurrentUser'

import AppLoader from '../CommonComponent/AppLoader'

import NumberFormatter from '../../helper/NumberFormatter'
import {ensureDeivceAndSession} from "../../helper/TransactionHelper";
import sizeHelper from "../../helper/SizeHelper";
import inlineStyle from "../UsersScreen/styles";
import AppToast from "../CommonComponent/AppToast";
import {ostSdkErrors} from "../../services/OstSdkErrors";
import OstWalletSdkHelper from "../../helper/OstSdkHelpers/OstWalletSdkHelper";

const DEFAULT_FIAT_VALUE = "0";
const DEFAULT_TOKEN_VALUE = "0";

export default class SendTokensScreen extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('navTitle', 'Send Tokens'),
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
    this.userBalance = '1';
    this.tokenFieldRef = React.createRef();
    this.fiatFieldRef = React.createRef();



    this.state = {
      tokenError:null,
      usdError:null,
      balance: {},
      modalVisible: false,
      title: 'fetching price point...'
    };

    this.numberFormatter = new NumberFormatter();
    this.priceOracle = null;
    this.user = props.navigation.getParam('user');

    this._isMounted = false;
    this.isSendTokenTapped = false;
  }

  async setPriceOracle(pricePoint) {
    this.priceOracle = await appProvider.getPriceOracle(pricePoint)
  }

  componentDidMount() {
    this._isMounted = true;
    OstJsonApi.getBalanceWithPricePointForUserId(CurrentUser.getUserId(), (res) => {
      this._isMounted && this.onBalanceResponse(res)
    }, (ostError) => {
      console.log(ostError)
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async onBalanceResponse(res) {
    let pricepoint = res["price_point"];
    let resultType = res.result_type;
    await this.setPriceOracle(pricepoint);
    this.setState({
      balance: res[resultType]
    });
    this.onSendTokenTapped()
  }

  onTokenChange = (...args) => {
    let tokenVal = args[0];
    let value = tokenVal;
    if (!this.numberFormatter.isValidInputProvided(value)) {
      console.log("-- RACHIN || onTokenChange || Invalid input");
      this.setState({
        tokenError:"Only numbers and upto 2 decimal values are allowed",
        usdError: null
      });

      // Set fiat value to empty string.
      this.setFiatDisplayValue( "" );
      // Set token value to empty string.
      this.setTokenDisplayValue( "" );

      return
    }

    if (this.priceOracle) {
      let fiatVal = this.priceOracle.btToFiat(value);
      console.log("-- RACHIN || onTokenChange || fiatVal", fiatVal);

      // Set fiat value to fiatVal.
      this.setFiatDisplayValue(fiatVal);

      this.setState({
        tokenError: null,
        usdError:null
      }, () => {
        console.log("-- RACHIN || onTokenChange || setState done...");
      })
    }
  };

  onUsdChange = (usdVal) => {
    let value = usdVal;
    if (!this.numberFormatter.isValidInputProvided(value)) {
      console.log("-- RACHIN || onUsdChange || Invalid input");
      this.setState({
        tokenError:"",
        usdError:"Only numbers and upto 2 decimal values are allowed"
      });

      // r-todo: set fiat value to empty string.
      this.setFiatDisplayValue( "" );
      // Set token value to empty string.
      this.setTokenDisplayValue( "" );

      return
    }

    if (this.priceOracle) {
      const toBtVal = this.priceOracle.fiatToBt(value);
      console.log("-- RACHIN || onUsdChange || toBtVal", toBtVal);

      // Set token value to toBtVal.
      this.setTokenDisplayValue( toBtVal );

      this.setState({
        tokenError: null,
        usdError: null
      })
    }
  };

  setFiatDisplayValue = (fiatVal) => {
    let { current: fiatField } = this.fiatFieldRef;
    if( fiatField && fiatField.setValue ) {
      fiatField.setValue(fiatVal);
    }
  }

  setTokenDisplayValue = ( tokenVal ) => {
    let { current: tokenField } = this.tokenFieldRef;
    if( tokenField && tokenField.setValue ) {
      tokenField.setValue(tokenVal);
    }
  };

  onSendTokenTapped = () => {

    if (!this.isSendTokenTapped) {
      return;
    }
    if (!this.priceOracle) {
      this.setState({
        modalVisible: true
      });
      return;
    }

    this.setState({
      modalVisible: true,
      title: 'Executing transaction...'
    });

    let executeTxDelegate = appProvider.getRegisgerDeviceHelper();
    executeTxDelegate.requestAcknowledged = (workflowContext, contextEntity) => {
      console.log(contextEntity)
    };

    executeTxDelegate.flowComplete = (workflowContext, contextEntity) => {
      console.log(contextEntity)
    };

    executeTxDelegate.flowInterrupt = (workflowContext, contextEntity) => {
      console.log(contextEntity)
    };

    let { current: tokenField } = this.tokenFieldRef;
    if (!this.numberFormatter.isValidInputProvided(tokenField.value())) {
      return
    }
    let txMeta = {"type": "user_to_user", "name": "Tokens sent from iOS", "details": "Send tokens from iOS"};

    let uuid = OstTransactionHelper.executeDirectTransfer(CurrentUser.getUserId(), [tokenField.value()], [this.user.token_holder_address], txMeta, appProvider.getOstSdkUIDelegate());
    OstWalletSdkUI.subscribe(uuid,  OstWalletSdkUI.EVENTS.flowComplete, (workflowContext, contextEntity) => {
      console.log(contextEntity);
    });
    OstWalletSdkUI.subscribe(uuid,  OstWalletSdkUI.EVENTS.flowInterrupt, (workflowContext, ostError) => {
      console.log(ostError);
			this.onTxnFail(workflowContext, ostError);
    });
    OstWalletSdkUI.subscribe(uuid,  OstWalletSdkUI.EVENTS.requestAcknowledged, (workflowContext, contextEntity) => {
      console.log(contextEntity);
      this.onTxReqestAcknowledged();
    });
  };


  onTxnFail(workflowContext, ostError) {
		this.setState({
			modalVisible: false,
			title: ''
		});

		if (OstWalletSdkHelper.isUserCancelled(ostError)) return;

		AppToast.showFailureToast(ostSdkErrors.getErrorMessage(workflowContext, ostError));
  }

  onTxReqestAcknowledged() {
    this.setState({
      modalVisible: false,
      title: ''
    });

    this.props.navigation.goBack();
    this.props.navigation.navigate('WalletScreen', {fetchTransaction: true});
  }

  getCircularView(centeredText) {
    return (<View style={{
      justifyContent:'center',
      backgroundColor: '#f4f4f4',
      borderColor: '#9b9b9b',
      width: sizeHelper.layoutPtToPx(50),
      height: sizeHelper.layoutPtToPx(50),
      borderRadius: sizeHelper.layoutPtToPx(25),
      borderWidth: sizeHelper.layoutPtToPx(2),
    }}>
      <Text style={{
        color: '#9b9b9b',
        fontWeight : 'bold',
        textAlign: 'center',
        fontSize: sizeHelper.fontPtToPx(20)
      }}>
        {centeredText}
      </Text>
    </View>);
  }

  getUserDetailsView(item) {
    return (
      <View>
        <Text style={inlineStyle.heading}>{item.name}</Text>
      </View>
    );
  }

  render() {
    console.log("-- RACHIN || render || method called");
    let available_balance = this.state.balance.available_balance;
    if (available_balance) {
      available_balance = this.priceOracle.fromDecimal(available_balance)
    }else {
      available_balance = '0'
    }
    return(
      <>
        <AppLoader modalVisible={this.state.modalVisible} title={this.state.title}/>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.balanceView}>
            <Text style={{color: Colors.lighterGrey, fontWeight: '700'}}>Send Tokens To</Text>
            <Text style={{color: Colors.rainySky}}>Balance: {available_balance} {appProvider.getTokenSymbol()}</Text>
          </View>

          <View style={styles.userContainer}>
              {this.getCircularView(this.user.username.charAt(0))}
              <View style={{marginLeft: 10,flex: 1}}>
                <Text style={styles.heading}>{this.user.username}</Text>
                <Text style={styles.subHeading}>{this.user.token_holder_address}</Text>
              </View>
          </View>

          <View style={styles.amountContainer}>
            <View style={{flex:3, marginRight:5}}>
              <OutlinedTextField label='Amount'
                                 tintColor={Colors.lightGrey}
                                 disabledLineWidth={2}
                                 lineWidth={2}
                                 baseColor={Colors.lightGrey}
                                 keyboardType={'decimal-pad'}
                                 ref={this.tokenFieldRef}
                                 defaultValue={DEFAULT_TOKEN_VALUE}
                                 error={this.state.tokenError}
                                 onChangeText={(val) => {
                                   this.onTokenChange(val)
                                 }}
              />
            </View>
            <View style={{flex:1}}>
              <OutlinedTextField label='Unit'
                                 tintColor={Colors.lightGrey}
                                 disabledLineWidth={2}
                                 lineWidth={2}
                                 editable={false}
                                 baseColor={Colors.lightGrey}
                                 value={appProvider.getTokenSymbol()}
              />
            </View>
          </View>

          <View style={styles.amountContainer}>
            <View style={{flex:3, marginRight:5}}>
              <OutlinedTextField label='Amount'
                                 tintColor={Colors.lightGrey}
                                 disabledLineWidth={2}
                                 lineWidth={2}
                                 keyboardType={'decimal-pad'}
                                 baseColor={Colors.lightGrey}
                                 ref={this.fiatFieldRef}
                                 value={DEFAULT_FIAT_VALUE}
                                 error={this.state.usdError}
                                 onChangeText={this.onUsdChange}
              />
            </View>
            <View style={{flex:1}}>
              <OutlinedTextField label='Unit'
                                 tintColor={Colors.lightGrey}
                                 disabledLineWidth={2}
                                 lineWidth={2}
                                 editable={false}
                                 baseColor={Colors.lightGrey}
                                 value='USD'
              />
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton}
                            onPress={() => {
                              this.isSendTokenTapped = true;
                              this.onSendTokenTapped()
                            }}>
            <Text style={{color: Colors.white}}>Send Tokens</Text>
          </TouchableOpacity>

        </KeyboardAwareScrollView>
      </SafeAreaView>
        </>
    );
  }
}

