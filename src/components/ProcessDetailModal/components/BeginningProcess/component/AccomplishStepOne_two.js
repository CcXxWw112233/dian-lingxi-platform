import React, { Component } from 'react'
import indexStyles from '../index.less'

export default class AccomplishStepOne_two extends Component {
  render() {
    const { itemValue } = this.props
    const { title, prompt_content, is_required, value, options = [] } = itemValue
    let gold_value = (options.filter(item => item.id == value) || [])[0].label_name || ''
    return (
      <div className={indexStyles.text_form}>
        <p>
          <span>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</span>
        </p>
        <div className={indexStyles.text_fillOut}>
          <span>{gold_value || prompt_content}</span>
        </div>
      </div>
    )
  }
}
