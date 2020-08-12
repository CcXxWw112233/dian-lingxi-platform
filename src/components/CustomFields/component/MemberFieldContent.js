import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon, DatePicker, Input, InputNumber } from 'antd'
import { categoryIcon } from '../../../routes/organizationManager/CustomFields/handleOperateModal'

export default class MemberFieldContent extends Component {

  render() {
    const { itemValue, itemKey } = this.props
    const { field_name, field_id, id, field_type } = itemValue
    return (
      <div className={commonStyles.custom_field_item_wrapper}>
        <div className={commonStyles.custom_field_item}>
          <div className={commonStyles.c_left}>
            <span className={`${globalsetStyles.authTheme} ${commonStyles.delete_icon}`}>&#xe7fe;</span>
            <div className={commonStyles.field_name}>
              <span className={`${globalsetStyles.authTheme} ${commonStyles.field_name_icon}`}>{categoryIcon(field_type).icon}</span>
              <span title={field_name}>{field_name}</span>
            </div>
          </div>
          <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}>
            <div onClick={this.onClick} className={commonStyles.common_select}>
              <span>未选择</span>
              <span className={globalsetStyles.authTheme}>&#xe7ee;</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
