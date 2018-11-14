import React, {Component} from 'react';
import {Form, Row, Col, Modal} from 'antd';
import FormItemPack from './FormItemPack';
import debounce from 'lodash/debounce';
import DropDownSelect from '../commonComponents/DropDownSelect';
import {queryTempByInfo} from '../commonComponents/requestData.api';
let modal = '';
class FormItemDemo extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            visiable: false,
        };
    }
    getPopContainer = () => {
        return document.getElementById('interview_info');
    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }
    componentWillUnmount = () => {
        if (modal.destroy) {
            modal.destroy();
        }
    }
    handleGoInterview = () => {
        modal.destroy();
        window.location.href = '/#/pop/check-interview';
    }
    onOkCallback = () => {
        this.props.form.setFields({ 'interviewRound': {value: '' }});
    }
    //校验场次的合理性
    checkInterviewRound = async () => {
        const interviewRound = this.props.form.getFieldValue('interviewRound');
        if (!interviewRound || !interviewRound.trim() || interviewRound.trim().length > 20) {
            return;
        }
        const rs = await queryTempByInfo({interviewRound});
        if (rs && rs.responseCode === 10001 && !rs.data) {
            modal = Modal.warning({
                title: (
                    <div>
                        已安排过该场次的面试，若需调整请进入<a onClick={this.handleGoInterview}>我安排的面试</a>
                    </div>
                ),
                width: 600,
                onOk: this.onOkCallback,
            });
        }
    }
    // 选中下拉框的值
    dropDownChecked = (item) => {
      // FormItemPack的defaultValue只执行一次，再次更新值用this.props.form.setFields
        this.props.form.setFields({ 'interviewCount': {value: item.tagName}});
        this.setState({visiable: false});
    }
    // 点击document关闭下拉框
    handleClickOnDocument = () => {
        this.setState({visiable: false});
    }
    // 面试类型
    getInterviewOptions = () => {
        return [
            {
                value: 'HR',
                label: 'HR面试',
            },
            {
                value: 'CHECK',
                label: '核人面试',
            },
        ];
    }
    render() {
        const {form, disabled, interArrangeInfo} = this.props;
        const {getFieldDecorator} = form;
        const {dataList, visiable} = this.state;
        return (
            <div id="interview_info">
                <Form autoComplete="off">
                  <Row type="flex">
                    <Col span={8}>
                      <FormItemPack 
                        form={form}
                        disabled={disabled}
                        label="场次名称"
                        placeholder="请输入"
                        type="input"
                        name="interviewRound"
                        style={{ width: 230 }}
                        maxLength={20}
                        onBlur={this.checkInterviewRound}
                        required
                        defaultValue={interArrangeInfo && interArrangeInfo.interviewRound && interArrangeInfo.interviewRound}
                      />
                      {
                        visiable && <div>
                          <DropDownSelect dataList={dataList} dropDownChecked={this.dropDownChecked} handleClickOnDocument={this.handleClickOnDocument} />
                        </div>
                      }
                    </Col>
                    <Col span={8}>
                      <FormItemPack 
                        form={form}
                        label="面试类型"
                        type="select"
                        getPopupConteiner={this.getPopContainer}
                        options={this.getInterviewOptions()}
                        name="interviewType"
                        defaultValue={interArrangeInfo && interArrangeInfo.interviewType && interArrangeInfo.interviewType}
                        allowClear
                      />
                    </Col>
                  </Row>
                </Form>
            </div>
        )
    }
}
export default Form.create()(FormItemDemo);