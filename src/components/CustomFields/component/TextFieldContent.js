import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon, DatePicker, Input, InputNumber } from 'antd'
import { categoryIcon } from '../../../routes/organizationManager/CustomFields/handleOperateModal'

export default class TextFieldContent extends Component {

  state = {
    inputVisible: false
  }

  onClick = (e) => {
    e && e.stopPropagation()
    this.setState({
      inputVisible: true
    })
  }

  onBlur = (e) => {
    this.setState({
      inputVisible: false
    })
  }

  render() {
    const { itemValue, itemKey } = this.props
    const { field_id, id, field_value, field_content: { name, field_type } } = itemValue
    return (
      <div className={commonStyles.custom_field_item_wrapper}>
        <div className={commonStyles.custom_field_item}>
          <div className={commonStyles.c_left}>
            <span className={`${globalsetStyles.authTheme} ${commonStyles.delete_icon}`}>&#xe7fe;</span>
            <div className={commonStyles.field_name}>
              <span className={`${globalsetStyles.authTheme} ${commonStyles.field_name_icon}`}>{categoryIcon(field_type).icon}</span>
              <span title={name}>{name}</span>
            </div>
          </div>
          {
            this.state.inputVisible ? (
              <Input className={commonStyles.common_input} autoFocus={true} style={{ width: '100%', height: '38px' }} onBlur={this.onBlur} />
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
