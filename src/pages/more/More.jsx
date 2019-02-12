/* eslint-disable */
import React, {Component} from 'react'
// import Header from "../../components/header.jsx"
// import CandProceBar from '../../components/CandProceBar.jsx';
// import FormItemPack from '../../components/FormItemPack';
import {Form, DatePicker, Table, Divider, Tag, Modal, Button, Radio } from 'antd';
const RadioGroup = Radio.Group;
// function onChange(pageNumber, pageSize) {
//   console.log('Page: ', pageNumber, pageSize);
// }

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a>{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address11',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'Tags',
  key: 'tags',
  dataIndex: 'tags',
  render: tags => (
    <span>
      {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
    </span>
  ),
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">Invite {record.name}</a>
      <Divider type="vertical" />
      <a href="javascript:;">Delete</a>
    </span>
  ),
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address11: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address11: 'London No. 1 Lake Park',
  tags: ['loser'],
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address11: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}];
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  const FormItem = Form.Item;
  const { MonthPicker, RangePicker } = DatePicker;
  const confirm = Modal.confirm;
class More extends Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }
    showConfirm = () => {
        confirm({
            title: 'Do you want to delete these items?',
            content: 'When clicked the OK button, this dialog will be closed after 1 second',
            onOk() {
              return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
              }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
          });
    }
    onChange = (e) => {
        console.log(e.target.value)
    }
    render(){
        const {form} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
          const rangeConfig = {
            rules: [{ type: 'array',}],
          };
        return (
            <div id="more" className="page">
                {/* <Header showBack>更多</Header> */}
                <RadioGroup name="radiogroup" defaultValue={1} onChange={this.onChange}>
                    <Radio value={1}>A</Radio>
                    <Radio value={2}>B</Radio>
                    <Radio value={3}>C</Radio>
                    <Radio value={4}>D</Radio>
                </RadioGroup>
                {/* <Pagination
                    showQuickJumper
                    showSizeChanger
                    defaultCurrent={1}
                    total={500}
                    onChange={onChange}
                    defaultPageSize={50}
                    pageSizeOptions={['50', '100']}
                /> */}
                <Table  columns={columns} dataSource={data} />
                <FormItem
                {...formItemLayout}
                label="RangePicker[showTime]"
                >
                {getFieldDecorator('range-time-picker', rangeConfig)(
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
                </FormItem>
                <Button onClick={this.showConfirm}>
                    确定
                </Button>
            </div>
        )
    }
}

export default Form.create()(More);





































