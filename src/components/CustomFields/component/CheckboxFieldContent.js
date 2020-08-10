import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon } from 'antd'

export default class CheckboxFieldContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedKeys: []
    }
  }

  onSelect = (e) => {
    const { selectedKeys = [] } = e
    console.log(e);
    this.setState({
      selectedKeys
    })
  }

  overlayMenu = () => {
    return (
      <div>
        <Menu selectedKeys={this.state.selectedKeys} onSelect={this.onSelect} multiple={true}>
          <Menu.Item key={1}>
            <span>选项1</span>
            <div style={{ display: 'none' }}>
              <Icon type="check" />
            </div>
          </Menu.Item>
          <Menu.Item key={2}>
            <span>选项2</span>
            <div style={{ display: 'none' }}>
              <Icon type="check" />
            </div>
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  render() {
    return (
      <div className={commonStyles.custom_field_item_wrapper}>
        <div className={commonStyles.custom_field_item}>
          <div className={commonStyles.c_left}>
            <span className={`${globalsetStyles.authTheme} ${commonStyles.delete_icon}`}>&#xe7fe;</span>
            <div className={commonStyles.field_name}>
              <span className={`${globalsetStyles.authTheme} ${commonStyles.field_name_icon}`}>&#xe6b2;</span>
              <span>多选字段</span>
            </div>
          </div>
          {/* <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}> */}
          <Dropdown getPopupContainer={triggerNode => triggerNode.parentNode} overlayClassName={commonStyles.overlay_common} trigger={['click']} overlay={this.overlayMenu()}>
            {
              this.state.selectedKeys.length ? (
                <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}>
                  <div className={commonStyles.field_selected}>
                    <div className={commonStyles.field_s_item}>
                      <div className={commonStyles.field_s_item_bg}>
                        <span>选项1 <span className={`${globalsetStyles.authTheme} ${commonStyles.field_s_item_close}`}>&#xe7fe;</span></span>
                      </div>
                    </div>
                    <span className={globalsetStyles.authTheme}>&#xe7ee;</span>
                  </div>
                </div>
              ) : (
                  <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}>
                    <div className={commonStyles.common_select}>
                      <span>未选择</span>
                      <span className={globalsetStyles.authTheme}>&#xe7ee;</span>
                    </div>
                  </div>
                )
            }
          </Dropdown>
          {/* </div> */}
        </div>
      </div>
    )
  }
}
