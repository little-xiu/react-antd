import React, {Component} from 'react'
import {NavLink} from "react-router-dom";
import "./Tabs.css"
class Tabs extends Component{
		constructor () {
			super();
			this.state = {
				tabsList: [
					{title: "首页", path: "/home", fontClass: "icon-index"},
					{title: "分类", path: "/category",fontClass: "icon-leimupinleifenleileibie1"},
					{title: "我的", path: "/mine",fontClass: "icon-user"},
					{title: "购物车", path: "/cart",fontClass: "icon-gouwuche"},
					{title: "更多", path: "/more",fontClass: "icon-gengduo"},
				]
			}
		}
    render(){
        return (
            <div id="tabs" className="tabs">
                {
                	this.state.tabsList.map((item,index)=>{
                		return (
												<NavLink className="tab" to={item.path} 
												key={index}>
												<span className={"iconfont " + item.fontClass}></span>
												<span>{item.title}</span>
												</NavLink>
                			)
                	})
                }
            </div>
        )
    }
}

export default Tabs;