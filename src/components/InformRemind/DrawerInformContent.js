import React, { Component } from 'react'
import { Icon, Select, Dropdown, Button, Menu, Tooltip } from 'antd'
import infoRemindStyle from './index.less'

const { Option } = Select;

export default class DrawerInformContent extends Component {

    state = {
        is_history: true, // 是否是历史提醒 (也就是说显示无还是有)
        is_add: true, // 是否点击添加操作
        content_item: {
            content_1: { //由查询类型接口返回
                value: '',
                name: '',
                type: '0' // 0 1 2
            },
            content_4: { //自定义时间
                timestamp: 15222222222
            }
        },
        dataList: [ //由查询列表接口返回
            { 
              id: '',
              content: {
                content_1: {
                    value: '',
                    name: '',
                    type: '0' // 0 1 2
                  },
                  content_2: {
                    value: '',
                    name: '',
                  },
                  content_3: {
                    value: '',
                    name: '',
                  },
              },
            },
           
        ]
    }

    // 展示显示历史记录的样式
    renderHistory() {
        return (
            <div className={infoRemindStyle.content}>
                    <div className={infoRemindStyle.select}>
                        <Select
                            defaultValue="start"
                            style={{ width: 122, height: 32, marginRight: 16 }}
                        >
                            <Option value="start">任务开始前</Option>
                            <Option value="ing">任务开始时</Option>
                            <Option value="end">任务开始后</Option>
                        </Select>
                        <Select
                            defaultValue="num"
                            style={{ width: 122, height: 32, marginRight: 16 }}
                        >
                            <Option value="num">5</Option>
                            <Option value="num2">10</Option>
                            <Option value="num3">15</Option>
                            <Option value="num4">20</Option>
                            <Option value="num5">25</Option>
                        </Select>
                        <Select
                            defaultValue="time"
                            style={{ width: 122, height: 32, marginRight: 16 }}
                        >
                            <Option value="time">分钟</Option>
                            <Option value="num2">小时</Option>
                            <Option value="num3">天</Option>
                        </Select>
                    </div>
                    <div>
                        <Tooltip placement="top" title="删除" arrowPointAtCenter>
                            <Icon type="delete" className={infoRemindStyle.del}/>
                        </Tooltip>
                    </div>
            </div>
        )
    }

    // 展示添加的内容样式
    renderAdd() {
        return (
            <div className={infoRemindStyle.content}>
                <div className={infoRemindStyle.select}>
                    <Select
                        defaultValue="start"
                        style={{ width: 122, height: 32, marginRight: 16 }}
                    >
                        <Option value="start">任务开始前</Option>
                        <Option value="ing">任务开始时</Option>
                        <Option value="end">任务开始后</Option>
                    </Select>
                    <Select
                        defaultValue="num"
                        style={{ width: 122, height: 32, marginRight: 16 }}
                    >
                        <Option value="num">5</Option>
                        <Option value="num2">10</Option>
                        <Option value="num3">15</Option>
                        <Option value="num4">20</Option>
                        <Option value="num5">25</Option>
                    </Select>
                    <Select
                        defaultValue="time"
                        style={{ width: 122, height: 32, marginRight: 16 }}
                    >
                        <Option value="time">分钟</Option>
                        <Option value="num2">小时</Option>
                        <Option value="num3">天</Option>
                    </Select>
                </div>
                <Button type='primary'>确定</Button>
            </div>
        )
    }

    renderContent() {
        const { is_add, is_history } = this.state;
        return is_history ? this.renderHistory() : this.renderAdd()
    }

    // 点击添加提醒的事件
    handleAdd() {
        console.log(1111)
        const { is_add, is_history } = this.state;
        this.setState({
            is_add: !is_add,
            is_history: !is_history,
        })
    }

    render() {
        return (
            <>
                <div className={infoRemindStyle.add_header} onClick={ () => { this.handleAdd() } }>
                    <Icon className={infoRemindStyle.icon} type="plus-circle" />
                    <span className={infoRemindStyle.text}>添加提醒</span>
                </div>
                { this.renderContent() }
            </>
        )
    }
}
