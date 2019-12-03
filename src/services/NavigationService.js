import { NavigationActions , StackActions } from 'react-navigation';
import deepGet from 'lodash/get';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getTopLevelNavigator(){
  return _navigator;
}


function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function getActiveTab(){
  let activeIndex = deepGet(_navigator , 'state.nav.index'),
      tabIndex = deepGet(_navigator , `state.nav.routes[${activeIndex}].index`),
      route = deepGet(_navigator , `state.nav.routes[${activeIndex}].routes[${tabIndex}]`);
  return route && route["routeName"];
}

const findCurrentRoute = (navState) => {
  if ( !navState ) {
    navState = getTopLevelNavigator().state.nav;
  }

  let index = navState.index;
  if (typeof index !== "number") {
    //No more index.
    return navState.routeName;
  } else {
    //Call recursive;
    return findCurrentRoute(navState.routes[index] );
  }
}

const getStackNumber = (routes , index , num , whiteListedStacks) => {
  if (typeof index !== "number" || !whiteListedStacks.length) {
    return num;
  } else {
    const currentRoute = routes[index] || {};
    const innerRoutes = currentRoute["routes"] || []
    for(let cnt = 0 ;  cnt < innerRoutes.length ; cnt++){
      const route = innerRoutes[cnt]; 
      const routeName = route["routeName"];
      const indexOfItem = whiteListedStacks.indexOf(routeName);
      if(indexOfItem > -1){
        num ++;
        whiteListedStacks.splice(indexOfItem, 1);
      }
      num = getStackNumber( route["routes"], route["index"], num  , whiteListedStacks);
    } 
    return num;
  }
}

function reset(navigation) {
  if(!navigation) return;
   navigation.dispatch(StackActions.popToTop("Notification"));
   navigation.dispatch(StackActions.popToTop("Search"));
   navigation.dispatch(StackActions.popToTop("Home"));
}

export default {
  navigate,
  setTopLevelNavigator,
  getTopLevelNavigator,
  findCurrentRoute,
  getActiveTab,
  getStackNumber,
  reset
};