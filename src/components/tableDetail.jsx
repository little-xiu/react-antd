import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Table, Button, Row, Col, message, Form, Popover } from 'antd';
import utils from './utils';
import OverflowText from '../commonComponents/overflow';
import FormItemPack from './FormItemPack';
import CancelInterviewGroupModal from './CancelInterviewGroupModal';
import {ExportInterviewArrange, CheckInterviewDetail, CheckCancelInterview} from '../commonComponents/requestData.api';
const renderOverText = (text, width) => {
    return <OverflowText width={width} text={text} minus />
}
class CheckInterviewDetailComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            columns: [], // 表格表头
            tableList: [], // 表格内容
            selectedRows: [], // 表格勾选的数据
            pagination: {
                current: 1,
                pageSize: 10, // 10条/页
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
            },
            cancelInterviewGroupVisible: false,
            interviewRound: '',
            isGroup: '',
            interviewerName: '',
            inviteStatusArr: [], // 表头邀约状态默认的过滤值
            highestDegreeArr: [],
            sorterValue: false,
        };
        this.interviewPlaceTemId = ''; // 面试场次ID
        this.arrangeIdList = []; // 查询取消接口参数
        this.startTimeOrder = 'asc';
        this.condidate = '';
        this.highestDegreeDesc = [];
        this.inviteStatus = []; // 导出入参
        this.currentRows = [];
        this.inviteStatusArr = []; // 表头邀约状态默认的过滤值，用于赋与值来请求数据
    }
    renderTable = (rs, type) => {
        this.setState({tableLoading: false});
        const columns = this.getColumns();
        const {pagination} = this.state;
        if (rs.data) {
            const data = rs.data;
            const detail = data.detail && data.detail;
            const interviewer = data.interviewer && data.interviewer.map(item => {
                return item.interviewerName;
            });
            let interviewerStr = interviewer && interviewer.join('，');
            pagination.current = detail.pageNo;
            pagination.total = detail.totalCount;
            pagination.pageSize = detail.pageSize;
            let tableList = detail.list && detail.list;
            tableList = tableList.map(item => {
                let inviteStatus = '';
                switch (item.inviteStatus) {
                case 'M_JOIN': {
                    inviteStatus = '参加';
                    break;
                }
                case 'M_NOT_JOIN': {
                    inviteStatus = '不参加';
                    break;
                }
                default:
                    break;
                }
                return {
                    ...item,
                    inviteStatus,
                };
            });
            if (type === 'init') {
                this.setState({
                    isGroup: this.isGroup === 'N' ? '单人' : '小组',
                    interviewRound: data.interviewRound,
                    interviewerName: interviewerStr ? interviewerStr : '-',
                    columns,
                    tableList,
                    pagination,
                });
            } else {
                this.setState({
                    columns,
                    tableList,
                    pagination,
                });
            }
        }
    }
    componentWillMount = () => {
        const urlParams = utils.getUrlParams(this.props.location.search);
        this.interviewPlaceTemId = urlParams && urlParams.interviewPlaceTemId;
        this.isGroup = urlParams && urlParams.isGroup;
        let inviteStatusArr = urlParams && urlParams.inviteStatusArr;
        if (inviteStatusArr) {
            inviteStatusArr = inviteStatusArr.split(); // 'ds'=> ['ds']
            this.setState({inviteStatusArr: inviteStatusArr}); // 表格展示邀约状态的的默认值
            this.inviteStatusArr = inviteStatusArr; // 请求数据用的传参
        }
        this.initTable();
    }
    requestInterviewDetail = async (params, type) => {
        this.setState({tableLoading: true});
        const rs = await CheckInterviewDetail(params);
        if (rs && rs.responseCode === 10001) {
            this.renderTable(rs, type);
        } else {
            this.setState({tableLoading: false});
        }
    }
    initTable = () => {
        if (this.inviteStatusArr.length > 0) {
            this.requestInterviewDetail({
                interviewPlaceTemId: this.interviewPlaceTemId,
                isGroup: this.isGroup,
                inviteStatusArr: this.inviteStatusArr,
            }, 'init');
        } else {
            this.requestInterviewDetail({
                interviewPlaceTemId: this.interviewPlaceTemId,
                isGroup: this.isGroup,
            }, 'init');
        }
    }
    // 表格的筛选 排序 分页操作
    handleTableChange = (...rest) => {
        const pagination = rest[0];
        const filter = rest[1]; // 筛选
        const sorter = rest[2]; // 排序
        let paramsObj = {};
        this.setState({
            inviteStatusArr: filter.inviteStatus && filter.inviteStatus,
            highestDegreeArr: filter.highestDegreeDesc && filter.highestDegreeDesc, //以便搜索时重置筛选项
            sorterValue: sorter.order && sorter.order,
        });
        if (this.condidate) {
            paramsObj = {
                ...paramsObj,
                keyword: this.condidate,
            }
        }
        if (sorter.order) {
            paramsObj = {
                ...paramsObj,
                orderFields: [{
                    fieldName: sorter.field,
                    order: sorter.order,
                }],
            };
        }
        if (!sorter.order || sorter.order === 'ascend') {
            this.startTimeOrder = 'asc';
        } else {
            this.startTimeOrder = 'desc'; // 导出入参转换
        }
        if (filter.inviteStatus && filter.inviteStatus.length !== 0) {
            paramsObj = {
                ...paramsObj,
                inviteStatusArr: filter.inviteStatus,
            };
            this.inviteStatus = filter.inviteStatus;
        } else {
            this.inviteStatus = [];
        }
        if (filter.highestDegreeDesc && filter.highestDegreeDesc.length !== 0) {
            paramsObj = {
                ...paramsObj,
                degrees: filter.highestDegreeDesc,
            };
            this.highestDegreeDesc = filter.highestDegreeDesc.map(item => {
                let highestDegreeDescStr = '';
                switch (item) {
                    case '本科': {
                        highestDegreeDescStr = '0/606';
                        break;
                    }
                    default:
                }
                return highestDegreeDescStr;
            });
        } else {
            this.highestDegreeDesc = [];
        }
        this.requestInterviewDetail({
            interviewPlaceTemId: this.interviewPlaceTemId,
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            isGroup: this.isGroup,
            ...paramsObj,
        });
    }
    getColumns = () => {
        return [
            {
                key: 'name', // 值跟dataSource的赋值的key相同
                dataIndex: 'name',
                width: 70,
                title: '候选人',
                render: text => renderOverText(text, 138),
            },
            {
                key: 'highestDegreeDesc',
                dataIndex: 'highestDegreeDesc',
                render: text => renderOverText(text, 137),
                filteredValue: this.state.highestDegreeArr, // 默认筛选的值
                width: 100,
                title: '最高学历',
                filterMultiple: true, // 可多选筛选
                filterIcon: <img src={require('1.png')} />,
                filters: [{
                    text: '高中', value: '高中',
                },{
                    text: '大专', value: '大专',
                },],
            },
            {
                key: 'startTime',
                dataIndex: 'startTime',
                width: 140,
                title: '开始时间',
                sorter: true,
                sortOrder: this.state.sorterValue, // 布尔值为默认是否排序，ascend为升序，descend为降序
                render: val => utils.formatDateWithoutSecond(val),
            },
            {
                key: 'inviteStatus',
                dataIndex: 'inviteStatus',
                title: '邀约状态',
                width: 120,
                filterMultiple: true,
                filters: [{
                    text: '参加', value: 'M_JOIN',
                },{
                    text: '不参加', value: 'M_NOT_JOIN',
                },],
                filteredValue: this.state.inviteStatusArr,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.inviteStatus === '不参加' ?
                                (
                                    (record.reason && record.reason !== '-') ?
                                    <Popover content={<span style={{fontSize: '12px'}}>{record.reason}</span>}>
                                        <a>{text}</a>
                                    </Popover> :
                                    text
                                ) :
                                text
                            }
                        </div>
                    );
                },
            },
        ];
    }
    getSelectedRow = (selectedRows) => {
        this.currentRows = selectedRows;
        this.setState({
            selectedRows,
        });
    }
    onClose = () => {
        this.setState({
            cancelInterviewGroupVisible: false,
        });
    }
    // 取消面试点 确定后，刷新列表
    refreshInterviewList = () => {
        this.setState({
            cancelInterviewGroupVisible: false,
        });
        this.initTable();
    }
    // 点击  取消面试，查询数据列表
    cancelInterviewByGroup = async () => {
        if (!this.checkSelectRows(this.currentRows)) {
            message.warn('请选择数据');
            return;
        }
        const rs = await CheckCancelInterview({ arrangeIdList: this.arrangeIdList });
        if (rs && rs.responseCode === 10001) {
            if (rs.data) {
                this.setState({
                    selectedRows: rs.data,
                    cancelInterviewGroupVisible: true,
                });
            }
        }
    }
    checkSelectRows = (selectedRows) => {
        if (!selectedRows || selectedRows.length === 0) {
            return false;
        }
        this.arrangeIdList = selectedRows.map(item => {
            return item.arrangeId;
        });
        return true;
    }
    removeCurrentRows = () => {
        this.currentRows = [];
    }
    handleExport = (interviewRound) => {
        let downUrl = `${ExportInterviewArrange}${this.state.interviewRound}&startTimeOrder=${this.startTimeOrder}`;
        if (this.condidate) {
            downUrl += `&condidate=${this.condidate}`;
        }
        if (this.highestDegreeDesc.length > 0) {
            let str = '';
            this.highestDegreeDesc.forEach(item => {
                str += `&highestDegrees=${item}`;
            });
            downUrl += str;
        }
        if (this.inviteStatus.length > 0) {
            let str = '';
            this.inviteStatus.forEach(item => {
                str += `&inviteStatus=${item}`;
            });
            downUrl += str;
        }
        window.open(downUrl);
    }
    handleSearch = (e) => {
        e.preventDefault();
        // 搜索时，表头点筛选 排序重置为空
        this.setState({
            inviteStatusArr: [],
            highestDegreeArr: [],
            sorterValue: false,
        });
        const param = this.props.form.getFieldsValue();
        let {keyword} = param;
        let paramsObj = {};
        if (keyword === undefined) {
            keyword = '';
        }
        if (keyword.trim() !== '') {
            paramsObj = {
                keyword: keyword.trim(),
            };
            this.condidate = keyword.trim();
            this.requestInterviewDetail({
                interviewPlaceTemId: this.interviewPlaceTemId,
                isGroup: this.isGroup,
                ...paramsObj,
            });
        } else {
            this.condidate = '';
            this.requestInterviewDetail({
                interviewPlaceTemId: this.interviewPlaceTemId,
                isGroup: this.isGroup,
            });
        }
    }
    render() {
        const {
            columns,
            tableList,
            pagination,
            interviewRound,
            isGroup,
            interviewerName,
        } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.getSelectedRow(selectedRows);
            },
        };
        const {form} = this.props;
        return (
            <div>
                <Row>
                    <Col span={21}>
                        <span>面试场次：</span>
                        <span>{interviewRound}</span>
                    </Col>
                    <Col span={3}>
                        {
                            isGroup === '单人' ? 
                            <Link to={{ pathname: '/pop/single', search: `?id=${this.interviewPlaceTemId}` }}>调整本场安排</Link> :
                            <Link to={{ pathname: '/pop/group', search: `?id=${this.interviewPlaceTemId}` }}>调整本场安排</Link>
                        }
                    </Col>
                </Row>
                <div>
                <FormItemPack 
                    name="keyword"
                    form={form}
                    label="简历关键词"
                    type="input"
                    placeholder="search"
                    style={{width: 300}}
                    labelol={{span: 2}}
                    wrapperCol={{span: 22}}
                />
                    <img onClick={this.handleSearch} src={require('1.png')} />
                </div>
                <div>
                    <Button type="ghost" onClick={this.cancelInterviewByGroup}>取消面试</Button>
                    <span onClick={this.handleExport}>导出</span>
                </div>
                <Table 
                    columns={columns}
                    rowSelection={rowSelection}
                    loading={this.state.tableLoading}
                    onChange={this.handleTableChange}
                    dataSource={tableList}
                    pagination={pagination}
                    rowKey={record => record.id}
                />
                <CancelInterviewGroupModal 
                    visible={this.state.cancelInterviewGroupVisible}
                    removeCurrentRows={this.removeCurrentRows}
                    onOk={this.refreshInterviewList}
                    onClose={this.onClose}
                    selectedRows={this.state.selectedRows}
                />
            </div>
        )
    }
}

export default Form.create()(CheckInterviewDetailComp);