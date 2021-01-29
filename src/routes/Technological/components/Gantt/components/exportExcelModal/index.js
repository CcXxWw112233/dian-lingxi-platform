import React, { Component } from 'react'
import { Modal, Checkbox, message, Radio } from 'antd'
import {
  getExportExcelFieldList,
  exportExcelFieldList
} from '../../../../../../services/technological/gantt'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import axios from 'axios'
import Cookies from 'js-cookie'
import { REQUEST_DOMAIN_WORK_BENCH } from '../../../../../../globalset/js/constant'
import imgsrc from 'src/assets/gantt/export_excel_progress.png'
export default class index extends Component {
  state = {
    export_field_list: [],
    select_mode: '0' //0默认选择字段导出， 1填充导出
  }

  componentDidMount() {
    getExportExcelFieldList().then(res => {
      if (isApiResponseOk(res)) {
        let ar = []
        let number = res.data.find(item => item.code == 'NUMBER') || {}
        let title = res.data.find(item => item.code == 'TITLE') || {}
        ar.push(number.code, title.code)
        this.setState(
          {
            export_field_list: res.data
          },
          () => {
            this.setState({
              checkedValue: ar
            })
          }
        )
      }
    })
  }

  onChange = checkedValue => {
    this.setState({
      checkedValue
    })
  }

  onOk = () => {
    const { checkedValue = [], select_mode = '0' } = this.state
    const { board_id } = this.props
    if (!board_id) return
    this.props.setVisible && this.props.setVisible(false)
    this.props.updateState &&
      this.props.updateState({
        name: 'showLoading',
        value: true
      })
    const url =
      select_mode == '0' ? '/board/export/excel' : '/board/export/outline'
    const options = {
      url: `${REQUEST_DOMAIN_WORK_BENCH}${url}`,
      method: 'post',
      headers: {
        AccessToken: Cookies.get('Authorization')
      },
      data: {
        board_id,
        codes: checkedValue
      },
      responseType: 'blob',
      timeout: 0
    }
    if (select_mode == '1') {
      options.data = { board_id }
    }
    axios({
      ...options
    })
      .then(resp => {
        if (resp.status < 400) {
          let respHeader = resp.headers
          let file_name = respHeader['content-disposition'] || ''
          file_name = (file_name.split('=') || [])[1] || ''
          file_name = file_name.split('.')[0]
          file_name = decodeURIComponent(escape(file_name)) + '.xlsx'
          let blob = new Blob([resp.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          let a = document.createElement('a')
          a.href = window.URL.createObjectURL(blob)
          a.download = file_name
          a.click()
          // 释放内存
          window.URL.revokeObjectURL(a.href)
          a = null
        } else {
          message.warn('导出失败')
        }
        this.props.updateState &&
          this.props.updateState({
            name: 'showLoading',
            value: false
          })
      })
      .catch(err => {
        message.warn('导出失败')
        this.props.updateState &&
          this.props.updateState({
            name: 'showLoading',
            value: false
          })
      })
  }

  onCancel = () => {
    this.props.setVisible && this.props.setVisible(false)
  }
  setSelectMode = e => {
    const value = e.target.value
    this.setState({
      select_mode: value
    })
  }
  render() {
    const { visible } = this.props
    const {
      export_field_list = [],
      checkedValue = [],
      select_mode
    } = this.state
    return (
      <div>
        <Modal
          width={380}
          onCancel={this.onCancel}
          title="导出表格"
          visible={visible}
          maskClosable={false}
          onOk={this.onOk}
          okButtonProps={{ disabled: !(checkedValue && checkedValue.length) }}
        >
          <div style={{ marginBottom: '16px' }}>
            <Radio.Group
              style={{ display: 'flex', justifyContent: 'space-between' }}
              onChange={this.setSelectMode}
              value={select_mode}
            >
              <Radio value={'0'}>按字段导出</Radio>
              <Radio value={'1'}>按填充进度导出</Radio>
            </Radio.Group>
          </div>
          <div style={{ display: select_mode == '0' ? 'block' : 'none' }}>
            <div
              style={{
                marginBottom: '16px',
                color: 'rgba(0,0,0,.65)',
                fontWeight: 'bold'
              }}
            >
              选择导出字段
            </div>
            <Checkbox.Group
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              value={checkedValue}
              onChange={this.onChange}
            >
              {!!(export_field_list && export_field_list.length) &&
                export_field_list.map(item => {
                  return (
                    <Checkbox
                      style={{
                        // width: '33.3%',
                        marginRight: '16px',
                        marginBottom: '16px',
                        marginLeft: 0
                      }}
                      value={item.code}
                      disabled={item.code == 'NUMBER' || item.code == 'TITLE'}
                    >
                      {item.title}
                    </Checkbox>
                  )
                })}
            </Checkbox.Group>
          </div>
          <div style={{ display: select_mode == '1' ? 'block' : 'none' }}>
            <img src={imgsrc} style={{ width: 332 }}></img>
          </div>
        </Modal>
      </div>
    )
  }
}
