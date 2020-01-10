import React from 'react';
import {Text, View} from 'react-native';
import inlineStyles from './styles';

const EmptyList = (props) => {
  return (
    <View style={inlineStyles.emptyListWrapper}>
    <View style={inlineStyles.emptyListConatiner}>
      <Text style={inlineStyles.emptyListConatinerText}>{props.displayText}</Text>
    </View>
    </View>
  );
};

export default EmptyList;
