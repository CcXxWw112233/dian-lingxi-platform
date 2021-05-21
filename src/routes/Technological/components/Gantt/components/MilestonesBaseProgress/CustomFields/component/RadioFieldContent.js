import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon, Checkbox } from 'antd'
import { categoryIcon } from '@/routes/organizationManager/CustomFields/handleOperateModal'
import { connect } from 'dva'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { isObjectValueEqual } from '@/utils/util'
@connect()
export default class RextFieldContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemValue: props.itemValue,
      itemKey: props.itemKey
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isObjectValueEqual(this.props.itemValue, nextProps.itemValue)) return
    this.setState({
      itemValue: nextProps.itemValue,
      itemKey: nextProps.itemKey
    })
  }

  onSelect = (e, relation_id) => {
    const { domEvent, key, selectedKeys = [] } = e
    domEvent && domEvent.stopPropagation()
    const { itemValue } = this.state
    const { id } = itemValue
    this.props.handleUpdateModelDatas({
      data: { id, field_value: key },
      type: 'update'
    })
  }

  onDeselect = (e, relation_id) => {
    const { domEvent, key, selectedKeys = [] } = e
    domEvent && domEvent.stopPropagation()
    const { itemValue } = this.state
    const { id } = itemValue
    this.props.handleUpdateModelDatas({
      data: { id, field_value: key },
      type: 'update'
    })
  }

  // 获取对应option的value值
  getSelectedValue = field_value => {
    const {
      itemValue: { items = [] }
    } = this.state
    const options = [...items]
    const gold_name = options.find(item => item.id == field_value).item_value
    return gold_name
  }

  overlayMenu = itemValue => {
    const { items = [], id, field_value } = itemValue
    return (
      <div>
        <Menu
          multiple={true}
          selectedKeys={[field_value]}
          onSelect={e => {
            this.onSelect(e, id)
          }}
          onDeselect={e => {
            this.onDeselect(e, id)
          }}
        >
          {!!(items && Object.keys(items).length) &&
            items.map(item => {
              return (
                <Menu.Item
                  title={item.item_value}
                  value={item.id}
                  key={item.id}
                >
                  <span>{item.item_value}</span>
                  <div style={{ display: 'none' }}>
                    <Icon type="check" />
                  </div>
                </Menu.Item>
              )
            })}
        </Menu>
      </div>
    )
  }

  render() {
    const { itemValue, itemKey } = this.state
    const {
      field_id,
      id,
      field_value,
      name,
      field_type,
      items = []
    } = itemValue
    const { add_select_ids } = this.props
    return (
      <div key={id} className={`${commonStyles.custom_field_item_wrapper} `}>
        <div className={commonStyles.custom_field_item}>
          <div className={commonStyles.c_left}>
            <div className={`${commonStyles.check_box}`}>
              <Checkbox
                value={id}
                onChange={this.props.singleChange}
                checked={add_select_ids.includes(id)}
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
          {/* <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}> */}
          <Dropdown
            getPopupContainer={triggerNode => triggerNode.parentNode}
            overlayClassName={commonStyles.overlay_common}
            trigger={['click']}
            overlay={this.overlayMenu(itemValue)}
          >
            <div
              className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}
            >
              <div className={commonStyles.common_select}>
                {field_value ? (
                  <span
                    style={{
                      color: field_value
                        ? 'rgba(0,0,0,0.65)'
                        : 'rgba(0,0,0,0.45)'
                    }}
                  >
                    {this.getSelectedValue(field_value)}
                  </span>
                ) : (
                  <span>未选择</span>
                )}
                {/* <span>未选择</span> */}
                <span className={globalsetStyles.authTheme}>&#xe7ee;</span>
              </div>
            </div>
          </Dropdown>
          <div
            className={` ${commonStyles.clear}`}
            onClick={() => this.props.clearItem({ id })}
          >
            清空
          </div>

          {/* </div> */}
        </div>
      </div>
    )
  }
}
