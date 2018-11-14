import React, {Component} from 'react'
import Header from "../../components/header.jsx"
import Content from "../../components/content.jsx"
import {getCinemaDetail} from "../../services/bookService.js"
class CinemaDetail extends Component {
	constructor ({match,history}) {
		super();
		this.history = history;
		this.state = {
			id: match.params.id,
			cinemaInfo:{}
		}
	}
	render () {
		let {cinemaInfo} = this.state;
		return (
				<div id="cinemaDetail" className="page">
					<Header showBack back={this.goBack.bind(this)}>电影详情</Header>
					<Content>
						<h4>{cinemaInfo.name}</h4>
						<p>电话: {cinemaInfo.ptelephones}</p>
						<p>地址: {cinemaInfo.address}</p>
					</Content>
				</div>
			)
	}
	componentDidMount () {
		getCinemaDetail(this.state.id).then(data=>{
			this.setState({cinemaInfo: data});
			console.log(this.state.cinemaInfo)
		})
	}
	goBack () {
		this.history.go(-1);
	}
}
export default CinemaDetail;