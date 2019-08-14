import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Tooltip, Dropdown, Menu } from 'antd'
import DateListLCBItem from './DateListLCBItem'
import AddLCBModal from './components/AddLCBModal'
import { isSamDay } from './getDate'
import MilestoneDetail from './components/milestoneDetail'
const MenuItem = Menu.Item

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class DateList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      add_lcb_modal_visible: false,
      create_lcb_time: '',
      miletone_detail_modal_visible: false
    }
  }


  componentDidMount() {
    this.getGttMilestoneList()
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
        <MenuItem key={'0'}>新建里程碑</MenuItem>
        {current_date_miletones.map((value, key) => {
          const { id, name } = value
          return (
            <MenuItem
              className={globalStyles.global_ellipsis}
              style={{ width: 216 }}
              key={id}>
              {name}
            </MenuItem>
          )
        })}
      </Menu>
    )
  }
  // 选择里程碑
  selectLCB = (e, timestamp) => {
    const id = e.key
    if (id == '0') {
      this.setAddLCBModalVisibile()
      this.setCreateLcbTime(timestamp)
      return
    }
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


  //获取和日期对应上的里程碑列表
  getGttMilestoneList = () => {
    const { dispatch } = this.props
    setTimeout(() => {
      dispatch({
        type: 'gantt/getGttMilestoneList',
        payload: {}
      })
    }, 500)
  }
  // 创建里程碑
  submitCreatMilestone = (data) => {
    const { dispatch } = this.props
    const { users, currentSelectedProject, due_time, add_name } = data
    dispatch({
      type: 'gantt/createMilestone',
      payload: {
        board_id: currentSelectedProject,
        deadline: due_time,
        name: add_name,
        users
      }
    })
  }

  setAddLCBModalVisibile = () => {
    this.setState({
      add_lcb_modal_visible: !this.state.add_lcb_modal_visible
    });
  }
  // 设置创建里程碑的时间
  setCreateLcbTime = (timestamp) => {
    this.setState({
      create_lcb_time: timestamp
    })
  }

  getBoardName = (boardId) => {
    const { projectList = [] } = this.props
    const board_name = (projectList.find(item => item.board_id == boardId) || {}).board_name
    return board_name || '项目名称'
  }

  isHasMiletoneList = (timestamp) => {
    const { milestoneMap = [] } = this.props
    let flag = false
    let current_date_miletones = []
    if (!timestamp) {
      return {
        flag,
        current_date_miletones
      }
    }
    for (let key in milestoneMap) {
      if (isSamDay(Number(timestamp), Number(key) * 1000)) {
        flag = true
        current_date_miletones = milestoneMap[key]
        break
      }
    }

    return {
      flag,
      current_date_miletones,
    }
  }

  // 获取某一天的农历或者节假日
  getDateNoHolidaylunar = (timestamp) => {
    const { holiday_list = [] } = this.props
    let holiday = ''
    let lunar = ''
    for (let val of holiday_list) {
      if (isSamDay(timestamp, Number(val['timestamp'] * 1000))) {
        holiday = val['holiday']
        lunar = val['lunar']
        break
      }
    }
    return {
      holiday,
      lunar: lunar || ' '
    }
  }

  render() {
    const {
      gold_date_arr = [],
      gantt_board_id = [],
      target_scrollTop,
      projectList,
      currentSelectedProjectMembersList = [],
      group_view_type
    } = this.props
    const { add_lcb_modal_visible, create_lcb_time } = this.state

    return (
      <div>
        <div className={indexStyles.dateArea}
          style={{ top: target_scrollTop }}>
          {gold_date_arr.map((value, key) => {
            const { date_top, date_inner = [] } = value
            return (
              <div className={indexStyles.dateAreaItem} key={key}>
                <div className={indexStyles.dateTitle}>{date_top}</div>
                <div className={indexStyles.dateDetail} >
                  {date_inner.map((value2, key2) => {
                    const { month, date_no, week_day, timestamp } = value2
                    const has_lcb = this.isHasMiletoneList(Number(timestamp)).flag
                    const current_date_miletones = this.isHasMiletoneList(Number(timestamp)).current_date_miletones
                    return (
                      gantt_board_id == '0' || group_view_type != '1' ? (
                        <Tooltip key={`${month}/${date_no}` } title={`${this.getDateNoHolidaylunar(timestamp).lunar} ${this.getDateNoHolidaylunar(timestamp).holiday || ' '}`}>
                          <div key={`${month}/${date_no}`}>
                            <div className={`${indexStyles.dateDetailItem}`} key={key2}>
                              <div className={`${indexStyles.dateDetailItem_date_no} 
                                    ${((week_day == 0 || week_day == 6)) && indexStyles.weekly_date_no} 
                                    ${this.getDateNoHolidaylunar(timestamp).holiday && indexStyles.holiday_date_no}`}>
                                {date_no}
                              </div>
                            </div>
                          </div>
                        </Tooltip>
                      ) : (
                          <Dropdown overlay={this.renderLCBList(current_date_miletones, timestamp)}>
                            <Tooltip title={`${this.getDateNoHolidaylunar(timestamp).lunar} ${this.getDateNoHolidaylunar(timestamp).holiday || ' '}`}>
                              <div key={`${month}/${date_no}`}>
                                <div className={`${indexStyles.dateDetailItem}`} key={key2}>
                                  <div className={`${indexStyles.dateDetailItem_date_no} 
                                    ${indexStyles.nomal_date_no}
                                    ${((week_day == 0 || week_day == 6)) && indexStyles.weekly_date_no} 
                                    ${this.getDateNoHolidaylunar(timestamp).holiday && indexStyles.holiday_date_no}
                                    ${has_lcb && indexStyles.has_moletones_date_no}`}>
                                    {date_no}
                                  </div>
                                </div>
                              </div>
                            </Tooltip>
                          </Dropdown>
                        )
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {gantt_board_id != '0' && (
          <AddLCBModal
            userList={currentSelectedProjectMembersList}
            projectList={projectList}
            boardName={this.getBoardName(gantt_board_id)}
            create_lcb_time={create_lcb_time}
            boardId={gantt_board_id}
            add_lcb_modal_visible={add_lcb_modal_visible}
            setAddLCBModalVisibile={this.setAddLCBModalVisibile.bind(this)}
            submitCreatMilestone={this.submitCreatMilestone}
          />
        )}
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
function mapStateToProps(
  {
    gantt: { datas: { gold_date_arr = [], list_group = [], target_scrollTop = [], milestoneMap = [], holiday_list = [], gantt_board_id, group_view_type } },
    workbench: { datas: { projectList = [], currentSelectedProjectMembersList = [] } }
  }) {
  return { gold_date_arr, list_group, target_scrollTop, projectList, currentSelectedProjectMembersList, milestoneMap, holiday_list, gantt_board_id, group_view_type }
}

//  {/* {projectTabCurrentSelectedProject != '0' ? (
//                           <DateListLCBItem
//                             has_lcb={has_lcb}
//                             boardName={this.getBoardName(projectTabCurrentSelectedProject)}
//                             current_date_miletones={current_date_miletones}
//                             timestamp={new Date(`${date_string} 23:59:59`).getTime()}
//                             setCreateLcbTime={this.setCreateLcbTime}
//                             setAddLCBModalVisibile={this.setAddLCBModalVisibile.bind(this)}
//                             set_miletone_detail_modal_visible = {this.set_miletone_detail_modal_visible}/>
//                         ):(
//                           <div className={indexStyles.lcb_area}></div>
//                         )} */}