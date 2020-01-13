import { createStore, applyMiddleware } from 'redux';
import { reducer } from '../reducers';

// export const store = __DEV__ === true ? createStore(reducer, applyMiddleware(logger)) : createStore(reducer);
 export const store = createStore(reducer);

export default store;
