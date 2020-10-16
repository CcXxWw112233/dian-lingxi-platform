import React, { Component } from 'react'
import {
  Modal,
  Table,
  Button,
  Select,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  message
} from 'antd'
import XLSX from 'xlsx'
import {
  checkNameReg,
  checkNumberReg,
  checkTimerReg,
  checkTypeReg,
  compareStartDueTime,
  components,
  GENRE_TYPE_REG,
  gold_value,
  handleResize,
  POSITIVE_INTEGER_REG,
  ResizableTitle,
  valiNameWithNo,
  YYYYMMDDREG,
  YYYYMMDD_HHMM_REG,
  YYYYMMDD_HHMM_REG_1,
  YYYYMMDD_REG_1
} from './getConst'
import styles from './index.less'
import { importExcelWithBoardData } from '../../services/technological'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { connect } from 'dva'
import { timeToTimestamp } from '../../utils/util'
const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  state = {
    editing: false
  }

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  save = e => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        this.setState({ editing: false })
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values }, values)
    })
  }

  renderCell = form => {
    this.form = form
    const { children, dataIndex, record, title } = this.props
    const { editing } = this.state
    const { is_error, is_error_key = {} } = record
    let rulesText = ''
    switch (title) {
      case 'name':
        rulesText = '名称不能为空,名称不能超过100个字'
        break
      case 'number':
        rulesText = '序号格式错误'
        break

      default:
        rulesText = '该字段内容不能为空'
        break
    }
    return editing ? (
      // && is_error && is_error_key.hasOwnProperty(dataIndex)
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${rulesText}`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className={
          // is_error &&
          // is_error_key.hasOwnProperty(dataIndex) &&
          styles['editable-cell-value-wrap']
        }
        style={{ paddingRight: 24 }}
        onClick={
          // is_error && is_error_key.hasOwnProperty(dataIndex) &&
          this.toggleEdit
        }
      >
        {children}
      </div>
    )
  }

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      className,
      ...restProps
    } = this.props
    let flag =
      record &&
      Object.keys(record.is_error_key).indexOf(dataIndex) != -1 &&
      record.is_error
    return (
      <td
        {...restProps}
        className={`${className} ${flag && styles.error_text}`}
      >
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    )
  }
}
@connect()
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
        { value: 'start_time', label: '开始时间' },
        { value: 'due_time', label: '截止时间' },
        { value: 'remarks', label: '备注' }
      ],
      selectedRows: [],
      selectedKey: {},
      hasSelected: false,
      select_time_format: {} // 选择的时间格式 { D:'YYYY-MM-DD' }
    }
    this.workBook = null
    this.align_type = {
      0: ['里程碑', '任务'],
      1: ['子里程碑', '任务', '子任务'],
      2: ['任务', '子任务'],
      3: ['子任务']
    }
    this.typeValid = {
      任务: {
        1: ['里程碑'],
        2: ['子里程碑']
      },
      子里程碑: {
        1: ['里程碑']
      },
      子任务: {
        1: ['任务'],
        2: ['任务'],
        3: ['任务']
      }
    }
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
          header: 'A',
          raw: false
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
  }

  // 转换表格需要用的数据
  transformJson = data => {
    if (data && data.length) {
      data = data.map((item, index) => {
        item.id = index + 1
        item.uuid = this.createUid()
        item.number = index + 1
        item.type = '任务'
        return item
      })
      let otherkey = this.state.tableDefaultKeys.map(item => item.value)
      // 1. 获取表格列
      let keys = Object.keys(data[0])

      let k = []
      // '__EMPTY'
      let notShow = ['id', 'uuid', ...otherkey]
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
            width: 80
          }
        } else {
          obj = {
            dataIndex: item,
            title: this.tableHeader.bind(this, item),
            // title: item,
            key: index,
            width: 120
          }
        }

        return obj
      })
      data = data.map((item, index) => {
        item.id = index + 1
        item.uuid = this.createUid()
        item.is_error_key = {}
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
  // 触发第一次验证
  dispatchTextHandle = (text, type, columns) => {
    let flag = false
    switch (type) {
      case 'number':
        this.handleChangeOrderField('', text)
        let a
        Object.keys(columns).forEach(item => {
          if (columns[item] === 'type') {
            flag = true
            a = item
          }
        })
        if (flag) this.handleChangeTypes(a)
        break
      case 'start_time':
        this.handleChangeTimer({
          format: 'YYYY-MM-DD',
          select_name: 'start_time',
          text
        })
        break
      case 'due_time':
        this.handleChangeTimer({
          format: 'YYYY-MM-DD',
          select_name: 'due_time',
          text
        })
        break
      default:
    }
  }

  handleCheckValidKeys = (keys, columns, text) => {
    let arr = [],
      key
    Object.keys(columns).forEach(item => {
      if (keys.includes(columns[item])) {
        arr.push(columns[item])
        key = item
      }
    })
    if (arr.length === 1) {
      let item = arr[0]
      if (item === 'number') {
        this.handleChangeOrderField('', key)
      }
      if (item === 'type') {
        this.handleChangeTypes(key)
      }
      if (item == 'start_time') {
        this.handleChangeTimer({
          format: this.state.select_time_format[key] || 'YYYY-MM-DD',
          select_name: 'start_time',
          text: key
        })
      }
      if (item == 'due_time') {
        this.handleChangeTimer({
          format: this.state.select_time_format[key] || 'YYYY-MM-DD',
          select_name: 'due_time',
          text: key
        })
      }
    }
  }

  /**
   * 设置选择后的数组
   * @param {String} text A B C D....
   * @param {String} e number type name...
   */
  selectText = (text, e) => {
    let obj = { ...this.state.selectedKey }
    let data = Array.from(this.state.data)
    let columns = Array.from(this.state.columns)
    if (e && e !== 'none') {
      obj[text] = e
    } else {
      delete obj[text]
    }
    console.log(obj)
    this.setState(
      {
        selectedKey: obj
      },
      () => {
        this.toFilterDefaultKey()
        const arr = Object.values(obj)
        this.dispatchTextHandle(text, e, obj)
        if (arr.includes('number') || arr.includes('type')) {
          columns = columns.map(item => {
            if (item.dataIndex == 'number' || item.dataIndex == 'type') {
              let new_item = { ...item }
              new_item = {
                ...item,
                className: styles['order_display']
              }
              return new_item
            } else if (item.dataIndex == text) {
              let new_item = { ...item }
              new_item = {
                ...item,
                editable: e == 'none' ? false : true
              }
              return new_item
            } else {
              return item
            }
          })
        } else {
          columns = columns.map(item => {
            if (item.dataIndex == 'number' || item.dataIndex == 'type') {
              let new_item = { ...item }
              new_item = {
                ...item,
                className: ''
              }
              return new_item
            } else if (item.dataIndex == text) {
              let new_item = { ...item }
              new_item = {
                ...item,
                editable: e == 'none' ? false : true
              }
              return new_item
            } else {
              return item
            }
          })
        }
        this.setState({
          columns
        })
        switch (e) {
          case 'none':
            this.handleClearTableData(text)
            this.handleCheckValidKeys(
              ['number', 'type', 'start_time', 'due_time'],
              obj,
              text
            )
            break
          case 'name':
            this.handleChangName(text)
            break
          case 'remarks':
            break
          case 'type':
            this.handleChangeTypes(text)
            break

          default:
            break
        }
      }
    )
  }

  // 将字段绑定为none 需清除默认状态
  handleClearTableData = text => {
    let { data = [] } = this.state
    data = data.map(item => {
      let new_item = { ...item }
      if (!!Object.keys(item.is_error_key).length) {
        delete new_item.is_error_key[text]
      }
      if (Object.keys(new_item.is_error_key).length) {
        new_item.is_error = true
      } else new_item.is_error = false
      return new_item
    })
    this.setState({
      data
    })
  }

  // 名称字段判断
  handleChangName = text => {
    let { data = [] } = this.state
    data = data.map(item => {
      let checkVal = item[text]
      let new_item = { ...item }
      if (checkNameReg(checkVal)) {
        delete item.is_error_key[text]
      } else {
        new_item = {
          ...item
        }
      }
      if (Object.keys(new_item.is_error_key || {}).length) {
        new_item.is_error = true
      } else new_item.is_error = false
      return new_item
    })
    this.setState({
      data
    })
  }

  // 校验序号与类型的组合
  validNumberOfTypes = (data, column, splitKey) => {
    let arr = []
    data.forEach((item, index) => {
      let value = item[column]
      if (index === 0) {
        // 第一条数据，必须是里程碑或者任务
        if (!this.align_type[0].includes(value)) {
          item.is_error_key[column] = 'type'
        }
      } else {
        let prev = data[index - 1]
        let prevValue = prev[column]
        let parentKey = item.parentKey || []
        if (item.is_error_key[column] !== 'type' && parentKey.length) {
          // 如果本来就报错了，说明一直是有问题的，就不处理了
          // 检查上一级是否匹配
          // console.log(value, this.typeValid[value], prevValue)
          if (!parentKey.includes(value)) {
            item.is_error_key[column] = 'type'
          } else {
            delete item.is_error_key[column]
            let volid = this.typeValid[value]
            let n = item[item.numberkey]
            if (n) {
              n = n.split(splitKey)
              let l = n.length - 1
              // 拿到上一级的序号，比如 1.1.1.1 拿到1.1.1
              let parent = n
              parent.length = parent.length - 1
              // 拿到上一级序号的数据
              let obj = data.find(col => {
                return col[col.numberkey] === parent.join(splitKey)
              })
              if (obj) {
                if (volid[l] && volid[l].includes(obj[column])) {
                  delete item.is_error_key[column]
                } else {
                  item.is_error_key[column] = 'type'
                }
              }
            }
          }
        }
      }
      if (Object.keys(item.is_error_key || {}).length) {
        item.is_error = true
      } else item.is_error = false
      arr.push(item)
    })
    return arr
  }

  // 类型格式校验
  handleChangeTypes = text => {
    let { data = [], selectedKey = {} } = this.state
    let arr = [],
      numberkey = '',
      param
    Object.keys(selectedKey).forEach(item => {
      if (selectedKey[item] === 'number') {
        arr.push(selectedKey[item])
        numberkey = item
      }
    })
    data = data.map(item => {
      let checkVal = item[text]
      let new_item = { ...item }
      new_item.typekey = text
      // let flag = arr.length
      if (
        checkTypeReg({
          val: checkVal,
          checkNumer: !!numberkey,
          item,
          gold_type: text,
          dictionary: 'number',
          selectedKey
        })
      ) {
        delete new_item.is_error_key[text]
        // if (numberkey) delete new_item.is_error_key[numberkey]
      } else {
        // if (numberkey) param = { [numberkey]: 'number' }
        // else param = {}
        new_item.is_error_key[text] = 'type'
      }
      if (Object.keys(new_item.is_error_key || {}).length) {
        new_item.is_error = true
      } else new_item.is_error = false
      return new_item
    })
    // 如果存在序号字段则进行二次过滤
    if (numberkey) {
      data = this.validNumberOfTypes(data, text, '.')
    }
    this.setState({
      data
    })
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

  // 检查上一个数据和当前数据是否层级合理
  checkPrevWithNow = (prev, val, splitKey) => {
    if (!prev || !val) return false
    let prevSplitArr = prev.split(splitKey)
    let splitArr = val.split(splitKey)
    let len = prevSplitArr.length
    let length = splitArr.length
    let keys = {
      2: [1, 2, 3, 4],
      3: [2, 3],
      4: [3, 4]
    }
    switch (length) {
      case 2:
        // 如果上一个数据满足定义的规则
        if (keys[length].includes(len)) {
          // 如果上一个是1.1.1.1 现在是1.2则验证通过 但是如果是1.1.1.1 - 2.1 则不通过
          if (len > 1 && splitArr[0] !== prevSplitArr[0]) {
            return false
          } else return true
        } else return false
      case 3:
      case 4:
        if (keys[length].includes(len)) {
          let flag = true
          if (len === 3 || len === 2) {
            flag = splitArr[1] === prevSplitArr[1]
          }
          if (len === 4) {
            flag =
              splitArr[1] === prevSplitArr[1] && splitArr[2] === prevSplitArr[2]
          }
          return flag
        }
        break
      default:
    }
  }

  getFloorNumber = (data, column, splitKey) => {
    // let { data } = this.state
    let checkInteger = 0 // 正在验证的整数
    let arr = []
    data.forEach((item, index) => {
      let value = item[column]
      let number = +value
      // 保存序号属于哪个字段 ABC
      item.numberkey = column
      // 整数,整数的情况下不需要验证
      if (!isNaN(number) && (number | 0) === number) {
        // 添加合理的上级
        checkInteger = number
        // item.parentKey = this.align_type[0]
      } else if (item.is_error_key[column] !== 'number' && value) {
        // 判断这条数据是不是已经是错的，如果是错的，就不处理了并且不处理第一条数据
        // 不是整数。需要验证
        if (index > 0) {
          if (value.indexOf(splitKey) !== -1) {
            let splitArr = value.split(splitKey)
            let len = splitArr.length // 截取的序号长度
            item.parentKey = this.align_type[len - 1]
            // 保存数据有几个点
            item.numberlength = len - 1
            let prev = data[index - 1] // 上一个数据 item是当前数据
            // 判断上一个数据和这个数据是否合理, 如果检验通过
            if (this.checkPrevWithNow(prev[column], value, splitKey)) {
              delete item.is_error_key[column]
            } else {
              // 不通过
              item.is_error_key[column] = 'number'
            }
            if (+splitArr[0] !== checkInteger) {
              // 判断当前数据与整数数据抑制 例 1 下面不能出现 2.1
              item.is_error_key[column] = 'number'
            }
          }
        } else if (index === 0) {
          // 是第一条数据，直接报错，因为不是整数
          item.is_error_key[column] = 'number'
        }
      }
      if (Object.keys(item.is_error_key).length) {
        item.is_error = true
      } else item.is_error = false
      arr.push(item)
    })
    return arr
  }

  handleChangeOrderField = (value, text) => {
    let { data = [], selectedKey = {} } = this.state
    let gold_no_param
    let arr = [],
      typekey = ''
    Object.keys(selectedKey).forEach(item => {
      if (selectedKey[item] === 'number' || selectedKey[item] === 'type') {
        arr.push(selectedKey[item])
        if (selectedKey[item] === 'type') typekey = item
      }
    })
    // 校验序号数据正确性
    data = data.map(item => {
      let checkVal = item[text]
      let new_item = { ...item }
      let flag = arr.length > 1 ? true : false
      if (
        checkNumberReg({
          symbol: '.',
          val: checkVal,
          checkType: false,
          item,
          gold_type: text,
          dictionary: 'type',
          selectedKey
        })
      ) {
        delete new_item.is_error_key[text]
        // if (flag) delete new_item.is_error_key[typekey]
      } else {
        // if (flag)
        //   gold_no_param = {
        //     [typekey]: 'type'
        //   }
        // else gold_no_param = {}
        new_item.is_error_key[text] = 'number'
        // let obj = {
        //   [text]: 'number',
        //   ...gold_no_param
        // }
        // new_item = {
        //   ...item,
        //   is_error_key: obj
        // }
      }
      if (Object.keys(new_item.is_error_key || {}).length) {
        new_item.is_error = true
      } else new_item.is_error = false
      return new_item
    })
    // 二次过滤-验证序号是否符合要求
    data = this.getFloorNumber(data, text, '.')
    this.setState({
      data
    })
  }

  // 渲染不同字段对应下拉框
  renderDiffSelectField = (text, value) => {
    let main = <></>
    if (value.includes('number')) {
      let defaultValue = 'order_spot'
      main = (
        <Select
          size="small"
          placeholder="请选择"
          style={{ width: 100, marginTop: '5px' }}
          onChange={value => {
            this.handleChangeOrderField(value, text)
          }}
          defaultValue={defaultValue}
        >
          <Select.Option key={'order_spot'}>1.1.1.1</Select.Option>
          <Select.Option key={'order_line'}>1-1-1-1</Select.Option>
        </Select>
      )
    }
    return main
  }

  /**
   * 操作时间格式
   * @param {String} format 表示选择的时间格式 'YYYY-MM-DD'
   * @param {String} select_name 代表是开始时间还是截止时间
   * @param {String} text 代表是选择列的表头 A,B,C...
   */
  handleChangeTimer = ({ format, select_name, text }) => {
    let { data = [], selectedKey = {} } = this.state
    let arr = [],
      due_time_key = ''
    // 表示如果选择的是开始时间 那么需要获取截止时间 反之亦然
    let gold_time = select_name == 'start_time' ? 'due_time' : 'start_time'
    Object.keys(selectedKey).forEach(item => {
      if (selectedKey[item] === gold_time) {
        arr.push(selectedKey[item])
        due_time_key = item
      }
    })
    data = data.map(item => {
      let checkVal = item[text]
      let new_item = { ...item }
      let gold_value = item[due_time_key]
      let temp
      // 表示当前操作并需要检测的元素
      let checkTimeValue = checkVal ? timeToTimestamp(checkVal) : ''
      // 表示需要比较进行判断的元素
      let goldTimeValue = gold_value ? timeToTimestamp(gold_value) : ''
      // 这里表示 如果当前操作的是截止时间 那么检测的就是截止时间, 所以要将开始和截止时间变量互换
      if (select_name == 'due_time') {
        temp = checkTimeValue
        checkTimeValue = goldTimeValue
        goldTimeValue = temp
      }
      if (
        !checkTimerReg(format, checkVal) ||
        (due_time_key && !compareStartDueTime(checkTimeValue, goldTimeValue))
      ) {
        new_item = {
          ...item,
          is_error_key: {
            ...item.is_error_key,
            [text]: select_name,
            [due_time_key]: gold_time
          }
        }
      } else {
        delete item.is_error_key[text]
        if (due_time_key) delete item.is_error_key[gold_value]
      }
      if (Object.keys(new_item.is_error_key || {}).length) {
        new_item.is_error = true
      } else new_item.is_error = false
      return new_item
    })

    this.setState({
      data,
      select_time_format: {
        ...this.state.select_time_format,
        [text]: format
      }
    })
  }

  renderSelectTime = ({ select_name, text }) => {
    return (
      <Select
        style={{ width: 120, marginTop: '5px' }}
        size="small"
        placeholder="请选择"
        onChange={format => {
          this.handleChangeTimer({ format, select_name, text })
        }}
        key={select_name}
        defaultValue={'YYYY-MM-DD'}
      >
        <Select.Option title="YYYY-MM-DD" key="YYYY-MM-DD">
          YYYY-MM-DD
        </Select.Option>
        <Select.Option title="YYYY-MM-DD HH:mm" key="YYYY-MM-DD HH:mm">
          YYYY-MM-DD HH:mm
        </Select.Option>
        <Select.Option title="YYYY/MM/DD" key="YYYY/MM/DD">
          YYYY/MM/DD
        </Select.Option>
        <Select.Option title="YYYY/MM/DD HH:mm" key="YYYY/MM/DD HH:mm">
          YYYY/MM/DD HH:mm
        </Select.Option>
      </Select>
    )
  }

  tableHeader = (text, data) => {
    const { selectedKey = {} } = this.state
    // let key = Object.keys(selectedKey)
    let value = Object.values(selectedKey)
    let head = (
      <>
        <Select
          size="small"
          placeholder="请选择"
          style={{ width: 100, marginRight: '5px' }}
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
        {selectedKey[text] == 'number' &&
          this.renderDiffSelectField(text, value)}
        {selectedKey[text] == 'start_time' &&
          this.renderSelectTime({ select_name: 'start_time', text })}
        {selectedKey[text] == 'due_time' &&
          this.renderSelectTime({ select_name: 'due_time', text })}
      </>
    )
    return head
  }

  // 删除选择的数据
  removeSelectValue = () => {
    let arr = Array.from(this.state.selectedRows)
    let datas = Array.from(this.state.data)
    let ids = arr.map(item => item.uuid)
    let data = datas.filter(item => !ids.includes(item.uuid))
    data = data.map((item, index) => {
      let new_item = { ...item }
      new_item = { ...item, id: index + 1, number: index + 1 }
      return new_item
    })
    this.setState({ data, selectedRows: [], hasSelected: false }, () => {
      let { selectedKey } = this.state
      Object.keys(selectedKey).forEach(item => {
        if (selectedKey[item] === 'number') {
          this.handleChangeOrderField('', item)
        }
        if (selectedKey[item] === 'type') {
          this.handleChangeTypes(item)
        }
      })
    })
  }

  // 选择行的回调
  onSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows: selectedRows,
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

  handleSave = (row, operateObj) => {
    let newData = [...this.state.data]
    const { selectedKey = {}, start_time_format = {} } = this.state
    const index = newData.findIndex(item => row.uuid === item.uuid)
    const item = newData[index]
    let checkVal = Object.values(operateObj)[0]
    let checkKey = Object.keys(operateObj)[0]
    let switchType = selectedKey[checkKey]
    let obj = { ...row }
    switch (switchType) {
      case 'number':
        obj[checkKey] = checkVal
        newData = newData.map(item => {
          if (item.uuid === obj.uuid) {
            item = obj
          }
          return item
        })
        this.setState(
          {
            data: newData
          },
          () => {
            this.handleChangeOrderField('', checkKey)
          }
        )
        return
      // let gold_no_param
      // let arr = [],
      //   typekey = ''
      // Object.keys(selectedKey).forEach(item => {
      //   if (selectedKey[item] === 'number' || selectedKey[item] === 'type') {
      //     arr.push(selectedKey[item])
      //     if (selectedKey[item] === 'type') typekey = item
      //   }
      // })
      // let flag = arr.length > 1 ? true : false
      // if (
      //   checkNumberReg({
      //     symbol: '.',
      //     val: checkVal,
      //     checkType: flag,
      //     item,
      //     gold_type: checkKey,
      //     dictionary: 'type',
      //     selectedKey
      //   })
      // ) {
      //   delete item.is_error_key[checkKey]
      //   newData.splice(index, 1, {
      //     ...item,
      //     ...row
      //   })
      //   if (flag) delete item.is_error_key[typekey]
      // } else {
      //   if (flag)
      //     gold_no_param = {
      //       [typekey]: 'type'
      //     }
      //   else gold_no_param = {}
      //   let obj = {
      //     [checkKey]: 'number',
      //     ...gold_no_param
      //   }
      //   newData.splice(index, 1, {
      //     ...item,
      //     ...row,
      //     is_error_key: obj
      //   })
      // }
      // break
      case 'name':
        if (checkNameReg(checkVal)) {
          delete item.is_error_key[checkKey]
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row
          })
        }
        break
      case 'start_time':
      case 'due_time':
        let time_format = select_time_format[checkKey]
        if (checkTimerReg(time_format, checkVal)) {
          delete item.is_error_key[checkKey]
          newData.splice(index, 1, {
            ...item,
            ...row
          })
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row
          })
        }
        break
      case 'remarks':
        break
      case 'type':
        // arr = []
        // let numberkey = '',
        //   param
        // Object.keys(selectedKey).forEach(item => {
        //   if (selectedKey[item] === 'number') {
        //     arr.push(selectedKey[item])
        //     numberkey = item
        //   }
        // })
        // if (
        //   checkTypeReg({
        //     val: checkVal,
        //     checkNumer: flag,
        //     item,
        //     gold_type: checkKey,
        //     dictionary: 'number',
        //     selectedKey
        //   })
        // ) {
        //   delete item.is_error_key[checkKey]
        //   if (flag) delete item.is_error_key[numberkey]
        //   newData.splice(index, 1, {
        //     ...item,
        //     ...row
        //   })
        // } else {
        //   if (flag) param = { [numberkey]: 'number' }
        //   else param = {}
        //   let obj = {
        //     [checkKey]: 'type',
        //     ...param
        //   }
        //   newData.splice(index, 1, {
        //     ...item,
        //     ...row,
        //     is_error_key: obj
        //   })
        // }
        // console.log(row)
        obj[checkKey] = checkVal
        newData = newData.map(item => {
          if (item.uuid === obj.uuid) {
            item = obj
          }
          return item
        })
        this.setState(
          {
            data: newData
          },
          () => {
            this.handleChangeTypes(checkKey)
          }
        )

        return
        break
      default:
        break
    }
    this.setState({ data: newData })
  }

  // 设置接口数据结构
  setDataList = () => {
    const { data = [], selectedKey = {} } = this.state
    let arr = Object.keys(selectedKey) || []
    let field_value = Object.values(selectedKey)
    let data_list = []
    arr.map(d => {
      data_list = data.map(item => {
        let new_item = {
          uuid: '',
          name: '',
          type: 'card',
          due_time: '',
          description: '',
          parent_id: '0'
        }
        // let new_item = {}
        new_item = {
          ...new_item,
          uuid: item.uuid,
          [selectedKey[d]]: item[d]
        }
        return new_item
      })
    })
    return data_list
  }

  // 确定
  setExportExcelData = () => {
    const { data = [], selectedKey = {} } = this.state
    const { board_id } = this.props
    let selected_value = Object.values(selectedKey)
    let data_list = this.setDataList()
    if (!selected_value.includes('name')) {
      message.error('操作失败，必须指定名称')
      return
    }
    return
    importExcelWithBoardData({
      board_id,
      data_list
    }).then(res => {
      if (isApiResponseOk(res)) {
        console.log(res)
        this.closeAll()
        this.props.dispatch({
          type: 'gantt/getGanttData',
          payload: {}
        })
      }
    })
    console.log(data, selectedKey)
  }

  render() {
    let {
      visible,
      columns = [],
      data = [],
      hasSelected,
      selectedKey = {},
      selectedRows = []
    } = this.state
    const maxHeight = document.body.clientHeight / 2
    columns = columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize1(index)
      }),
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: selectedKey[col.dataIndex],
        handleSave: this.handleSave
      })
    }))
    const components = {
      // header: {
      //   cell: ResizableTitle
      // },
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
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
          onOk={() => this.setExportExcelData()}
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
          {/* <EditableTable /> */}
          <Table
            components={components}
            style={{ overflow: 'auto', maxHeight: maxHeight + 'px' }}
            bordered
            rowKey="uuid"
            rowSelection={{
              hideSelectAll: true,
              columnTitle: ' ',
              onChange: this.onSelectRow,
              selectedRows: selectedRows
            }}
            rowClassName={() => styles['editable-row']}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </Modal>
      </div>
    )
  }
}

ExcelRead.defaultProps = {
  board_id: '' // 项目ID
}
