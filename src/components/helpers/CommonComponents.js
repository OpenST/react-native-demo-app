import React, {PureComponent} from 'react';
import Colors from '../../theme/styles/Colors';
import {FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, View, Alert} from 'react-native';
import sizeHelper from "../../helper/SizeHelper";

class CommonComponents {
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
};

export default new CommonComponents();
