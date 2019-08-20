import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { isToday } from './getDate'
import globalStyles from '@/globalset/css/globalClassName.less'
import MilestoneDetail from './components/milestoneDetail'
import { isSamDay } from './getDate'
import { Dropdown, Menu } from 'antd'
const MenuItem = Menu.Item
const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class GetRowGanttItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
      miletone_detail_modal_visible: false, //里程碑详情是否点开
      needs_task_arr: [], //实现以起始时间相同的为同一分组
    }
  }

  initSet(props) {
    const { list_id, list_data } = this.props
    // console.log(list_id, list_data)
    let start_time_arr = []
    let needs_task_arr = []
    const sortCreateTime = (a, b) => {
      return a.create_time - b.create_time
    }
    for (let val of list_data) {
      start_time_arr.push(val['start_time'])
    }
    start_time_arr = new Set(start_time_arr)
    for (let val of start_time_arr) {
      let arr = []
      for (let val2 of list_data) {
        if (val == val2['start_time']) {
          arr.push(val2)
        }
      }
      arr.sort(sortCreateTime)
      needs_task_arr = [].concat(needs_task_arr, arr)
    }
  }

  seeMiletones = () => {

  }

  isHasMiletoneList = (timestamp) => {
    const { milestones = [] } = this.props
    let flag = false
    let current_date_miletones = []
    if (!timestamp) {
      return {
        flag,
        current_date_miletones
      }
    }
    for (let key in milestones) {
      if (isSamDay(Number(timestamp), Number(key) * 1000)) {
        flag = true
        current_date_miletones = milestones[key]
        break
      }
    }

    return {
      flag,
      current_date_miletones,
    }
  }
  set_miletone_detail_modal_visible = () => {
    const { miletone_detail_modal_visible } = this.state
    this.setState({
      miletone_detail_modal_visible: !miletone_detail_modal_visible
    })
  }

  // 里程碑详情和列表
  renderLCBList = (current_date_miletones, timestamp) => {
    return (
      <Menu onClick={(e) => this.selectLCB(e, timestamp)}>
        {current_date_miletones.map((value, key) => {
          const { id, name, board_id } = value
          return (
            <MenuItem
              data-targetclassname="specific_example"
              className={globalStyles.global_ellipsis}
              style={{ width: 216 }}
              key={`${board_id}__${id}`}>
              {name}
            </MenuItem>
          )
        })}
      </Menu>
    )
  }
  // 过滤项目成员
  setCurrentSelectedProjectMembersList = ({ board_id }) => {
    const { about_user_boards = [] } = this.props
    const users = (about_user_boards.find(item => item.board_id == board_id) || {}).users
    // console.log('ssssssss', { users, board_id})
    this.setState({
      currentSelectedProjectMembersList: users
    })
  }
  // 选择里程碑
  selectLCB = (e, timestamp) => {
    const idarr = e.key.split('__')
    const id = idarr[1]
    const board_id = idarr[0]
    this.setCurrentSelectedProjectMembersList({board_id})
    this.set_miletone_detail_modal_visible()
    // this.getMilestoneDetail(id)
    //更新里程碑id,在里程碑的生命周期会监听到id改变，发生请求
    const { dispatch } = this.props
    dispatch({
      type: 'milestoneDetail/updateDatas',
      payload: {
        milestone_id: id
      }
    })
  }
  render() {
    const { rows = 7 } = this.props
    const { gold_date_arr = [], ceiHeight, gantt_board_id } = this.props
    const { milestones = {} } = this.props
    const { currentSelectedProjectMembersList } = this.state
    const item_height = rows * ceiHeight
    return (
      <div className={indexStyles.ganttAreaOut}>

        <div className={indexStyles.ganttArea} >
          {gold_date_arr.map((value, key) => {
            const { date_inner = [] } = value
            return (
              <div className={indexStyles.ganttAreaItem} key={key}>
                <div className={indexStyles.ganttDetail} style={{ height: item_height }}>
                  {date_inner.map((value2, key2) => {
                    const { week_day, timestamp, } = value2
                    const has_lcb = this.isHasMiletoneList(Number(timestamp)).flag
                    const current_date_miletones = this.isHasMiletoneList(Number(timestamp)).current_date_miletones
                    return (
                      <div className={`${indexStyles.ganttDetailItem}`}
                        key={key2}
                        style={{ backgroundColor: (week_day == 0 || week_day == 6) ? 'rgba(0, 0, 0, 0.04)' : (isToday(timestamp) ? 'rgb(242, 251, 255)' : 'rgba(0,0,0,.02)') }}
                      >
                        {/* 12为上下margin的总和 */}
                        {
                          gantt_board_id == '0' && has_lcb && (
                            <Dropdown overlay={this.renderLCBList(current_date_miletones, timestamp)}>
                              <div className={`${indexStyles.board_miletiones_flag} ${globalStyles.authTheme}`}
                                data-targetclassname="specific_example"
                                onClick={this.seeMiletones}
                                onMouseDown={e => e.stopPropagation()}
                              >&#xe6a0;</div>
                            </Dropdown>
                          )
                        }
                        {
                          gantt_board_id == '0' && has_lcb && (
                            <Dropdown placement={'topRight'} overlay={this.renderLCBList(current_date_miletones, timestamp)}>
                              <div
                                data-targetclassname="specific_example"
                                className={`${indexStyles.board_miletiones_flagpole}`} style={{ height: item_height - 12 }}
                                onClick={this.seeMiletones}
                                onMouseDown={e => e.stopPropagation()}
                                onMouseOver={e => e.stopPropagation()}
                                // onMouseMove
                              />
                            </Dropdown>
                          )
                        }
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <MilestoneDetail
          users={currentSelectedProjectMembersList}
          miletone_detail_modal_visible={this.state.miletone_detail_modal_visible}
          set_miletone_detail_modal_visible={this.set_miletone_detail_modal_visible}
        />
      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: { datas: { gold_date_arr = [], ceiHeight, gantt_board_id, about_user_boards } } }) {
  return { gold_date_arr, ceiHeight, gantt_board_id, about_user_boards }
}
