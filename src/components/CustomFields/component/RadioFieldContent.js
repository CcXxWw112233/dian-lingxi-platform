import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon } from 'antd'
import { categoryIcon } from '../../../routes/organizationManager/CustomFields/handleOperateModal'

export default class RextFieldContent extends Component {

  overlayMenu = () => {
    return (
      <div>
        <Menu>
          <Menu.Item key={1}>
            <span>选项1</span>
            <div style={{display: 'none'}}>
              <Icon type="check" />
            </div>
          </Menu.Item>
          <Menu.Item key={2}>
            <span>选项2</span>
            <div style={{display: 'none'}}>
              <Icon type="check" />
            </div>
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  render() {
    const { itemValue, itemKey } = this.props
    const { field_name, field_id, id, field_type } = itemValue
    return (
      <div key={id} className={commonStyles.custom_field_item_wrapper}>
        <div className={commonStyles.custom_field_item}>
          <div className={commonStyles.c_left}>
            <span className={`${globalsetStyles.authTheme} ${commonStyles.delete_icon}`}>&#xe7fe;</span>
            <div className={commonStyles.field_name}>
              <span className={`${globalsetStyles.authTheme} ${commonStyles.field_name_icon}`}>{categoryIcon(field_type).icon}</span>
              <span title={field_name}>{field_name}</span>
            </div>
          </div>
          {/* <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}> */}
          <Dropdown getPopupContainer={triggerNode => triggerNode.parentNode} overlayClassName={commonStyles.overlay_common} trigger={['click']} overlay={this.overlayMenu()}>
            <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}>
              <div className={commonStyles.common_select}>
                <span>未选择</span>
                <span className={globalsetStyles.authTheme}>&#xe7ee;</span>
              </div>
            </div>
          </Dropdown>
          {/* </div> */}
        </div>
      </div>
    )
  }
}
