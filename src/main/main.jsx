import React, { Component } from 'react';
import { Route, Redirect, Switch} from "react-router-dom";
import {Layout} from 'antd';
import * as global from './actions/global';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Pop from '../modules/pop/pop.jsx';
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/pop" Component={Pop} />
          <Redirect from="/" to="/recruit" />
        </Switch>
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.global.userInfo,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({...global}, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);