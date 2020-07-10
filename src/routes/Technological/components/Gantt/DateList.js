import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Tooltip, Dropdown, Menu } from 'antd'
import { handleTimeDetailReturn, isSamDay } from '@/utils/util.js'
import DateListLCBItem from './DateListLCBItem'
import AddLCBModal from './components/AddLCBModal'
import MilestoneDetail from './components/milestoneDetail'
import { checkIsHasPermissionInBoard, setBoardIdStorage } from '../../../../utils/businessFunction';
import { PROJECT_TEAM_BOARD_MILESTONE } from "@/globalset/js/constant";

const MenuItem = Menu.Item

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class DateList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      add_lcb_modal_visible: false,
      create_lcb_time: '', //创建里程碑具体日期
      create_lcb_time_arr: [], //创建里程碑日期区间
      miletone_detail_modal_visible: false,
      currentSelectedProjectMembersList: [],
    }
  }

  componentDidMount() {
    // this.getGttMilestoneList()
  }

  set_miletone_detail_modal_visible = () => {
    const { miletone_detail_modal_visible } = this.state
    this.setState({
      miletone_detail_modal_visible: !miletone_detail_modal_visible
    })
  }

  // 里程碑详情和列表
  renderLCBList = (current_date_miletones = [], { timestamp, timestampEnd }) => {
    const { gantt_board_id } = this.props;
    const params_board_id = gantt_board_id;
    //console.log("里程碑", checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MILESTONE, params_board_id),params_board_id);
    const flag = (params_board_id != 0 && !checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MILESTONE, params_board_id));
    return (
      <Menu onClick={(e) => this.selectLCB(e, { timestamp, timestampEnd })}>
        {

          <MenuItem key={`${0}__${0}`} style={flag ? {} : { color: '#1890FF' }} disabled={flag}>
            <i className={globalStyles.authTheme}>&#xe8fe;</i>
            &nbsp;
             新建里程碑
            </MenuItem>
        }

        {current_date_miletones.map((value, key) => {
          const { id, name, board_name, board_id } = value
          return (
            <MenuItem
              className={globalStyles.global_ellipsis}
              style={{ width: 216 }}
              key={`${board_id}__${id}`}>
              {name}
              {gantt_board_id == '0' && <span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)', marginLeft: 6 }}>#{board_name}</span>}
            </MenuItem>
          )
        })}
      </Menu>
    )
  }
  // 选择里程碑
  selectLCB = (e, { timestamp, timestampEnd }) => {
    const idarr = e.key.split('__')
    const id = idarr[1]
    const board_id = idarr[0]
    this.setCurrentSelectedProjectMembersList({ board_id })
    if (id == '0') {
      this.setAddLCBModalVisibile()
      this.setCreateLcbTime({ timestamp, timestampEnd })
      return
    }
    this.set_miletone_detail_modal_visible()
    // this.getMilestoneDetail(id)
    //更新里程碑id,在里程碑的生命周期会监听到id改变，发生请求
    const { dispatch } = this.props
    setBoardIdStorage(board_id)
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
    const { add_lcb_modal_visible } = this.state
    this.setState({
      add_lcb_modal_visible: !add_lcb_modal_visible
    });
    if (!add_lcb_modal_visible) { //关闭弹窗清除状态
      this.setState({
        create_lcb_time: '',
        create_lcb_time_arr: [],
      })
    }
  }
  // 设置创建里程碑的时间
  setCreateLcbTime = ({ timestamp, timestampEnd }) => {
    const { gantt_view_mode } = this.props
    if (gantt_view_mode == 'month') {
      this.setState({
        create_lcb_time: timestampEnd
      })
    } else if (gantt_view_mode == 'year') {
      this.setState({
        create_lcb_time_arr: [timestamp, timestampEnd]
      })
    } else if (gantt_view_mode == 'week') {
      this.setState({
        create_lcb_time_arr: [timestamp, timestampEnd]
      })
    } else {

    }

  }

  // 判断日期是否有里程碑
  isHasMiletoneList = () => {
    let flag = false //是否具有里程碑
    let current_date_miletones = [] //计算日期的里程碑列表
    let is_over_duetime = false //是否超出截止时间
    let is_all_realized = '1' //全部关联的任务已完成 1 / 0 =>完成 / 未完成
    const { milestoneMap = [] } = this.props
    return {
      handleMonthMode: (timestamp) => {
        if (!timestamp) {
          return {
            flag,
            current_date_miletones
          }
        }
        if (Number(timestamp) < new Date().getTime()) { //小于今天算逾期
          is_over_duetime = true
        }
        for (let key in milestoneMap) {
          if (isSamDay(Number(timestamp), Number(key) * 1000)) {
            current_date_miletones = current_date_miletones.concat(milestoneMap[key])
            if (milestoneMap[key].length) {
              flag = true
            }
            for (let val of milestoneMap[key]) {
              if (val['is_all_realized'] == '0') {
                is_all_realized = '0'
                break
              }
            }
          }
        }

        return {
          is_over_duetime,
          flag,
          is_all_realized,
          current_date_miletones,
        }
      },
      handleYearMode: ({ year, month, last_date, timestamp, timestampEnd }) => {
        if (!timestamp || !timestampEnd) {
          return {
            flag,
            current_date_miletones
          }
        }
        if (Number(timestampEnd) < new Date().getTime()) { //小于今天算逾期
          is_over_duetime = true
        }
        for (let key in milestoneMap) {
          const cal_timestamp = Number(key) * 1000
          if (cal_timestamp >= timestamp && cal_timestamp <= timestampEnd) { //在该月份区间内
            current_date_miletones = current_date_miletones.concat(milestoneMap[key])
            if (milestoneMap[key].length) {
              flag = true
            }
            for (let val of milestoneMap[key]) {
              if (val['is_all_realized'] == '0') {
                is_all_realized = '0'
                break
              }
            }
          }
        }

        return {
          is_over_duetime,
          flag,
          is_all_realized,
          current_date_miletones,
        }
      }
    }

  }

  // 里程碑是否过期的颜色设置
  setMiletonesColor = ({ is_over_duetime, has_lcb, is_all_realized }) => {
    if (!has_lcb) {
      return ''
    }
    if (is_over_duetime) {
      if (is_all_realized == '0') { //存在未完成任务
        return '#FFA39E'
      } else { //全部任务已完成
        return 'rgba(0,0,0,0.15)'
      }
    }
    return ''
  }

  // 获取某一天的农历或者节假日
  getDateNoHolidaylunar = (timestamp) => {
    const { holiday_list = [] } = this.props
    let holiday = ''
    let lunar = ''
    let festival_status = ''
    for (let val of holiday_list) {
      if (isSamDay(timestamp, Number(val['timestamp'] * 1000))) {
        holiday = val['holiday']
        lunar = val['lunar']
        festival_status = val['festival_status']
        break
      }
    }
    return {
      holiday,
      lunar: lunar || ' ',
      festival_status
    }
  }

  // 过滤项目成员
  setCurrentSelectedProjectMembersList = ({ board_id }) => {
    const { about_user_boards = [] } = this.props
    const users = (about_user_boards.find(item => item.board_id == board_id) || {}).users
    this.setState({
      currentSelectedProjectMembersList: users
    })
  }
  // 甘特图信息变化后，实时触发甘特图渲染在甘特图上变化
  handleMiletonsChangeMountInGantt = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getGttMilestoneList',
      payload: {

      }
    })
  }
  deleteMiletone = ({ id }) => {
    const { milestoneMap = {}, dispatch } = this.props
    const new_milestoneMap = { ...milestoneMap }
    let flag = false
    for (let key in new_milestoneMap) {
      const item = new_milestoneMap[key]
      const length = item.length
      for (let i = 0; i < length; i++) {
        if (item[i].id == id) {
          flag = true
          new_milestoneMap[key].splice(i, 1)
          break
        }
      }
      if (flag) {
        break
      }
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        milestoneMap: new_milestoneMap
      }
    })
  }
  // 里程碑删除子任务回调
  deleteRelationContent = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/getGttMilestoneList',
      payload: {
      }
    })
  }

  // 渲染月视图日期数据
  renderMonthViewDate = (date_inner = []) => {
    const {
      group_view_type,
    } = this.props
    return (
      <div className={indexStyles.dateDetail} >
        {date_inner.map((value2, key2) => {
          const { month, date_no, week_day, timestamp, timestampEnd } = value2
          // const has_lcb = this.isHasMiletoneList().handleMonthMode(Number(timestampEnd)).flag
          // const current_date_miletones = this.isHasMiletoneList().handleMonthMode(Number(timestampEnd)).current_date_miletones
          // const is_over_duetime = this.isHasMiletoneList().handleMonthMode(Number(timestampEnd)).is_over_duetime
          // const is_all_realized = this.isHasMiletoneList().handleMonthMode(Number(timestampEnd)).is_all_realized
          const { flag: has_lcb, current_date_miletones = [], is_over_duetime, is_all_realized } = this.isHasMiletoneList().handleMonthMode(Number(timestampEnd))
          // /gantt_board_id == '0' ||
          const isToday = isSamDay(timestamp, new Date().getTime())
          return (
            group_view_type != '1' ? (
              <Tooltip key={`${month}/${date_no}`} title={`${this.getDateNoHolidaylunar(timestamp).lunar} ${this.getDateNoHolidaylunar(timestamp).holiday || ' '}`}>
                <div key={`${month}/${date_no}`}>
                  <div className={`${indexStyles.dateDetailItem}`} key={key2}>
                    <div className={`${indexStyles.dateDetailItem_date_no} 
                                    ${((week_day == 0 || week_day == 6)) && indexStyles.weekly_date_no} 
                                    ${this.getDateNoHolidaylunar(timestamp).festival_status == '1' && indexStyles.holiday_date_no}`}>
                      {
                        this.getDateNoHolidaylunar(timestamp).holiday && (
                          <div style={{ position: 'absolute', zIndex: 2, top: -24, left: -18, width: 60, height: 20, backgroundColor: '#fff' }} >
                            {this.getDateNoHolidaylunar(timestamp).holiday}
                          </div>
                        )
                      }
                      {isToday ? <span style={{ color: '#1890FF', fontSize: 12 }}>今天</span> : date_no}
                    </div>
                  </div>
                </div>
              </Tooltip>
            ) : (
                <Dropdown overlay={this.renderLCBList(current_date_miletones, { timestampEnd })} key={`${month}/${date_no}`} trigger={['click']}>
                  <Tooltip title={`${this.getDateNoHolidaylunar(timestamp).lunar} ${this.getDateNoHolidaylunar(timestamp).holiday || ' '}`}>
                    <div>
                      <div className={`${indexStyles.dateDetailItem}`} key={key2}>
                        <div className={`${indexStyles.dateDetailItem_date_no} 
                                    ${indexStyles.nomal_date_no}
                                    ${((week_day == 0 || week_day == 6)) && indexStyles.weekly_date_no} 
                                    ${this.getDateNoHolidaylunar(timestamp).festival_status == '1' && indexStyles.holiday_date_no}
                                    ${has_lcb && indexStyles.has_moletones_date_no}`}
                          style={{ background: this.setMiletonesColor({ is_over_duetime, has_lcb, is_all_realized }) }}
                        // style={{ background: is_over_duetime && has_lcb ? '#FF7875' : '' }}
                        >
                          {
                            this.getDateNoHolidaylunar(timestamp).holiday && (
                              <div style={{ position: 'absolute', zIndex: 2, top: -24, left: -18, width: 60, height: 20, backgroundColor: '#fff' }} >
                                {this.getDateNoHolidaylunar(timestamp).holiday}
                              </div>
                            )
                          }
                          {isToday ? <span style={{ color: '#1890FF', fontSize: 12 }}>今天</span> : date_no}
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </Dropdown>
              )
          )
        })}
      </div>
    )
  }

  // 渲染周视图日期数据
  renderWeekViewDate = (date_inner = []) => {
    const { ceilWidth, group_view_type } = this.props
    return (
      <div className={indexStyles.dateDetail} >
        {date_inner.map((value2, key2) => {
          const { month, last_date, year, timestamp, timestampEnd, date_no } = value2
          const { flag: has_lcb, current_date_miletones, is_over_duetime, is_all_realized } = this.isHasMiletoneList().handleYearMode({
            year, month, last_date, timestamp, timestampEnd
          })
          return (
            group_view_type != '1' ? (
              <div key={`${month}/${timestamp}`}>
                <div className={`${indexStyles.dateDetailItem}`} key={key2} style={{ width: ceilWidth * 7, fontSize: 12 }}>
                  <div className={`${indexStyles.dateDetailItem_date_no} `} style={{ fontSize: 12, }}>
                    {date_no}
                  </div>
                </div>
              </div>
            ) : (
                <Dropdown overlay={this.renderLCBList(current_date_miletones, { timestamp, timestampEnd })} key={`${month}/${timestamp}`} trigger={['click']}>
                  <div key={`${month}/${timestamp}`}>
                    <div className={`${indexStyles.dateDetailItem}`} key={key2} style={{ width: ceilWidth * 7, fontSize: 12 }}>
                      <div className={`${indexStyles.dateDetailItem_date_no} 
                                    ${indexStyles.nomal_date_no}
                                    ${has_lcb && indexStyles.has_moletones_date_no}`}
                        style={{ background: this.setMiletonesColor({ is_over_duetime, has_lcb, is_all_realized, fontSize: 12 }) }}
                      >
                        {date_no}
                      </div>

                    </div>
                  </div>
                </Dropdown>
              )
          )
        })}
      </div>
    )
  }

  // 渲染年视图日期数据
  renderYearViewDate = (date_inner = []) => {
    const { ceilWidth, group_view_type } = this.props
    return (
      <div className={indexStyles.dateDetail} >
        {date_inner.map((value2, key2) => {
          const { month, last_date, year, timestamp, timestampEnd, description } = value2
          const { flag: has_lcb, current_date_miletones, is_over_duetime, is_all_realized } = this.isHasMiletoneList().handleYearMode({
            year, month, last_date, timestamp, timestampEnd
          })
          return (
            group_view_type != '1' ? (
              <div key={`${month}/${timestamp}`}>
                <div className={`${indexStyles.dateDetailItem}`} key={key2} style={{ width: ceilWidth * last_date }}>
                  <div className={`${indexStyles.dateDetailItem_date_no} `}>
                    {description}
                  </div>
                </div>
              </div>
            ) : (
                <Dropdown overlay={this.renderLCBList(current_date_miletones, { timestamp, timestampEnd })} key={`${month}/${timestamp}`} trigger={['click']}>
                  <div key={`${month}/${timestamp}`}>
                    <div className={`${indexStyles.dateDetailItem}`} key={key2} style={{ width: ceilWidth * last_date }}>
                      <div className={`${indexStyles.dateDetailItem_date_no} 
                                    ${indexStyles.nomal_date_no}
                                    ${has_lcb && indexStyles.has_moletones_date_no}`}
                        style={{ background: this.setMiletonesColor({ is_over_duetime, has_lcb, is_all_realized }) }}
                      >
                        {description}
                      </div>

                    </div>
                  </div>
                </Dropdown>
              )
          )
        })}
      </div>
    )
  }

  // 渲染月份或年份
  renderDateTop = (date_top) => {
    const { gantt_view_mode } = this.props

    let contain = <></>
    if (gantt_view_mode == 'month') {
      contain = (
        <div className={indexStyles.dateTitle}>{date_top}</div>
      )
    } else {
      contain = (
        <div className={indexStyles.dateTitle_2}>{date_top}</div>
      )
    }
    return contain
  }
  renderFixedDateTop = () => {
    const { target_scrollLeft, gold_date_arr, gantt_view_mode, width_area_section = [] } = this.props
    if (gantt_view_mode != 'month') return <></>
    const index = width_area_section.findIndex(item => target_scrollLeft < item)
    const title = (gold_date_arr[index] || {}).date_top
    return <div style={{
      position: 'absolute',
      left: target_scrollLeft,
      top: 9,
      fontWeight: 'bold',
      backgroundColor: '#fff',
      zIndex: 0,
      paddingLeft: 6,
      color: 'rgba(0, 0, 0, .45)'
    }}>{title}</div>
  }
  render() {
    const {
      gold_date_arr = [],
      gantt_board_id,
      gantt_view_mode,
      about_user_boards,
    } = this.props

    const { create_lcb_time_arr = [] } = this.state

    const { add_lcb_modal_visible, create_lcb_time, currentSelectedProjectMembersList = [] } = this.state

    return (
      <div>
        <div className={indexStyles.dateArea}
          id={'gantt_date_area'}
        // style={{ left: -target_scrollLeft, }}
        >
          {this.renderFixedDateTop()}
          {gold_date_arr.map((value, key) => {
            const { date_top, date_inner = [] } = value
            return (
              <div className={indexStyles.dateAreaItem} key={key}>
                {/* <div className={indexStyles.dateTitle}>{date_top}</div> */}
                {this.renderDateTop(date_top)}
                {
                  gantt_view_mode == 'year' && (
                    this.renderYearViewDate(date_inner)
                  )
                }
                {
                  gantt_view_mode == 'month' && (
                    this.renderMonthViewDate(date_inner)
                  )
                }
                {
                  gantt_view_mode == 'week' && (
                    this.renderWeekViewDate(date_inner)
                  )
                }
              </div>
            )
          })}
        </div>
        {/* {gantt_board_id != '0' && ( */}
        <AddLCBModal
          about_user_boards={about_user_boards}
          user_list={gantt_board_id == '0' ? [] : currentSelectedProjectMembersList} //如果是全部项目，则传空数组，特定项目下传特定的userList
          create_lcb_time={create_lcb_time}
          board_id={gantt_board_id}
          add_lcb_modal_visible={add_lcb_modal_visible}
          setAddLCBModalVisibile={this.setAddLCBModalVisibile.bind(this)}
          submitCreatMilestone={this.submitCreatMilestone}
          // 给一个区间但不是具体时间需要处理
          availableDate={create_lcb_time_arr}
          defaultPickerValue={create_lcb_time_arr[0]}
        />
        {/* )} */}
        <MilestoneDetail
          handleMiletonesChange={this.handleMiletonsChangeMountInGantt}
          users={currentSelectedProjectMembersList}
          miletone_detail_modal_visible={this.state.miletone_detail_modal_visible}
          set_miletone_detail_modal_visible={this.set_miletone_detail_modal_visible}
          deleteMiletone={this.deleteMiletone}
          deleteRelationContent={this.deleteRelationContent}
        />
      </div>
    )
  }

}

