import React from 'react'
import { Icon, Modal, message } from 'antd'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import headerStyles from './headerContent.less'
export default class Header extends React.Component {
  state = {
  }

  render() {

    return (
      <div className={headerStyles.header_out}>
        <div className={headerStyles.header_out_left}>
          <div className={headerStyles.header_out_flag}>
            <div className={`${headerStyles.header_out_flag_logo} ${globalStyles.authTheme}`}>&#xe633;</div>
            <div className={`${headerStyles.header_out_flag_name}`}>里程碑</div>
          </div>

          <div className={headerStyles.header_out_detail}>
            <div className={headerStyles.header_out_detail_1}>卡是多久啊</div>
            <div className={headerStyles.header_out_detail_2}>#阿斯顿</div>
            <div className={`${globalStyles.authTheme} ${headerStyles.header_out_detail_3}`}>&#xe61f;</div>
            <div className={headerStyles.header_out_detail_4}>阿德</div>
          </div>
        </div>
        <div className={headerStyles.header_out_right}>
        </div>
      </div>
    )
  }
}
