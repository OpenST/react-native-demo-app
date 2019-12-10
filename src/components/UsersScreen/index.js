import React, {PureComponent} from 'react';
import Colors from '../../theme/styles/Colors';
import {FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import inlineStyle from "../UsersScreen/styles";
import {appProvider} from "../../helper/AppProvider";
import sizeHelper from "../../helper/SizeHelper";

class UsersScreen extends PureComponent {
	static navigationOptions = (options) => {
		return {
			headerTitle: 'Users',
			headerBackTitle: null,
			headerStyle: {
				backgroundColor: Colors.white,
				borderBottomWidth: 0,
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 1
				},
				shadowOpacity: 0.1,
				shadowRadius: 3
			},
			headerTitleStyle: {
				// fontFamily: 'AvenirNext-Medium'
			}
		};
	};

	constructor(props) {
		super(props);
		this.state = {list: null, balances: null, refreshing: false};
		this.next_page_payload = null;
		this.appIdHash = {};
		this.fetchData();
	}

	fetchData() {
		const oThis = this;
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
			}).catch((err) => {
			console.log(err);
		});
	}

	cleanList(list) {
		for (let ind=0; ind<list.length; ind++) {
			let obj = list[ind];
			if (obj.app_user_id && !this.appIdHash[obj.app_user_id]) {
				if (!this.state.list) this.state.list = [];
				this.state.list.push(obj);
				this.appIdHash[obj.app_user_id] = 1;
			}
		}
		return this.state.list;
	}
	onRefresh = () => {

	};

	getCircularView(centeredText) {
		return (<View style={{
			flex:1,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#f4f4f4',
			borderColor: '#9b9b9b',
			marginTop: sizeHelper.layoutPtToPx(10),
			marginLeft: sizeHelper.layoutPtToPx(5),
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
				backgroundColor: 'none',
				fontSize: sizeHelper.fontPtToPx(20)
			}}>
				{centeredText}
			</Text>
		</View>);
	}

	getUserNameView(userName) {
		return (<Text style={inlineStyle.heading}>{userName}</Text>);
	}

	getUserBalanceView(balance) {
		return (<Text style={inlineStyle.subHeading}>Balance: {balance} POP</Text>);
	}

	getUserDetailsView(item) {
		return (<View style={{flex: 3, justifyContent: "center", marginTop: sizeHelper.layoutPtToPx(10)}}>
			{
				this.getUserNameView(item.username)
			}
			{
				this.getUserBalanceView(this.state.balances[item.app_user_id] ? this.state.balances[item.app_user_id].available_balance : 0)
			}
		</View>);

	}
	_renderItem = ({item, index}) => {
		return (
			<TouchableWithoutFeedback onPress={() => this.onSettingItemTapped(item)}>
				<View style={inlineStyle.userComponent}>
					{
						this.getCircularView(item.username && item.username.charAt(0))
					}
					{
						this.getUserDetailsView(item)
					}
					<TouchableOpacity
						style={inlineStyle.buttonStyle}
						activeOpacity={.5}>
						<Text style={inlineStyle.textStyle}> Send </Text>
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	_keyExtractor = (item, index) => `id_${index}_${item.cellType}`;

	getNext = () => {
		if (
			this.state.refreshing ||
			!this.next_page_payload
		)
			return;
		appProvider.getAppServerClient().getUserList(this.next_page_payload)
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
		);
	}
}

export default UsersScreen;
