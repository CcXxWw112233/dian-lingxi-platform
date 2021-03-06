import React from 'react'
import { Menu, Modal, message, Dropdown, Tooltip } from 'antd'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import headerStyles from './headerContent.less'
import { connect } from 'dva'
import InformRemind from '@/components/InformRemind'
import { requestDeleteMiletone } from '../../../../../../services/technological/task'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'

const MenuItem = Menu.Item

@connect(mapStateToProps)
export default class Header extends React.Component {
  state = {}

  handelOperateMenu = ({ key }) => {
    if ('delete' == key) {
      this.confrimDelete()
    }
  }

  confrimDelete = () => {
    const {
      milestone_detail: { id },
      deleteMiletone = function() {},
      projectDetailInfoData: { board_id },
      card_id
    } = this.props
    const that = this
    Modal.confirm({
      title: '提示',
      content: '确认删除该里程碑？',
      zIndex: 1009,
      onOk() {
        requestDeleteMiletone({ id }).then(res => {
          if (isApiResponseOk(res)) {
            setTimeout(() => {
              message.success('删除成功')
            })
            if (typeof deleteMiletone == 'function') {
              deleteMiletone({ id })
            }
            const calback = () => {
              // 需要更新弹窗数据以及里程碑数据
              that.props.dispatch({
                type: 'publicTaskDetailModal/getCardWithAttributesDetail',
                payload: {
                  id: card_id
                }
              })
            }
            that.props.dispatch({
              type: 'gantt/updateCardDetailDrawer',
              payload: {
                board_id,
                action: 'update_lcb',
                calback
              }
            })
            that.props.onCancel()
          } else {
            message.error(res.message)
          }
        })
      }
    })
  }

  renderOperateMenu = () => {
    return (
      <Menu onClick={this.handelOperateMenu}>
        <MenuItem key={'delete'} style={{ color: '#FF4D4F' }}>
          删除
        </MenuItem>
      </Menu>
    )
  }

  render() {
    // console.log(this.props, 'sssss_milestone')
    const { milestone_detail = {}, users = [] } = this.props
    const { board_name, id, principals = [], parent_id } = milestone_detail
    let title = parent_id == '0' || !parent_id ? '里程碑' : '子里程碑'
    let title_icon = parent_id == '0' ? <>&#xe633;</> : <>&#xe7b7;</>
    return (
      <div className={headerStyles.header_out}>
        <div className={headerStyles.header_out_left}>
          <div className={headerStyles.header_out_flag}>
            <div
              className={`${headerStyles.header_out_flag_logo} ${globalStyles.authTheme}`}
            >
              {title_icon}
            </div>
            <div className={`${headerStyles.header_out_flag_name}`}>
              {title}
            </div>
          </div>
          <div className={headerStyles.header_out_detail}>
            <div className={headerStyles.header_out_detail_1}>{board_name}</div>
            {/*<div className={headerStyles.header_out_detail_2}>#阿斯顿</div>*/}
            {/*<div className={`${globalStyles.authTheme} ${headerStyles.header_out_detail_3}`}>&#xe61f;</div>*/}
            {/*<div className={headerStyles.header_out_detail_4}>阿德</div>*/}
          </div>
        </div>
        <div className={headerStyles.header_out_right}>
          {/* <Dropdown overlay={this.renderOperateMenu()}>
            <div className={globalStyles.authTheme} style={{ fontSize: 18, marginRight: 10 }}>&#xe7fd;</div>
          </Dropdown> */}
          <div className={headerStyles.del_milestone}>
            <Tooltip
              placement="top"
              title="删除"
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              <div
                className={`${globalStyles.authTheme} ${headerStyles.del_icon}`}
                onClick={this.confrimDelete}
                style={{ fontSize: 18, marginRight: 10, cursor: 'pointer' }}
              >
                &#xe7c3;
              </div>
            </Tooltip>
          </div>
          <InformRemind
            milestonePrincipals={principals}
            rela_id={id}
            rela_type="5"
            user_remind_info={users}
          />
        </div>
      </div>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  milestoneDetail: { milestone_detail = {} },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  },
  publicTaskDetailModal: { card_id }
}) {
  return { milestone_detail, projectDetailInfoData, card_id }
}
