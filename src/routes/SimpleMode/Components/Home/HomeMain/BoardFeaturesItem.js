import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './featurebox.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import {
  timestampToTimeNormal,
  timeColor,
  isSamDay,
  transformTimestamp,
  timestampToHM
} from '../../../../../utils/util'
import {
  getOrgNameWithOrgIdFilter,
  currentNounPlanFilterName
} from '../../../../../utils/businessFunction'
import { TASKS, FLOWS } from '../../../../../globalset/js/constant'

@connect(mapStateToProps)
export default class BoardFeaturesItem extends Component {
  static propTypes = {
    prop: PropTypes
  }

  itemClick = () => {
    const {
      dispatch,
      itemValue: { id = '', board_id = '', parent_id, rela_type }
    } = this.props
    if (rela_type == 'meeting') return
    this.props.whetherShowModalVisible &&
      this.props.whetherShowModalVisible({ type: 'card', visible: true })
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        drawerVisible: true,
        card_id: parent_id || id
      }
    })
    dispatch({
      type: 'workbenchPublicDatas/updateDatas',
      payload: {
        board_id
      }
    })
  }

  // 加入会议点击事件
  handleJoinMeeting = join_url => {
    const openWin = url => {
      var element1 = document.createElement('a')
      element1.href = url
      element1.target = '_blank'
      element1.id = 'openWin'
      document.querySelector('body').appendChild(element1)
      document.getElementById('openWin').click() //点击事件
      document
        .getElementById('openWin')
        .parentNode.removeChild(document.getElementById('openWin'))
    }
    openWin(join_url)
  }

  filterIcon = ({ rela_type }) => {
    let container = ''
    switch (rela_type) {
      case '1': //任务
        container = (
          <span className={`${globalStyles.authTheme}`}>&#xe66a;</span>
        )
        break
      case 'meeting': //日程
        container = (
          <span className={`${globalStyles.authTheme}`}>&#xe68e;</span>
        )
        break
      case '3': //流程
        container = (
          <span className={`${globalStyles.authTheme}`}>&#xe68c;</span>
        )
        break
      default:
        break
    }
    return container
  }
  filterIcon2 = ({ rela_type, is_realize }) => {
    let container = ''
    switch (rela_type) {
      case '1': //任务
        if (is_realize == '1') {
          container = (
            <span className={`${globalStyles.authTheme}`}>&#xe662;</span>
          )
        } else {
          container = (
            <span className={`${globalStyles.authTheme}`}>&#xe661;</span>
          )
        }

        break
      case 'meeting': //日程
        container = (
          <span className={`${globalStyles.authTheme}`}>&#xe84d;</span>
        )
        break
      case '3': //流程
        container = (
          <span className={`${globalStyles.authTheme}`}>&#xe68b;</span>
        )
        break
      default:
        break
    }
    return container
  }
  filterTitle = ({ rela_type, parent_id }) => {
    let container = ''
    switch (rela_type) {
      case '1': //任务
        container = `${currentNounPlanFilterName(TASKS)}`
        if (parent_id) {
          container = `子${currentNounPlanFilterName(TASKS)}`
        }
        break
      case 'meeting': //日程
        container = `会议`
        break
      case '3': //流程
        container = `${currentNounPlanFilterName(FLOWS)}`
        break
      default:
        break
    }
    return container
  }
  renderTime = () => {
    const {
      itemValue: { rela_type, start_time, due_time, end_time }
    } = this.props
    let time = ''
    let dec = ''
    // 一律没有截止时间的都是未排期
    if (!due_time && rela_type != 'meeting') {
      return {
        time: '',
        dec: '未排期'
      }
    }
    const is_today = timestamp =>
      isSamDay(new Date().getTime(), timestamp) &&
      transformTimestamp(timestamp) > new Date().getTime() //今天截止但未过期
    if (rela_type == 'meeting') {
      return {
        // ???? 没看懂 为什么用截止时间比较 然后取得是开始时间
        time: is_today(end_time.length === 10 ? end_time * 1000 : end_time)
          ? `今天 ${timestampToHM(end_time)}`
          : timestampToTimeNormal(end_time, '/', true),
        dec: '截止'
      }
    } else {
      return {
        time: is_today(due_time)
          ? `今天 ${timestampToHM(due_time)}`
          : timestampToTimeNormal(due_time, '/', true),
        dec: '截止'
      }
    }
  }
  renderBelong = () => {
    const {
      currentSelectOrganize = {},
      currentUserOrganizes,
      simplemodeCurrentProject = {},
      itemValue = {}
    } = this.props
    let { board_name, org_id } = itemValue
    const isAllOrg =
      !currentSelectOrganize.id || currentSelectOrganize.id == '0'
    const isAllBoard =
      !simplemodeCurrentProject.board_id ||
      simplemodeCurrentProject.board_id == '0'
    let org_name = ''
    if (isAllBoard) {
      board_name = `#${board_name}`
    } else {
      return ``
    }
    if (isAllOrg) {
      org_name = `(${getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)})`
    } else {
      org_name = ''
    }
    return `${board_name} ${org_name}`
  }
  render() {
    const {
      currentSelectOrganize = {},
      currentUserOrganizes,
      simplemodeCurrentProject = {}
    } = this.props
    const isAllOrg =
      !currentSelectOrganize.id || currentSelectOrganize.id == '0'
    const isAllBoard =
      !simplemodeCurrentProject.board_id ||
      simplemodeCurrentProject.board_id == '0'
    const {
      itemValue: {
        id,
        name,
        rela_type,
        start_time,
        due_time,
        org_id,
        is_realize,
        parent_id,
        parent_name,
        board_name,
        topic,
        join_url,
        end_time
      }
    } = this.props
    const use_time = rela_type == 'meeting' ? end_time : due_time
    const belong_name = this.renderBelong()
    // console.log('belong_name', belong_name, !!belong_name)
    return (
      <div
        className={`${
          !!belong_name ? styles.feature_item2 : styles.feature_item
        }`}
        onClick={this.itemClick}
      >
        <div className={`${styles.feature_item_lf}`}>
          {this.filterIcon({ rela_type })}
          <span>{this.filterTitle({ rela_type, parent_id })}</span>
        </div>
        <div
          className={`${styles.feature_item_middle}  ${globalStyles.global_ellipsis}`}
        >
          <div
            className={`${styles.feature_item_middle_name}  ${globalStyles.global_ellipsis}`}
          >
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  marginRight: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {this.filterIcon2({ rela_type, is_realize })}
                <span>{name || topic}</span>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {parent_id && parent_name && ` (${parent_name})`}
                </span>
              </div>
              {rela_type == 'meeting' && (
                <div
                  style={{
                    width: '88px',
                    height: '24px',
                    lineHeight: '24px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.65)',
                    flexShrink: 0
                  }}
                  onClick={() => {
                    this.handleJoinMeeting(join_url)
                  }}
                >
                  加入会议
                </div>
              )}
            </div>
          </div>
          {/* {
                        isAllOrg && (
                            <div className={`${styles.feature_item_middle_orgname}  ${globalStyles.global_ellipsis}`}>
                                #{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
                            </div>
                        )
                    } */}
          {!!belong_name && (
            <div
              className={`${styles.feature_item_middle_orgname} ${globalStyles.global_ellipsis}`}
              title={belong_name}
            >
              {belong_name}
            </div>
          )}
        </div>
        <div
          className={`${styles.feature_item_rt}`}
          style={{ color: timeColor(use_time) }}
        >
          {' '}
          {this.renderTime().time} {this.renderTime().dec}
        </div>
      </div>
    )
  }
}
function mapStateToProps({
  simplemode: { simplemodeCurrentProject },
  technological: {
    datas: { currentUserOrganizes, currentSelectOrganize = {} }
  }
}) {
  return {
    simplemodeCurrentProject,
    currentUserOrganizes,
    currentSelectOrganize
  }
}
