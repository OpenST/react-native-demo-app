import { NativeModules } from 'react-native';

const nativeHelper = NativeModules.NativeHelper;
const maxAllowedDecimals = 2;
class NumberFormatter {

  constructor(config){
    this.config = config;
    this.groupSeparator = ',';
    this.decimalSeparator = '.';
    nativeHelper.getGroupAndDecimalSeparators((groupSeparator, decimalSeparator)=> {
      this.groupSeparator = groupSeparator;
      this.decimalSeparator = decimalSeparator;

    }, (error)=> {
      this.groupSeparator = ',';
      this.decimalSeparator = '.';
    });
  }


  isValidInputProvided(val) {
    val  = val && String(val);
    val =  val.trim();
    let separators = this.getDecimalGroupSeparators()
      , decimalSeparator = separators[1]
      , regex = new RegExp(['[^0-9'+decimalSeparator+']+'],'g')
      , matchStrs = val.match(regex)
    ;

    if (matchStrs && matchStrs.length > 0) {
      return false;
    }

    const splitArray = val && val.split(decimalSeparator)
      , decimals = splitArray[1] || ''
      ;
    if (maxAllowedDecimals < decimals.length ) {
      return false
    }

    return true;
  }

  getDecimalGroupSeparators(){
    return [this.groupSeparator, this.decimalSeparator];
  }

  convertToValidFormat(val) {
    val  = val && String(val);
    let separators = this.getDecimalGroupSeparators()
      , decimalSeparator = separators[1]
      , regex = new RegExp(['[^0-9\\'+decimalSeparator+']+'],'g')
    ;

    val = val && val.split(regex).join('');

    let splitArray = val && val.split(decimalSeparator);

    if (splitArray.length > 1) {
      let firstVal = splitArray[0];
      splitArray.shift();
      let decimalVal = splitArray.join('');

      val = firstVal+decimalSeparator+decimalVal;
    }

    return val;
  };

  getFullStopValue(val) {
    val  = val && String(val)
    let sperators = this.getDecimalGroupSeparators()
      , decimalSeparator = sperators[1]
    ;

    val = val && val.replace(decimalSeparator, '.');

    return val
  }

  getFormattedValue(valTobeFormatted) {
    valTobeFormatted  = valTobeFormatted && String(valTobeFormatted)
    let sperators = this.getDecimalGroupSeparators()
      , decimalSeparator = sperators[1]
    ;

    valTobeFormatted = valTobeFormatted.replace('.', decimalSeparator);

    return valTobeFormatted
  }


}

export default NumberFormatter;