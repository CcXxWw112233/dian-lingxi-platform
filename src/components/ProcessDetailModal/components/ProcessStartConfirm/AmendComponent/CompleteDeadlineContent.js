import React, { Component } from 'react'
import { InputNumber, Select, Radio, Button } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'

const Option = Select.Option;
export default class CompleteDeadlineContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      deadlineType: props.itemValue.deadline_type ? props.itemValue.deadline_type : '',
      deadlineValue: props.itemValue.deadline_value ? props.itemValue.deadline_value : '',
      deadlineTimeType: props.itemValue.deadline_time_type ? props.itemValue.deadline_time_type : ''
    }
  }

  // 完成期限
  deadlineValueChange = (value) => {
    if (value == '') {
      return
    }
    this.setState({
      deadlineValue: value
    })
    // this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: value }, 'deadline_value')
  }
  // 是否限制时间事件
  deadlineTypeChange = (e) => {
    const { itemValue } = this.props
    const { deadline_time_type, deadline_value } = itemValue
    this.setState({
      deadlineType: e.target.value
    })
    if (e.target.value == '2') {
      this.setState({
        deadlineTimeType: deadline_time_type ? deadline_time_type : 'day',
        deadlineValue: deadline_value ? deadline_value : '1'
      })
    }
    // this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: value }, 'deadline_type')
  }
  // 天、时、月事件
  deadlineTimeTypeValueChange = (value) => {
    this.setState({
      deadlineTimeType: value
    })
  }

  // 判断是否有变化
  whetherIsHasChange = () => {
    const { itemValue } = this.props
    const { deadline_time_type, deadline_value, deadline_type } = itemValue
    const { deadlineType, deadlineTimeType, deadlineValue } = this.state
    let flag = false
    if (deadline_type == '1' || deadline_type == '') {
      if (deadlineType != deadline_type) {
        flag = true
      } else {
        flag = false
      }
    } else if (deadline_type == '2') {
      if ((deadlineType != deadline_type) || (deadlineTimeType != deadline_time_type) || (deadlineValue != deadline_value)) {
        flag = true
      } else {
        flag = false
      }
    }
    return flag
  }

  handleConfirmChangeDeadlineValue = () => {
    const { deadlineType, deadlineTimeType, deadlineValue } = this.state
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('deadline_type',deadlineType)
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('deadline_value',deadlineValue)
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('deadline_time_type',deadlineTimeType)
    if (deadlineType == '1') {
      this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('deadline_value','1')
      this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('deadline_time_type','day')
    }
  }

  // 渲染完成期限
  renderCompletionDeadline = () => {
    // const { itemValue } = this.props
    // const { deadline_time_type, deadline_value, } = itemValue
    const { deadlineType, deadlineTimeType, deadlineValue } = this.state
    return (
      <div className={`${indexStyles.complet_deadline}`}>
        <InputNumber precision="0.1" min={1} max={deadlineTimeType == 'hour' ? 24 : deadlineTimeType == 'day' ? 30 : 12} value={deadlineValue} onChange={this.deadlineValueChange} onClick={(e) => e.stopPropagation()} className={indexStyles.select_number} />
        <Select className={indexStyles.select_day} value={deadlineTimeType} onChange={this.deadlineTimeTypeValueChange}>
          <Option value="hour">时</Option>
          <Option value="day">天</Option>
          <Option value="month">月</Option>
        </Select>
      </div>
    )
  }

    // 渲染完成期限内容
    renderDeadlineContent = () => {
      // const { itemValue } = this.props
      // const { deadline_type } = itemValue
      const { deadlineType, deadlineTimeType, deadlineValue } = this.state
      return (
        <div className={indexStyles.mini_content}>
          <div className={`${indexStyles.mini_top} ${globalStyles.global_vertical_scrollbar}`}>
            <Radio.Group style={{ display: 'flex', flexDirection: 'column' }} value={deadlineType} onChange={this.deadlineTypeChange}>
              <Radio style={{ marginBottom: '12px' }} value="1">不限制时间</Radio>
              <Radio style={{ marginBottom: '12px' }} value="2">限制时间</Radio>
            </Radio.Group>
            {
              deadlineType == '2' && (
                <div>
                  {this.renderCompletionDeadline()}
                </div>
              )
            }
          </div>
          <div className={indexStyles.mini_bottom}>
            <Button onClick={this.handleConfirmChangeDeadlineValue} disabled={this.whetherIsHasChange() ? false : true} type="primary">确定</Button>
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
