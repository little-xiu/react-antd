import React, {Component} from "react";
import PropTypes from "prop-types";
class ImageCom extends Component {
	constructor () {
		super();
		this.state = {
			url: 'https://place-hold.it/150x200'
		}
	}		
	render () {
		return (
				<img src={this.state.url} alt=""/>
			)
	}
	componentDidMount () {
		let imgObj = new Image();
		imgObj.src = this.props.src;
		imgObj.onload = ()=>{
			this.setState({url: this.props.src});
		}
	}
}
export default ImageCom;
ImageCom.propTypes = {
	src: PropTypes.string
}