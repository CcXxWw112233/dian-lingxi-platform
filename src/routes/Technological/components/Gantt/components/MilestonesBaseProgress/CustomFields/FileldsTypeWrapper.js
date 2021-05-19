import { Checkbox } from 'antd'
import React, { Component } from 'react'
import commonStyles from './common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { categoryIcon } from '@/routes/organizationManager/CustomFields/handleOperateModal'
import { connect } from 'dva'

export default class FileldsTypeWrapper extends Component {
  renderContent = (itemValue, itemKey) => {
    const { field_id, id, field_value, name, field_type } = itemValue
    const { remove_select_ids = [] } = this.props
    return (
      <div
        key={itemKey}
        style={{ background: '#F5F7FB' }}
        className={`${commonStyles.custom_field_item_wrapper} }`}
      >
        <div
          className={commonStyles.custom_field_item}
          style={{ paddingLeft: 16 }}
        >
          <div className={commonStyles.c_left}>
            <div className={`${commonStyles.check_box}`}>
              <Checkbox
                value={id}
                onChange={this.props.singleChange}
                checked={remove_select_ids.includes(id)}
              />
            </div>
            <div
              className={`${globalsetStyles.authTheme} ${commonStyles.field_name_icon}`}
            >
              {categoryIcon(field_type).icon}
            </div>
            <div className={commonStyles.field_name} title={name}>
              {name}
            </div>
          </div>
        </div>
      </div>
    )
  }
  render() {
    const { fields = [] } = this.props
    return (
      <div className={commonStyles.custom_operate_wrapper}>
        {!!(fields && fields.length) &&
          fields.map((item, key) => {
            return this.renderContent(item, key)
          })}
      </div>
    )
  }
}
