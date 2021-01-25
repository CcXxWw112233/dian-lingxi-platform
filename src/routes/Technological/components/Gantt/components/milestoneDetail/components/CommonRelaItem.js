import React from 'react'
import taskItemStyles from './taskItem.less'
import { Icon, message, Popconfirm } from 'antd'
import {
  caldiffDays,
  timestampToTimeNormal
} from '../../../../../../../utils/util'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import AvatarList from '../../../../../../../components/avatarList'
import { connect } from 'dva'
import { currentNounPlanFilterName } from '../../../../../../../utils/businessFunction'
import {
  MESSAGE_DURATION_TIME,
  TASKS
} from '../../../../../../../globalset/js/constant'
import { isApiResponseOk } from '../../../../../../../utils/handleResponseData'
import { completeTask } from '../../../../../../../services/technological/task'
import { ganttIsOutlineView } from '../../../constants'
import { getTreeNodeValue } from '../../../../../../../models/technological/workbench/gantt/gantt_utils'
import { onChangeCardHandleCardDetail } from '../../../ganttBusiness'

@connect(mapStateToProps)
export default class CommonRelaItem extends React.Component {
  state = {}
  deleteConfirm = ({ id }) => {
    const {
      milestone_id,
      dispatch,
      deleteRelationContent,
      card_id
    } = this.props
    dispatch({
      type: 'milestoneDetail/taskCancelRelaMiletones',
      payload: {
        id: milestone_id,
        rela_id: id
      }
    }).then(res => {
      if (isApiResponseOk(res)) {
        if (typeof deleteRelationContent == 'function') deleteRelationContent()
        // 更新弹窗数据
        dispatch({
          type: 'gantt/updateCardDetailDrawer',
          payload: {
            card_id
          }
        })
        // 如果是在大纲视图 则需要更新大纲视图下树变化
        dispatch({
          type: 'gantt/updateOutLineTreeNode',
          payload: {
            card_id: id
          }
        })
      }
    })
  }

  changeOutLineTreeNodeProto = (id, data = {}) => {
    let { dispatch, outline_tree = [] } = this.props
    let nodeValue = getTreeNodeValue(outline_tree, id)
    const mapSetProto = data => {
      Object.keys(data).map(item => {
        nodeValue[item] = data[item]
      })
    }
    if (nodeValue) {
      mapSetProto(data)

      dispatch({
        type: 'gantt/handleOutLineTreeData',
        payload: {
          data: outline_tree
        }
      })
    } else {
      console.error('OutlineTree.getTreeNodeValue:未查询到节点')
    }
  }

  changeListGroupNodeProto = ({ card_id, list_id, is_realize }) => {
    const { list_group = [], dispatch } = this.props
    let list_group_new = [...list_group]
    // 1. 获取当前任务所在的分组位置
    const group_drop_index = list_group_new.findIndex(
      item => item.lane_id == list_id
    )
    if (group_drop_index == -1) return
    // 2. 遍历 从已排期或者未排期的任务列表中找到当前任务
    const card_item = list_group_new[group_drop_index]['lane_data'][
      'cards'
    ].find(item => item.id == card_id)
    const card_index = list_group_new[group_drop_index]['lane_data'][
      'cards'
    ].findIndex(item => item.id == card_id)
    const card_no_time_item = list_group_new[group_drop_index]['lane_data'][
      'card_no_times'
    ].find(item => item.id == card_id)
    const card_no_time_index = list_group_new[group_drop_index]['lane_data'][
      'card_no_times'
    ].findIndex(item => item.id == card_id)
    if (card_item && !!Object.keys(card_item).length) {
      list_group_new[group_drop_index]['lane_data']['cards'][card_index] = {
        ...card_item,
        is_realize: is_realize
      }
    }
    if (card_no_time_item && !!Object.keys(card_no_time_item).length) {
      list_group_new[group_drop_index]['lane_data']['card_no_times'][
        card_no_time_index
      ] = {
        ...card_no_time_item,
        is_realize: is_realize
      }
    }
    dispatch({
      type: 'gantt/updateListGroup',
      payload: {
        datas: list_group_new
      }
    })
  }

  // 更新甘特图
  updateGanttDatas = ({ card_id, is_realize, list_id }) => {
    const { group_view_type, outline_tree = [] } = this.props
    if (ganttIsOutlineView({ group_view_type })) {
      // 如果是大纲视图
      let nodeValue = getTreeNodeValue(outline_tree, card_id)
      nodeValue.is_realize = is_realize
      this.changeOutLineTreeNodeProto(card_id, { ...nodeValue })
    } else {
      this.changeListGroupNodeProto({ card_id, is_realize, list_id })
    }
  }

