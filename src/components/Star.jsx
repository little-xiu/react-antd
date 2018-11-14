import React, {Component} from 'react'
import './Star.css'
export default class Star extends Component{
    render(){
        let num1 = Math.floor(Number(this.props.rate));
        let num2 = Math.ceil(Number(this.props.rate));
        let type1 = num1;//实心
        let type2 = Number(this.props.rate)-num1;//半颗心
        let type3 = 10 - num2;//空心
        // console.log(type1 + '************' + type2 + '**************' + type3);
        return (
            <div className="star">
                {/* 实心 */}
                {
                    (function(){
                        let arr = [];
                        for (let i = 0; i < type1; i++) {
                            arr.push(<span key={i}>★</span>);
                        }
                        return arr;
                    })()
                }
                {/* 半颗心 */}
                {
                    type2 === 0 ? '': <span>'☾'</span>
                }
                {/* 空心 */}
                {
                    (function(){
                        let arr = [];
                        for (let i = 0; i < type3; i++) {
                            arr.push(<span key={i}>☆</span>);
                        }
                        return arr;
                    })()
                } 
            </div>
        )
    }
}

