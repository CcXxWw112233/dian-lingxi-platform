import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon } from 'antd'
import { categoryIcon } from '../../../routes/organizationManager/CustomFields/handleOperateModal'
import { connect } from 'dva'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { isObjectValueEqual } from '../../../utils/util'
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
    const { domEvent, key } = e
    domEvent && domEvent.stopPropagation()
    this.props.dispatch({
      type: 'organizationManager/setRelationCustomField',
      payload: {
        id: relation_id,
        field_value: key
      }
    }).then(res => {
      if (isApiResponseOk(res)) {
        this.props.handleUpdateModelDatas && this.props.handleUpdateModelDatas({data: res.data, type: 'update'})
      }
    })
  }

  onDeselect = (e, relation_id) => {
    const { domEvent, key, selectedKeys = [] } = e
    domEvent && domEvent.stopPropagation()
    this.props.dispatch({
      type: 'organizationManager/setRelationCustomField',
      payload: {
        id: relation_id,
        field_value: selectedKeys.join(',')
      }
    }).then(res => {
      if (isApiResponseOk(res)) {
        this.props.handleUpdateModelDatas && this.props.handleUpdateModelDatas({ data: res.data, type: 'update' })
      }
    })
  }

  // 获取对应option的value值
  getSelectedValue = (field_value) => {
    const { itemValue: { items = [] } } = this.state
    const options = [...items]
    const gold_name = options.find(item => item.id == field_value).item_value
    return gold_name
  }

  overlayMenu = (itemValue) => {
    const { items = [], id, field_value } = itemValue
    return (
      <div>
        <Menu multiple={true} selectedKeys={[field_value]} onSelect={(e) => { this.onSelect(e,id) }} onDeselect={(e) => { this.onDeselect(e, id) }}>
          {
            !!(items && Object.keys(items).length) && items.map(item => {
              return (
                <Menu.Item value={item.id} key={item.id}>
                  <span>{item.item_value}</span>
                  <div style={{ display: 'none' }}>
                    <Icon type="check" />
                  </div>
                </Menu.Item>
              )
            })
          }
        </Menu>
      </div>
    )
  }

  render() {
    const { itemValue, itemKey } = this.state
    const { field_name, field_id, id, field_type, items = [], field_value } = itemValue
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
          <Dropdown getPopupContainer={triggerNode => triggerNode.parentNode} overlayClassName={commonStyles.overlay_common} trigger={['click']} overlay={this.overlayMenu(itemValue)}>
            <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}>
              <div className={commonStyles.common_select}>
                {
                  field_value ? <span>{this.getSelectedValue(field_value)}</span> : <span>未选择</span>
                }
                {/* <span>未选择</span> */}
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
