import React, { Component } from 'react'
import indexStyles from '../index.less'
import Sheet from '../../../../Sheet/Sheet'
import { getOnlineExcelDataWithProcess } from '../../../../../services/technological/workFlow'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'

export default class EditStepTypeOne_six extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.sheet = null;
  }

  getOnlineExcelDataWithProcess = (props) => {
    const { itemValue: { online_excel_id } } = props
    getOnlineExcelDataWithProcess({id:online_excel_id}).then(res=> {
      if (isApiResponseOk(res)) {
        this.setState({
          data: res.data
        },() => {
          this.sheet.reload(res.data && res.data.sheet_data)
        })
        
      }
    })
  }

  componentDidMount() {
    this.getOnlineExcelDataWithProcess(this.props)
  }

  render() {
    const { itemValue } = this.props
    const { online_excel_id } = itemValue
    const { data = [] } = this.state
    return (
      <div key={online_excel_id} style={{ minHeight: '440px',position:'relative' }} className={indexStyles.text_form}>
        {/* <Sheet ref={el => this.sheet = el} /> */}
        <p>在线表格</p>
        <Sheet
          data={data.sheet_data}
          ref={el=>this.sheet=el} 
          disabledEdit={true}
          showtoolbar={false}
          showinfobar={false}
          showstatisticBar={false}
        />
      </div>
    )
  }
}
