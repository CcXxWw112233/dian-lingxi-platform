import {
  Button,
  Col,
  message,
  Row,
  Select,
  Table,
  Spin,
  Divider,
  Checkbox,
  Popconfirm
} from 'antd'
import React, { Fragment } from 'react'
import styles from './index.less'
import Action from '../../Action'
import { getSearchOrganizationList } from '../../../../../../../services/technological/organizationMember'
import debounce from 'lodash/debounce'

export default class Authorized extends React.PureComponent {
  constructor(props) {
    super(props)
    this.getOrgList = debounce(this.getOrgList, 500)
  }
  state = {
    data: [],
    selectedRoom: [],
    authList: [],
    rooms: [],
    fetching: false,
    org_list: [],
    selectedOrg: [],
    isLoading: false
  }

  columns = [
    {
      title: '授予组织',
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => {
        const { org_list, fetching } = this.state
        return (
          <Select
            placeholder="搜索添加组织"
            style={{ width: '60%' }}
            labelInValue
            disabled={!record.isAdd}
            defaultValue={record.auth_org}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            onSearch={this.getOrgList}
            onSelect={val => this.handleChangeOrg(val, record)}
            filterOption={false}
            showSearch
          >
            {org_list.map(item => {
              return (
                <Select.Option
                  value={item.id}
                  key={item.id}
                  disabled={item.disabled}
                >
                  {item.name}
                </Select.Option>
              )
            })}
          </Select>
        )
      }
    },
    {
      title: '会议室',
      key: 'room',
      width: 800,
      render: record => {
        const { rooms } = this.state
        return (
          <Select
            placeholder="添加会议室"
            mode="multiple"
            style={{ width: '60%' }}
            // maxTagCount={4}
            showArrow
            value={record.auth_room_ids || []}
            onSelect={val => this.setSelectRoom(val, record)}
            onDeselect={val => this.deSelectRoom(val, record)}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '2px 0' }} />
                <div
                  style={{ padding: '4px 8px 8px 8px', cursor: 'pointer' }}
                  onMouseDown={e => e.preventDefault()}
                >
                  <Checkbox
                    checked={!!record.checkAll}
                    onChange={e => this.setAllCheck(e, record)}
                    indeterminate={
                      !!(record.rooms || []).length &&
                      (record.rooms || []).length < this.state.rooms.length
                    }
                  >
                    全选
                  </Checkbox>
                </div>
              </div>
            )}
          >
            {rooms.map(item => {
              return (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              )
            })}
          </Select>
        )
      }
    },
    {
      title: '操作',
      key: 'operation',
      width: 200,
      render: record => {
        return (
          <Fragment>
            {record._unsave ? (
              <Button size="small" onClick={() => this.saveOrgAuth(record)}>
                保存
              </Button>
            ) : (
              <div className={styles.operation_items}>
                {record.auth_status === '1' ? (
                  <Popconfirm
                    title="确定取消授权吗?"
                    onConfirm={() => this.changeAuthStatus(record)}
                  >
                    <a>取消授权</a>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="确定授权吗?"
                    onConfirm={() => this.saveOrgAuth(record)}
                  >
                    <a>授权</a>
                  </Popconfirm>
                )}
                <Popconfirm
                  title="确定删除此授权信息吗?"
                  onConfirm={() => this.delOrgItem(record)}
                >
                  <span>删除</span>
                </Popconfirm>
              </div>
            )}
          </Fragment>
        )
      }
    }
  ]

  componentDidMount() {
    this.getAuthOrgList()
    this.getRoomList()
  }

  delOrgItem = record => {
    let arr = Array.from(this.state.data)
    if (record.isAdd) {
      arr = arr.filter(item => item.id !== record.id)
      this.setState(
        {
          data: arr
        },
        () => {
          this.setDisabledSelection()
        }
      )
    } else {
      Action.DelRoomOrg({ id: record.id })
        .then(res => {
          arr = arr.filter(item => item.id !== record.id)
          message.success('删除成功')
          this.setState(
            {
              data: arr
            },
            () => {
              this.setDisabledSelection()
            }
          )
        })
        .catch(err => {
          message.warn(err.message)
        })
    }
  }

  changeAuthStatus = record => {
    let obj = {
      id: record.id,
      auth_status: record._unsave
        ? record.auth_status
        : record.auth_status === '1'
        ? '0'
        : '1',
      auth_room_ids: record.auth_room_ids
    }
    if (!obj.auth_room_ids) {
      return message.warn('未选择会议室')
    }
    let arr = Array.from(this.state.data)
    Action.SaveEditRoom(obj)
      .then(res => {
        // console.log(res)
        message.success('修改成功')
        arr = arr.map(item => {
          if (item.id === record.id) {
            item._unsave = false
            item.auth_status = item.auth_status === '1' ? '0' : '1'
          }
          return item
        })
        this.setState({
          data: arr
        })
      })
      .catch(err => {
        message.warn(err.message)
      })
  }

  /**
   * 保存授权
   * @param {*} record
   */
  saveOrgAuth = record => {
    if (!record.auth_org || !record.auth_org?.key) {
      return message.warn('未选择授权组织')
    }
    if (!(record.auth_room_ids || []).length) {
      return message.warn('未选择会议室')
    }
    // 如果是已经授权了的，则需要更新授权状态
    if (!record.isAdd) return this.changeAuthStatus(record)
    let obj = {
      auth_room_ids: record.auth_room_ids,
      auth_org_id: record.auth_org.key,
      org_id: this.props.org_id,
      auth_status: record.auth_status || '0'
    }
    let arr = Array.from(this.state.data)
    // console.log(record)
    Action.addAuthOrg(obj)
      .then(res => {
        message.success('授权成功')
        arr = arr.map(item => {
          if (item.id === record.id) {
            if (res.data) {
              item.id = res.data.id
              item.auth_status = res.data.auth_status
            }
            item._unsave = false
            item.isAdd = false
          }
          return item
        })
        this.setState({
          data: arr
        })
      })
      .catch(err => {
        message.warn(err.message)
      })
  }
  // 选择了房间
  setSelectRoom = (val, record) => {
    let arr = [...this.state.data]
    arr = arr.map(item => {
      if (record.id === item.id) {
        item._unsave = true
        if (!item.auth_room_ids) item.auth_room_ids = []
        item.auth_room_ids.push(val)
        if (item.auth_room_ids.length === this.state.rooms.length) {
          item.checkAll = true
        } else item.checkAll = false
      }
      return item
    })
    this.setState({
      data: arr
    })
  }
  // 取消选择了房间
  deSelectRoom = (val, record) => {
    let arr = [...this.state.data]
    arr = arr.map(item => {
      if (item.id === record.id) {
        item._unsave = true
        item.auth_room_ids = item.auth_room_ids.filter(room => room !== val)
      }
      return item
    })
    this.setState({
      data: arr
    })
  }
  handleChangeOrg = (val, record) => {
    // 保存用auth_org_id 使用是 auth_org
    let arr = this.state.data.map(item => {
      if (item.id === record.id) {
        item.auth_org = { ...val, id: val.key, name: val.label }
      }
      return item
    })
    this.setState(
      {
        data: arr
      },
      () => {
        this.setDisabledSelection()
      }
    )
  }

  setAllCheck = (val, record) => {
    let flag = val.target.checked
    let arr = [...this.state.data]
    arr = arr.map(item => {
      if (item.id === record.id) {
        item._unsave = true
        if (!flag) {
          item.auth_room_ids = []
          item.checkAll = false
        } else {
          item.auth_room_ids = this.state.rooms.map(room => room.id)
          item.checkAll = true
        }
      }

      return item
    })
    this.setState({
      data: arr
    })
  }

  getOrgList = val => {
    this.setState({ fetching: true })
    getSearchOrganizationList({ name: val }).then(res => {
      console.log(this.state.selectedOrg)
      this.setState({
        fetching: false,
        org_list: (res.data || []).map(item => {
          if (this.state.selectedOrg.includes(item.id)) {
            item.disabled = true
          } else item.disabled = false
          return item
        })
      })
    })
  }

  getAuthOrgList = () => {
    this.setState({
      isLoading: true
    })
    Action.getRoomAuthList({ org_id: this.props.org_id })
      .then(res => {
        this.setState(
          {
            data: (res.data || []).map(item => {
              if (typeof item.auth_org === 'object') {
                item.auth_org = {
                  ...item.auth_org,
                  key: item.auth_org.id,
                  label: item.auth_org.name
                }
              }
              return item
            }),
            isLoading: false
          },
          () => {
            let orgs = this.setDisabledSelection()
            this.setState({
              org_list: orgs
            })
          }
        )
      })
      .catch(err => {
        message.warn(err.message)
      })
  }

  // 更新不可选的组织
  setDisabledSelection = () => {
    let { data } = this.state
    let orgs = []
    let arr = []
    let obj = {}
    ;(data || []).forEach(item => {
      if (!item.auth_org?.id || !item.auth_org.key) return
      if (!obj[item.auth_org.id || item.auth_org.key]) {
        arr.push(item.auth_org.id || item.auth_org.key)
        orgs.push({ ...item.auth_org, disabled: true })
        obj[item.auth_org.id || item.auth_org.key] = true
      }
    })

    this.setState({
      selectedOrg: arr,
      org_list: this.state.org_list.map(item => {
        if (arr.includes(item.id)) {
          item.disabled = true
        } else item.disabled = false
        return item
      })
    })
    return orgs
  }

  getRoomList = () => {
    Action.getRoomList({ org_id: this.props.org_id })
      .then(res => {
        this.setState({
          rooms: res.data
        })
      })
      .catch(err => {
        message.warn(err.message)
      })
  }
  goback = () => {
    const { onGoBack } = this.props
    onGoBack && onGoBack()
  }

  setAddAuthOrg = () => {
    let obj = {
      id: Math.random() * 1e10 + 1,
      name: '',
      auth_room_ids: [],
      isAdd: true,
      _unsave: true
    }
    let arr = Array.from(this.state.data)
    arr.push(obj)
    this.setState({
      data: arr
    })
  }
  render() {
    const { workbenchBoxContent_height = 700 } = this.props
    const scrollHeight = workbenchBoxContent_height - 290
    return (
      <div className={styles.container}>
        <div className={styles.container_header}>
          <Row>
            <Col span={12}>
              <span className={styles.org_name}>
                {this.props.currentSelectOrganize.name} - 会议使用授权
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={this.setAddAuthOrg}
              >
                添加授权
              </Button>
              <Button type="primary" onClick={this.goback}>
                返回
              </Button>
            </Col>
          </Row>
        </div>
        <div className={styles.authorized_table}>
          <Table
            loading={this.state.isLoading}
            scroll={{ y: scrollHeight }}
            bordered
            dataSource={this.state.data}
            columns={this.columns}
            rowKey="id"
          />
        </div>
      </div>
    )
  }
}
