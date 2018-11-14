import React, {Component} from 'react'
import "./Home.css"
import Header from "../../components/header.jsx";
import Content from "../../components/content.jsx"
import SearchBar from "../../components/searchBar.jsx"
import {getTopBookList} from "../../services/bookService.js";
import Books from "../../components/Books.jsx";
class Home extends Component{
	constructor () {
		super();
		this.state = {
			bookList: []
		}
	}
  render(){
  	let {bookList} = this.state; 
      return (
          <div id="home" className="page">
              <Header>书店</Header>
              <Content>
              	<SearchBar/>
                <Books data={bookList} type="home"/>
      	
              </Content>
          </div>
      )
  }
  componentDidMount () {
		getTopBookList().then(data=>{
			this.setState({
				bookList: data.data
			})
		})
  }
  
}

export default Home;