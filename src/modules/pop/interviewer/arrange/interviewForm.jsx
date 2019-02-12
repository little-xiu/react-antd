import React, {Component} from 'react';
import {Form, Row, Col, Input, Icon} from 'antd';
import ReactDom from 'react-dom';

const FormItem = Form.Item;
class InterviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {
    if (this.props.changePopContainer) {
      this.wrapperDom = ReactDom.findDOMNode(this.wrapperRef);
    }
  }
  render() {
    const {
      getFieldDecorator,
    } = this.props.form;
    const formItem = (
      <FormItem
        labelCol={{span: 3, offset: 12}}
        ref={(ref) => { this.wrapperRef = ref; }}>
        {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
        )}
      </FormItem>
    );
    if (true) {
      return formItem;
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit} autoComplete="off">
          <Row>
            <Col span={8}>
              {formItem}
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default InterviewForm;