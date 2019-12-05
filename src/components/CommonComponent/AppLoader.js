import React, {Component} from 'react'
import {View, Modal, Text, Image, Animated, Easing, Platform} from 'react-native';
import Colors from "../../theme/styles/Colors";


export default class ApplicationLoader extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={{backgroundColor:"rgba(0,0,0,0.4)",height: "100%", width: "100%"}}>
          <View>
            <Text>Hello World!</Text>
          </View>
        </View>
      </Modal>

    );
  }

  getModalView = () => {
    <View style={{backgroundColor: Colors.lightGrey, width:"100%", height: "100%"}}></View>
  }
}