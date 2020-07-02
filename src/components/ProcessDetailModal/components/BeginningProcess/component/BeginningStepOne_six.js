import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber } from 'antd'
import Sheet from '../../../../Sheet/Sheet'
import { getOnlineExcelDataWithProcess } from '../../../../../services/technological/workFlow'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
@connect(mapStateToProps)
export default class BeginningStepOne_six extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.sheet = null
  }

  getOnlineExcelDataWithProcess = (props) => {
    const { itemValue: { online_excel_id } } = props
    getOnlineExcelDataWithProcess({ id: online_excel_id }).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          data: res.data
        }, () => {
          this.sheet.reload(res.data && res.data.sheet_data)
          setTimeout(() => {
            if (this.sheet) {
              this.props.setSheet && this.props.setSheet(this.sheet)
            }
          }, 1000)
        })

      }
    })
  }

  componentDidMount() {
    this.getOnlineExcelDataWithProcess(this.props)
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
    const { children, itemValue: { online_excel_id } } = this.props
    return (
      <div key={online_excel_id} style={{ minHeight: '550px',position:'relative' }} className={indexStyles.text_form}>
        <p>在线表格</p>
        {/* {children} */}
        <Sheet ref={el => this.sheet = el} />
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