import React, {Component} from 'react';
import {Form, Row, Col} from 'antd';
import FormItemPack from '../components/FormItemPack';
import DropDownSelect from './DropDownSelect';
import debounce from 'lodash/debounce';
import {getTagsByKeyWord} from './interview.api';

class InterviewArrangeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            visiable: false,
        };
        this.handleChange = debounce(this.handleChange, 600);//减少函数调用次数
    }
    getPopContainer = () => {
        return document.getElementById('interview_div_info');
    }
    //模糊查询
    handleChange = async () => {
        const value = this.props.form.getFieldValue('interviewCount');
        const rs = await getTagsByKeyWord({tagName: value});
        if (rs && rs.responseCode === 10001) {
            let reg = new RegExp(`^${value}`, 'gi');
            rs.data.forEach(item => {
                item.tagName_1 = item.tagName.replace(reg, match => {
                    return `<label style="color: red">${match}</label>`;
                });
             });
             this.setState({dataList: rs.data, visiable: true});
        }
    }
    //选中下拉框中的值
    dropDownChecked = (item) => {
        this.props.form.setFields({'interviewCount': {value: item.tagName}});
        this.setState({visiable: false});
    }
    //点击document关闭下拉框
    handleClickOnDocument = () => {
        this.setState({visiable: false});
    }
    render () {
        const { form, interArrangeInfo, disabled, } = this.props;
        const { getFieldDecorator } = form;
        const { dataList, visiable } = this.state;
        return (
          <div id="interview_div_info">
            <Form autoComplete="off">
              <div>
                <Row type="flex">
                  <Col className="drop_down_parent" span={8}>
                    <FormItemPack 
                      form={form}
                      disabled={disabled}
                      label="面试场次"
                      placeholder="请输入"
                      type="input"
                      name="interviewCount"
                      style={{width: 230}}
                      maxLength={20}
                      onChange={this.handleChange}
                      required
                      defaultValue={interArrangeInfo && interArrangeInfo.interviewCount && }
                    />
                    {
                      visiable && <div className="drop_down_child">
                        <DropDownSelect dataList={dataList} dropDownChecked={this.dropDownChecked} handleClickOnDocument={this.handleClickOnDocument} />
                      </div>
                    }
                  </Col>
                  <Col span={8} className="managers">
                    <FormItemPack 
                      form={form}
                      span={8}
                      label="面试类型"
                      type="select"
                      placeholder="请选择"
                      getPopupContainer={this.getPopContainer}
                      options={[{
                        value: '123',
                        label: '面试类型1',
                      }]}
                      name="interviewType"
                      style={{width: 230}}
                      defaultValue={interArrangeInfo && interArrangeInfo.type && interArrangeInfo.type}
                      allowClear
                    />
                  </Col>
                </Row>
                <Row>
                  <FormItemPack label={<span>联系人</span>} span={8} required>
                    <FormItemPack 
                      disabled={disabled}
                      labelCol={{span: 0}}
                      wrapperCol={{span: 20}}
                      span={8}
                      form={form}
                      type="input"
                      name="concatName"
                      placeholder="姓名"
                      style={{width: 70}}
                    />
                    <FormItemPack 
                      disabled={disabled}
                      labelCol={{span: 0}}
                      wrapperCol={{span: 20}}
                      span={8}
                      form={form}
                      type="input"
                      name="concatTell"
                      placeholder="手机号"
                      style={{width: 154, marginLeft: '-10px'}}
                    />
                  </FormItemPack>
                  <FormItemPack 
                    disabled={disabled}
                    form={form}
                    span={8}
                    label="面试地点"
                    type="input"
                    name="interviewPlace"
                    placeholder="请输入详细地点"
                    style={{width: 580}}
                    maxLength={50}
                  />
                </Row>
              </div>
            </Form>
          </div>
        )
    }
}