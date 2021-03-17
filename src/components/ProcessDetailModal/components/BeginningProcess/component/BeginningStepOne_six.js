import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from '../index.less'
import { getOnlineExcelDataWithProcess } from '../../../../../services/technological/workFlow'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import PrivewTable from '../../../../previewTable/index'
import Sheet from '../../../../Sheet'
import DEvent, { PREVIEWTABLE } from '../../../../../utils/event'
import { Popconfirm } from 'antd'
@connect(mapStateToProps)
export default class BeginningStepOne_six extends Component {
  constructor(props) {
    super(props)
    this.state = {
      /**
       * 是否打开确认框
       */
      openConfirm: false
    }
    this.tableRow = 10
    this.tableColumn = 5
    this.startEvent = {}
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

  /**
   * 确认编辑表格
   */
  handleToEdit = () => {
    DEvent.firEvent(PREVIEWTABLE, true)
    this.setState({
      openConfirm: false
    })
  }

  /**
   * 鼠标按下
   * @param {*} e
   */
  handleMouseDown = e => {
    this.startEvent = { x: e.pageX, y: e.pageY }
  }

  /**
   * 鼠标抬起
   * @param {*} e
   */
  handleMouseUp = e => {
    const endEvent = { x: e.pageX, y: e.pageY }
    const tans = 10
    const sqtansX = Math.abs(this.startEvent.x - endEvent.x)
    const sqtansY = Math.abs(this.startEvent.y - endEvent.y)
    if (sqtansX <= tans || sqtansY <= tans) {
      this.setState({
        openConfirm: true
      })
    }
  }

  handleMouseOut = e => {
    this.startEvent = {}
  }

  render() {
    const {
      itemValue: { online_excel_id }
    } = this.props
    const { data = [] } = this.state
    return (
      <div
        key={online_excel_id}
        style={{
          background: 'rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.15)'
        }}
        className={indexStyles.text_form}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseOut}
      >
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          表格
        </p>
        <Popconfirm
          visible={this.state.openConfirm}
          title="是否进入编辑模式"
          onConfirm={this.handleToEdit}
          onVisibleChange={val => this.setState({ openConfirm: val })}
        >
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
        </Popconfirm>
      </div>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: { processEditDatas = [] }
}) {
  return { processEditDatas }
}
