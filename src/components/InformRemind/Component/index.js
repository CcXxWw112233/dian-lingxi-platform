// 渲染内容的组件
import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Icon, Tooltip, Button } from 'antd'
import infoRemindStyle from '../index.less'

@connect(({informRemind = []}) => ({
    informRemind,
}))
export default class RenderContent extends Component {

    state = {
      is_show_other_select: false, // 是否显示其他选择框
      diff_remind_type: [
        { remind_time_type: 'm', timerVal: [5,10,15,20] },
        { remind_time_type: 'h', timerVal: [1,2,3,4,5,6,7,8,9] },
        { remind_time_type: 'd', timerVal: [1,2,3,4,5] },
      ], // 匹配的不同类型的选择
      diff_text_term: [
        { text_type: 'm', txtVal: '分钟' },
        { text_type: 'h', txtVal: '小时' },
        { text_type: 'd', txtVal: '天数' },
      ], // 匹配不同的字段
      select_field_type: '', // 选择 小时 分钟 天数的字段类型
    }

    // handleTriggerChg 改变选项的类型切换, 判断是否显示其他选项的内容
    handleTriggerChg(type) {
      console.log(type)
      if (type == 1) {
        this.setState({
          is_show_other_select: true
        })
      } else {
        this.setState({
          is_show_other_select: false
        })
      }
    }

    // handleFiledSelect 选择不同的字段 分钟，小时，天数
    handleFiledSelect(type) {
      console.log(type)
      this.setState({
        select_field_type: type,
      })
    }

    // 展示显示历史记录的样式
    renderHistory() {
        let temp;
        const { is_show_other_select, diff_remind_type, diff_text_term, select_field_type } = this.state;
        const { informRemind } = this.props;
        const { triggerList = [] } = informRemind

        return (
            <div className={infoRemindStyle.content}>
                    <div className={infoRemindStyle.select}>
                    <Select 
                        style={{ width: 122, height: 32, marginRight: 16 }}>
                        {
                          triggerList && triggerList.length && triggerList.map(item => {
                            return ( 
                              <Option onClick={() => { this.handleTriggerChg(item.remind_edit_type) }} value={item.type_code}>{item.type_name}</Option>
                            )      
                          })
                        }
                    </Select>
                    {
                      is_show_other_select && <Select style={{ width: 122, height: 32, marginRight: 16 }}>
                        {
                         diff_remind_type.filter(item => {
                          if (item.remind_time_type == select_field_type) {
                            item.timerVal.map(key => {
                              return (
                                <Option value={key}>{key}</Option>
                              )
                            })
                          }
                         })
                        }
                      </Select>
                    }
                    {
                      is_show_other_select && <Select style={{ width: 122, height: 32, marginRight: 16 }}>
                        {
                          diff_text_term.map(item => {
                            return (
                              <Option onClick={() => { this.handleFiledSelect(item.text_type) }} value={item.text_type}>{item.txtVal}</Option>
                            )
                          })
                        }
                      </Select>
                    }
                        {/* <Select
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
                        </Select> */}
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
        const { informRemind } = this.props;
        const { is_history } = informRemind;
        return is_history ? this.renderHistory() : this.renderAdd()
    }

    render() {
        return (
            <>
                { this.renderContent() }
            </>
        )
    }
}
