import React, { Component } from 'react'
import { Modal, Table, Button, Select } from 'antd'
import XLSX from 'xlsx'

export default class ExcelRead extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      importDataVisible: false,
      columns: [],
      data: [],
      tableDefaultKeys: [
        { value: 'none', label: '不绑定' },
        { value: 'name', label: '名称' },
        { value: 'type', label: '类型' },
        { value: 'start_date', label: '开始时间' },
        { value: 'end_date', label: '结束时间' },
        { value: 'stage', label: '类型' },
        { value: 'remark', label: '备注' }
      ],
      selectedRows: [],
      selectedKey: {},
      hasSelected: false,
      hasLocation: []
    }
    this.workBook = null
  }

  addFile = () => {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls'
    input.onchange = this.readFile
    input.click()
    input = null
  }

  readFile = val => {
    let { target } = val
    let file = target.files[0]
    if (file) {
      let read = new FileReader()
      read.onload = e => {
        let result = e.target.result
        var data = new Uint8Array(result)
        this.workBook = XLSX.read(data, { type: 'array' })
        // 转出来的数据
        let json = XLSX.utils.sheet_to_json(
          this.workBook.Sheets[this.workBook.SheetNames[0]]
        )
        this.transformJson(json)
      }
      read.readAsArrayBuffer(file)
    }
    // console.log(target.files)
  }

  // 转换表格需要用的数据
  transformJson = data => {
    if (data && data.length) {
      data = data.map((item, index) => {
        item.id = index + 1
        item.uid = this.createUid()
        return item
      })
      let otherkey = this.state.tableDefaultKeys.map(item => item.value)
      let keys = Object.keys(data[0])
      let k = []
      let notShow = ['id', '__EMPTY', 'uid', ...otherkey]
      keys.forEach(item => {
        if (!notShow.includes(item)) {
          k.push(item)
        }
      })
      let arr = k.map((item, index) => {
        let obj = {
          dataIndex: item,
          title: this.tableHeader.bind(this, item),
          key: index
          // width:80
        }
        return obj
      })
      this.setState({
        columns: arr,
        data: data,
        visible: true
      })
    }
  }

  createUid = () => {
    return Math.floor(Math.random() * 10000000 + 1)
  }

  // 设置选择后的数组
  selectText = (text, e) => {
    let obj = { ...this.state.selectedKey }
    let data = Array.from(this.state.data)
    if (e && e !== 'none') {
      obj[text] = e
    } else {
      obj[text] = ''
    }
    // 只保存自定义字段的数据
    data = data.map(d => {
      d[e] = d[text]
      let key = Object.values(obj)
      let dkey = this.state.tableDefaultKeys.map(item => item.value)
      dkey.forEach(item => {
        if (!key.includes(item)) {
          delete d[item]
        }
      })
      return d
    })
    this.setState(
      {
        data,
        selectedKey: obj
      },
      () => {
        this.toFilterDefaultKey()
      }
    )
  }

  toFilterDefaultKey = () => {
    let arr = Array.from(this.state.tableDefaultKeys)
    let vals = Object.values(this.state.selectedKey)
    arr = arr.map(item => {
      if (vals.includes(item.value)) {
        item.selected = true
      } else {
        item.selected = false
      }
      return item
    })
    this.setState({
      tableDefaultKeys: arr
    })
  }

  tableHeader = (text, data) => {
    let head = (
      <>
        <span>{text}</span>
        <br />
        <Select
          size="small"
          placeholder="字段绑定"
          style={{ width: 100 }}
          onChange={this.selectText.bind(this, text)}
        >
          {this.state.tableDefaultKeys.map(item => {
            return (
              <Select.Option
                key={item.value}
                value={item.value}
                disabled={item.selected}
              >
                {item.label}
              </Select.Option>
            )
          })}
        </Select>
      </>
    )
    return head
  }

  // 选择行的回调
  onSelectRow = (record, selected, selectedRows) => {
    let arr = Array.from(this.state.selectedRows)

    if (selected) {
      arr.push(record)
    } else {
      arr = arr.filter(item => item.uid !== record.uid)
    }
    this.setState({
      selectedRows: arr,
      hasSelected: !!selectedRows.length
    })
  }

  closeAll = () => {
    let tableDefaultKeys = Array.from(this.state.tableDefaultKeys)
    tableDefaultKeys = tableDefaultKeys.map(item => {
      item.selected = false
      return item
    })
    this.setState({
      tableDefaultKeys,
      selectedRows: [],
      selectedKey: {},
      visible: false,
      importDataVisible: false
    })
  }

  render() {
    const { visible, columns = [], data = [] } = this.state
    return (
      <div>
        <Button onClick={this.addFile} style={{ marginTop: '8px' }} block>
          导入表格
        </Button>
        <Modal
          width="80%"
          visible={visible}
          title="导入数据"
          onCancel={() => this.closeAll()}
          // onOk={() => this.setDataForDetail()}
          okText="确定"
          cancelText="取消"
          maskClosable={false}
          keyboard={false}
          destroyOnClose={true}
        >
          <Table
            bordered
            rowKey="id"
            rowSelection={{
              hideSelectAll: true,
              onSelect: this.onSelectRow
            }}
            columns={columns}
            dataSource={data}
          />
        </Modal>
      </div>
    )
  }
}
