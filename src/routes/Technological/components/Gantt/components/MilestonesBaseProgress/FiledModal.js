import { Checkbox, Menu, message, Modal } from 'antd'
import React, { Component } from 'react'
import CustomCategoriesOperate from './CustomFields/CustomCategoriesOperate'
import FileldsTypeWrapper from './CustomFields/FileldsTypeWrapper'
import commonStyles from './CustomFields/common.less'

import styles from './index.less'
import { getTreeNodeValue } from '../../../../../../models/technological/workbench/gantt/gantt_utils'
import { FEATURE_INSTANCE_CODE_TYPE } from '../../../../../../globalset/js/constant'
import { connect } from 'dva'
import {
  batchDeleteFileds,
  batchSetFileds
} from '../../../../../../services/technological/gantt'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import { getCustomFieldList } from '../../../../../../services/organization'
import { ganttIsOutlineView } from '../../constants'

@connect(mapStateToProps)
export default class FiledModal extends Component {
  state = {
    operate_type: 'add', // add || remove
    add_select_ids: [], //添加字段已选项
    remove_select_ids: [], //移除字段选项
    fields: [] //字段列表
  }
  componentDidMount() {
    this.fetchCustomFields()
  }
  componentWillReceiveProps(nextProps) {
    // 弹出的时候做请求
    if (nextProps.visible && !this.props.visible) {
      this.fetchCustomFields()
    }
  }
  // 过滤出需要渲染的条
  filterEffectFields = (fields = []) => {
    const _fields = fields.filter(item => {
      const { field_type, field_status } = item
      return ['1', '2'].includes(field_type) && field_status != '1'
    })
    this.setState({
      fields: _fields
    })
  }

  /** 获取自定义字段 */
  fetchCustomFields = () => {
    let org_id = localStorage.getItem('OrganizationId')
    if (org_id == '0') {
      org_id = window.sessionStorage.getItem('aboutBoardOrganizationId')
    }
    getCustomFieldList({ _organization_id: org_id }).then(res => {
      if (isApiResponseOk(res)) {
        const { fields = [], groups = [] } = res.data
        let _group_fileds = []
        for (let val of groups) {
          _group_fileds = _group_fileds.concat(val.fields || [])
        }
        const _new_data = [].concat(fields, _group_fileds)
        this.filterEffectFields(_new_data)
      }
    })
  }

