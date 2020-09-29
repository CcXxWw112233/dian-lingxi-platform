import React, { Component } from 'react'
import { Modal, Checkbox, message } from 'antd'
import {
  getExportExcelFieldList,
  exportExcelFieldList
} from '../../../../../../services/technological/gantt'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import axios from 'axios'
import Cookies from 'js-cookie'

export default class index extends Component {
  state = {
    export_field_list: []
  }

  componentDidMount() {
    getExportExcelFieldList().then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          export_field_list: res.data
        })
      }
    })
  }

  onChange = checkedValue => {
    this.setState({
      checkedValue
    })
  }

  onOk = () => {
    const { checkedValue = [] } = this.state
    const { board_id } = this.props
    if (!board_id) return
    let url = '/api/workbenchs/board/export/excel'
    let reqParam = { board_id, codes: checkedValue }
    let headers = { Authorization: Cookies.get('Authorization') }
    this.props.setVisible && this.props.setVisible(false)
    this.props.updateState &&
      this.props.updateState({
        name: 'showLoading',
        value: true
      })
    axios({
      url: '/api/workbenchs/board/export/excel',
      method: 'post',
      headers: {
        Authorization: Cookies.get('Authorization')
      },
      data: {
        board_id,
        codes: checkedValue
      },
      timeout: 0
    }).then(resp => {
      // console.log(resp)
      if (resp.status < 400) {
        let respHeader = resp.headers
        let file_name = respHeader['content-disposition'] || ''
        file_name = (file_name.split('=') || [])[1] || ''
        let decode = function({
          str = '',
          jinzhi = '16',
          prefix = '\\u',
          postfix = ';'
        } = {}) {
          var ret = ''
          var splits = str.split(';')
          for (let i = 0; i < splits.length; i++) {
            let tmp = splits[i].replace(prefix, '')
            ret += String.fromCharCode(parseInt(tmp, jinzhi))
          }
          return ret
        }
        console.log(decode(file_name))
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
    // axios.post(url, reqParam, { headers, responseType: 'blob' }).then(resp => {
    //   let respHeader = resp.headers
    //   console.log(resp)
    //   let names = respHeader['content-disposition']
    //   // 文件名
    //   names = names.split('=')[1]
    //   let blob = new Blob([resp.data], {
    //     type:
    //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //   })
    //   let a = document.createElement('a')
    //   a.href = window.URL.createObjectURL(blob)
    //   a.download = names
    //   a.click()
    //   // 释放内存
    //   window.URL.revokeObjectURL(a.href)
    //   a = null
    //   // this.props.updateState({
    //   //   showLoading: false
    //   // })
    // })
    // exportExcelFieldList({ board_id, codes: checkedValue }).then(res => {
    //   if (isApiResponseOk(res)) {
    //     console.log(res)
    //   }
    // })
  }

  onCancel = () => {
    this.props.setVisible && this.props.setVisible(false)
  }

  render() {
    const { visible } = this.props
    const { export_field_list = [], checkedValue = [] } = this.state
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
          <div style={{ marginBottom: '16px' }}>选择导出字段</div>
          <Checkbox.Group
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
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
                  >
                    {item.title}
                  </Checkbox>
                )
              })}
          </Checkbox.Group>
        </Modal>
      </div>
    )
  }
}