class DropMilestone extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menu_oprate_visible: false
    }
  }
  dropdwonVisibleChange = (bool) => {
    this.setState({
      menu_oprate_visible: bool
    })
  }
  render() {
    const { menu_oprate_visible } = this.state
    const {
      renderLCBList,
      getDateNoHolidaylunar,
      setMiletonesColor,
      timestamp,
      current_date_miletones,
      timestampEnd,
      itemKey,
      key2,
      week_day,
      date_no,
      is_over_duetime,
      has_lcb,
      is_all_realized
    } = this.props
    return (
      <Dropdown onVisibleChange={this.dropdwonVisibleChange} overlay={menu_oprate_visible ? renderLCBList(current_date_miletones, { timestampEnd }) : (<span />)} key={itemKey} trigger={['click']}>
        <Tooltip title={`${getDateNoHolidaylunar(timestamp).lunar} ${getDateNoHolidaylunar(timestamp).holiday || ' '}`}>
          <div>
            <div className={`${indexStyles.dateDetailItem}`} key={key2}>
              <div className={`${indexStyles.dateDetailItem_date_no} 
              ${indexStyles.nomal_date_no}
              ${((week_day == 0 || week_day == 6)) && indexStyles.weekly_date_no} 
              ${getDateNoHolidaylunar(timestamp).festival_status == '1' && indexStyles.holiday_date_no}
              ${has_lcb && indexStyles.has_moletones_date_no}`}
                style={{ background: setMiletonesColor({ is_over_duetime, has_lcb, is_all_realized }) }}
              // style={{ background: is_over_duetime && has_lcb ? '#FF7875' : '' }}
              >
                {
                  getDateNoHolidaylunar(timestamp).holiday && (
                    <div style={{ position: 'absolute', zIndex: 2, top: -24, left: -18, width: 60, height: 20, backgroundColor: '#fff' }} >
                      {getDateNoHolidaylunar(timestamp).holiday}
                    </div>
                  )
                }
                {date_no}
              </div>
            </div>
          </div>
        </Tooltip>
      </Dropdown>
    )
  }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps(
  {
    gantt: { datas: {
      target_scrollLeft, width_area_section = [],
      gold_date_arr = [], about_user_boards = [],
      target_scrollTop = [],
      milestoneMap = [], holiday_list = [],
      gantt_board_id, group_view_type, gantt_view_mode, ceilWidth
    } },
    technological: { datas: { userBoardPermissions } }
  }) {
  return {
    target_scrollLeft, width_area_section,
    gold_date_arr,
    target_scrollTop, milestoneMap,
    holiday_list, gantt_board_id,
    group_view_type, about_user_boards,
    userBoardPermissions, gantt_view_mode, ceilWidth
  }
}

