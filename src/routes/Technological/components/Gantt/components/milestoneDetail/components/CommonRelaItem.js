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
import {
  completeTask,
  updateMilestone
} from '../../../../../../../services/technological/task'
import { ganttIsOutlineView } from '../../../constants'
import { getTreeNodeValue } from '../../../../../../../models/technological/workbench/gantt/gantt_utils'
import { onChangeCardHandleCardDetail } from '../../../ganttBusiness'
import CardGroupNames from '../../CardGroupNames'
// 引入 ECharts 主模块
import echarts from 'echarts'
// 引入饼状图
import 'echarts/lib/chart/pie'

import { ECHARTSTHEME } from '../../../../../../SimpleMode/Components/WorkbenchPage/ChartForStatistics/constans'
import theme from '../../../../../../SimpleMode/Components/WorkbenchPage/StatisticalReport/echartTheme.json'
@connect(mapStateToProps)
export default class CommonRelaItem extends React.Component {
  constructor(props) {
    super(props)
    this.chartRef = React.createRef()
  }
  state = {}
  componentDidMount() {
    this.initEchart()
  }

  componentWillReceiveProps() {
    this.initEchart()
  }

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

  // 更新甘特图
  updateGanttDatas = (payload = {}) => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/updateGanttMilestoneData',
      payload: payload
    })
  }

  // 更新里程碑详情数据
  updateMilestoneDetailDatas = () => {
    let {
      milestone_detail: { id },
      dispatch
    } = this.props
    return dispatch({
      type: 'milestoneDetail/getMilestoneDetail',
      payload: {
        id
      }
    })
  }

  // 更新里程碑信息
  updateMilestone = params => {
    const { dispatch, milestone_detail = {} } = this.props
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'milestoneDetail/updateMilestone',
        payload: {
          ...params
        }
      }).then(res => {
        if (res) {
          resolve(res)
        } else {
          reject()
        }
      })
    })
  }

  // 点击完成任务
  setIsCheck = async ({ is_completed, id, list_id }) => {
    const {
      milestone_detail: { board_id },
      dispatch,
      card_id,
      selected_card_visible,
      type
    } = this.props
    const obj = {
      card_id: id,
      is_realize: is_completed === '1' ? '0' : '1',
      board_id
    }
    let res = {}
    if (type == '0') {
      //任务
      res = await completeTask({ ...obj })
    } else {
      // 里程碑
      res = await updateMilestone({
        id,
        is_finished: is_completed === '1' ? '0' : '1'
      })
    }
    if (isApiResponseOk(res)) {
      setTimeout(() => {
        message.success('更新成功', MESSAGE_DURATION_TIME)
      }, 200)
      await this.updateMilestoneDetailDatas()
      if (window.location.href.indexOf('home') != -1) return
      this.updateGanttDatas({ ...obj, list_id })
      onChangeCardHandleCardDetail({
        card_detail_id: card_id, //来自任务详情的id
        selected_card_visible, //任务详情弹窗是否弹开
        dispatch,
        operate_id: id //当前操作的id
      })
      this.props.setStatusProperty && this.props.setStatusProperty(true)
    } else {
      message.warn(res.message, MESSAGE_DURATION_TIME)
    }
  }
  // 获取任务分组列表
  getCardGroups = () => {
    const {
      about_group_boards = [],
      milestone_detail: { board_id }
    } = this.props
    const item =
      about_group_boards.find(item => item.board_id == board_id) || {}
    const { list_data = [] } = item
    // console.log('ssssssssssaaa', list_data)
    return list_data
  }

  initEchart = () => {
    const {
      itemValue: { rela_type, parent_id, progress_percent }
    } = this.props
    if (progress_percent === undefined) return //必须是父任务
    echarts.registerTheme(ECHARTSTHEME, theme)
    this.chart = echarts.init(this.chartRef.current, ECHARTSTHEME)
    const option = {
      color: ['#E6E8F1', '#95DE64'],
      tooltip: {
        show: false
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          data: [
            { value: 100 - progress_percent },
            { value: progress_percent }
          ],
          animation: false,
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    this.chart.setOption(option)
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
      list_id = '0',
      list_ids
    } = itemValue
    return (
      <div className={`${taskItemStyles.taskItem}`}>
        <div className={`${taskItemStyles.item_1} ${taskItemStyles.pub_hover}`}>
          {/*完成*/}
          {/* {type == '0' && ( */}
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
          {/* )} */}

          {/*名称*/}
          <div
            style={{
              paddingTop: 2,
              marginRight: '6px',
              display: 'flex',
              flex: 1
            }}
            className={`${globalStyles.global_ellipsis}`}
          >
            {/* '爱丽丝卢卡斯昆德拉喀什角动量喀什离开的ask了角动量喀什觉得撒旦看见啦时刻记得阿斯利康大家案例喀什觉' */}
            <div
              title={name}
              style={{ maxWidth: 300 }}
              className={`${globalStyles.global_ellipsis}`}
            >
              {' '}
              {name}&nbsp;&nbsp;&nbsp;
            </div>
            <div className={`${globalStyles.global_ellipsis}`}>
              <CardGroupNames
                wrapper_styles={{
                  justifyContent: 'flex-start',
                  color: '#575C75'
                }}
                selects={list_ids}
                list_data={this.getCardGroups()}
              />
            </div>
          </div>
          {/* 饼图 */}
          {//
          progress_percent !== undefined && (
            <div
              style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}
            >
              <div ref={this.chartRef} style={{ height: 30, width: 30 }}></div>
              <div>{progress_percent}%</div>
            </div>
          )}
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
      list_group = [],
      about_group_boards = []
    }
  }
}) {
  return {
    milestone_detail,
    card_id,
    group_view_type,
    outline_tree,
    selected_card_visible,
    list_group,
    about_group_boards
  }
}

CommonRelaItem.defaultProps = {
  type: '', // 区分是什么关联类型 0:表示任务，4:表示里程碑
  itemValue: {}, // 当前关联item
  key: '', // 每条id标识
  milestone_id: '', // 里程碑ID
  deleteRelationContent: function() {} // 删除关联内容
}
