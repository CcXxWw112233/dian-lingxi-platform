import React, { Component } from 'react'
import { InputNumber, Select, Radio, Button } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'

const Option = Select.Option;
export default class CompleteDeadlineContent extends Component {

  // 完成期限
  deadlineValueChange = (value) => {
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: value }, 'deadline_value')
  }

  // 渲染完成期限
  renderCompletionDeadline = () => {
    const { itemValue } = this.props
    const { deadline_time_type, deadline_value, } = itemValue
    return (
      <div className={`${indexStyles.complet_deadline}`}>
        <InputNumber precision="0.1" min={1} max={deadline_time_type == 'hour' ? 24 : deadline_time_type == 'day' ? 30 : 12} value={deadline_value} onChange={this.deadlineValueChange} onClick={(e) => e.stopPropagation()} className={indexStyles.select_number} />
        <Select className={indexStyles.select_day} value={deadline_time_type} onChange={this.deadlineTimeTypeValueChange}>
          <Option value="hour">时</Option>
          <Option value="day">天</Option>
          <Option value="month">月</Option>
        </Select>
      </div>
    )
  }

    // 渲染完成期限内容
    renderDeadlineContent = () => {
      const { itemValue } = this.props
      const { deadline_type } = itemValue
      return (
        <div className={indexStyles.mini_content}>
          <div className={`${indexStyles.mini_top} ${globalStyles.global_vertical_scrollbar}`}>
            <Radio.Group style={{ display: 'flex', flexDirection: 'column' }} value={deadline_type} onChange={this.deadlineTypeChange}>
              <Radio style={{ marginBottom: '12px' }} value="1">不限制时间</Radio>
              <Radio style={{ marginBottom: '12px' }} value="2">限制时间</Radio>
            </Radio.Group>
            {
              deadline_type == '2' && (
                <div>
                  {this.renderCompletionDeadline()}
                </div>
              )
            }
          </div>
          <div className={indexStyles.mini_bottom}>
            <Button type="primary">确定</Button>
          </div>
        </div>
      )
    }

  render() {
    return (
      <span>
        {this.renderDeadlineContent()}
      </span>
    )
  }
}
