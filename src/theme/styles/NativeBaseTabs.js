import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';

const scrollableTabStyles = {
    "tabsContainerStyleSkipFont": {
        backgroundColor: Colors.white
    },
    "underlineStyleSkipFont": {
        backgroundColor: Colors.primary,
        height: 2
    }
};

const tabStyle = {
    textStyle : { 
        color: Colors.black,
        fontSize: 25
    },
    activeTextStyle :{
        color: Colors.primary,
        fontSize: 25,
       // fontWeight : 'bold'
    },
    activeTabStyle : {backgroundColor: Colors.white},
    tabStyleSkipFont : {
        backgroundColor: Colors.white
    },
    style : {backgroundColor:  Colors.white}
}

//styles = DefaultStyleGenerator.generate(stylesMap);
export default {
    scrollableTab: DefaultStyleGenerator.generate(scrollableTabStyles),
    tab :  DefaultStyleGenerator.generate(tabStyle)
}