import React, {Component} from "react";
import "./searchBar.css"
export default class SearchBar extends Component {
	render () {
		return (
				<div className="search-wrap">
					<span className="search-btn iconfont icon-dianhua"></span>
					<p className="search-inner">
						请输入搜索内容
					</p>
				</div>
			)
	}
}