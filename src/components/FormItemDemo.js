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
            unit: 'k',
            isRequired: false,
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
    getSalaryTypeChange = (e) => {
        if (e.label === '年薪') {
            this.setState({
                unit: 'w',
                isOwn: false,
                isRequired: false,              
            })
        }
        if (e.label === '月薪') {
            this.setState({
                unit: 'k',
                isOwn: false,
                isRequired: false,             
            })
        }
        if (e.label === '面议') {
            this.setState({
                isOwn: false,
                isRequired: false,              
            })
        }
    }// 年薪校验
    handleSalaryMin = (rule, value, callback) => {
        if (value === '') {
            callback();
            return;
        }
        const {form} = this.props;
        let salaryMax = form.getFieldValue('salaryMax');
        if (salaryMax && value > salaryMax) {
            callback('最小值不能大于最大值');
            return;
        }
        this.props.form.setFields({ salaryMax: {errors: null, value: salaryMax} });
        callback();
    }
    // 年薪最大薪资判断
    handleSalaryMax = (val) => {
        let salaryMin = this.props.form.getFieldValue('salaryMin');
        // 输入其中一个就是必填
        if (val && !salaryMin || !val && salaryMin) {
            this.setState({isRequired: true});
        }
        if (!val && !salaryMin) {
            this.setState({isRequired: false});
        }
    }
    // 年薪校验
    checkSalaryMax = (rule, value, callback) => {
        this.props.form.validateFields(['salaryMin'], {force: true});
        callback();
    }
    // 为空时自动填充默认值
    handleBlurInput = (type) => {
        const value = this.props.form.getFieldValue(type); // 获取值
        if (type === 'timeDuration' && (value === '' || value === undefined)) {
            this.props.form.setFields({ [type]: { value: 30 } });   // 设置值
        }
    }
    render() {
        const {form, disabled, interArrangeInfo} = this.props;
        const {getFieldDecorator} = form;
        const {dataList, visiable, isRequired} = this.state;
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
                    <Col span={8}>
                        <FormItemPack 
                            type="textarea"
                            span={24}
                            labelCol={{span: 2}}
                            wrapperCol={{span: 22}}
                            label="工作职责"
                            form={form}
                            name="duty"
                            placeholder="请输入"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    message: '不能小于20字，且不能超过500字',
                                    whitespace: true,
                                    min: 20,
                                    max: 500
                                },
                            ]}
                            required
                        />
                    </Col>
                  </Row>
                  <Row type="flex">
                        <FormItemPack label={<span>薪资</span>}>
                            <FormItemPack
                                type="select"
                                span={8}
                                form={form}
                                onChange={this.getSalaryTypeChange}
                                name="salaryTypeDesc"
                                options={[
                                    {label: '面议', key: 'face'},
                                    {label: '月薪', key: 'month'},
                                    {label: '年薪', key: 'year'},
                                ]}
                                defaultValue={{
                                    key: 'face',
                                    label: '面议',
                                }}
                                labelInValue
                                labelCol={{span: 0}}
                                wrapperCol={{span: 20}}
                            />
                            {
                                this.state.unit === 'w' && !this.state.isOwn && <Col>
                                    <Col span={8}>
                                        <FormItemPack 
                                            form={form}
                                            span={20}
                                            type="number"
                                            max={999}
                                            min={1}
                                            required={isRequired}
                                            onChange={this.handleSalaryMin}
                                            rules={[{ validator: this.checkSalaryMin }]}
                                            name="salaryMin"
                                            precision={0.1} // 精度 小数显示不了
                                        />
                                        <span>{this.state.unit} -</span>
                                    </Col>                                   
                                    <Col span={8}>
                                        <FormItemPack 
                                            form={form}
                                            span={20}
                                            max={999}
                                            min={1}
                                            required={isRequired}
                                            onChange={this.handleSalaryMax}
                                            rules={[{ validator: this.checkSalaryMax }]}
                                            type="number"
                                            name="salaryMax"
                                            precision={0.1}
                                        />
                                        <span>{this.state.unit}</span>
                                    </Col>
                                </Col>
                            }
                        </FormItemPack>
                  </Row>
                  <FormItemPack 
                    form={form}
                    type="number"
                    min={0}
                    max={999}
                    onBlur={() => { this.handleBlurInput('timeDuration') }}
                    defaultValue={30}
                    name="timeDuration"
                  />
                </Form>
            </div>
        )
    }
}
export default Form.create()(FormItemDemo);