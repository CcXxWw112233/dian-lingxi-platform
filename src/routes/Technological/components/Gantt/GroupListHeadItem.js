import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { Avatar, Icon } from 'antd'
import { getOrgNameWithOrgIdFilter } from '../../../../utils/businessFunction';
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '@/components/avatarList'
import CheckItem from '@/components/CheckItem'

@connect(mapStateToProps)
export default class GroupListHeadItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowBottDetail: '0', //0 初始化(关闭) 1展开 2 关闭
    }
  }
  noTimeAreaScroll(e) {
    e.stopPropagation()
  }
  componentWillMount() {

  }
  setIsShowBottDetail = () => {
    const { isShowBottDetail } = this.state
    let new_isShowBottDetail = '1'
    if (isShowBottDetail == '0') {
      new_isShowBottDetail = '1'
    } else if (isShowBottDetail == '1') {
      new_isShowBottDetail = '2'
    } else if (isShowBottDetail == '2') {
      new_isShowBottDetail = '1'
    } else {

    }
    this.setState({
      isShowBottDetail: new_isShowBottDetail
    })
  }
  setLableColor = (label_data) => {
    let bgColor = ''
    let b = ''
    if (label_data && label_data.length) {
      const color_arr = label_data.map(item => {
        return `rgb(${item.label_color})`
      })
      const color_arr_length = color_arr.length
      const color_percent_arr = color_arr.map((item, index) => {
        return (index + 1) / color_arr_length * 100
      })
      bgColor = color_arr.reduce((total, color_item, current_index) => {
        return `${total},  ${color_item} ${color_percent_arr[current_index - 1] || 0}%, ${color_item} ${color_percent_arr[current_index]}%`
      }, '')

      b = `linear-gradient(to right${bgColor})`
    } else {
      b = '#ffffff'
    }
    return b
  }

  // 未分组任务点击事件
  noTimeCardClick = ({id, board_id}) => {
    const { dispatch, setTaskDetailModalVisibile, list_id } = this.props
    setTaskDetailModalVisibile && setTaskDetailModalVisibile('no_schedule')
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        current_list_group_id: list_id
      }
    })
    dispatch({
      type: 'workbenchTaskDetail/getCardDetail',
      payload: {
        id,
        board_id,
        calback: function(data) {
          dispatch({
            type: 'workbenchPublicDatas/getRelationsSelectionPre',
            payload: {
              _organization_id: data.org_id
            }
          })
        }
      }
    })
    dispatch({
      type: 'workbenchTaskDetail/getCardCommentListAll',
      payload: {
        id: id
      }
    })
    dispatch({
      type: 'workbenchPublicDatas/updateDatas',
      payload: {
        board_id
      }
    })
  }

  renderTaskItem = () => {
    const { itemValue = {} } = this.props
    const { list_no_time_data = [] } = itemValue
    return (
      <div
        className={indexStyles.no_time_card_area_out}
        // style={{ height: (group_rows[itemKey] || 2) * ceiHeight - 50 }}
        onScroll={this.noTimeAreaScroll.bind(this)}>
        <div className={indexStyles.no_time_card_area}>
          {
            list_no_time_data.map((value, key) => {
              const { name, id, is_realize, executors = [], label_data = [], board_id } = value || {}
              return (
                <div
                  onClick={() => this.noTimeCardClick({id, board_id})}
                  style={{ background: this.setLableColor(label_data) }}
                  className={indexStyles.no_time_card_area_card_item}
                  key={id}>
                  <div className={indexStyles.no_time_card_area_card_item_inner}>
                    <div className={`${indexStyles.card_item_status}`}>
                      <CheckItem is_realize={is_realize} />
                    </div>
                    <div className={`${indexStyles.card_item_name} ${globalStyles.global_ellipsis}`}>{name}</div>
                    <div>
                      <AvatarList users={executors} size={'small'} />
                    </div>
                  </div>

                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
  //分组名点击
  listNameClick = () => {
    const { itemValue, gantt_board_id, dispatch, group_view_type } = this.props
    // console.log('sssss', {itemValue, gantt_board_id, group_view_type})

    if (group_view_type != '1' || gantt_board_id != '0') { //必须要在项目视图才能看
      return
    }
    const { list_id } = itemValue
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        gantt_board_id: list_id
      }
    })
    dispatch({
      type: 'gantt/getGttMilestoneList',
      payload: {

      }
    })
    dispatch({
      type: 'gantt/getGanttData',
      payload: {

      }
    })
  }
  render() {

    const { currentUserOrganizes = [], gantt_board_id = [], ceiHeight, is_show_org_name, is_all_org, rows = 5, group_view_type, get_gantt_data_loading } = this.props
    const { itemValue = {}, itemKey } = this.props
    const { list_name, org_id, list_no_time_data = [], list_id, lane_icon } = itemValue
    const { isShowBottDetail } = this.state

    // console.log('sssss',{itemKey, group_rows, row: group_rows[itemKey], list_id })

    return (
      <div className={indexStyles.listHeadItem} style={{ height: rows * ceiHeight }}>
        <div className={indexStyles.list_head_top}>
          {
            group_view_type == '2' && !get_gantt_data_loading && (
              <Avatar src={lane_icon} icon="user" style={{ marginTop: '-4px', marginRight: 8 }}></Avatar>
            )
          }
          <span className={indexStyles.list_name} onClick={this.listNameClick}>{list_name}</span>
          <span className={indexStyles.org_name}>
            {
              is_show_org_name && is_all_org && group_view_type == '1' && !get_gantt_data_loading && gantt_board_id == '0' && (
                <span className={indexStyles.org_name}>
                  #{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
                </span>
              )
            }
          </span>
        </div>
        {/* {this.renderNoTimeCard()} */}
        <div className={`${indexStyles.list_head_body}`}>
          <div className={`${indexStyles.list_head_body_inner} ${isShowBottDetail == '0' && indexStyles.list_head_body_inner_init} ${isShowBottDetail == '2' && indexStyles.animate_hide} ${isShowBottDetail == '1' && indexStyles.animate_show}`} >
            {this.renderTaskItem()}
          </div>
        </div>
        <div className={indexStyles.list_head_footer} onClick={this.setIsShowBottDetail}>
          <div className={`${globalStyles.authTheme} ${indexStyles.list_head_footer_tip} ${isShowBottDetail == '2' && indexStyles.spin_hide} ${isShowBottDetail == '1' && indexStyles.spin_show}`}>&#xe61f;</div>
          <div>{list_no_time_data.length}个未排期事项</div>
        </div>
      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  gantt: { datas: { group_rows = [], ceiHeight, gantt_board_id, group_view_type, get_gantt_data_loading } },
  technological: { datas: { currentUserOrganizes = [], is_show_org_name, is_all_org, } },
}) {
  return { ceiHeight, group_rows, currentUserOrganizes, is_show_org_name, is_all_org, gantt_board_id, group_view_type, get_gantt_data_loading }
}
