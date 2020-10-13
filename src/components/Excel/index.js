import React, { Component } from 'react'
import { Modal, Table, Button, Select, Row, Col } from 'antd'
import XLSX from 'xlsx'
import { components, handleResize } from './getConst'

export default class ExcelRead extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      columns: [],
      data: [],
      tableDefaultKeys: [
        { value: 'none', label: '不绑定' },
        { value: 'number', label: '序号' },
        { value: 'type', label: '类型' },
        { value: 'name', label: '名称' },
        { value: 'start_date', label: '开始时间' },
        { value: 'end_date', label: '截止时间' },
        { value: 'remark', label: '备注' }
      ],
      selectedRows: [],
      selectedKey: {},
      hasSelected: false
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
      // 创建FileReader对象，将文件内容读入内存，通过一些api接口，可以在主线程中访问本地文件
      let read = new FileReader()
      // onload事件，当读取操作成功完成时调用
      read.onload = e => {
        let result = e.target.result
        // 返回数组中元素的字节数
        var data = new Uint8Array(result)
        this.workBook = XLSX.read(data, { type: 'array' })
        // 转出来的数据
        const sheet2JSONOpts = {
          /** Default value for null/undefined values */
          defval: '', //给defval赋值为空的字符串
          header: 'A'
        }
        //1、XLSX.utils.json_to_sheet(data) 接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表，默认的列顺序由使用Object.keys的字段的第一次出现确定
        //2、将数据放入对象workBook的Sheets中等待输出
        let json = XLSX.utils.sheet_to_json(
          this.workBook.Sheets[this.workBook.SheetNames[0]],
          sheet2JSONOpts
        )
        this.transformJson(json)
      }
      // 方法用于启动读取指定的 Blob 或 File 内容。当读取操作完成时，readyState 变成 DONE（已完成），并触发 loadend 事件
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
        item.number = index + 1
        item.type = '任务'
        return item
      })
      let otherkey = this.state.tableDefaultKeys.map(item => item.value)
      // 1. 获取表格列
      let keys = Object.keys(data[0])

      let k = []
      // '__EMPTY'
      let notShow = ['id', 'uid', ...otherkey]
      keys.forEach(item => {
        if (!notShow.includes(item)) {
          k.push(item)
        }
      })
      k.unshift('type')
      k.unshift('number')
      let arr = k.map((item, index) => {
        let obj = {}
        if (item == 'type' || item == 'number') {
          obj = {
            dataIndex: item,
            title: null,
            // title: item,
            key: index,
            render: (text, record, index) => {
              return text
            },
            width: 80
          }
        } else {
          obj = {
            dataIndex: item,
            title: this.tableHeader.bind(this, item),
            // title: item,
            key: index,
            render: (text, record, index) => {
              return text
            },
            width: 120
          }
        }

        return obj
      })
      // console.log(arr)
      data = data.map((item, index) => {
        item.id = index + 1
        item.uid = this.createUid()
        return item
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
    // obj = { A : 'number' }
    // console.log(text, e, obj)
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
    // console.log(data)
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
        <Select
          size="small"
          placeholder="请选择"
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

  // 删除选择的数据
  removeSelectValue = () => {
    let arr = Array.from(this.state.selectedRows)
    let datas = Array.from(this.state.data)
    let ids = arr.map(item => item.uid)
    let data = datas.filter(item => !ids.includes(item.uid))

    // console.log(data);
    this.setState({ data, selectedRows: [], hasSelected: false })
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
      visible: false
    })
  }

  handleResize1 = index => (e, { size }) => {
    let columns = this.state.columns
    columns = handleResize({
      width: size.width,
      index,
      columns
    })
    this.setState({
      columns
    })
  }

  render() {
    let { visible, columns = [], data = [], hasSelected } = this.state
    const maxHeight = document.body.clientHeight / 2
    columns = columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize1(index)
      })
    }))
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
          <Row style={{ margin: '10px 0' }}>
            <Col>
              <Button
                disabled={!hasSelected}
                type="danger"
                onClick={this.removeSelectValue}
              >
                删除
              </Button>
            </Col>
          </Row>
          <Table
            // components={components}
            style={{ overflow: 'auto', maxHeight: maxHeight + 'px' }}
            bordered
            rowKey="id"
            rowSelection={{
              hideSelectAll: true,
              columnTitle: ' ',
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
