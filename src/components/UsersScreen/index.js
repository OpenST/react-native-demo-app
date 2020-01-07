import React, {PureComponent} from 'react';
import Colors from '../../theme/styles/Colors';
import {FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, View, Alert} from 'react-native';
import inlineStyle from "../UsersScreen/styles";
import {appProvider} from "../../helper/AppProvider";
import sizeHelper from "../../helper/SizeHelper";
import AppLoader from "../CommonComponent/AppLoader";
import CurrentUser from "../../models/CurrentUser";

class UsersScreen extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('navTitle', 'Users'),
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
      headerBackTitle: null

    };
  };

  constructor(props) {
    super(props);
    this.state = {
      list: null,
      balances: null,
      refreshing: false,
      modalVisible: false,
      title: ""
    };
    this.next_page_payload = null;
    this.appIdHash = {};
    this.priceOracle = null
  }

  async setPriceOracle() {
    this.priceOracle = await appProvider.getPriceOracle();
  }

  componentDidMount() {
    this.setPriceOracle();
    this.fetchData();
  }

  fetchData() {
    this.appIdHash = {};
    const oThis = this;
    this.setState({
      refreshing: true,
      list:null
    });
    appProvider.getAppServerClient().getUserList()
      .then((res) => {
        if (res.result_type) {
          let cleanList = oThis.cleanList(res[res.result_type]);
          oThis.setState({
            list: cleanList,
            balances: res["balances"]
          });
          oThis.next_page_payload= res.meta.next_page_payload
        }
        oThis.hideLoader();
      }).catch((err) => {
      oThis.hideLoader();
      console.log(err);
    });
  }

  hideLoader() {
    this.setState({
      refreshing: false
    });
  }

  cleanList(list) {
    const preList = this.state.list ? this.state.list.slice(0) : [];
    for (let ind=0; ind<list.length; ind++) {
      let obj = list[ind];
      let isObejctPresent =  this.appIdHash[obj.app_user_id];
      if (isObejctPresent) {
        continue;
      }
      if (CurrentUser.getUserId() === obj.user_id.toString()) {
        preList.push(obj);
        this.appIdHash[obj.app_user_id] = 1;
        continue;
      }
      if (obj.app_user_id && obj.token_holder_address) {
        preList.push(obj);
        this.appIdHash[obj.app_user_id] = 1;
      }
    }
    return preList;
  }
  onRefresh = () => {
    this.fetchData();
  };

  getCircularView(centeredText) {
    return (<View style={{
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4f4f4',
      borderColor: '#9b9b9b',
      marginRight: sizeHelper.layoutPtToPx(5),
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

  getUserNameView(userName) {
    return (<Text style={inlineStyle.heading}>{userName}</Text>);
  }

  getUserBalanceView(item) {

    if (CurrentUser.getUserId() === item.user_id.toString()) {
      if (CurrentUser.getStatus() !== 'ACTIVATED') {
        return (<Text style={{
          color: 'red',
          fontSize: sizeHelper.layoutPtToPx(13),
          fontWeight: "normal"
        }}>Initializing...</Text>);
      }
    }

    let balance = this.state.balances[item.app_user_id] ? this.state.balances[item.app_user_id].available_balance : 0;
    return (<Text style={inlineStyle.subHeading}>Balance: {this.priceOracle.fromDecimal(balance) || 0} {appProvider.getTokenSymbol()}</Text>);
  }

  getUserDetailsView(item) {
    return (<View style={{flex: 3, justifyContent: "center"}}>
      {this.getUserNameView(item.username)}
      {this.getUserBalanceView(item)}
    </View>);
  }

  getSendButton(item) {
    if (CurrentUser.getUserId().toString() === item.user_id.toString()) {
      return(<View/>)
    }

    return(
      <TouchableOpacity
        onPress={() => {
          this.onSend(item);
        }}
        style={inlineStyle.buttonStyle}
        activeOpacity={0.5}>
        <Text style={inlineStyle.textStyle}> Send </Text>
      </TouchableOpacity>
    )
  }

  onSend(item) {
    if (CurrentUser.getUserId().toString() === item.user_id.toString()) {
      this.props.navigation.navigate('WalletScreen');
      return
    }

    const checkStatus = [CurrentUser.isDeviceStatusRegistered(), CurrentUser.isUserStatusActivated()];
    Promise.all(checkStatus)
      .then((res)=> {
        if (res[0] && res[1]) {
          console.log("UserScreen:", "Device not authorized to do transaction");
          this.showRegisteredDeviceDialog();
        } else {
          console.log("UserScreen:", "Opening send tokens screen");
          this.props.navigation.push("SendTokens", {user:item});
        }
      }).catch((err)=> {
      console.log("UserScreen:", "Error while fetching status", err);
      this.props.navigation.navigate('WalletScreen');
    });
  }

  showRegisteredDeviceDialog() {
    Alert.alert("Registered Device",
      "Your device is in registered state. Please authorized your device",
      [
        {
          text: 'Go to settings',
          onPress: () => {
            let navigationScreen =  'WalletSettingScreen';
            let navigationParams = {'ostUserId': CurrentUser.getUserId(), 'ostWalletUIWorkflowCallback': appProvider.getOstSdkUIDelegate()};
            this.props.navigation.navigate(navigationScreen, navigationParams);
          },
          style: 'cancel'
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel ')
        }
      ],
      {cancelable: false}
    );
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => {
        this.onSend(item);
      }}>
        <View style={inlineStyle.userComponent}>
          {this.getCircularView(item.username && item.username.charAt(0))}
          {this.getUserDetailsView(item)}
          {this.getSendButton(item)}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _keyExtractor = (item, index) => `id_${index}_${item.cellType}`;

  getNext = () => {
    if (
      this.state.refreshing ||
      !this.next_page_payload.page
    )
      return;
    appProvider.getAppServerClient().getUserList(this.next_page_payload.page)
      .then((res) => {
        if (res.result_type) {
          let cleanList = this.cleanList(res[res.result_type]);
          this.state.balances = Object.assign({}, this.state.balances, res["balances"]);
          this.setState({
            list: cleanList,
            balances: this.state.balances,
          });
          this.next_page_payload = res.meta.next_page_payload;
        }
      });
  };

  render() {
    return (
      <>
        <AppLoader modalVisible={this.state.modalVisible} title={this.state.title}/>
        <FlatList
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
      </>
    );
  }
}

export default UsersScreen;
