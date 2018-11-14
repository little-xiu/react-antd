import React, {Component} from 'react';
//自己封装的下拉组件
class DropDownSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }//选中下拉框的值
    handleChecked = (item) => {
        this.props.dropDownChecked && this.props.dropDownChecked(item);
    }
    handleClickOnDocument = () => {
        this.props.handleClickOnDocument && this.props.handleClickOnDocument();
    }
    componentDidMount () {
        document.addEventListener('click', this.handleClickOnDocument, false);
    }
    componentWillUnmount () {
        document.removeEventListener('click', this.handleClickOnDocument, false);
    }
    render () {
        const {dataList} = this.props;
        return (
            dataList.map(item => {
                return <div className='menu' key={item.id} onClick={() => {this.handleChecked(item) }} dangerouslySetInnerHTML={{__html: item.tagName_1 }}></div>
            })
        )
    }
}
export default DropDownSelect;
