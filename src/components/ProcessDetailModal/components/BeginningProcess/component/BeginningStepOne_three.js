import React, { Component } from 'react'
import { Input, DatePicker } from 'antd'
import indexStyles from '../index.less'
import moment from 'moment/moment'

const { MonthPicker, RangePicker } = DatePicker

export default class BeginningStepOne_three extends Component {
  render() {
    const { itemValue } = this.props
    const { title, prompt_content, is_required } = itemValue
    return (
      <div className={indexStyles.text_form}>
        <p>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
        <div className={indexStyles.text_fillOut}>
          <DatePicker style={{width: '100%'}} placeholder={prompt_content}/>
        </div>
      </div>
    )
  }
}
