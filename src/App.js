import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import './App.css';
import Home from "./pages/home/Home.jsx";
import Mine from "./pages/mine/Mine.jsx";
import More from "./pages/more/More.jsx";
import Category from "./pages/category/Category.jsx";
import Guide from "./pages/guider/Guider.jsx";
import Cart from "./pages/cart/Cart.jsx";
import Tabs from "./components/Tabs.jsx";
import BookDetail from "./pages/common/BookDetail.jsx";
import CinemaDetail from "./pages/category/cinemaDetail.jsx";
class App extends Component {
  constructor () {
    super();
    this.state = {
      isLoad: localStorage.getItem("loaded") ? true : false
    }
  }
  render() {
    let appDom = null;
    //判断app登录过就不再显示引导页,用localStorage存储加载信息
    if(this.state.isLoad) {
      appDom = (
      <Router>
        <div className="App">
          {/*根页面路由*/}
          <Switch>
            <Route path="/" exact render={()=>{
              return <Redirect to="/home"/>
            }}/>
            <Route path="/home" exact component={Home}/>
            <Route component={BookDetail} path="/home/detail/"/>           
            <Route path="/Mine" component={Mine}/>
            <Route path="/More" component={More}/>
            <Route path="/Category" exact component={Category}/>
            <Route path="/Category/detail/:id" component={CinemaDetail}/>
            <Route path="/Cart" component={Cart}/>
            <Route render={()=>{
              return <Redirect to="/home"/>;
            }}/>
          </Switch>

        {/*footer部分*/}
          <Tabs/>
        </div>
      </Router>
    );
    } else {
      appDom = <Guide onEnter={this.handAppEnter.bind(this)}/>
    }
    return appDom;
  }
  handAppEnter () {
    this.setState({
      isLoad: true
    })
    localStorage.setItem("loaded",true);
  }
}

export default App;
