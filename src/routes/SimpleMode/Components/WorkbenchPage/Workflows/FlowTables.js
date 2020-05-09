import React, { Component } from 'react'
import { Table } from 'antd';
import { timestampToTimeNormal } from '../../../../../utils/util';
import { getOrgNameWithOrgIdFilter, setBoardIdStorage } from '../../../../../utils/businessFunction';
import { connect } from 'dva';
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '@/components/avatarList/executorAvatarList'

@connect(mapStateToProps)
export default class FlowTables extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    componentDidMount() {
        this.setTabledata(this.props)
    }
    componentWillReceiveProps(nextProps) {
        this.setTabledata(nextProps)
    }
    setTabledata = (props) => { //设置列和数据源
        const { list_source = [], list_type } = props
        const dataSource = list_source.map(item => {
            const { id, total_node_name, total_node_num, completed_node_num, plan_start_time, last_complete_time, update_time, create_time, creator = {}, curr_executors = [] } = item
            const new_item = { ...item, key: id }
            let key_time
            let key_state
            if ('1' == list_type) {
                key_time = last_complete_time
                key_state = `${total_node_name}（${completed_node_num}/${total_node_num}）`
                if (!total_node_name || !completed_node_num || !total_node_num) {
                    key_state = ''
                }
            } else if ('2' == list_type) {
                key_time = update_time
                key_state = '已中止'
            } else if ('3' == list_type) {
                key_time = update_time //代替尚未定义
                key_state = '已完成'
            } else if ('0' == list_type) {
                key_time = plan_start_time
                key_state = '未开始'
            } else {

            }
            // new_item.originator = '吴彦祖'
            new_item.time = key_time
            new_item.state = key_state
            new_item.originator = creator.name
            return new_item
        })
        const columns = [
            {
                title: '流程名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                width: 164,
                render: (text, item) => {
                    return this.renderKeyName(item)
                }
            },
            {
                title: this.renderTitle(list_type).state_title,
                dataIndex: 'state',
                key: 'state',
                ellipsis: true,
                width: 164,
                render: (item) => {
                    return this.renderKeyState(item)
                }
            },
            {
                title: this.renderTitle(list_type).time_title,
                dataIndex: 'time',
                key: 'time',
                ellipsis: true,
                width: 164,
                render: (item, value) => {
                    return this.renderKeyTime(item, value)
                }
            },
            {
                title: list_type == '1' ? '步骤执行人' : '发起人',
                dataIndex: 'originator',
                key: 'originator',
                ellipsis: true,
                width: 164,
                render: (item, value) => {
                    return this.renderKeyOriginator(item,value)
                }
            },
        ];
        this.setState({
            columns,
            dataSource
        })
    }
    renderTitle = (list_type) => {
        let time_title = '步骤完成期限'
        let state_title = '流程状态'
        switch (list_type) {
            case '1':
                time_title = '步骤完成期限'
                state_title = '当前步骤'
                break
            case '2':
                time_title = '流程中止时间'
                break
            case '3':
                time_title = '流程完成时间'
                break
            case '0':
                time_title = '流程开始时间'
                break
            default: break
        }
        return {
            time_title,
            state_title
        }
    }
    renderKeyName = (item) => {
        let name_dec = item
        const { name, board_name, org_id } = item
        const { currentUserOrganizes = [], simplemodeCurrentProject = {} } = this.props
        const { board_id } = simplemodeCurrentProject
        const select_org_id = localStorage.getItem('OrganizationId')
        const org_dec = (select_org_id == '0' || !select_org_id) ? `(${getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)})` : ''
        const board_dec = (board_id == '0' || !board_id) ? `#${board_name}` : ''
        return (
            <div>
                <p style={{ marginBottom: 0 }}>
                    <span className={`${globalStyles.authTheme}`} style={{ fontSize: 16, color: '#40A9FF', marginRight: 4 }}>&#xe682;</span>
                    <span>{name}</span>
                </p>
                {
                    (board_id == '0' || !board_id) && (
                        <p style={{ color: 'rgba(0,0,0,0.45)', marginBottom: 4, marginLeft: 20 }}>
                            {board_dec}
                            {org_dec}
                        </p>
                    )
                }
            </div>
        )
    }
    renderKeyState = (item) => {
        const { list_type } = this.props
        let state_dec = ''
        switch (list_type) {
            case '1':
                state_dec = (
                    <span style={{ color: '#1890FF' }}>{item}</span>
                )
                break
            case '2':
                state_dec = (
                    <span style={{ color: 'rgba(0,0,0,0.45)' }}>{item}</span>
                )
                break
            case '3':
                state_dec = (
                    <span style={{ color: '#1890FF' }}>{item}</span>
                )
                break
            case '0':
                state_dec = (
                    <span style={{ color: '#1890FF' }}>{item}</span>
                )
                break
            default: break
        }
        return state_dec
    }
    renderKeyTime = (item, value) => {
        const { list_type } = this.props
        let time_dec = ''
        switch (list_type) {
            case '1':
                time_dec = (
                    <span style={{ color: this.setDoingTimeDec(value) != '已逾期' ? '#1890FF' : '#F5222D' }}>{this.setDoingTimeDec(value)}</span>
                )
                break
            case '2':
                time_dec = (
                    <span style={{ color: 'rgba(0,0,0,0.45)' }}>{timestampToTimeNormal(item, '/', true)}</span>
                )
                break
            case '3':
                time_dec = (
                    <span style={{ color: 'rgba(0,0,0,0.45)' }}>{timestampToTimeNormal(item, '/', true)}</span>
                )
                break
            case '0':
                time_dec = (
                    <span style={{ color: '#1890FF' }}>{timestampToTimeNormal(item, '/', true)}</span>
                )
                break
            default: break
        }
        return time_dec
    }
    renderKeyOriginator = (item, value) => {
        const { curr_executors = [], creator = {} } = value
        const { list_type } = this.props
        let  executor_dec = <div></div>
        switch (list_type) {
            case '1':
                executor_dec = 
                <div>
                    <AvatarList users={curr_executors} size={'small'} />
                </div>
                break;
            case '2':
            case '3':
            case '0':
                executor_dec = <div>{creator && creator.name || ''}</div>
                break;
            default:
                break;
        }
        return executor_dec
    }
    // 设置进行中的期限描述
    setDoingTimeDec = (value) => {
        const { deadline_type } = value
        if (deadline_type == '1') {
            return '未限制'
        } else if (deadline_type == '2') {
            return this.renderRestrictionsTime(value)
        } else {
            return ''
        }
    }
    // 获取当前月份的天数
    getDaysOfEveryMonth = () => {//返回天数
        var baseMonthsDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];//各月天数
        var thisYear = new Date().getFullYear();//今年
        var thisMonth = new Date().getMonth();//今月
        var thisMonthDays = [];//这个月有多少天,用于返回echarts用
        //判断是闰年吗？闰年2月29天
        const isLeapYear = (fullYear) => {
            return (fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0));
        }

        const getThisMonthDays = (days) => {//传天数，返天数数组
            var arr = [];
            for (var i = 1; i <= days; i++) {
                arr.push(i);
            }
            return arr;
        }

        if (isLeapYear(thisYear) && thisMonth == 1) {//闰年2月29天
            thisMonthDays = getThisMonthDays(baseMonthsDay[thisMonth] + 1);
        } else {
            thisMonthDays = getThisMonthDays(baseMonthsDay[thisMonth]);
        }
        return thisMonthDays.length;
    }
    // 显示不同类型的时间 时、天、月
    renderRestrictionsTime = (itemValue) => {
        const { deadline_time_type, deadline_value, deadline_type, last_complete_time } = itemValue
        let total_time = '' //总时间
        let surplus_time = '' //剩余时间戳
        let now = parseInt(new Date().getTime() / 1000)
        let time_ceil = 60 * 60 //单位(3600秒)
        const take_time = now - Number(last_complete_time) //花费时间
        switch (deadline_time_type) {
            case 'hour': // 天
                total_time = deadline_value * time_ceil
                break;
            case 'day':
                total_time = deadline_value * 24 * time_ceil
                break
            case 'month':
                total_time = 30 * deadline_value * 24 * time_ceil
                break
            default:
                break;
        }
        surplus_time = total_time - take_time //86400

        let description = ''
        let month_day_total = this.getDaysOfEveryMonth() //当前月份总天数

        let month = ''
        let day = ''
        let hour = ''
        let min = ''

        if (surplus_time <= 0) {
            description = '已逾期'
        } else {
            if (surplus_time <= time_ceil) { //
                description = `剩余${parseInt(surplus_time / 60)}分钟`
                // 分
            } else if (surplus_time > time_ceil && surplus_time <= 24 * time_ceil) {
                hour = parseInt(surplus_time / time_ceil)
                min = parseInt((surplus_time % time_ceil) / 60)
                if (min < 1) {
                    description = `剩余${hour}小时`
                } else {
                    description = `剩余${hour}小时${min}分钟`
                }
                // 时/分
            } else if (surplus_time > (24 * time_ceil) && surplus_time <= (month_day_total * 24 * time_ceil)) {
                day = parseInt(surplus_time / (24 * time_ceil))
                hour = parseInt(((surplus_time % (24 * time_ceil))) / time_ceil)
                if (hour < 1) {
                    description = `剩余${day}天`
                } else {
                    description = `剩余${day}天${hour}小时`
                }
                // 天/时
            } else if (surplus_time > month_day_total * 24 * time_ceil) {
                month = parseInt(surplus_time / (month_day_total * 24 * time_ceil))
                hour = parseInt((surplus_time % (month_day_total * 24 * time_ceil) / (24 * time_ceil)))
                description = `剩余${month}月${hour}小时`
            } else {

            }
        }

        return description
    }

    // 流程实例的点击事件
    handleProcessInfo = (id) => {
        const { dispatch } = this.props
        dispatch({
            type: 'publicProcessDetailModal/getProcessInfo',
            payload: {
                id,
                calback: () => {
                    dispatch({
                        type: 'publicProcessDetailModal/updateDatas',
                        payload: {
                            processPageFlagStep: '4',
                            process_detail_modal_visible: true,
                        }
                    })
                }
            }
        })
    }
    tableRowClick = (record) => {
        const { id, board_id, org_id } = record
        const { dispatch, simplemodeCurrentProject = {} } = this.props
        setBoardIdStorage(board_id, org_id)
        if (!simplemodeCurrentProject.board_id || simplemodeCurrentProject.board_id == '0') {
            dispatch({
                type: 'projectDetail/projectDetailInfo',
                payload: {
                    id: board_id
                }
            }).then(res => {
                this.handleProcessInfo(id)
            })
        } else {
            this.handleProcessInfo(id)
        }
    }
    render() {
        const { dataSource, columns } = this.state
        const { workbenchBoxContent_height = 700 } = this.props
        const scroll_height = workbenchBoxContent_height - 200
        return (
            <div>
                <Table
                    onRow={record => {
                        return {
                            onClick: e => this.tableRowClick(record), // 点击行
                        };
                    }}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: scroll_height, }} />
            </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    simplemode: {
        simplemodeCurrentProject = {}
    },
    technological: {
        datas: {
            currentUserOrganizes = [],
        }
    }
}) {
    return {
        simplemodeCurrentProject,
        currentUserOrganizes
    }
}
