import React from 'react'
import styles from './index.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import Action from '../../Action'
import {
  Table,
  Modal,
  Row,
  Col,
  // Badge,
  Button,
  Form,
  Input,
  Checkbox,
  message,
  Popconfirm,
  InputNumber,
  notification,
  Popover,
  Select,
  DatePicker
  // Upload,
  // Icon
} from 'antd'
import moment from 'moment'
import upimg from '../../ud.svg'
import Authorized from '../Authorized'
class MeetingManage extends React.Component {
  defaultConfig = {
    enable: {
      color: '#BBC0D4',
      text: '可预订'
    },
    disabled: {
      color: '#FF8181',
      text: '已占用'
    },
    noState: {
      color: '#F5F7FA',
      text: ''
    }
  }
  tdHeight = 0
  constructor(props) {
    super(props)
    this.timeBox = React.createRef()
    this.timer = null
    this.createLineTimer = null
    this.state = {
      query_param: {
        query_time: new Date().getTime()
      },
      managePage: true,
      // 时间表
      times: [
        { time: '9', disabled: false, noState: false },
        { time: '9.5', disabled: false, noState: false },
        { time: '10', disabled: false, noState: false },
        { time: '10.5', disabled: false, noState: false },
        { time: '11', disabled: false, noState: false },
        { time: '11.5', disabled: false, noState: false },
        { time: '12', disabled: false, noState: false },
        { time: '12.5', disabled: false, noState: false },
        { time: '13', disabled: false, noState: false },
        { time: '13.5', disabled: false, noState: false },
        { time: '14', disabled: false, noState: false },
        { time: '14.5', disabled: false, noState: false },
        { time: '15', disabled: false, noState: false },
        { time: '15.5', disabled: false, noState: false },
        { time: '16', disabled: false, noState: false },
        { time: '16.5', disabled: false, noState: false },
        { time: '17', disabled: false, noState: false },
        { time: '17.5', disabled: false, noState: false },
        { time: '18', disabled: false, noState: false },
        { time: '18.5', disabled: false, noState: false },
        { time: '19', disabled: false, noState: false },
        { time: '19.5', disabled: false, noState: false },
        { time: '20', disabled: false, noState: false },
        { time: '20.5', disabled: false, noState: false },
        { time: '21', disabled: false, noState: false }
      ],
      // 是否显示时间线
      showTimeLine: false,
      // 表格数据
      data: [],
      // 表头
      columns: [
        {
          key: 'name',
          title: '会议室名称',
          dataIndex: 'name',
          ellipsis: true,
          width: 200,
          render: text => {
            return (
              <span className={styles.ellipsis} style={{ width: 160 }}>
                {text}
              </span>
            )
          }
        },
        {
          key: 'address',
          title: '会议室地址',
          dataIndex: 'address',
          ellipsis: true,
          width: 200,
          render: (text, record) => {
            return (
              <span className={styles.ellipsis} style={{ width: 160 }}>
                {text}
              </span>
            )
          }
        },
        {
          key: 'device',
          title: '会议设备',
          width: 400,
          render: record => {
            let { room_devices = [] } = record || {}
            let text = room_devices.map(item => item.name).join(' / ')
            return (
              <span
                className={styles.ellipsis}
                style={{ width: 360 }}
                title={text}
              >
                {text}
              </span>
            )
          },
          ellipsis: true
        },
        {
          key: 'status',
          title: '当前状态',
          // dataIndex: 'status',
          width: 100,
          ellipsis: true,
          render: record => {
            let statusArr = ['disabled', 'enable']
            const text = statusArr[+record.room_status]
            const status = props.config || this.defaultConfig
            return (
              <div>
                <span
                  className={styles.status_item}
                  style={{ background: status[text]?.color }}
                ></span>
                <span>{status[text]?.text}</span>
              </div>
            )
          }
        },
        {
          key: 'time',
          width: 550,
          className: styles.time_step,
          title: val => {
            const arr = this.state.times.map((item, index) => {
              if (!(index % 4))
                return (
                  <span className={styles.title_time} key={index}>
                    {item.time < 10 ? '0' + item.time : item.time}:00
                  </span>
                )

              return ''
            })
            return (
              <div
                style={{ position: 'relative', height: '100%' }}
                ref={this.timeBox}
              >
                {arr}
                {/* {this.state.showTimeLine && index !== -1 && <span className={styles.time_line}></span>} */}
              </div>
            )
          },
          render: record => {
            const text = 'enable'
            const status = props.config || this.defaultConfig
            let index = 0
            let notStatelength = this.state.times.filter(item => !item.noState)
              .length
            return (
              <div className={styles.time_box}>
                {this.state.times.map((item, i) => {
                  let isHasPlan = (record.times_plan || []).includes(+item.time)
                  if (item.noState) index++
                  return (
                    <div
                      key={item.time}
                      className={`${styles.time_box_item} ${
                        item.noState
                          ? styles.noStateColor
                          : 'normalTime_' +
                            Math.abs(
                              this.state.times.length - notStatelength - i - 1
                            )
                      }`}
                      title={`${Action.forMatTime({
                        time: +item.time
                      })} - ${Action.forMatTime({ time: +item.time + 0.5 })}`}
                      style={{
                        background: isHasPlan
                          ? status['disabled']?.color
                          : status[text]?.color
                      }}
                    ></div>
                  )
                })}
              </div>
            )
          }
        },
        {
          title: '定价',
          dataIndex: 'hourly_cost',
          key: 'hourly_cost',
          render: (text, record) => {
            let number = text
            return (
              <div>
                {record._edit ? (
                  <InputNumber
                    autoFocus
                    defaultValue={text}
                    onChange={val => {
                      number = val
                    }}
                    style={{ width: 60 }}
                  />
                ) : (
                  <span className={styles.price_text}>{text}</span>
                )}
                <span>元/小时</span>
                {record._edit ? (
                  <Button
                    type="primary"
                    size="small"
                    style={{ marginLeft: 8 }}
                    onClick={() => this.savePrice(number, record)}
                  >
                    确定
                  </Button>
                ) : (
                  <a
                    className={styles.editPrice}
                    onClick={() => this.setEditProps(record)}
                  >
                    <span className={globalStyles.authTheme}>&#xe791;</span>
                  </a>
                )}
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'operation',
          width: 150,
          render: record => {
            return (
              <Row gutter={8} style={{ width: '100%' }}>
                <Col span={8}>
                  <a onClick={() => this.toEdit(record)}>编辑</a>
                </Col>
                <Col span={8}>
                  <Popconfirm
                    title={`确定删除 ${record.name} 会议室吗？`}
                    onConfirm={() => this.removeRoom(record)}
                    okButtonProps={{ type: 'danger' }}
                  >
                    <a style={{ color: '#F5222D' }}>删除</a>
                  </Popconfirm>
                </Col>
              </Row>
            )
          }
        }
      ],
      // 设备列表
      devices: [],
      //编辑会议室的参数
      room_datas: {},
      // 大屏是否输入了绑定码
      isMacCodeLarge: false,
      // 门牌是否输入了绑定码
      isMacCodeSmall: false,
      // 预览图的url
      previewSrc: [],
      previewCode: [],
      loadingModal: false // 显示modal的等待按钮
    }
  }

  componentDidMount() {
    // 获取会议室列表
    this.getList(true)
  }

  // 修改状态
  setEditProps = record => {
    this.setEditStatus(record, true)
  }

  setEditStatus = (record, flag) => {
    let { data } = this.state
    // 先更新不可编辑状态
    data = data.map(item => {
      if (item.id === record.id) {
        item._edit = flag
      }
      return item
    })
    this.setState({
      data
    })
  }

  savePrice = (price, record) => {
    let { data } = this.state
    this.setEditStatus(record, false)
    // 判定哪些可保存
    if (price < 0) return message.warn('价格不能为负数')
    if (record.hourly_cost.toString() === price.toString()) {
      return
    }
    Action.ChangePrice({ hourly_cost: price, room_id: record.id })
      .then(res => {
        data = data.map(item => {
          if (item.id === record.id) {
            item._edit = false
            item.hourly_cost = price
          }
          return item
        })
        this.setState({
          data
        })
        message.success('修改成功')
      })
      .catch(err => {
        message.warn(err.message)
      })
  }

  /**
   * 删除房间
   * @param {id: room_id} val 房间id
   */
  removeRoom = val => {
    let { data } = this.state

    Action.removeMeetingRoom({ id: val.id })
      .then(res => {
        message.success('删除会议室成功')
        data = data.filter(item => item.id !== val.id)
        this.setState(
          {
            data
          },
          () => {
            if (!data.length) {
              clearInterval(this.timer)
              this.timer = null
              this.removeTimeline()
            } else {
              this.setTimeLine()
            }
          }
        )
      })
      .catch(err => {
        message.warn(err.message)
      })
  }
  toEdit = async val => {
    // console.log(val)
    await this.addMeetingRoom()
    Action.getMeetingInfo({ id: val.id }).then(data => {
      let obj = {
        ...data,
        large_device: data.large_device?.code,
        large_device_name: data.large_device?.name,
        tablet_device: data.tablet_device?.code,
        tablet_device_name: data.tablet_device?.name
      }
      this.setState({
        modal: true,
        isMacCodeLarge: !!obj.large_device,
        isMacCodeSmall: !!obj.tablet_device,
        room_datas: obj,
        previewSrc: data.room_images
      })
    })
  }

  // 设置是否禁用的时间段
  setHasPlanTime = () => {
    let { data } = this.state
    let arr = data.map(item => {
      if (item.meeting_plans) {
        let plantimes = []
        item.meeting_plans.forEach(plan => {
          let start_time = Action.getHours(+(plan.start_time + '000'))
          let end_time = Action.getHours(+(plan.end_time + '000'))
          let times = (() => {
            let arr = []
            if (start_time < end_time)
              for (let i = start_time; i < end_time; ) {
                arr.push(i)
                i += 0.5
              }
            else if (start_time === end_time) {
              arr.push(start_time)
            }
            return arr
          })()
          // 将计算出来的整合
          plantimes = plantimes.concat(times)
        })

        item = Object.assign({}, item, { times_plan: plantimes })
      }
      return { ...item }
    })
    this.setState({
      data: arr
    })
    console.log(arr)
  }
  /**
   * 更新会议室列表
   */
  getList = isFirst => {
    if (this.props.org_id == '0')
      return notification.warn({
        message: '提示',
        description: <div>全组织模式下不允许使用会议管理,请选择组织</div>,
        placement: 'topRight'
      })
    Action.fetchList({
      org_id: this.props.org_id,
      ...this.state.query_param
    }).then(data => {
      this.setState(
        {
          data
        },
        () => {
          if (data.length) {
            this.setTimeLine()
            this.setUpdate()
            this.setHasPlanTime()
          } else {
            clearInterval(this.timer)
            this.removeTimeline()
          }
        }
      )
      if (data && data.length && isFirst) {
        this.createLineTimer = setTimeout(() => {
          // 设置时间线
          this.setTimeLine()
        }, 500)
        this.setUpdate()
      }
    })
  }

  /**
   * 设定定时更新时间线
   */
  setUpdate = () => {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      // 十秒钟更新一次位置
      this.setTimeLine()
    }, 10 * 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
    clearTimeout(this.createLineTimer)
  }

  // 删除时间线
  removeTimeline = () => {
    let line = document.querySelector('#time_line')
    if (line) {
      line.parentNode.removeChild(line)
    }
  }
  getOffsetTop(elm) {
    var mOffsetTop = elm.offsetTop
    var mOffsetParent = elm.offsetParent
    while (mOffsetParent) {
      mOffsetTop += mOffsetParent.offsetTop
      mOffsetParent = mOffsetParent.offsetParent
    }
    return mOffsetTop
  }
  // 设置时间线
  setTimeLine = () => {
    let t = new Date()
    let hours = t.getHours()
    let minut = t.getMinutes()
    if (minut >= 30) {
      hours = hours + 0.5
    }
    let index = this.state.times.findIndex(
      item => item.time === hours.toString()
    )
    // this.removeTimeline()
    if (index !== -1) {
      // let td = document.querySelector('.' + styles.time_step)
      // let tdTop = this.getOffsetTop(td)
      // let height = 0
      // let table = document.querySelector('.meeting_table')
      // if (table) {
      //   height = table.querySelector('.ant-table-body')?.clientHeight || 0
      // }
      // if (td) {
      //   this.tdHeight = td.clientHeight
      //   let span = document.createElement('span')
      //   span.id = 'time_line'
      //   span.style.left = 20 * index + 11 + 'px'
      //   span.innerHTML = `<i style="height:${Math.abs(height)}px;" />`
      //   span.className = styles.time_line
      //   // span.style.top = tdTop + 'px'
      //   td.appendChild(span)

      // document.body.appendChild(span)
      // }
      // 更新过期时间的颜色
      this.updateTimesColor(index)
    }
  }
  /**
   * 更新当前时间之前的数据不可选
   * @param {*} index 现在几点的下标
   */
  updateTimesColor = index => {
    let { times } = this.state
    let arr = times.map((item, i) => {
      if (i < index) {
        item.noState = true
      } else item.noState = false
      return item
    })
    this.setState({
      times: arr
    })
  }

  /**
   * 录入新会议室
   */
  addMeetingRoom = () => {
    return new Promise((resolve, reject) => {
      this.props.form.resetFields()
      this.setState({
        modal: true,
        isMacCodeLarge: false,
        isMacCodeSmall: false,
        room_datas: {},
        previewSrc: [],
        previewCode: []
      })
      Action.fetchDevices()
        .then(data => {
          // console.log(data)
          resolve()
          this.setState({
            devices: data || []
          })
        })
        .catch(err => {
          reject()
        })
    })
  }
  /**
   *
   * @param {*} val
   */
  beforeSubmit = val => {
    const { form } = this.props
    form.validateFields(async (err, values) => {
      if (err) {
        return
      }
      let obj = {}
      let keys = ['address', 'name', 'max_hold', 'device_type_ids']
      keys.forEach(item => {
        obj[item] = values[item]
      })
      if (values.large_device) {
        obj.large_device = {
          code: values.large_device,
          name: values.large_device_name
        }
      } else {
        obj.large_device = {
          code: '',
          name: values.large_device_name || ''
        }
      }
      if (values.tablet_device) {
        obj.tablet_device = {
          code: values.tablet_device,
          name: values.tablet_device_name
        }
      } else {
        obj.tablet_device = {
          code: '',
          name: values.tablet_device_name || ''
        }
      }
      if (this.state.previewCode.length) {
        obj.room_images = this.state.previewCode
      }
      obj.org_id = this.props.org_id
      // console.log(obj)
      this.setState({
        loadingModal: true
      })
      if (
        obj.large_device &&
        obj.large_device.code &&
        this.state.room_datas.large_device !== obj.large_device.code
      ) {
        let check = await Action.checkBindCode({
          bind_code: obj.large_device.code,
          device_type_id: 1
        }).catch(err => err)
        if (check.code !== '0') {
          message.warn('触控大屏:' + check.message)
          this.setState({
            loadingModal: false
          })
          return
        }
      }
      if (
        obj.tablet_device &&
        obj.tablet_device.code &&
        this.state.room_datas.tablet_device !== obj.tablet_device.code
      ) {
        let check = await Action.checkBindCode({
          bind_code: obj.tablet_device.code,
          device_type_id: 2
        }).catch(err => err)
        if (check.code !== '0') {
          message.warn('会议门牌:' + check.message)
          this.setState({
            loadingModal: false
          })
          return
        }
      }
      if (this.state.room_datas.id) {
        obj.id = this.state.room_datas.id
      }
      this.saveRoom(obj)
    })
  }
  /**
   * 保存会议室
   */
  saveRoom = data => {
    const { form } = this.props
    if (data.id) {
      // 编辑
      this.setState({
        loadingModal: true
      })
      Action.editMeetingInfo(data)
        .then(res => {
          form.resetFields()
          message.success('更新成功')
          this.getList()
          this.setState({
            loadingModal: false,
            modal: false
          })
        })
        .catch(er => {
          form.resetFields()
          message.success('更新失败,请稍后重试')
          this.setState({
            loadingModal: false,
            modal: false
          })
        })
    } else {
      Action.saveRoom(data)
        .then(res => {
          // 添加成功
          form.resetFields()
          this.getList()
          message.success('录入成功')
          this.setState({
            loadingModal: false,
            modal: false
          })
          if (!this.timer) {
            this.setUpdate()
          }
        })
        .catch(err => {
          form.resetFields()
          message.warn(err.message)
          this.setState({
            loadingModal: false,
            modal: false
          })
        })
    }
  }
  modalClose = () => {
    // console.log(this.state)
    this.setState({
      modal: false,
      loadingModal: false,
      previewCode: [],
      previewSrc: []
    })
    this.props.form.resetFields()
  }
  // 文件上传
  uploadFile = e => {
    let { previewCode, previewSrc } = this.state
    let files = e.target.files
    let file = files[0]
    let data = new FormData()
    data.append('file', file)
    Action.uploadFile(data)
      .then(res => {
        let id = Math.random() * 1e15 + 1
        previewCode.push({ file_key: res.data.file_key, id: id })
        previewSrc.push({
          preview_url: res.data.preview_url,
          id: id,
          noteupload: true
        })
        this.setState({
          previewSrc,
          previewCode
        })
      })
      .catch(err => {
        // console.log(err)
        message.error(err?.message)
      })
  }
  chooseFile = () => {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = '.png,.jpg,.jpeg,.gif'
    input.onchange = this.uploadFile
    input.click()
  }

  // 删除图片
  removeImage = val => {
    let { previewCode, previewSrc } = this.state
    previewCode = previewCode.filter(item => item.id !== val.id)
    previewSrc = previewSrc.filter(item => item.id !== val.id)
    this.setState({
      previewCode,
      previewSrc
    })
    if (!val.noteupload) {
      Action.removePicture({ id: val.id }).then(res => {
        message.success('删除成功')
      })
    }
  }

  // 下载安装包
  downloadPakage = val => {
    window.open(val.value)
  }

  // 使用授权
  setAuthorized = () => {
    if (this.props.org_id == '0') {
      return message.warn('全组织下禁止使用此功能')
    }
    this.setState({
      managePage: false
    })
  }

  onGoBack = () => {
    this.setState({
      managePage: true
    })
  }

  setSearchTime = (val, dateString) => {
    console.log(val.valueOf(), dateString)
    this.setState({
      query_param: {
        query_time: val.valueOf()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { config, workbenchBoxContent_height = 700 } = this.props
    const colors = config || this.defaultConfig
    const scrollHeight = workbenchBoxContent_height - 290 - (this.tdHeight || 0)
    return (
      <div className={styles.meeting_container}>
        {this.state.managePage ? (
          <div className={styles.meeting_container_content}>
            <Row gutter={8} type="flex" align="middle">
              <Col span={14}>
                <Row gutter={4} type="flex" align="middle">
                  <Col span={6}>
                    <DatePicker
                      onChange={this.setSearchTime}
                      defaultValue={moment(new Date(), 'YYYY-MM-DD')}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={18} className={styles.operation_btns}>
                    <a onClick={this.getList}>查询</a>
                    {/* <a>清空</a> */}
                  </Col>
                </Row>
              </Col>
              <Col span={4} className={styles.status_list}>
                <div>
                  <span
                    className={`${styles.status_item} ${styles.enable}`}
                    style={{ background: colors?.enable?.color }}
                  ></span>
                  <span>{colors?.enable?.text}</span>
                </div>
                <div>
                  <span
                    className={`${styles.status_item} ${styles.disabled}`}
                    style={{ background: colors?.disabled?.color }}
                  ></span>
                  <span>{colors?.disabled?.text}</span>
                </div>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  onClick={this.setAuthorized}
                  style={{ marginRight: 10 }}
                >
                  使用授权
                </Button>
                <Button type="primary" onClick={this.addMeetingRoom}>
                  录入新会议室
                </Button>
              </Col>
            </Row>

            <div className={styles.tableRender}>
              <Table
                scroll={{ y: scrollHeight, x: 1800 }}
                bordered
                onChange={() =>
                  setTimeout(() => {
                    this.setTimeLine()
                  }, 100)
                }
                pagination={{
                  showTotal: (total, range) =>
                    `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
                }}
                rowKey="id"
                dataSource={this.state.data}
                columns={this.state.columns}
                className="meeting_table"
              />
            </div>
          </div>
        ) : (
          <Authorized {...this.props} onGoBack={this.onGoBack} />
        )}
        <Modal
          closable={false}
          title="编辑会议室"
          width="30%"
          keyboard={false}
          maskClosable={false}
          confirmLoading={this.state.loadingModal}
          visible={this.state.modal}
          onOk={this.beforeSubmit}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          onCancel={() => this.modalClose()}
        >
          <div className={styles.editModal_container}>
            <Form layout="vertical">
              <Form.Item label="会议室名称">
                {getFieldDecorator('name', {
                  initialValue: this.state.room_datas.name,
                  rules: [{ required: true, message: '请输入会议室名称' }]
                })(<Input placeholder="请输入会议室名称" />)}
              </Form.Item>
              <Form.Item label="会议室地址">
                {getFieldDecorator('address', {
                  initialValue: this.state.room_datas.address
                })(<Input placeholder="例: 5楼 502会议室" />)}
              </Form.Item>
              <Form.Item label="容纳人数">
                {getFieldDecorator('max_hold', {
                  rules: [
                    {
                      required: false,
                      pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                      message: '请输入正确的数字'
                    }
                  ],
                  getValueFromEvent: event => {
                    return event.target.value.replace(/\D/g, '')
                  },
                  initialValue: this.state.room_datas.max_hold
                })(<Input placeholder="请输入" style={{ width: '100%' }} />)}
              </Form.Item>
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item label="触控大屏">
                    {getFieldDecorator('large_device', {
                      initialValue: this.state.room_datas.large_device
                    })(
                      <Input
                        placeholder="输入设备绑定码"
                        onChange={val =>
                          this.setState({ isMacCodeLarge: !!val.target.value })
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="设备名称">
                    {getFieldDecorator('large_device_name', {
                      rules: [
                        {
                          required: this.state.isMacCodeLarge,
                          message: '请输入设备名称'
                        }
                      ],
                      initialValue: this.state.room_datas.large_device_name
                    })(<Input placeholder="输入设备名称" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item label="会议门牌">
                    {getFieldDecorator('tablet_device', {
                      initialValue: this.state.room_datas.tablet_device
                    })(
                      <Input
                        placeholder="输入设备绑定码"
                        onChange={val =>
                          this.setState({ isMacCodeSmall: !!val.target.value })
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="设备名称">
                    {getFieldDecorator('tablet_device_name', {
                      rules: [
                        {
                          required: this.state.isMacCodeSmall,
                          message: '请输入设备名称'
                        }
                      ],
                      initialValue: this.state.room_datas.tablet_device_name
                    })(<Input placeholder="输入设备名称" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                {getFieldDecorator('device_type_ids', {
                  initialValue: this.state.room_datas.device_type_ids || []
                })(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      {this.state.devices.map(device => {
                        return (
                          <Col key={device.id} span={8}>
                            <Checkbox value={device.id}>{device.name}</Checkbox>
                          </Col>
                        )
                      })}
                    </Row>
                  </Checkbox.Group>
                )}
              </Form.Item>
              <Form.Item label="会议室照片">
                <div className={styles.defineUpload}>
                  {this.state.previewSrc.length ? (
                    this.state.previewSrc.map((item, index) => {
                      return (
                        <div className={styles.preview_img} key={item.id}>
                          <span
                            className={styles.preview_img_delete}
                            onClick={() => this.removeImage(item)}
                          >
                            <svg
                              t="1604574154174"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="11903"
                              width="12"
                              height="12"
                            >
                              <path
                                d="M853.333333 469.333333v85.333334H170.666667v-85.333334z"
                                p-id="11904"
                                fill="#ffffff"
                              ></path>
                            </svg>
                          </span>
                          <img src={item.preview_url} alt="" height="100%" />
                        </div>
                      )
                    })
                  ) : (
                    <div
                      className={styles.upload_msg}
                      onClick={this.chooseFile}
                    >
                      <img src={upimg} />
                      <div>上传照片</div>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(MeetingManage)
