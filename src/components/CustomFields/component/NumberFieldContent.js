import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon, DatePicker, Input, InputNumber } from 'antd'

export default class NumberFieldContent extends Component {

  state = {
    numberInputVisible: false
  }

  onClick = (e) => {
    e && e.stopPropagation()
    this.setState({
      numberInputVisible: true
    })
  }

  onBlur = (e) => {
    this.setState({
      numberInputVisible: false
    })
  }

  render() {
    return (
      <div className={commonStyles.custom_field_item_wrapper}>
        <div className={commonStyles.custom_field_item}>
          <div className={commonStyles.c_left}>
            <span className={`${globalsetStyles.authTheme} ${commonStyles.delete_icon}`}>&#xe7fe;</span>
            <div className={commonStyles.field_name}>
              <span className={`${globalsetStyles.authTheme} ${commonStyles.field_name_icon}`}>&#xe7d3;</span>
              <span>数字字段</span>
            </div>
          </div>
          {
            this.state.numberInputVisible ? (
              <InputNumber className={commonStyles.common_input} autoFocus={true} style={{ width: '100%', height: '38px' }} onBlur={this.onBlur} />
            ) : (
                <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}>
                  <div onClick={this.onClick} className={commonStyles.common_select}>
                    <span>未填写</span>
                  </div>
                </div>
              )
          }
        </div>
      </div>
    )
  }
}
