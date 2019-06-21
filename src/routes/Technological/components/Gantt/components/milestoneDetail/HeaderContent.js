import React from 'react'
import { Icon, Modal, message } from 'antd'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import headerStyles from './headerContent.less'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class Header extends React.Component {
  state = {
  }

  render() {
   const { milestone_detail = {} } = this.props
    const { board_name } = milestone_detail
    return (
      <div className={headerStyles.header_out}>
        <div className={headerStyles.header_out_left}>
          <div className={headerStyles.header_out_flag}>
            <div className={`${headerStyles.header_out_flag_logo} ${globalStyles.authTheme}`}>&#xe633;</div>
            <div className={`${headerStyles.header_out_flag_name}`}>里程碑</div>
          </div>

          <div className={headerStyles.header_out_detail}>
            <div className={headerStyles.header_out_detail_1}>{board_name}</div>
            {/*<div className={headerStyles.header_out_detail_2}>#阿斯顿</div>*/}
            {/*<div className={`${globalStyles.authTheme} ${headerStyles.header_out_detail_3}`}>&#xe61f;</div>*/}
            {/*<div className={headerStyles.header_out_detail_4}>阿德</div>*/}
          </div>
        </div>
        <div className={headerStyles.header_out_right}>
        </div>
      </div>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ milestoneDetail: { milestone_detail = {} } }) {
  return { milestone_detail }
}
