import React, { Component } from 'react'
import {
  ganttIsOutlineView,
  milestone_base_height,
  showMilestoneBase
} from '../../constants'
import styles from './index.less'
import outlineStyles from '../OutlineTree/index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Menu, Switch, Dropdown, Modal, Checkbox } from 'antd'
import { connect } from 'dva'
import OperateMenu from './OperateMenu'
import { getTreeNodeValue } from '../../../../../../models/technological/workbench/gantt/gantt_utils'
import { FEATURE_INSTANCE_CODE_TYPE } from '../../../../../../globalset/js/constant'
// 分组和大纲视图最顶部的里程碑那一栏
@connect(mapStateToProps)
export default class MilestoneBaseHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realy_outline_tree_round_ids: [] //大纲树下所有的id(包含隐藏)
    }
  }
  componentDidMount() {
    this.fetchSetting()
    this.recusionCheckOutlineIds()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.outline_tree.length !== nextProps.outline_tree.length) {
      this.recusionCheckOutlineIds()
    }
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
        batch_operating: false
      }
    })
  }

  // 批量删除任务里程碑等等
  batchDeleteInstanceConfirm = () => {
    const _self = this
    Modal.confirm({
      title: '确认删除所选字段吗？',
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
  }

  recusionCheckOutlineIds = flag => {
    const { outline_tree = [] } = this.props
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
  // 全选
  onCheckAllChange = () => {
    const { batch_opetate_ids = [], dispatch } = this.props
    const { realy_outline_tree_round_ids = [] } = this.state
    let checked = false
    let _batch_opetate_ids = []
    if (
      batch_opetate_ids.length &&
      batch_opetate_ids.length === realy_outline_tree_round_ids.length
    ) {
      //如果原来为全选，就变为空
    } else {
      //其它情况下，没有已选或者选了一部分，都变为全选
      _batch_opetate_ids = realy_outline_tree_round_ids
      checked = true
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_opetate_ids: _batch_opetate_ids
      }
    })
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
    const indeterminate =
      batch_opetate_ids.length &&
      realy_outline_tree_round_ids.length > batch_opetate_ids.length

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
                    checked={
                      realy_outline_tree_round_ids.length ==
                      batch_opetate_ids.length
                    }
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
                className={`${globalStyles.authTheme} ${styles.operate_icon}`}
              >
                &#xe7bd;
              </div>
              <div
                onClick={this.batchDeleteInstanceConfirm}
                className={`${globalStyles.authTheme} ${styles.operate_icon}`}
              >
                &#xe720;
              </div>
            </div>
          )}
        </div>
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
      outline_tree
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
    outline_tree
  }
}
