import React from 'react'
import { Menu, Modal, message, Dropdown } from 'antd'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import headerStyles from './headerContent.less'
import { connect } from 'dva'
import InformRemind from '@/components/InformRemind'

const MenuItem = Menu.Item

@connect(mapStateToProps)
export default class Header extends React.Component {
  state = {
  }

  handelOperateMenu = ({ key }) => {
    if ('delete' == key) {
      this.confrimDelete()
    }
  }

  confrimDelete = () => {
    const { milestone_detail: { id }, deleteMiletone = function () { } } = this.props
    const that = this
    Modal.confirm({
      title: '提示',
      content: '确认删除该里程碑？',
      zIndex: 1007,
      onOk() {
        if (typeof deleteMiletone == 'function') {
          deleteMiletone({ id })
        }
        that.props.onCancel()
      },
    })
  }

  renderOperateMenu = () => {
    return (
      <Menu onClick={this.handelOperateMenu}>
        <MenuItem key={'delete'} style={{ color: '#FF4D4F' }}>删除</MenuItem>
      </Menu>
    )
  }

  render() {
    // console.log(this.props, 'sssss_milestone')
    const { milestone_detail = {}, users = [] } = this.props
    const { board_name, id, principals = [] } = milestone_detail
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
          <Dropdown overlay={this.renderOperateMenu()}>
            <div className={globalStyles.authTheme} style={{ fontSize: 18, marginRight: 10 }}>&#xe7fd;</div>
          </Dropdown>
          <InformRemind milestonePrincipals={principals} rela_id={id} rela_type='5' user_remind_info={users} />
        </div>
      </div>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ milestoneDetail: { milestone_detail = {} }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { milestone_detail, projectDetailInfoData }
}
