import React, {Component} from 'react'
import Header from '../../components/header.jsx'
import Content from '../../components/content.jsx'
import './BookDetail.css'
import {getHomeDetail} from '../../services/bookService'
import store from "../../store/store.js";
export default class BookList extends Component{
    constructor({match, history,location}){
        super();
        this.history = history;
        //取得书籍的id
        this.state = {
            // id: match.params.id,
            id: location.state.id,
            dom: null
        }
    }
    render(){
        return (
            <div className="page subpage" id="book-detail">
                <Header showBack back={this.handleBack.bind(this)}>
                    书籍详情
                </Header>
                <Content>
                    {this.state.dom}
                </Content>
            </div>
        )
    }

    handleBack(){
        this.history.goBack();
    }

    componentDidMount(){
        //请求书籍的详情数据
        getHomeDetail(this.state.id).then(result=>{

            let bookDetailDOM = (
                <div>
                    <p className="detail-img"><img src={result.poster} alt=""/></p>
                    <h1 className="detail-bookname">{result.name}</h1>
                    <p className="book-details">{result.des}</p>
                    <span className="buy-btn" onClick={this.addCart.bind(this,result)}>添加购物车</span>
                </div>
            )
            this.setState({dom: bookDetailDOM});
        })
    }//添加购物车事件
    addCart (item) {
        store.dispatch({
            type: "add-cart",
            value: {
                name: item.name,
                id: item.id
            }
        })
    }
}