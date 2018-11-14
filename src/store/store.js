import {createStore,combineReducers} from "redux";
import cartReducer from './cart.js'

const reducer = combineReducers({
    cart: cartReducer
})


const store = createStore(reducer);
export default store;
