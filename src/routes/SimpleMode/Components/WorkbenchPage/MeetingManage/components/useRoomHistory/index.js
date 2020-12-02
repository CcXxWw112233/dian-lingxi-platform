import { Button, Col, Row, DatePicker, message, Table, Select } from 'antd'
import React from 'react'
import styles from './index.less'
import Action from '../../Action'
import MultipleSelect from '../MultipleSelect'
import { dateFormat } from '../../../../../../../utils/util'

const { RangePicker } = DatePicker

export default class UseRoomHistory extends React.Component {
  query_params = {
    query_start_time: new Date().getTime(),
    query_end_time: new Date().getTime(),
    current_page: 1,
    page_size: 10,
    room_ids: [],
    org_ids: []
  }
  state = {
    selectedOrgs: [],
    selectedRooms: [],
    data: [],
    orgs: [],
    rooms: [],
    status_list: [
      { label: '取消', value: 'cancel' },
      { label: '未使用', value: 'unused' },
      { label: '进行中', value: 'using' },
      { label: '已使用', value: 'finish' },
      { label: '已记账', value: 'invoice' },
      { label: '已结账', value: 'checkout' }
    ],
    columns: [
      {
        title: '组织名称',
        key: 'name',
        width: 200,
        render: record => {
          return <span>{record.booker_org?.name}</span>
        }
      },
      {
        title: '会议室名称',
        key: 'room',
        width: 500,
        render: record => {
          return <span>{record.meeting_room?.name}</span>
        }
      },
      {
        title: '使用时段',
        key: 'time',
        width: 200,
        render: record => {
          return (
            <span>
              {dateFormat(+(record.start_time + '000'), 'yyyy-MM-dd HH:mm')}-
              {dateFormat(+(record.end_time + '000'), 'HH:mm')}
            </span>
          )
        }
      },
      {
        title: '费用(元)',
        dataIndex: 'total_cost',
        width: 100
      },
      {
        title: '状态',
        key: 'status',
        width: 100,
        render: record => {
          const { status_list } = this.state
          let obj =
            status_list.find(item => item.value === record.meeting_status) || {}
          return <span>{obj.label || '未知状态'}</span>
        }
      },
      {
        title: '联系人',
        dataIndex: 'booker_name'
      },
      {
        title: '联系方式',
        width: 300,
        dataIndex: 'booker_mobile'
      }
    ]
  }
  componentDidMount() {
    // this.getList()
    Promise.all([this.getAllRooms(), this.getOrgList()]).then(res => {
      // console.log(res)
      let { orgs, rooms } = this.state
      this.query_params.room_ids = rooms.map(item => item.id)
      this.query_params.org_ids = orgs.map(item => item.id)
      this.setState({
        selectedOrgs: this.query_params.org_ids,
        selectedRooms: this.query_params.room_ids
      })
      this.getList()
    })
  }
  // 获取组织列表
  getOrgList = () => {
    return new Promise((resolve, reject) => {
      Action.getHistoryOrgList({ org_id: this.props.org_id })
        .then(res => {
          resolve(res)
          // console.log(res)
          this.setState({
            orgs: res.data || []
          })
        })
        .catch(err => {
          reject(err)
          message.warn(err.message)
        })
    })
  }
  // 获取房间列表
  getAllRooms = () => {
    return new Promise((resolve, reject) => {
      let org_id = this.props.org_id
      Action.getRoomList({ org_id })
        .then(res => {
          resolve(res)
          this.setState({
            rooms: res.data || []
          })
        })
        .catch(err => {
          reject(err)
          message.warn(err.message)
        })
    })
  }
  // 设置查询时间
  setQueryTime = val => {
    if (!val.length) {
      this.query_params.query_start_time = new Date().getTime()
      this.query_params.query_end_time = new Date().getTime()
      return
    }
    let start_time = val[0].valueOf()
    let endt_time = val[1].valueOf()
    this.query_params.query_start_time = start_time
    this.query_params.query_end_time = endt_time
  }

  setQueryParam = (val, property) => {
    this.query_params[property] = val
  }

  getList = () => {
    Action.getHistoryUseList(this.query_params)
      .then(res => {
        // console.log(res)
        this.setState({
          data: res.data || []
        })
      })
      .catch(err => {
        message.warn(err.message)
      })
  }

  paginationChange = val => {
    this.query_params.current_page = val.current
    this.getList()
  }

  // 生成账单按钮
  setOrderPayment = () => {
    // 使用方组织id
    let lessee_org_id = this.query_params.org_ids[0]
    // 资源方组织id
    let lessor_org_id = this.props.org_id
    let param = {
      room_ids: this.query_params.room_ids,
      lessor_org_id,
      lessee_org_id,
      query_start_time: this.query_params.query_start_time,
      query_end_time: this.query_params.query_end_time,
      query_status: 'finish'
    }
    Action.setGenerate(param).then(res => {
      console.log(res)
    })
  }

  render() {
    const { orgs, rooms, status_list, selectedOrgs, selectedRooms } = this.state
    const { workbenchBoxContent_height = 700 } = this.props
    const scrollHeight = workbenchBoxContent_height - 290
    return (
      <div className={styles.container}>
        <Row type="flex" align="middle">
          <Col span={18}>
            <Row gutter={8} type="flex" align="middle">
              <Col span={6}>
                <MultipleSelect
                  placeholder="选择组织"
                  options={orgs}
                  onFocus={this.getOrgList}
                  valueKey="id"
                  labelKey="name"
                  selectedArray={selectedOrgs}
                  showCheckAll
                  onChange={val => this.setQueryParam(val, 'org_ids')}
                />
              </Col>
              <Col span={6}>
                <MultipleSelect
                  placeholder="选择会议室"
                  options={rooms}
                  valueKey="id"
                  onFocus={this.getAllRooms}
                  labelKey="name"
                  selectedArray={selectedRooms}
                  showCheckAll
                  onChange={val => this.setQueryParam(val, 'room_ids')}
                />
              </Col>
              <Col span={4}>
                <Select
                  style={{ width: '100%' }}
                  defaultValue=""
                  onChange={val => this.setQueryParam(val, 'query_status')}
                >
                  <Select.Option value="">所有状态</Select.Option>
                  {status_list.map(item => {
                    return (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Col>
              <Col span={6}>
                <RangePicker onChange={this.setQueryTime} />
              </Col>
              <Col span={2} className={styles.textBtn}>
                <a onClick={this.getList}>查询</a>
                {/* <a>清空</a> */}
              </Col>
            </Row>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              onClick={this.setOrderPayment}
              disabled={
                selectedRooms.length != 1 && !this.state.data?.list?.length
              }
            >
              生成账单
            </Button>
          </Col>
        </Row>
        <div className={styles.historyTable}>
          <Table
            bordered
            onChange={this.paginationChange}
            columns={this.state.columns}
            scroll={{ y: scrollHeight }}
            dataSource={this.state.data?.list || []}
            pagination={{
              current: this.query_params.current_page,
              pageSize: this.query_params.page_size,
              total: this.state.data?.total_count
            }}
          />
        </div>
      </div>
    )
  }
}
