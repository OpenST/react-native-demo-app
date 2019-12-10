import React, {PureComponent} from 'react'
import {View, SafeAreaView, StatusBar, Text, Alert, TouchableOpacity, TouchableHighlight, Modal, PixelRatio} from 'react-native'

import styles from './style'

import {OutlinedTextField} from 'react-native-material-textfield';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {OstWalletSdk, OstWalletSdkUI, OstJsonApi} from '@ostdotcom/ost-wallet-sdk-react-native';

import Colors from "../../theme/styles/Colors";
import BackArrow from '../CommonComponent/BackArrow'
import {appProvider} from "../../helper/AppProvider";
import CurrentUser from '../../models/CurrentUser'

import NumberFormatter from '../../helper/NumberFormatter'
import {ensureDeivceAndSession} from "../../helper/TransactionHelper";


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
      tokenValue:'0',
      tokenError:null,
      usdValue: '0',
      usdError:null,
      balance: {}
    };

    this.numberFormatter = new NumberFormatter();
    this.priceOracle = null;
    this.user = props.navigation.getParam('user');
  }

  async setPriceOracle(pricePoint) {
    this.priceOracle = await appProvider.getPriceOracle(pricePoint)
  }

  componentDidMount() {

    OstJsonApi.getBalanceWithPricePointForUserId(CurrentUser.getUserId(), (res) => {
      this.onBalanceResponse(res)
    }, (ostError) => {
      console.log(ostError)
    });
  }

  async onBalanceResponse(res) {
    let pricepoint = res["price_point"];
    let resultType = res.result_type;
    await this.setPriceOracle(pricepoint);
    this.setState({
      balance: res[resultType]
    });
  }

  onTokenChange = (tokenVal) => {
    let value = tokenVal;
    if (!this.numberFormatter.isValidInputProvided(value)) {
      this.setState({
        tokenValue:value,
        tokenError:"Only numbers and upto 2 decimal values are allowed",
        usdValue: '',
        usdError:null
      });
      return
    }

    if (this.priceOracle) {
      let fiatVal = this.priceOracle.btToFiat(value);

      this.setState({
        tokenValue:value,
        tokenError: null,
        usdValue: fiatVal,
        usdError:null
      })
    }
  };

  onUsdChange = (usdVal) => {
    let value = usdVal;
    if (!this.numberFormatter.isValidInputProvided(value)) {
      this.setState({
        tokenValue:"",
        tokenError:"",
        usdValue: value,
        usdError:"Only numbers and upto 2 decimal values are allowed"
      });
      return
    }

    if (this.priceOracle) {
      const toBtVal = this.priceOracle.fiatToBt(value);

      this.setState({
        tokenValue: toBtVal,
        tokenError: null,
        usdValue: value,
        usdError: null
      })
    }
  };

  onSendTokenTapped = () => {

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

    const tokenValue = this.state.tokenValue;
    if (!this.numberFormatter.isValidInputProvided(tokenValue)) {
      return
    }
    const toWeiValue = this.priceOracle.toDecimal(tokenValue);
    let txMeta = {"type": "user_to_user", "name": "Tokens sent from iOS", "details": "Send tokens from iOS"};

    ensureDeivceAndSession(CurrentUser.getUserId(),toWeiValue,(res) => {
      //device is unauthorized.
    },(error, isSuccess) => {
      if (error) {

        return;
      }

      OstWalletSdk.executeTransaction(CurrentUser.getUserId(), [this.user.token_holder_address], [toWeiValue], "direct transfer", txMeta, executeTxDelegate)
    });
  };

  render() {
    let available_balance = this.state.balance.available_balance;
    if (available_balance) {
      available_balance = this.priceOracle.fromDecimal(available_balance)
    }else {
      available_balance = '0'
    }
    return(
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.balanceView}>
            <Text>Send Tokens To</Text>
            <Text>Balance: {available_balance} {appProvider.getTokenSymbol()}</Text>
          </View>

          <View style={styles.userContainer}>
            <View>
              <View style={{backgroundColor: Colors.lightGrey, borderRadius: 15, height: 30, width: 30}}>
                <Text>A</Text>
              </View>
              <View >
                <Text>A25</Text>
								<Text>0xawe1231231241234dfdfqwa</Text>
              </View>
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
                                 value={this.state.tokenValue}
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
              <Text> {`${this.state.usdValue}---------------`} </Text>
              <OutlinedTextField label='Amount'
                                 tintColor={Colors.lightGrey}
                                 disabledLineWidth={2}
                                 lineWidth={2}
                                 keyboardType={'decimal-pad'}
                                 baseColor={Colors.lightGrey}
                                 ref={this.fiatFieldRef}
                                 value={String(this.state.usdValue)}
                                 error={this.state.usdError}
                                 onChangeText={(val) => { this.onUsdChange(val)}}
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
                            onPress={this.onSendTokenTapped}>
            <Text style={{color: Colors.white}}>Send Tokens</Text>
          </TouchableOpacity>

        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

