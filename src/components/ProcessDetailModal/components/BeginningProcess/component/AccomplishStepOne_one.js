import React, { Component } from 'react'
import indexStyles from '../index.less'

export default class AccomplishStepOne_one extends Component {
  render() {
    const { itemValue } = this.props
    const { title, prompt_content, is_required, value } = itemValue
    return (
      <div className={indexStyles.text_form}>
        <p style={{color:'rgba(0,0,0,0.65)'}}>
          <span>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</span>
        </p>
        <div className={indexStyles.text_fillOut}>
          <span>{value || prompt_content}</span>
        </div>
      </div>
    )
  }
}
