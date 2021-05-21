import { Menu, message, Switch } from 'antd'
import React, { Component } from 'react'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { setGanttUserCustorm } from '../../../../../../services/technological/gantt'
import { BOOLEAN_FALSE_CODE } from '../../../../../../globalset/js/constant'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import { connect } from 'dva'
import { ganttIsOutlineView } from '../../constants'
const SubMenu = Menu.SubMenu

@connect(mapStateToProps)
export default class OperateMenu extends Component {
  setCardNameOutside = checked => {
    const { dispatch } = this.props
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        card_name_outside: checked
      }
    })
  }
  setCardNameOutsideBuddle = e => {
    e.stopPropagation()
  }
  // 类型选择
  handleOnSelect = e => {
    const { key } = e
    const { outline_tree = [], dispatch } = this.props
    switch (key) {
      case 'select_hide_term': // 选择隐藏项
        const outline_tree_ = JSON.parse(JSON.stringify(outline_tree))
        dispatch({
          type: 'gantt/updateDatas',
          payload: {
            selected_hide_term: true,
            // 进行快照
            outline_tree_original: outline_tree_
          }
        })
        break
      case 'set_batch_operating':
        this.setBatchOpetating()
        break
      default:
        break
    }
  }
  //设置批量设置
  setBatchOpetating = () => {
    const { batch_operating, dispatch } = this.props
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        batch_operating: !batch_operating
      }
    })
  }

  setFilterTypeStyle = code => {
    const { outline_tree_filter_type } = this.props
    if (outline_tree_filter_type[code] == BOOLEAN_FALSE_CODE)
      return 'rgba(0,0,0,0.35)'
    return '#75A4FF'
  }
  // 设置隐藏
  setOutlineTreeFilterType = async (code, e) => {
    e.stopPropagation()
    const {
      outline_tree_filter_type = {},
      dispatch,
      outline_tree,
      gantt_board_id
    } = this.props
    if (outline_tree_filter_type[code] == BOOLEAN_FALSE_CODE) return
    const res = await setGanttUserCustorm({
      board_id: gantt_board_id,
      [code]: BOOLEAN_FALSE_CODE
    })
    if (isApiResponseOk(res) || true) {
      message.success('隐藏成功')
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          outline_tree_filter_type: {
            ...outline_tree_filter_type,
            [code]: BOOLEAN_FALSE_CODE
          }
        }
      })
      setTimeout(() => {
        dispatch({
          type: 'gantt/handleOutLineTreeData',
          payload: {
            data: outline_tree
          }
        })
      }, 100)
    }
  }
  render() {
    const { card_name_outside, group_view_type } = this.props
    return (
      <Menu onClick={this.handleOnSelect}>
        <Menu.Item
          key="set_name_outside"
          style={{
            display: ganttIsOutlineView({ group_view_type }) ? 'block' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 14 }}>名称外置</div>
            <div onClick={e => this.setCardNameOutsideBuddle(e)}>
              <Switch
                checked={card_name_outside}
                onChange={this.setCardNameOutside}
              />
            </div>
          </div>
        </Menu.Item>
        <SubMenu
          title={'选择隐藏项'}
          style={{
            display: ganttIsOutlineView({ group_view_type }) ? 'block' : 'none'
          }}
        >
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>逾期的任务</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_due') }}
                onClick={e => this.setOutlineTreeFilterType('is_show_due', e)}
              >
                隐藏
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>预警的任务</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_warning') }}
                onClick={e =>
                  this.setOutlineTreeFilterType('is_show_warning', e)
                }
              >
                隐藏
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>正在进行的任务</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_doing') }}
                onClick={e => this.setOutlineTreeFilterType('is_show_doing', e)}
              >
                隐藏
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>未开始的任务</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_not_start') }}
                onClick={e =>
                  this.setOutlineTreeFilterType('is_show_not_start', e)
                }
              >
                隐藏
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className={styles.hide_sub_menu}>
              <div>已完成的任务</div>
              <div
                className={globalStyles.link_mouse}
                style={{ color: this.setFilterTypeStyle('is_show_realize') }}
                onClick={e =>
                  this.setOutlineTreeFilterType('is_show_realize', e)
                }
              >
                隐藏
              </div>
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="select_hide_term">自定义</Menu.Item>
        </SubMenu>
        <Menu.Item key="set_batch_operating">批量设置</Menu.Item>
      </Menu>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  gantt: {
    datas: {
      outline_tree,
      outline_tree_original = [],
      card_name_outside,
      outline_tree_filter_type,
      gantt_board_id,
      group_view_type,
      batch_operating
    }
  }
}) {
  return {
    outline_tree,
    card_name_outside,
    outline_tree_original,
    outline_tree_filter_type,
    gantt_board_id,
    batch_operating,
    group_view_type
  }
}
