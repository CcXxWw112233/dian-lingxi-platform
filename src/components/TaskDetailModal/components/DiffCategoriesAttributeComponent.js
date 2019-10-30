import React, { Component } from 'react'
import { Menu } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './diffCategoriesAttributeComponent.less'
import { connect } from 'dva'

@connect()
export default class DiffCategoriesAttributeComponent extends Component {

  // 获取对应字段的Icon
  getCurrentFieldIcon = (value) => {
    const { code } = value
    let messageValue = (<span></span>)
    switch (code) {
      case 'EXECUTOR':// 表示是负责人
        messageValue = (
          <sapn>&#xe7b2;</sapn>
        )
        break;
      case 'MILESTONE':// 表示是里程碑
        messageValue = (
          <sapn>&#xe6b7;</sapn>
        )
        break;
      case 'REMARK':// 表示是备注
        messageValue = (
          <sapn>&#xe7f6;</sapn>
        )
        break;
      case 'LABEL':// 标签
        messageValue = (
          <sapn>&#xe6b8;</sapn>
        )
        break;
      case 'ATTACHMENT':// 表示是上传附件
        messageValue = (
          <sapn>&#xe6b9;</sapn>
        )
        break;
      case 'SUBTASK':// 表示是子任务
        messageValue = (
          <sapn>&#xe7f5;</sapn>
        )
        break;
      case 'CONTENTLINK':// 表示是关联内容
        messageValue = (
          <sapn>&#xe6ba;</sapn>
        )
        break;
      default:
        break;
    }
    return messageValue
  }

  // 属性选择的下拉回调 S
  handleMenuReallySelect = (e) => {
    console.log(e, 'ssssss')
    const { dispatch, card_id } = this.props
    const { key } = e
    dispatch({
      type: 'publicTaskDetailModal/setCardAttributes',
      payload: {
        card_id, property_id: key
      }
    })
  }
  // 属性选择的下拉回调 E

  render() {
    const { attributesList = [] } = this.props
    return (
      <div>
        <div className={indexStyles.attrWrapper}>
          <Menu style={{ padding: '8px 0px', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.15)', maxWidth: '248px' }}
            // onDeselect={this.handleMenuReallyDeselect.bind(this)}
            onSelect={this.handleMenuReallySelect.bind(this)}
          >
            {
              attributesList.map(item => (
                <Menu.Item key={item.id}>
                  <span className={`${globalStyles.authTheme} ${indexStyles.attr_icon}`}>{this.getCurrentFieldIcon(item)}</span>
                  <sapn className={indexStyles.attr_name}>{item.name}</sapn>
                </Menu.Item>
              ))
            }
          </Menu>
        </div>
      </div>
    )
  }
}

DiffCategoriesAttributeComponent.defaultProps = {
  card_id: '', // 当前的任务ID
  attributesList: [], // 默认的属性字段列表
  handleSelectedPropertiesItem: function() {}, // 每一个字段选择的下拉回调
}
