import React, {Component} from 'react'
import PropTypes from 'prop-types'
import "./Guider.css";
class Guider extends Component{
    render(){
        return (
            <div id="guider">
                <div className="swiper-container guide-swiper" ref="swiper">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <img src="./imgs/3.jpg" alt=""/>
                        </div>
                        <div className="swiper-slide"><img src="./imgs/4.jpg" alt=""/></div>
                        <div className="swiper-slide"><img src="./imgs/5.jpg" alt=""/></div>
                        <div className="swiper-slide">
                            <img src="./imgs/6.jpg" alt=""/>
                            <span className="enter-btn" onClick={this.enterAppAction.bind(this)}>进入</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    enterAppAction(){
        //调用app组件的进入事件
        this.props.onEnter();
    }
    componentDidMount () {
        this.swiper = new window.Swiper (this.refs.swiper,{
        })
    }
}

Guider.propTypes = {
    onEnter: PropTypes.func
}

export default Guider;