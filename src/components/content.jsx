import React, {Component} from "react";
import "./content.css"
class Content extends Component {
	render () {
		return (
				<div className="content" ref="content">
					<div className="content-wrap">
						{this.props.children}
					</div>
				</div>
			)
	}
	componentDidMount () {
		this.iscroll = new window.IScroll(this.refs.content,{

		})
		this.iscroll.on("beforeScrollStart",()=>{
			this.iscroll.refresh();
		})
	}
	refreshDOM () {
		this.iscroll.refresh();
	}
}
export default Content