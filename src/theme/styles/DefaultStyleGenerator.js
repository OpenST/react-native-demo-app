import { StyleSheet } from 'react-native';

class DefaultStyleGenerator {
  generate(styles) {
    let styleKey, styleObj;
    for (styleKey in styles) {
      if (styles.hasOwnProperty(styleKey)) {
        styleObj = styles[styleKey];
        if (typeof styleObj.fontFamily === 'undefined' && styleKey.indexOf('SkipFont') < 0) {
          // styleObj.fontFamily = 'Avenir Next';
        }
      }
    }
    return StyleSheet.create(styles);
  }
}

export default new DefaultStyleGenerator();
