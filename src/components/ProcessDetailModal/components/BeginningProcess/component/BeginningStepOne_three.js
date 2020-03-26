import React, { Component } from 'react'
import { Input, DatePicker } from 'antd'
import indexStyles from '../index.less'
import moment from 'moment'
import { timeToTimestamp } from '../../../../../utils/util'
import { connect } from 'dva'

const { MonthPicker, RangePicker } = DatePicker

@connect(mapStateToProps)
export default class BeginningStepOne_three extends Component {

  updateEdit = (data, key) => {
    const { itemKey, parentKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    forms[itemKey][key] = data.value
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('forms', forms)
  }

    // 预约开始时间
    startDatePickerChange = (timeString) => {
      this.updateEdit({value: timeToTimestamp(timeString)}, 'value')
    }

  renderDiffDateRangeAndDatePrecision = () => {
    const { itemValue } = this.props
    const { date_range, date_precision, prompt_content } = itemValue
    let container = (<div></div>)
    switch (date_range) {
      case '1':// 表示单个日期
        if (date_precision == '1') { // 表示仅日期
          container = <DatePicker onChange={this.startDatePickerChange.bind(this)} format={'YYYY/MM/DD'} style={{ width: '100%' }} placeholder={prompt_content} />
        } else if (date_precision == '2') { // 表示日期 + 时间
          container = (
            <DatePicker
              onOk={this.startDatePickerChange.bind(this)}
              format="YYYY-MM-DD HH:mm"
              showTime={{ format: 'HH:mm' }}
              style={{ width: '100%' }} placeholder={prompt_content} />
          )
        }
        break;
      case '2': // 表示日期 + 时间
        if (date_precision == '1') { // 表示仅日期
          container = <RangePicker
            format="YYYY-MM-DD"
            // placeholder={prompt_content}
            style={{ width: '100%' }}
          />
        } else if (date_precision == '2') { // 表示日期 + 时间
          container = <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            // placeholder={prompt_content}
            style={{ width: '100%' }}
          />
        }
        break
      default:
        // container = <DatePicker style={{ width: '100%' }} placeholder={prompt_content} />
        break;
    }
    return container
  }

  render() {
    const { itemValue } = this.props
    const { title, prompt_content, is_required, date_range, date_precision } = itemValue
    return (
      <div className={indexStyles.text_form}>
        <p>
          <span>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</span>
        </p>
        <div className={indexStyles.text_fillOut}>
          {/* <DatePicker style={{ width: '100%' }} placeholder={prompt_content} /> */}
          {this.renderDiffDateRangeAndDatePrecision()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}

/**
 * 1. 单个日期 + 仅日期
 * 2. 单个日期 + 日期/时间
 * 3. 开始日期~截止日期 + 仅日期
 * 4. 开始日期 ~ 截止日期 + 日期/时间
 * date_range 日期范围 1 == 单个日期 2 == 开始日期~截止日期
 * date_precision 日期精度 1 == 仅日期 2 == 日期+时间
 */
