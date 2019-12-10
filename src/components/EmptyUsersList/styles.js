import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';
export default styles = StyleSheet.create({
  emptyListWrapper: {
    flex: 1,
    height: Dimensions.get('screen').height,
    justifyContent: 'flex-start',
    backgroundColor: Colors.whiteSmoke
  },
  emptyListConatiner: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    paddingHorizontal: 20,
    margin: 15
  },
  emptyListConatinerText: {
    color: Colors.greyLite,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
    alignSelf: 'center'
  }
});