  // 更新里程碑详情数据
  updateMilestoneDetailDatas = () => {
    let {
      milestone_detail: { id },
      dispatch
    } = this.props
    dispatch({
      type: 'milestoneDetail/getMilestoneDetail',
      payload: {
        id
      }
    })
  }

  // 点击完成任务
  setIsCheck = ({ is_completed, id, list_id }) => {
    const {
      milestone_detail: { board_id },
      dispatch,
      card_id,
      selected_card_visible
    } = this.props
    const obj = {
      card_id: id,
      is_realize: is_completed === '1' ? '0' : '1',
      board_id
    }

    completeTask({ ...obj }).then(res => {
      if (isApiResponseOk(res)) {
        setTimeout(() => {
          message.success('更新成功', MESSAGE_DURATION_TIME)
        }, 200)
        this.updateMilestoneDetailDatas()
        if (window.location.href.indexOf('home') != -1) return
        this.updateGanttDatas({ ...obj, list_id })
        onChangeCardHandleCardDetail({
          card_detail_id: card_id, //来自任务详情的id
          selected_card_visible, //任务详情弹窗是否弹开
          dispatch,
          operate_id: id //当前操作的id
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    })
  }

  render() {
    const {
      itemValue = {},
      type,
      board_set = {},
      base_relative_time: relative_time
    } = this.props
    const { date_format, date_mode } = board_set
    const {
      id,
      name,
      deadline,
      is_completed,
      users = [],
      progress_percent,
      list_id
    } = itemValue
    const result_process = Math.round(progress_percent * 100) / 100
    return (
      <div className={`${taskItemStyles.taskItem}`}>
        <div className={`${taskItemStyles.item_1} ${taskItemStyles.pub_hover}`}>
          {/*完成*/}
          {type == '0' && (
            <div
              className={
                is_completed == '1'
                  ? taskItemStyles.nomalCheckBoxActive
                  : taskItemStyles.nomalCheckBox
              }
              onClick={() => {
                this.setIsCheck({ is_completed, id, list_id })
              }}
            >
              <Icon
                type="check"
                style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}
              />
            </div>
          )}

          {type == '4' && !!result_process && (
            <div style={{ marginRight: '6px', color: 'rgba(0,0,0,0.45)' }}>
              {result_process || '0'} %
            </div>
          )}

          {/*名称*/}
          <div
            style={{
              wordWrap: 'break-word',
              paddingTop: 2,
              marginRight: '6px'
            }}
          >
            {name}
          </div>
          {/*日期*/}
          {deadline && (
            <>
              {date_mode == '1' ? (
                <span style={{ color: '#d5d5d5' }}>
                  {caldiffDays(relative_time, deadline) &&
                    `T+ ${caldiffDays(relative_time, deadline)} 日 `}
                </span>
              ) : (
                <div style={{ color: '#d5d5d5' }}>
                  {timestampToTimeNormal(
                    deadline,
                    '/',
                    date_format == '1' ? false : true
                  )}
                </div>
              )}
            </>
          )}
          <div style={{ margin: '0 8px' }}>
            <AvatarList size={'small'} users={users} />
          </div>

          {/*cuozuo*/}
          {type == '0' && (
            <Popconfirm
              onConfirm={this.deleteConfirm.bind(this, { id })}
              title={`删除该子${currentNounPlanFilterName(TASKS)}`}
              zIndex={10000}
            >
              <div
                className={`${globalStyles.authTheme} ${taskItemStyles.deletedIcon}`}
                style={{ fontSize: 16 }}
              >
                &#xe70f;
              </div>
            </Popconfirm>
          )}
        </div>
      </div>
    )
  }
}
function mapStateToProps({
  milestoneDetail: { milestone_detail = {} },
  publicTaskDetailModal: { card_id },
  gantt: {
    datas: {
      group_view_type,
      outline_tree = [],
      selected_card_visible,
      list_group = []
    }
  }
}) {
  return {
    milestone_detail,
    card_id,
    group_view_type,
    outline_tree,
    selected_card_visible,
    list_group
  }
}

CommonRelaItem.defaultProps = {
  type: '', // 区分是什么关联类型 0:表示任务，4:表示里程碑
  itemValue: {}, // 当前关联item
  key: '', // 每条id标识
  milestone_id: '', // 里程碑ID
  deleteRelationContent: function() {} // 删除关联内容
}
