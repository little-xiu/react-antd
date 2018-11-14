import React, {Component} from 'react';
import {Modal, Form, Button, Checkbox, Table, Spin, message} from 'antd';
import OverflowText from '../commonComponents/overflow';
import {CancelInterviews} from '../commonComponents/requestData.api';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const renderOverText = (text, width) => {
    return <OverflowText width={width} text={text} minus />
};
// 引用该组件的有 tableDetail.jsx
class CancelInterviewGroupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            saveLoading: false,
            loading: false,
        };
    }
    // componentWillMount函数只在页面一进来就执行
    componentWillReceiveProps = (props) => {
        if (props.visible === this.state.visible) {
            return;
        }
        const {visible} = props;
        this.setState({visible});
    }
    handleClose = () => {
        localStorage.removeItem('candidateTemplateInfo');
        localStorage.removeItem('attachmentIdsForCancel');
        localStorage.removeItem('fileListForRemove');
        this.props.onClose();
    }
    handleSubmit = async () => {
        const value = this.props.form.getFieldValue('notice'); // 复选框是否通知候选人的值
        const sendToCandidate = value.some(item => {
            return item === 'Y';
        });
        this.setState({loading: true});
        const attachmentIds = JSON.parse(localStorage.getItem('attachmentIdsForCancel'));
        let attachmentId = '';
        if (attachmentIds) {
            attachmentId = attachmentIds;
        } else {
            attachmentId = [];
        }
        const rs = await CancelInterviews({
            cancelInterviewRequestList: this.props.selectedRows,
            sendToCandidate,
            attachmentId,
            batchNo: this.props.selectedRows[0].batchNo,
        });
        if (rs && rs.responseCode === 10001) {
            message.success('取消成功');
            this.props.removeCurrentRows();
            localStorage.removeItem('candidateTemplateInfo');
            localStorage.removeItem('attachmentIdsForCancel');
            localStorage.removeItem('fileListForRemove');
            this.setState({loading: false}, () => {
                this.props.onOk();
            });
        } else {
            this.setState({loading: false});
        }
    }
    handleToCancelTemplet = () => {
        const candidateList = this.props.selectedRows[0];
        const obj = {
            candidateInfoCancel: {
                resumeAcceptId: candidateList.resumeAcceptId,
                interviewPlace: candidateList.interviewPlace,
                interviewTimeStart: candidateList.interviewTime,
                contactPerson: candidateList.contactPerson,
                contactNumber: candidateList.contactNumber,
            },
        };
        localStorage.setItem('candidateTemolateInfo', JSON.stringify(obj));
        window.open('/#/pop/');
    }
    render() {
        const {form, selectedRows} = this.props;
        const {visible} = this.state;
        const {getFieldDecorator} = form;
        const columns = [
            {
                key: 'name',
                dataIndex: 'name',
                title: '候选人',
                render: text => renderOverText(text, 100),
            },
        ]
        return (
            <div>
                <Modal
                    width={900}
                    title='取消面试'
                    visible={visible}
                    onCancel={this.handleClose}
                    footer={
                        [
                            <Button key="closeBtn" type="ghost" onClick={this.handleClose}>取消</Button>,
                            <Button
                                key="submitBtn"
                                type="primary"
                                loading={this.state.loading}
                                onClick={this.handleSubmit}
                            >确定</Button>,
                        ]
                    }
                >
                    <Spin spinning={this.state.loading}>
                        <div>是否确定取消如下后续人面试？</div>
                        <Table 
                            columns={columns}
                            dataSource={selectedRows}
                            pagination={false}
                            rowKey={record => record.resumeAcceptId}
                        />
                        <FormItem>
                            {
                                getFieldDecorator('notice', {
                                    initialValue: ['Y'],
                                })(
                                    <CheckboxGroup
                                        style={{fontSize: '12px'}}
                                        onChange={this.handleChange}
                                    >
                                        <Checkbox value="Y" style={{fontSize: '12px'}}>通知候选人</Checkbox>
                                        <a onClick={this.handleToCancelTemplet}>面试取消模板</a>
                                    </CheckboxGroup>
                                )
                            }
                        </FormItem>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(CancelInterviewGroupModal);