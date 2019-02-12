/* eslint-disable */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import { updateAudition } from './interviewArrange.api';
import { Form, message } from 'antd';
import InterviewForm from './interviewForm.jsx';

class InterviewArrange extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  handleBookRoomOk = (data) => {
    const {form} = this.props;
    form.setFieldsValue({
      startHour: `${data.startHour}`
    });
    const dataRoomList = data.roomList;
    dataRoomList.forEach((item, index) => {
      const formObj = {};
      formObj[`roomName_${index} + 1`] = '';
      formObj[`playerBy_${index} + 1`] = [];
      form.setFieldsValue(formObj);
      formObj[`roomName_${index} + 1`] = data.roomName;
      formObj[`playerBy_${index} + 1`] = data.roomAddress;
      form.setFieldsValue(formObj);
    })
  }
  sendAuditionToServer = async (params) => {
    this.setState({loading: true});
    if (params.isAudition) {
      // const rs = await updateAudition(params);
      const rs = {
        responseCode: 10001
      }
      this.setState({loading: false});
      if (rs && rs.responseCode === 10001) {
        message.success('面试修改成功');
        this.props.history.goBack();
      }
    }
  }
  handleCancel = () => {
    this.props.history.goBack();
  }
  render () {
    // 经 Form.create() 包装过的组件会自带 this.props.form 属性
    const {form} = this.props;
    return (
      <div>
        <InterviewForm 
          form={form}
        />
      </div>
    )
  }
}
// 此组件内使用this.props.isAssistantRole
const mapStateToProps = state => ({
  isAssistantRole: state.global.isAssistantRole,
});
// 此组件内使用 this.props.actions.fetch();
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(InterviewArrange));