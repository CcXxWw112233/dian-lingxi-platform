import React, { Component } from 'react'
import {
  ganttIsOutlineView,
  ganttIsSingleBoardGroupView,
  milestone_base_height,
  showMilestoneBase
} from '../../constants'
import styles from './index.less'
import outlineStyles from '../OutlineTree/index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Menu, Switch, Dropdown, Modal, Checkbox, message } from 'antd'
import { connect } from 'dva'
import OperateMenu from './OperateMenu'
import { getTreeNodeValue } from '../../../../../../models/technological/workbench/gantt/gantt_utils'
import { FEATURE_INSTANCE_CODE_TYPE } from '../../../../../../globalset/js/constant'
import FiledModal from './FiledModal'
import { batchDeleteNode } from '../../../../../../services/technological/gantt'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
// 分组和大纲视图最顶部的里程碑那一栏
@connect(mapStateToProps)
export default class MilestoneBaseHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realy_outline_tree_round_ids: [], //大纲树下所有的id(包含隐藏)
      list_group_ids: [], //分组视图节点id
      filed_modal_visible: false
    }
  }
  componentDidMount() {
    this.resetState()
    this.fetchSetting()
    this.recusionCheckOutlineIds(this.props)
    this.getGroupListId(this.props)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.outline_tree.length !== nextProps.outline_tree.length) {
      this.recusionCheckOutlineIds(nextProps)
    }
    if (
      this.props.list_group.length != nextProps.list_group.length ||
      this.props.gantt_board_id != nextProps.gantt_board_id
    ) {
      this.getGroupListId(nextProps)
    }
    // 检测到切换视图退出批量设置重置
    if (
      this.props.group_view_type != nextProps.group_view_type ||
      this.props.gantt_board_id != nextProps.gantt_board_id
    ) {
      this.resetState()
    }
  }
  resetState = () => {
    this.setState({
      realy_outline_tree_round_ids: [],
      list_group_ids: []
    })
    this.props.dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_operating: false,
        batch_opetate_ids: [],
        _already_batch_operate_ids: []
      }
    })
  }
  // 获取设置项
  fetchSetting = async () => {
    const { dispatch, outline_columns, outline_default_columns } = this.props
    let data = await dispatch({
      type: 'gantt/getOutlineTableHeader'
    })
    let arr = Array.from(outline_default_columns)
    if (data) {
      arr = []
      for (const key in data) {
        if (data[key] == 1) {
          let obj = outline_columns.find(item => item.dataIndex === key)
          if (obj) arr.push(obj.key)
        }
      }
    }

    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        outline_default_columns: arr,
        outline_is_show_order: !!+data?.is_show_order
      }
    })
  }
  computedWidth = arr => {
    if (arr.length === 3 || arr.length === 2) {
      return 460
    }
    if (arr.length === 4) {
      return 540
    }
    if (arr.length === 1) {
      return 370
    }
  }
  // 更新表头
  handleSelectionColumns = val => {
    const { dispatch, outline_columns, outline_default_columns } = this.props
    const { key, item } = val
    let dataIndex = item.props.item_key
    let arr = Array.from(outline_default_columns)
    let show = 0
    if (outline_default_columns.includes(key)) {
      arr = arr.filter(item => item !== key)
      show = 0
    } else {
      arr.push(key)
      show = 1
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        outline_default_columns: arr
      }
    })
    setTimeout(() => {
      // 更新页面
      let width = this.computedWidth(arr)
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          gantt_head_width: width
        }
      })
      dispatch({
        type: 'gantt/setOutlineTableHeader',
        payload: {
          [dataIndex]: show
        }
      })
      // 更新缓存
      window.localStorage.setItem('gantt_head_width', width)
      const target = document.getElementById('gantt_header_wapper')
      target.style.width = `${width}px`
      // 提醒一下拖动条在哪
      const slidebar = target.querySelector('.draggableSlidebar')
      slidebar.classList.add(outlineStyles.slideActive_bar)
      setTimeout(() => {
        slidebar.classList.remove(outlineStyles.slideActive_bar)
      }, 800)
    }, 200)
  }

  // 切换是否显示编号
  toogleNumber = val => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        outline_is_show_order: val
      }
    })
    dispatch({
      type: 'gantt/setOutlineTableHeader',
      payload: {
        is_show_order: val ? 1 : 0
      }
    })
  }
  // 下拉菜单
  SettingMenu = () => {
    const {
      dispatch,
      outline_columns,
      outline_default_columns,
      outline_is_show_order
    } = this.props

    return (
      <div className={outlineStyles.overlay_toogle_menu}>
        <Menu onClick={this.handleSelectionColumns}>
          {outline_columns.map(item => {
            return (
              <Menu.Item key={item.key} item_key={item.dataIndex}>
                <div className={outlineStyles.selectColumns}>
                  {item.title}
                  {outline_default_columns.includes(item.key) && (
                    <span
                      className={`${outlineStyles.active} ${globalStyles.authTheme}`}
                    >
                      &#xe7fc;
                    </span>
                  )}
                </div>
              </Menu.Item>
            )
          })}
        </Menu>
        <div className={outlineStyles.overlay_toogle_number}>
          <span>显示编号</span>
          <span>
            <Switch
              onChange={this.toogleNumber}
              checked={outline_is_show_order}
            />
          </span>
        </div>
      </div>
    )
  }
  //退出批量设置
  quitBatchOperating = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_operating: false,
        batch_opetate_ids: [],
        already_batch_operate_ids: []
      }
    })
  }

  // 批量删除任务里程碑等等
  batchDeleteInstanceConfirm = () => {
    const { batch_opetate_ids = [] } = this.props
    if (!batch_opetate_ids.length) {
      message.warn('请选择需要删除的节点')
      return
    }
    const _self = this
    Modal.confirm({
      title: '确认删除所选节点吗？',
      onOk() {
        _self.batchDeleteInstance()
      }
    })
  }
  batchDeleteInstance = () => {
    const { batch_opetate_ids, outline_tree = [], dispatch } = this.props
    let card_ids = [],
      milestone_ids = [],
      flow_ids = []
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
    batchDeleteNode({ card_ids, flow_ids, milestone_ids }).then(res => {
      if (isApiResponseOk(res)) {
        dispatch({
          type: 'gantt/getGanttData',
          payload: {}
        }).then(() => {
          dispatch({
            type: 'gantt/updateDatas',
            payload: {
              batch_opetate_ids: [],
              batch_operating: false
            }
          })
        })
      } else {
        message.error(res.message)
      }
    })
  }

  // 获取大纲树状结构所有节点id
  recusionCheckOutlineIds = props => {
    const { outline_tree = [] } = props
    let realy_outline_tree_round_ids = [] //大纲树递归获取数据成为一维数组
    const recusion = arr => {
      for (let val of arr) {
        if (val.id) {
          realy_outline_tree_round_ids.push(val.id)
        }
        if (val.children?.length) {
          recusion(val.children)
        }
      }
    }
    recusion(outline_tree)
    this.setState({
      realy_outline_tree_round_ids
    })
  }
  // 获取分组所有分组id
  getGroupListId = props => {
    const { list_group = [] } = props
    const list_group_ids = []
    for (let val of list_group) {
      list_group_ids.push(val.list_id)
    }
    this.setState({
      list_group_ids
    })
  }
  // 全选
  onCheckAllChange = () => {
    const { batch_opetate_ids = [], dispatch, group_view_type } = this.props
    let _batch_opetate_ids = []
    const code = ganttIsOutlineView({ group_view_type })
      ? 'realy_outline_tree_round_ids'
      : 'list_group_ids'
    if (
      batch_opetate_ids.length &&
      batch_opetate_ids.length === this.state[code].length
    ) {
      //如果原来为全选，就变为空
    } else {
      //其它情况下，没有已选或者选了一部分，都变为全选
      _batch_opetate_ids = this.state[code]
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_opetate_ids: _batch_opetate_ids
      }
    })
  }
  //全选框的状态
  setAllCheckStatus = () => {
    const { group_view_type, gantt_board_id, batch_opetate_ids } = this.props
    const { realy_outline_tree_round_ids = [], list_group_ids } = this.state
    let indeterminate, all_checked
    if (ganttIsOutlineView({ group_view_type })) {
      indeterminate =
        batch_opetate_ids.length &&
        realy_outline_tree_round_ids.length > batch_opetate_ids.length
      all_checked =
        batch_opetate_ids.length &&
        realy_outline_tree_round_ids.length == batch_opetate_ids.length
    } else if (
      ganttIsSingleBoardGroupView({ gantt_board_id, group_view_type })
    ) {
      indeterminate =
        batch_opetate_ids.length &&
        list_group_ids.length > batch_opetate_ids.length
      all_checked =
        batch_opetate_ids.length &&
        list_group_ids.length == batch_opetate_ids.length
    } else {
    }
    return {
      indeterminate: !!indeterminate,
      all_checked: !!all_checked
    }
  }

  // 设置字段弹框显示隐藏
  setFiledModalVisible = bool => {
    this.setState({
      filed_modal_visible: bool
    })
  }
  setFiledModalVisibleConfirm = () => {
    const { batch_opetate_ids = [] } = this.props
    if (!batch_opetate_ids.length) {
      message.warn('请选择需要操作的节点')
      return
    }
    this.setFiledModalVisible(true)
  }

  render() {
    const {
      outline_columns,
      outline_default_columns,
      group_view_type,
      gantt_board_id,
      projectDetailInfoData = {},
      batch_operating,
      batch_opetate_ids
    } = this.props
    const { realy_outline_tree_round_ids = [] } = this.state
    const { board_progress } = projectDetailInfoData
    const is_outline_view = ganttIsOutlineView({ group_view_type })
    const { indeterminate, all_checked } = this.setAllCheckStatus()
    return (
      <div
        className={`${styles.base}`}
        style={{
          height: milestone_base_height,
          display: showMilestoneBase({ group_view_type, gantt_board_id })
            ? 'block'
            : 'none'
        }}
      >
        <div
          className={outlineStyles.outline_header}
          // style={{ marginLeft: batch_operating && is_outline_view ? 30 : '' }}
        >
          <div
            className={outlineStyles.flex1}
            style={{ flex: outline_default_columns.length <= 2 ? 2 : 1 }}
          >
            {/* 设置大纲显示项 */}
            {is_outline_view && !batch_operating && (
              <Dropdown
                overlayClassName={outlineStyles.settingOverlay}
                trigger={['click']}
                overlay={this.SettingMenu()}
                overlayStyle={{ width: 200 }}
              >
                <div
                  className={`${globalStyles.authTheme} ${outlineStyles.settings_icon}`}
                >
                  &#xe78e;
                </div>
              </Dropdown>
            )}
            {/* 设置操作按钮区域 */}
            <div
              className={`${outlineStyles.item_title_name} ${styles.operate_wrapper}`}
              style={{ width: 242 }}
            >
              {!batch_operating ? (
                <Dropdown
                  overlayClassName={outlineStyles.settingOverlay}
                  overlay={
                    <div className={outlineStyles.overlay_toogle_menu}>
                      <OperateMenu />
                    </div>
                  }
                  trigger={['click']}
                >
                  <div
                    className={`${globalStyles.authTheme} ${styles.operate_icon}`}
                  >
                    &#xe855;
                  </div>
                </Dropdown>
              ) : (
                // 退出批量操作按钮
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={all_checked}
                  ></Checkbox>
                  <div
                    onClick={this.quitBatchOperating}
                    style={{ marginLeft: 8 }}
                    className={`${globalStyles.authTheme} ${styles.operate_icon}`}
                  >
                    &#xe816;
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* 大纲显示项标题 */}
          {!batch_operating && (
            <div className={outlineStyles.flex2}>
              {is_outline_view ? (
                <>
                  {outline_columns
                    .filter(c => outline_default_columns.includes(c.key))
                    .map(item => {
                      return (
                        <div
                          className={outlineStyles[item.className]}
                          key={item.key}
                        >
                          {item.title}
                        </div>
                      )
                    })}
                </>
              ) : (
                <div style={{ paddingRight: 20 }}>{board_progress}%</div>
              )}
            </div>
          )}
          {batch_operating && (
            <div
              className={`${outlineStyles.flex2} ${styles.batching_operate_area}`}
            >
              <div
                onClick={() => this.setFiledModalVisibleConfirm()}
                className={`${globalStyles.authTheme} ${styles.operate_icon}`}
              >
                &#xe7bd;
              </div>
              <div
                style={{
                  display: ganttIsOutlineView({ group_view_type })
                    ? 'block'
                    : 'none'
                }}
                onClick={this.batchDeleteInstanceConfirm}
                className={`${globalStyles.authTheme} ${styles.operate_icon}`}
              >
                &#xe720;
              </div>
            </div>
          )}
        </div>
        <FiledModal
          visible={this.state.filed_modal_visible}
          setFiledModalVisible={this.setFiledModalVisible}
        />
      </div>
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
      list_group
    }
  },
  projectDetail: {
    datas: { projectDetailInfoData }
  }
}) {
  return {
    outline_columns,
    outline_default_columns,
    outline_is_show_order,
    group_view_type,
    gantt_board_id,
    projectDetailInfoData,
    batch_operating,
    batch_opetate_ids,
    outline_tree,
    list_group
  }
}
