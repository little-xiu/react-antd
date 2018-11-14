import React, {Component} from 'react'
import Header from "../../components/header.jsx"
import Content from "../../components/content.jsx";
import SearchBar from "../../components/searchBar.jsx";
import {getCategoryData} from "../../services/bookService.js";
import "./Category.css"
class Category extends Component{
  constructor ({history}) {
    super();
    this.history = history;
    this.state = {
      categoryList:[]
    }
  }
  render(){
    let {categoryList} = this.state;
    console.log(categoryList,11)
    return (
      <div id="category" className="page">
        <Header showBack back={this.backAct.bind(this)}>分类</Header>
				<Content ref="content">
					<SearchBar></SearchBar>
					<ul className="categoryList">
            {
              categoryList.map((items,i)=>{
                return (
                    <li className="category-item" key={i}>
                      <h5 className="category-title" onClick={this.tabAct.bind(this,i)}>{items.name}</h5>
                        {
                          items.show && (
                              <ul>
                                {
                                  items.data.map((item,j)=>{
                                    return (
                                        <li className="sub-item" key={j} onClick={this.goCinemaDetailPage.bind(this,item.id)}>
                                          {item.name}
                                        </li>
                                      )
                                  })
                                }
                              </ul>
                            )
                        }
                    </li>
                  )
              })
            }
          </ul>
				</Content>
      </div>
    )
  }
  componentDidMount () {
    getCategoryData().then((data)=>{
      this.setState({categoryList: data});
    })
  }
  tabAct (i) {
    let show = this.state.categoryList[i].show;
    this.state.categoryList[i].show = !show;
    this.setState({categoryList: this.state.categoryList}, ()=>{
      // console.log('更新dom完成');
      // 刷新滚动视图
      this.refs.content.refreshDOM();
    });
  }
  backAct () {
    this.history.go(-1);
  }
  goCinemaDetailPage (id) {
    this.history.push(`/Category/detail/${id}`);
  }
}

export default Category;