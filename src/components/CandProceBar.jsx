import React, { Component } from 'react';
import { connect } from 'redux';
import { message, Modal, Spin } from 'antd';
import { withRouter } from 'react-router';
import MarkStatusComp from './MarkStatusComp.jsx';
class CandProceBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markWrittenStatusVisible: true,//标记笔试状态
            currentSelectRows: [],//当前选中的数据
            title: '标记offer状态'
        }
    }
    //关闭弹窗
    sendClose = () => {
        this.setState({
            markWrittenStatusVisible: false,
            currentSelectRows: [],
        })
    }
    //刷新数据
    refreshDataAndRecord = (data) => {
        // this.props.refreshData && this.props.refreshData(data);
    }
    render() {
        const {currentSelectRows, title} = this.state;
        return (
            //标记offer状态
            <MarkStatusComp 
                visible={this.state.markWrittenStatusVisible}
                selectedRows={currentSelectRows}
                title={this.state.title}
                onClose={this.sendClose}
                onOk={this.refreshDataAndRecord}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isSuperManager: state.global.isSuperManager,
    };
}
// export default connect(mapStateToProps)(withRouter(CandProceBar));
export default CandProceBar;
