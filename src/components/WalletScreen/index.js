import React, {PureComponent} from 'react';
import Colors from "../../theme/styles/Colors";
import inlineStyle from "../WalletScreen/styles";
import {FlatList, Image, Text, View, Linking, TouchableOpacity} from "react-native";
import walletBgCurve from '../../assets/wallet_bg_curve.png'
import {appProvider} from "../../helper/AppProvider";
import CurrentUser from "../../models/CurrentUser";
import {OstJsonApi} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";
import airDropLogo from '../../assets/ost_logo_small.png'
import tokenReceiveIcon from '../../assets/token_receive_icon.png'
import tokenSentIcon from '../../assets/token_sent_icon.png'
import PriceOracle from "../../services/PriceOracle";
import {OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
import AppToast from "../CommonComponent/AppToast";

class WalletScreen extends PureComponent {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('navTitle', 'Wallet'),
      headerStyle: {
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
      headerBackTitle: null

    };
  };

  constructor(props) {
    super(props);
    this.state = {list:[], refreshing: false, balance: {available_balance:"0"}};
    this.transactionUsers = {};
    this.priceOracle = new PriceOracle();
    this.activateUserWorkflowId = this.props.navigation.getParam('activateUserWorkflowId');
  }

  componentDidMount() {
    this.subscribeToEvents();
    this.onComponentDidMount()
  }

  subscribeToEvents() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.onfocus();
    });
  }

  onfocus() {
    let shouldFetchTx = this.props.navigation.getParam('fetchTransaction');
    if (shouldFetchTx) {
      this.props.navigation.setParams({fetchTransaction: false});
      this.fetchData();
	}
  }

  async onComponentDidMount() {
    let status = await CurrentUser.getOstUserStatus();
    if (status === 'ACTIVATED') {
      this.fetchData()
    }else if (this.activateUserWorkflowId){
      OstWalletSdkUI.subscribe(this.activateUserWorkflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext, contextEntity) => {
        setTimeout(() => {
          AppToast.showSuccessToast("Congratulations! Your wallet is now ready.");
          this.fetchData();
        }, 1000*24)
      })
    }

		await this.preFetchChainId();
  }

  async preFetchChainId() {
		this.chainId = 0;
		const token = await CurrentUser.getOstToken();
		if (token && token.auxiliary_chains && token.auxiliary_chains[0] && token.auxiliary_chains[0].chain_id) {
			this.chainId = token.auxiliary_chains[0].chain_id;
		}
  }

  fetchData() {
    this.fetchBalance().then(()=>{
      this.onRefresh();
    }).catch(()=>{
      console.log("Error while fetching balance");
    });
  }

  onRefresh = () => {
    this.fetchTransactions();
  };

  async fetchBalance() {
    const oThis = this;
    return new Promise(function(resolve, reject){
      OstJsonApi.getBalanceWithPricePointForUserId(CurrentUser.getUserId(), (res) => {
        oThis.onBalanceResponse(res)
          .then(()=>{
            return resolve();
          }).catch(()=>{
          return reject();
        })
      }, (ostError) => {
        console.log(ostError);
        return reject();
      });
    });
  }

  async onBalanceResponse(res) {
    let pricepoint = res["price_point"];
    let resultType = res.result_type;
    console.log(res[resultType]);
    await this.setPriceOracle(pricepoint);
    this.setState({
      balance: res[resultType]
    });
  }

  async setPriceOracle(pricePoint) {
    this.priceOracle = await appProvider.getPriceOracle(pricePoint)
  }

  fetchTransactions() {
    if (this.state.refreshing) {
      return
    }
    this.setState({
      refreshing: true,
      list:[]
    });
    appProvider.getAppServerClient().getCurrentUserTransactions()
      .then((res) => {
        console.log(res);
        if (res.result_type) {
          this.transactionUsers = res["transaction_users"];
          let cleanList = this.cleanList(res[res.result_type]);
          this.setState({
            list: cleanList,
            refreshing: false
          });
          this.next_page_payload = res.meta.next_page_payload
        }else {
          this.setState({
            refreshing: false
          })
        }
      }).catch((err) => {
      this.setState({
        refreshing: false
      });
      console.log(err);
    });
  }

  cleanList(list) {
    let preList = this.state.list ? this.state.list.slice(0) : [];
    for (let ind=0; ind<list.length; ind++) {
      let txn = list[ind];
      preList = preList.concat(this.getTransactionTransferList(txn, this.transactionUsers));
    }
    return preList;
  }

  getNext = () => {
    if (
      this.state.refreshing ||
      !this.next_page_payload.page
    )
      return;
    appProvider.getAppServerClient().getCurrentUserTransactions(this.next_page_payload.page)
      .then((res) => {
        if (res.result_type) {
          let cleanList = this.cleanList(res[res.result_type]);
          this.setState({
            list: cleanList,
            refreshing: false
          });
          this.next_page_payload = res.meta.next_page_payload
        } else {
          this.setState({
            refreshing: false
          })
        }
      }).catch((err) => {
      this.setState({
        refreshing: false
      });
      console.log(err);
    });
  };

  render() {
    return (
      <React.Fragment>
      <View style={inlineStyle.walletComponent}>
        <View style={inlineStyle.walletWrapStyle}>
          <Image style={inlineStyle.walletScreenStyle} source={walletBgCurve}/>
          <View style={inlineStyle.walletBalanceStyle}>
            <Text style={inlineStyle.tokenTextStyle}>{this.getTokenBalance()}</Text>
            <Text style={inlineStyle.fiatTextStyle}>{this.getTokenFiatBalance()}</Text>
          </View>
        </View>
        <Text style={inlineStyle.heading}>TRANSACTION HISTORY</Text>
      </View>
        <FlatList
          style={inlineStyle.flatListStyle}
          onRefresh={this.onRefresh}
          data={this.state.list}
          onEndReached={this.getNext}
          onEndReachedThreshold={0.5}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          visible={false}
          scrollEnabled={true}
        />
      </React.Fragment>
    );
  }

  getTokenBalance() {
    let balanceInDecimal = "0";
    if (this.priceOracle) balanceInDecimal = this.priceOracle.fromDecimal(this.state.balance.available_balance);
    return `${balanceInDecimal} ${appProvider.getTokenSymbol()}`;
  }

  getTokenFiatBalance() {
    let balanceInFiat = "0";
    if (this.priceOracle) {
      let btValue = this.priceOracle.fromDecimal(this.state.balance.available_balance);
      balanceInFiat = this.priceOracle.btToFiat(btValue) || '0';
    }
    return `$ ${balanceInFiat}`;
  }

  _renderItem = ({item, index}) => {
    let image = airDropLogo;
    if (item.in) {
      image = airDropLogo;
      if ('company_to_user' != item.metaType) {
        image = tokenReceiveIcon;
      }
    } else {
      image = tokenSentIcon;
    }
    return (
      <View style={inlineStyle.txnComponent}>
        <Image source={image} style={inlineStyle.imageStyle} />
        {
          this.getTxnDetailsView(item)
        }
        {
          this.getValueTransferView(item)
        }
      </View>
    );
  };

  _keyExtractor = (item, index) => `id_${index}_${item.cellType}`;

  getTxnText(item) {
    let txnType = null;
    if (item.in){
      if ('company_to_user' == item.metaType) {
        txnType = item.metaName;
      } else if (!item.fromUserName || item.fromUserName == ""){
        txnType = "Received Tokens";
      } else {
        txnType = `Received from ${item.fromUserName}`;
      }
    } else {
      if (!item.toUserName || item.toUserName == ""){
        txnType = "Sent Tokens";
      } else {
        txnType = `Sent to ${item.toUserName}`;
      }
    }
    return (<Text style={inlineStyle.txnHeading}>{txnType}</Text>);
  }

  getDateTimeStamp(timestamp) {
    let dateString = this.getDateString(new Date(timestamp));
    return (<Text style={inlineStyle.subHeading}>{dateString}</Text>);
  }

  getTxnDetailsView(item) {
    return (<TouchableOpacity
			onPress={ () => { this.onTxnTap(item) } }>
      <View style={{flex: 8, justifyContent: "center"}}>
      {
        this.getTxnText(item)
      }
      {
        this.getDateTimeStamp(item.timestamp * 1000)
      }
    </View>
    </TouchableOpacity>);

  }

	onTxnTap(item) {
		const viewEndPoint = appProvider.getViewApiEndpoint();
		const url = viewEndPoint + "transaction/tx-" + this.chainId + "-" + item.txnHash;
		Linking.openURL(url);
  }

  getDateString(date){
    return ('0' + date.getUTCDate()).slice(-2) +
      '/' + ('0' + date.getUTCMonth()).slice(-2) +
      '/' + date.getUTCFullYear() +
      ' ' + ('0' + date.getUTCHours()).slice(-2) +
      ':' + ('0' + date.getUTCMinutes()).slice(-2) +
      ':' + ('0' + date.getUTCSeconds()).slice(-2);

  }

  getValueTransferView(item) {
    let textColor;
    let valueString = parseFloat(this.priceOracle.fromDecimal(item.amount)).toFixed(2).toString();
    if (item.in) {
      textColor = Colors.darkerBlue;
      valueString = `+${valueString}`;
    } else {
      textColor = Colors.lighterGrey;
      valueString = `-${valueString}`;
    }

    return (<Text style={[inlineStyle.valueStyle, {color:textColor}]}>{valueString}</Text>);
  }

  getTransactionTransferList(txnObject, txnUsers) {
    let list = [];
    let txnPojo = {};
    txnPojo["id"] = txnObject.id;
    txnPojo["txnHash"] = txnObject.transaction_hash;
    txnPojo["timestamp"] = txnObject.block_timestamp;
    txnPojo["metaName"] = txnObject.meta_property.name;
    txnPojo["metaType"] = txnObject.meta_property.type;
    txnPojo["metaDetails"] = txnObject.meta_property.details;
    let transferArray = txnObject.transfers;

    let currentUserId = CurrentUser.getUserId();
    for (let i = 0;i<transferArray.length;i++) {
      let transferObj = Object.assign({}, txnPojo);
      let transfer = transferArray[i];
      let fromUserId = transfer.from_user_id;
      let toUserId = transfer.to_user_id;

      transferObj["amount"] = transfer.amount;
      if (txnUsers[fromUserId]) {
        transferObj["fromUserName"] = txnUsers[fromUserId].username || appProvider.getTokenName();
      } else {
        transferObj["fromUserName"] = "";
      }

      if (txnUsers[toUserId]) {
        transferObj["toUserName"] = txnUsers[toUserId].username || appProvider.getTokenName();
      } else {
        transferObj["toUserName"] = "";
      }
      if ( ( fromUserId == currentUserId ) || (toUserId == currentUserId)) {
        transferObj["in"] = toUserId == currentUserId;
        list.push(transferObj);
      }
    }
    return list;

  }
}

export default WalletScreen;