  //设置tab选项
  setMenu = ({ key }) => {
    this.setState({
      operate_type: key
    })
  }
  renderTitle = () => {
    return (
      <Menu
        mode="horizontal"
        selectedKeys={[this.state.operate_type]}
        onClick={this.setMenu}
        style={{ height: 56 }}
      >
        <Menu.Item key={'add'} style={{ height: 56, lineHeight: '56px' }}>
          添加字段
        </Menu.Item>
        <Menu.Item key={'remove'} style={{ height: 56, lineHeight: '56px' }}>
          移除字段
        </Menu.Item>
      </Menu>
    )
  }
  // 全部
  renderAllSelect = () => {
    const { fields, add_select_ids } = this.state
    const indeterminate =
      add_select_ids.length && fields.length > add_select_ids.length
    return (
      <div className={commonStyles.custom_operate_wrapper}>
        <div className={`${commonStyles.custom_field_item_wrapper} }`}>
          <div className={commonStyles.custom_field_item}>
            <div className={commonStyles.c_left}>
              <div className={`${commonStyles.check_box}`}>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={fields.length == add_select_ids.length}
                />
              </div>
              <div
                className={` ${commonStyles.field_name_icon}`}
                style={{ width: 16 }}
              ></div>
              <div className={commonStyles.field_name}>全部</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // 全选框
  onCheckAllChange = () => {
    const { add_select_ids = [], fields } = this.state
    let _add_select_ids = []
    if (add_select_ids.length && add_select_ids.length === fields.length) {
      //如果原来为全选，就变为空
    } else {
      //其它情况下，没有已选或者选了一部分，都变为全选
      _add_select_ids = fields.map(item => item.id)
    }
    this.setState({
      add_select_ids: _add_select_ids
    })
  }

  // 单个项目选择
  singleChange = ({ target }) => {
    const { operate_type } = this.state
    const ids_code =
      operate_type == 'add' ? 'add_select_ids' : 'remove_select_ids'
    const ids = this.state[ids_code]
    const { checked, value } = target
    let _ids = [...ids]
    if (!checked) {
      _ids = ids.filter(item => item != value)
    } else {
      _ids.push(value)
    }
    this.setState({
      [ids_code]: _ids
    })
  }

  onCancel = () => {
    this.props.setFiledModalVisible(false)
    this.setState({
      operate_type: 'add',
      add_select_ids: [],
      remove_select_ids: []
    })
  }
  //子项影响父级
  handleUpdateModelDatas = ({ data, type }) => {
    const { fields = [] } = this.state
    let new_fields = [...fields]
    // debugger
    switch (type) {
      case 'update':
        const { id, field_value } = data
        new_fields = new_fields.map(item => {
          if (item.id == id) {
            let new_item = { ...item }
            new_item = { ...item, field_value: field_value }
            return new_item
          } else {
            return item
          }
        })
        break
      case 'delete':
        new_fields = new_fields.filter(item => item.id != data)
        break

      default:
        break
    }
    this.setState({
      fields: new_fields
    })
  }
  //清除单条
  clearItem = ({ id }) => {
    const { fields = [] } = this.state
    let new_fields = [...fields]
    new_fields = new_fields.map(item => {
      if (item.id == id) {
        let new_item = { ...item }
        delete new_item.field_value
        return new_item
      } else {
        return item
      }
    })
    this.setState({
      fields: new_fields
    })
  }
  onOk = () => {
    const { operate_type } = this.state
    if ('add' == operate_type) {
      this.setFields()
    } else if ('remove' == operate_type) {
      this.removeFieldsConfirm()
    } else {
    }
  }

  //获取参数
  getRequestParams = () => {
    const {
      batch_opetate_ids = [],
      outline_tree = [],
      group_view_type,
      gantt_board_id
    } = this.props
    let card_ids = [],
      milestone_ids = [],
      flow_ids = [],
      list_ids
    if (ganttIsOutlineView({ group_view_type })) {
      for (let val of batch_opetate_ids) {
        const { tree_type, id } = getTreeNodeValue(outline_tree, val) || {}
        if (tree_type == FEATURE_INSTANCE_CODE_TYPE.MILESTONE) {
          milestone_ids.push(id)
        } else if (tree_type == FEATURE_INSTANCE_CODE_TYPE.CARD) {
          card_ids.push(id)
        } else if (tree_type == FEATURE_INSTANCE_CODE_TYPE.FLOW) {
          flow_ids.push(id)
        } else {
        }
      }
    } else {
      list_ids = batch_opetate_ids
    }
    return {
      card_ids,
      milestone_ids,
      list_ids,
      board_id: gantt_board_id
      // flow_ids
    }
  }

  // 添加字段
  setFields = () => {
    const { fields = [], add_select_ids } = this.state
    let field_values = {}
    for (let val of fields) {
      if (add_select_ids.includes(val.id)) {
        field_values[val.id] = val.field_value || ''
      }
    }
    const param = { ...this.getRequestParams(), field_values }
    batchSetFileds(param).then(res => {
      if (isApiResponseOk(res)) {
        message.success('设置成功')
        this.batchSetCalback()
      } else {
        message.error(res.message)
      }
    })
  }
  // 移除字段
  removeFieldsConfirm = () => {
    const _self = this
    Modal.confirm({
      title: '确认移除字段？',
      onOk() {
        _self.removeFields()
      }
    })
  }
  removeFields = () => {
    const { remove_select_ids } = this.state
    const param = { ...this.getRequestParams(), field_ids: remove_select_ids }
    batchDeleteFileds(param).then(res => {
      if (isApiResponseOk(res)) {
        message.success('成功移除字段')
        this.batchSetCalback()
      } else {
        message.error(res.message)
      }
    })
  }

  // 批量设置后回调，将已经设置的节点缓存
  batchSetCalback = () => {
    this.onCancel()
    const {
      dispatch,
      already_batch_operate_ids,
      batch_opetate_ids
    } = this.props
    let _already_batch_operate_ids = [].concat(
      already_batch_operate_ids,
      batch_opetate_ids
    )
    _already_batch_operate_ids = Array.from(new Set(_already_batch_operate_ids))
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_opetate_ids: [],
        already_batch_operate_ids: _already_batch_operate_ids
      }
    })
  }

  //设置确认按钮disabled
  setButtonDisabled = () => {
    const {
      operate_type,
      remove_select_ids = [],
      add_select_ids = []
    } = this.state
    if (operate_type == 'add') {
      return !add_select_ids.length
    } else if (operate_type == 'remove') {
      return !remove_select_ids.length
    } else {
      return false
    }
  }

  render() {
    const { visible = true } = this.props
    const {
      operate_type,
      fields,
      add_select_ids,
      remove_select_ids
    } = this.state
    return (
      <Modal
        title={this.renderTitle()}
        visible={visible}
        wrapClassName={styles.filed_modal}
        okText={operate_type == 'add' ? '添加' : '移除'}
        onCancel={this.onCancel}
        onOk={this.onOk}
        okButtonProps={{ disabled: this.setButtonDisabled() }}
        destroyOnClose
        bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
      >
        <div style={{ display: operate_type == 'add' ? 'block' : 'none' }}>
          {this.renderAllSelect()}
          <CustomCategoriesOperate
            fields={fields}
            handleUpdateModelDatas={this.handleUpdateModelDatas}
            clearItem={this.clearItem}
            singleChange={this.singleChange}
            add_select_ids={add_select_ids}
          />
        </div>
        <div style={{ display: operate_type == 'remove' ? 'block' : 'none' }}>
          <FileldsTypeWrapper
            fields={fields}
            remove_select_ids={remove_select_ids}
            singleChange={this.singleChange}
          />
        </div>
      </Modal>
    )
  }
}

function mapStateToProps({
  gantt: {
    datas: {
      outline_columns,
      outline_default_columns,
      outline_is_show_order,
      group_view_type,
      gantt_board_id,
      batch_operating,
      batch_opetate_ids,
      outline_tree,
      already_batch_operate_ids = []
    }
  }
}) {
  return {
    outline_columns,
    outline_default_columns,
    outline_is_show_order,
    group_view_type,
    gantt_board_id,
    batch_operating,
    batch_opetate_ids,
    outline_tree,
    already_batch_operate_ids
  }
}
