import { createStore } from 'redux';
import rootReducer from './Reducers/reducer'; // Create and import your root reducer

const store = createStore(rootReducer); // Create the Redux store using the root reducer

export default store;
