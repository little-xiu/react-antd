import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import cartReducer from './cart.js'
import rootReducer from '../main/reducers';
import IntervieReducer from '../modules/pop/interviewer/reducer';

const reducer = combineReducers({
    cart: cartReducer,
    IntervieReducer,
    ...rootReducer,
})
// 中间件thunk是用来做异步的；
const store = createStore(reducer, applyMiddleware(thunk));
export default store;
/**
 * 组件中使用
 * // 此组件内使用this.props.isAssistantRole
const mapStateToProps = state => ({
  isAssistantRole: state.global.isAssistantRole,
});
// 此组件内使用 this.props.actions.fetch();·
const mapDispatchToProps = (dispatch) => {
  return {//bindActionCreators里面的actions是引入的 import * as actions from '../action';
    actions: bindActionCreators(actions, dispatch),
  };
}·
export default connect(mapStateToProps, mapDispatchToProps)(InterviewArrange);
 */