import React, {PureComponent} from 'react';
import {FlatList, Text, View, TouchableWithoutFeedback} from 'react-native';

import inlineStyle from './style'
import Colors from '../../../src/theme/styles/Colors'

import AppLoader from '../CommonComponent/AppLoader'
import CurrentUser from "../../models/CurrentUser";
import {SwitchActions} from "react-navigation";

import {appProvider} from "../../helper/AppProvider";
import {OstWalletSettings} from "@ostdotcom/ost-wallet-sdk-react-native";
import {DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT} from "../../constants/AppConfig";


class Settings extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam('navTitle', 'Settings'),
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
      list: [],
      refreshing: false,
      modalVisible: false,
      title: ""
    };
  }

  componentDidMount() {
    this._buildList()
  }

  _buildList() {
    let cells = [];

    cells.push(this._buildOstWalletSettingsData());
    cells.push(this._buildLogoutData());

    this.setState({
      list: cells
    })
  }

  _buildOstWalletSettingsData() {
    return {
      "cellType": "walletSetting",
      "heading": "Wallet Setting",
      "description": null
    }
  }

  _buildLogoutData() {
    return {
      "cellType": "logout",
      "heading": "Logout",
      "description": null
    }
  }

  onSettingItemTapped = (cellData) => {
    if ( cellData.cellType === 'walletSetting' ) {

      OstWalletSettings.setMasterConfig({
        item_configs:{
          add_session: {
            config: {
              "spending_limit": DEFAULT_SPENDING_LIMIT,
              "expiration_time": DEFAULT_SESSION_KEY_EXPIRY_TIME
            }
          },
          wallet_details:{
            config: {
              ost_view_endpoint: appProvider.getViewApiEndpoint()
            }
          }
        }
        });

      this.props.navigation.push("WalletSettingScreen", {'ostUserId': CurrentUser.getUserId(), 'ostWalletUIWorkflowCallback': appProvider.getOstSdkUIDelegate()});
      return
    }

    if ( cellData.cellType === 'logout' ) {
      this.onLogoutButtonTapped();
      return
    }
  };

  onLogoutButtonTapped = () => {
    this.setState({
      modalVisible: true,
      title: "Logging out"
    })

    CurrentUser.logoutUser()
      .then( () => {
        this.props.navigation.dispatch(SwitchActions.jumpTo({routeName:'Onboarding'}, {navTitle: "Wallet"}));
      })
      .catch( () => {

      })
  };

  _keyExtractor = (item, index) => `id_${index}_${item.cellType}`;

  _renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onSettingItemTapped(item)}>
        <View style={inlineStyle.listComponent}>
          <Text style={inlineStyle.heading}>{item.heading}</Text>
          {(item.description && (item.description.length > 0)) ? <Text style={inlineStyle.description}>{item.description}</Text> : <View />}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <>
        <AppLoader modalVisible={this.state.modalVisible} title={this.state.title} />
        <View style= {inlineStyle.list}>
          <FlatList
            onRefresh={this.onRefresh}
            data={this.state.list}
            refreshing={this.state.refreshing}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            visible={false}
            scrollEnabled={false}
          />
        </View>
      </>
    );
  }
}

export default Settings