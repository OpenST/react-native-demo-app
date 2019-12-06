import React, {Component} from 'react'
import {View, Modal, Text, Image, Animated, Easing, Platform, StyleSheet} from 'react-native';
import Colors from "../../theme/styles/Colors";
import Spinner from '../../assets/Spinner.gif'

export default class ApplicationLoader extends Component {

  constructor(props){
    super();
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}>
        <View style={appLoaderStyles.container}>
          <View style={appLoaderStyles.loaderContainer}>

            <Image source={Spinner} style={appLoaderStyles.image}/>
            <Text style={appLoaderStyles.text}>{this.props.title}</Text>

          </View>
        </View>
      </Modal>
    );
  }
}

const appLoaderStyles = StyleSheet.create({
  container: {
    backgroundColor:"rgba(0,0,0,0.4)",
    height: "100%",
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center'
  },

  loaderContainer: { backgroundColor: "rgb(255,255,255)",
    width:"85%",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },

  text: {
    color: "black",
    marginTop: 10,
    fontSize: 17
  },

  image: {
    width:30,
    height: 30,
  }
});