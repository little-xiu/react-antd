import React, {Component} from "react";
import "./header.css";
class Header extends Component {
	render () {
		let backBtn = this.props.showBack && <span className="btn leftBtn" onClick={this.backAct.bind(this)}>返回</span>
		let rightBtn = this.props.rightBtn && (
				<span className="btn rightBtn" onClick={this.props.rightBtn.handler}>
					{this.props.rightBtn.title}
				</span>
			)
		return (
				<div className="header">
					{backBtn}
					<h1 className="title">
						{this.props.children}
					</h1>
					{rightBtn}
				</div>
			)
	}
	backAct () {
		this.props.back();
	}
}
export default Header;