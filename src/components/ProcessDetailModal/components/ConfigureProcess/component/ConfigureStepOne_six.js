import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber } from 'antd'
import Sheet from '../../../../Sheet/Sheet'
@connect(mapStateToProps)
export default class ConfigureStepOne_six extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.sheet = null
  }

  // 删除对应字段的表项
  handleDelFormDataItem = (e) => {
    e && e.stopPropagation()
    const { processEditDatas = [], parentKey = 0, itemKey } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    let new_form_data = [...forms]
    new_form_data.splice(itemKey, 1)
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: new_form_data }, 'forms')
  }

  render() {
    const { children } = this.props
    return (
      <div style={{ minHeight: '440px' }} className={indexStyles.text_form}>
        {/* <Sheet ref={el => this.sheet = el} /> */}
        <p>在线表格</p>
        {children}
        <span style={{ zIndex: 6 }} onClick={this.handleDelFormDataItem} className={`${indexStyles.delet_iconCircle}`}>
          <span className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}>&#xe720;</span>
        </span>
      </div>

    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}