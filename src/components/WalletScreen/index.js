import React, {PureComponent} from 'react';
import Colors from "../../theme/styles/Colors";
import inlineStyle from "../WalletScreen/styles";
import {FlatList, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import walletBgCurve from '../../assets/wallet_bg_curve.png'
import {appProvider} from "../../helper/AppProvider";
import CurrentUser from "../../models/CurrentUser";
import {OstJsonApi} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";

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
		this.state = {list:null, refreshing: false, balance: {available_balance:"0"}};
		this.txnIdHash = {};
		this.priceOracle = null;
	}

	componentDidMount() {
		this.onRefresh();
		this.fetchBalance();
	}

	onRefresh = () => {
		this.fetchTransactions();

	};

	fetchBalance() {
		OstJsonApi.getBalanceWithPricePointForUserId(CurrentUser.getUserId(), (res) => {
			this.onBalanceResponse(res)
		}, (ostError) => {
			console.log(ostError)
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
			refreshing: true
		});
		appProvider.getAppServerClient().getCurrentUserTransactions()
			.then((res) => {
				console.log(res);
				if (res.result_type) {
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
		for (let ind=0; ind<list.length; ind++) {
			let obj = list[ind];
			if (obj.id && !this.txnIdHash[obj.id]) {
				if (!this.state.list) this.state.list = [];
				this.state.list.push(obj);
				this.txnIdHash[obj.id] = 1;
			}
		}
		return this.state.list;
	}

	render() {
		return (
			<View style={inlineStyle.walletComponent}>
				<View style={inlineStyle.walletWrapStyle}>
					<Image style={inlineStyle.walletScreenStyle} source={walletBgCurve}/>
					<View style={inlineStyle.walletBalanceStyle}>
						<Text style={inlineStyle.tokenTextStyle}>{this.getTokenBalance()}</Text>
						<Text style={inlineStyle.fiatTextStyle}>{this.getTokenFiatBalance()}</Text>
					</View>
				</View>

				<Text style={inlineStyle.heading}>TRANSACTION HISTORY</Text>
				<FlatList
					style={inlineStyle.flatListStyle}
					onRefresh={this.onRefresh}
					data={this.state.list}
					refreshing={this.state.refreshing}
					renderItem={this._renderItem}
					keyExtractor={this._keyExtractor}
					visible={false}
					scrollEnabled={true}
				/>
			</View>
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
			balanceInFiat = this.priceOracle.btToFiat(btValue);
		}
		return `$ ${balanceInFiat}`;
	}

	_renderItem = ({item, index}) => {
		return (
			<TouchableWithoutFeedback>
				<Text>{item.id}</Text>
			</TouchableWithoutFeedback>
		);
	};

	_keyExtractor = (item, index) => `id_${index}_${item.cellType}`;
}

export default WalletScreen;
