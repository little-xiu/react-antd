import React, {Component} from 'react'
import Header from "../../components/header.jsx"
import store from "../../store/store.js"
import Content from "../../components/content.jsx";
import "./Cart.css"
class Cart extends Component{
    render(){
        console.log(store.getState().cart)
        let cartList = store.getState().cart;
        let contentDom = (cartList.length === 0) ? <div className="cart-wrap">购物车空空如也</div> : (
                cartList.map((item,index)=>{
                    return (
                         <div className="cart-item" key={index}>
                            <p className="pro-name">{item.name}</p>
                            <span className="add-btn" onClick={this.addPro.bind(this,item.id)}>+</span>
                            <span className="pro-num">{item.count}</span>
                            <span className="reduce-btn" onClick={this.reducePro.bind(this,item.id)}>-</span>
                            <span className="pro-delete" onClick={this.deletePro.bind(this,item.id)}>删除</span>
                         </div>
                        )
                })
            )
        return (
            <div id="cart" className="page">
                <Header showBack rightBtn={{
                	title: "去结算",
                	handler: this.payAction.bind(this)
                }}>购物车</Header>
                <Content>
                    {contentDom}
                </Content>
            </div>
        )
    }
    //监听全局数据的变化
    componentDidMount () {
     this.token = store.subscribe(()=>{
            this.forceUpdate();
        })
    }
    componentWillUnmount () {
        this.token();
    }
    payAction () {
    	console.log("去结算")
    }
    addPro (id) {
        store.dispatch({
            type: "addPro",
            id
        })
    }
    reducePro (id) {
        store.dispatch({
            type: "reducePro",
            id
        })
    }
    deletePro (id) {
        store.dispatch({
            type: "deletePro",
            id
        })
    }
}

export default Cart;