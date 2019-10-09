import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import headerStyles from './HeaderContent.less'
import { currentNounPlanFilterName, getOrgNameWithOrgIdFilter, checkIsHasPermissionInVisitControl } from '@/utils/businessFunction.js'
import { TASKS } from '../../globalset/js/constant'
import VisitControl from '@/routes/Technological/components/VisitControl/index'
import HeaderContentRightMenu from './HeaderContentRightMenu'

export default class HeaderContent extends Component {
  render() {
    const { taskDetailModalHeaderParams } = this.props
    const { is_show_org_name, is_all_org, currentUserOrganizes = [], drawContent } = taskDetailModalHeaderParams
    const { card_id, org_id, board_id, board_name, list_name } = drawContent
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        {/* 这里是头部左边 */}
        <div style={{flex: '1', minWidth: '376px'}}>
          {/* 这里是头部图标样式 */}
          <span className={headerStyles.header_icon}>
            <i className={`${globalStyles.authTheme} ${headerStyles.title_icon}`}>&#xe66a;</i>
            <i>{currentNounPlanFilterName(TASKS)}</i>
          </span>
          {/* 这里是小导航 */}
          <span className={headerStyles.bread_nav}>
            <span className={headerStyles.bread_board_name}>{board_name}</span>
            {
              is_show_org_name && is_all_org && (
                <span className={headerStyles.bread_org_name}>
                  #{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
                </span>
              )
            }
            <span className={`${globalStyles.authTheme} ${headerStyles.arrow}`}>&#xe61f;</span>
            <span className={headerStyles.bread_list_name}>{list_name}</span>
          </span>
        </div>
        {/* 这里是头部右边 */}
        <div style={{minWidth: '130px'}}>
          <HeaderContentRightMenu />
        </div>
      </div>
    )
  }
}

HeaderContent.defaultProps = {
  board_id: '', // 项目id
  board_name: '', // 项目名
  card_id: '', // 任务id
}
