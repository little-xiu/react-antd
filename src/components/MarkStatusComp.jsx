import React, {Component} from 'react'
import FormItemPack from "../components/FormItemPack.jsx";
import {Modal, Form, message, Button, Row,} from 'antd';
// import {changeWrittenStatus, changeInterviewStatus, changeOfferStatus} from './MarkStatus.api.js';
import _ from 'lodash';
const writtenStatusOptions = [
    {
        label: '确定',
        value: 'W_UNTERMINED',
    },
    {
        label: '通过',
        value: 'M_PASS',
    },
];
const interviewStatusOptions = [
    {
        label: '待定',
        value: 'M_UNTERMINED',
    },
    {
        label: '不通过',
        value: 'M_NOT_PASS',
    },
];
const offerOptions = [
    {
        label: '已拒绝',
        value: 'O_REFUSED',
    },
];
class MarkStatusComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            sltObsoleteCause: '',
        };
    }
    componentWillReceiveProps = (props) => {
        if (props.visible === this.state.visible) {
            return;
        }
        const { visible } = props;
        this.setState({ visible });        
    }
    getParams = (formVal) => {
        const resumeAcceptIds = this.props.selectedRows.map((item) => {
            return item.resumeAcceptId;
        });
        return {
            remake: _.trim(formVal.mark),
            recruitNodeStatus: formVal.recruitNodeStatus,
            resumeAcceptIds,
        };
    }
    // handleSubmit = async () => {
    //     this.props.form.validateFields(async (err, formVal) => {
    //         if (err) {
    //             return;
    //         }
    //         const params = this.getParams(formVal);
    //         const { title } = this.props;
    //         if (!params) {
    //             return false;
    //         }
    //         let rs = null;
    //         this.setState({ loading: true });
    //         // if (title === '笔试') {
    //         //     rs = await changeWrittenStatus(params, () => {
    //         //         this.setState({ loading: false });
    //         //     });
    //         // } else if (title === '面试') {
    //         //     rs = await changeInterviewStatus(params, () => {
    //         //         this.setState({loading: false});
    //         //     });
    //         // } else {
    //         //     rs = await changeOfferStatus(params, () => {
    //         //         this.setState({loading: false});
    //         //     })
    //         // }
    //         this.handleClose();
    //         if (!rs || rs.responseCode !== 10001) {
    //             return;
    //         }
    //         if (rs.responseCode === 10001) {
    //             message.success('操作成功');
    //             this.props.onOk && this.props.onOk();
    //         }
    //     });
    // }
    handleClose = () => {
        this.props.form.resetFields();
        this.props.onClose && this.props.onClose();
    }
    render() {
        const { form, selectedRows, title } = this.props;
        let options = [];
        let desc = '结果';
        if (title === 'offer') {
            options = offerOptions;
            desc = '状态';
        } else if (title === '笔试') {
            options = writtenStatusOptions;
        } else {
            options = interviewStatusOptions;
        }
        const { visible, loading } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        return (
            <Modal
                width={490}
                title={`标记${title}${desc}`}
                visible={visible}
                onCancel={this.handleClose}
                footer={
                    [
                        <Button key="closeBtn" type="ghost" onClick={this.handleClose}>取消</Button>,
                        <Button
                            key="submitBtn"
                            type="primary"
                            loading={loading}
                            // onClick={this.handleSubmit}
                        >
                            确定
                        </Button>,
                    ]
                }
            >
            <Form>
                <Row style={{ marginBottom: 16, color: 'red' }}>
                    <span>{`已选${selectedRows.length}位候选人`}</span>
                    {/* <span>{selectedRows && selectedRows.map(item => item.name.join('  '))}</span> */}
                </Row>
                <Row>
                    <FormItemPack 
                        name='RecruitNodeStatus'
                        form={form}
                        label={`${title}${desc}`}
                        type='select'
                        style={{width: 365}}
                        options={options}
                        placeholder='请选择'
                        required
                        allowClear
                        {...formItemLayout}
                    />
                </Row>
                <Row>
                    <FormItemPack 
                        name='mark'
                        form={form}
                        label='备注'
                        type='textarea'
                        maxLength={30}
                        style={{ width: 365 }}
                        {...formItemLayout}
                    />
                </Row>
            </Form> 
            </Modal>
        )
    }
}
export default Form.create()(MarkStatusComp);