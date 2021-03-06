import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import Sheet from '../../../../Sheet'
import { getOnlineExcelDataWithProcess } from '../../../../../services/technological/workFlow'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import PrivewTable from '../../../../previewTable/index'
@connect(mapStateToProps)
export default class ConfigureStepOne_six extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.tableRow = 10
    this.tableColumn = 5
  }

  getOnlineExcelDataWithProcess = props => {
    const {
      itemValue: { online_excel_id }
    } = props
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

  // 删除对应字段的表项
  handleDelFormDataItem = e => {
    e && e.stopPropagation()
    const { processEditDatas = [], parentKey = 0, itemKey } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    let new_form_data = [...forms]
    new_form_data.splice(itemKey, 1)
    this.props.updateConfigureProcess &&
      this.props.updateConfigureProcess({ value: new_form_data }, 'forms')
  }

  // 更新表格数据
  updateSheetData = data => {
    const { updateSheetList } = this.props
    this.setState({
      data: {
        id: this.state.data.id,
        sheet_data: data
      }
    })
    updateSheetList &&
      updateSheetList({ id: this.state.data.id, sheetData: data })
  }

  render() {
    const {
      itemKey,
      itemValue: { online_excel_id }
    } = this.props
    const { data = {} } = this.state
    return (
      <div key={online_excel_id || itemKey} className={indexStyles.text_form}>
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          表格
        </p>
        <PrivewTable
          expend={
            <span style={{ marginRight: 10 }}>
              <Sheet
                data={data.sheet_data}
                onMessage={this.updateSheetData}
                row={this.tableRow}
                column={this.tableColumn}
              />
            </span>
          }
          data={data.sheet_data}
          minRows={this.tableRow}
          minCols={this.tableColumn}
        />
        <span
          style={{ zIndex: 6 }}
          onClick={this.handleDelFormDataItem}
          className={`${indexStyles.delet_iconCircle}`}
        >
          <span
            className={`${globalStyles.authTheme} ${indexStyles.deletet_icon}`}
          >
            &#xe720;
          </span>
        </span>
      </div>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: { processEditDatas = [] }
}) {
  return { processEditDatas }
}
