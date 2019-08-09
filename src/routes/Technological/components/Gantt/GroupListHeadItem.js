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
    if(isShowBottDetail == '0') {
      new_isShowBottDetail = '1'
    } else if(isShowBottDetail == '1') {
      new_isShowBottDetail = '2'
    }else if(isShowBottDetail == '2') {
      new_isShowBottDetail = '1'
    }else {

    }
    this.setState({
      isShowBottDetail: new_isShowBottDetail
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
              const { name, id, is_realize, executors=[] } = value || {}
              const users = [{name: '111', avatar: '', user_id: '1111'}, {name: '11321', avatar: '', user_id: '121111'}, {name: '111', avatar: '', user_id: '11311'}, {name: '111', avatar: '', user_id: '11211'}]
              return (
                <div className={indexStyles.no_time_card_area_card_item} key={id}>
                  <div className={`${indexStyles.card_item_status}`}>
                    <CheckItem is_realize={is_realize} />
                  </div>
                  <div className={`${indexStyles.card_item_name} ${globalStyles.global_ellipsis}`}>{name}</div>
                  <div>
                    <AvatarList users={executors} size={'small'}/>
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

    if(group_view_type != '1' || gantt_board_id != '0') { //必须要在项目视图才能看
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
    
    const { currentUserOrganizes = [], group_rows = [], ceiHeight, is_show_org_name, is_all_org, rows = 5, group_view_type, get_gantt_data_loading } = this.props
    const { itemValue = {}, itemKey } = this.props
    const { list_name, org_id, list_no_time_data = [], list_id, lane_icon } = itemValue
    const { isShowBottDetail } = this.state 

    // console.log('sssss',{itemKey, group_rows, row: group_rows[itemKey], list_id })

    return (
      <div className={indexStyles.listHeadItem} style={{ height: rows * ceiHeight }}>
        <div className={indexStyles.list_head_top}>
          {
            group_view_type == '2' && !get_gantt_data_loading && (
              <Avatar src={lane_icon} icon="user" style={{marginTop: '-4px', marginRight: 8}}></Avatar>
            )
          }
          <span className={indexStyles.list_name} onClick={this.listNameClick}>{list_name}</span>
          <span className={indexStyles.org_name}>
            {
              is_show_org_name && is_all_org && group_view_type == '1' && !get_gantt_data_loading && (
                <span className={indexStyles.org_name}>
                  #{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
                </span>
              )
            }
          </span>
        </div>
        {/* {this.renderNoTimeCard()} */}
        <div className={`${indexStyles.list_head_body}`}>
          <div className={`${indexStyles.list_head_body_inner} ${isShowBottDetail == '0' && indexStyles.list_head_body_inner_init} ${ isShowBottDetail == '2' && indexStyles.animate_hide} ${isShowBottDetail == '1' && indexStyles.animate_show}`} >
            {this.renderTaskItem()}
          </div>
        </div>
        <div className={indexStyles.list_head_footer} onClick={this.setIsShowBottDetail}>
          <div className={`${globalStyles.authTheme} ${indexStyles.list_head_footer_tip} ${isShowBottDetail == '2' && indexStyles.spin_hide} ${ isShowBottDetail == '1' && indexStyles.spin_show}`}>&#xe61f;</div>
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
