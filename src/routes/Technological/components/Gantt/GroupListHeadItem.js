import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import { Tooltip, Icon } from 'antd'
import { getOrgNameWithOrgIdFilter } from '../../../../utils/businessFunction';
import globalStyles from  '@/globalset/css/globalClassName.less'
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
  funTransitionHeight = function(element, time, type) { // time, 数值，可缺省
    if (typeof window.getComputedStyle === "undefined") return;
      const height = window.getComputedStyle(element).height;
      element.style.transition = "none"; // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~
      element.style.height = "auto";
      const targetHeight = window.getComputedStyle(element).height;
      element.style.height = height;
      element.offsetWidth;
      if (time) element.style.transition = "height "+ time +"ms";
      element.style.height = type ? targetHeight : 0;
  };
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
              const { name, id, is_realize } = value || {}
              const users = [{name: '111', avatar: '', user_id: '1111'},{name: '11321', avatar: '', user_id: '121111'},{name: '111', avatar: '', user_id: '11311'},{name: '111', avatar: '', user_id: '11211'}]
              return (
               
                <div className={indexStyles.no_time_card_area_card_item} key={id}>
                  <div className={` ${indexStyles.card_item_status} `}>
                    <CheckItem is_realize={is_realize} />
                  </div>
                  <div  className={`${indexStyles.card_item_name} ${globalStyles.global_ellipsis}`}>{name}</div>
                  <div><AvatarList users={users} size={'small'}/></div>
                </div>
              )
            })
          }
        </div>
      </div>

    )
  }
  render() {
    
    const { currentUserOrganizes = [], group_rows = [], ceiHeight, is_show_org_name, is_all_org } = this.props
    const { itemValue = {}, itemKey } = this.props
    const { list_name,  org_id, list_no_time_data = [] } = itemValue
    const { isShowBottDetail } = this.state 

    return (
      <div className={indexStyles.listHeadItem} style={{ height: (group_rows[itemKey] || 2) * ceiHeight }}>
        <div className={indexStyles.list_head_top}>
          <span className={indexStyles.list_name}>{list_name}</span>
          <span className={indexStyles.org_name}>
            {
              is_show_org_name && is_all_org && (
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
  gantt: { datas: { group_rows = [], ceiHeight, } },
  technological: { datas: { currentUserOrganizes = [], is_show_org_name, is_all_org } },
}) {
  return { ceiHeight, group_rows, currentUserOrganizes, is_show_org_name, is_all_org, }
}
