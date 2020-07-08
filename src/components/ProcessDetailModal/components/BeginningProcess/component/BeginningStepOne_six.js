import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Popover, Input, Button, Radio, Select, InputNumber } from 'antd'
// import Sheet from '../../../../Sheet/Sheet'
import { getOnlineExcelDataWithProcess } from '../../../../../services/technological/workFlow'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import PreviewTable from '../../../../previewTable/index'
@connect(mapStateToProps)
export default class BeginningStepOne_six extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  getOnlineExcelDataWithProcess = (props) => {
    const { itemValue: { online_excel_id } } = props
    getOnlineExcelDataWithProcess({ id: online_excel_id }).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          data: res.data
        })
      }
    })
  }

  componentDidMount() {
    this.getOnlineExcelDataWithProcess(this.props)
  }

  render() {
    const { itemValue: { online_excel_id } } = this.props
    const { data } = this.state;
    return (
      <div key={online_excel_id} style={{ position:'relative',marginBottom: '40px' }} className={indexStyles.text_form}>
        <p>在线表格</p>
        <PreviewTable data={data && data.sheet_data}/>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}