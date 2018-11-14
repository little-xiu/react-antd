import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import "./Books.css";
import Image from "./Image.jsx"
import store from "../store/store.js"
//to={path+item.id}
export default class Books extends Component {
  render () {
    let {data,type} = this.props;
    let path = "";
    if(type === "home") {
      path = '/home/detail/';
    }
    return (
          <ul className="book-list">
            {
              data.map(item=>{//首页商品边上显示购物车商品数量
                let count = this.getCountById(item.id);
                return (
                    <Link key={item.id} className="book-item" to={{pathname:path,state: {id: item.id}}}>
                      <div className="home-img">
                        <Image src={item.image}/>
                      </div>
                      <div className="home-bookdes">
                        <p className="home-title">{item.title}</p>
                        <p className="home-price">
                          ¥ {item.price}
                        </p>
                        <span className="buy-btn iconfont icon-gouwuche"
                        onClick={this.addCart.bind(this,item.id)}>{count}</span>
                      </div>
                    </Link>
                  )
              })
            } 
          </ul> 
      )
  }
  addCart (id,event) {
    event.preventDefault()//onClick事件添加在<Link>标签上时,可阻止to的链接跳转
    // event.stopPropagation()
    store.dispatch({
      type: "add-cart",
      value: {
        id
      }
    })
  }
  getCountById (id) {
    //获取购物车所有数据
    let data = store.getState().cart;
    let obj = data.find(item=>{
      return item.id === id;
    })
    return (obj ? obj.count : "");
  }
}