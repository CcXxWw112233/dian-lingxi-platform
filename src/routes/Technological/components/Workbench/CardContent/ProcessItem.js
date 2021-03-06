import React from 'react'
import indexstyles from '../index.less'
import { Icon, Tooltip } from 'antd'
import Cookies from 'js-cookie'
import {
  setBoardIdStorage,
  getOrgNameWithOrgIdFilter
} from '../../../../../utils/businessFunction'
import { message } from 'antd/lib/index'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN,
  ORG_TEAM_BOARD_QUERY,
  PROJECT_FLOW_FLOW_ACCESS,
  PROJECT_TEAM_CARD_INTERVIEW
} from '../../../../../globalset/js/constant'
import { resolve } from 'path'
import { connect } from 'dva'
import globalStyle from '../../../../../globalset/css/globalClassName.less'

@connect(
  (
    {
      technological: {
        datas: { currentUserOrganizes = [], is_show_org_name, is_all_org }
      }
    },
    {
      workbench: {
        datas: { projectTabCurrentSelectedProject }
      }
    }
  ) => ({
    currentUserOrganizes,
    is_show_org_name,
    projectTabCurrentSelectedProject,
    is_all_org
  })
)
export default class ProcessItem extends React.Component {
  state = {
    totalId: {},
    value: {}
  }
  componentDidMount() {
    const { itemValue = {} } = this.props
    const {
      flow_node_name,
      flow_instance_name,
      flow_template_name,
      name,
      board_name,
      board_id,
      status = '1',
      flow_instance_id,
      org_id
    } = itemValue //status 1running 2stop 3 complete
    this.setState({
      value: {
        flow_node_name,
        flow_template_name,
        name,
        board_name,
        board_id,
        status,
        flow_instance_id,
        org_id,
        flow_instance_name
      }
    })
  }
  async gotoBoardDetail(obj) {
    // debugger
    setBoardIdStorage(obj.board)
    // if (!checkIsHasPermission(ORG_TEAM_BOARD_QUERY, obj.org_id)) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    await this.props.dispatch({
      type: 'workbenchDetailProcess/getWorkFlowComment',
      payload: { flow_instance_id: obj.flow }
    })

    await this.props.dispatch({
      type: 'workbenchDetailProcess/updateDatas',
      payload: this.state
    })

    await this.props.routingJump(
      `/technological/projectDetail?board_id=${obj.board}&appsSelectKey=2&flow_id=${obj.flow}`
    )
    await this.props.dispatch({
      type: 'publicProcessDetailModal/getProcessInfoByUrl',
      payload: {
        currentProcessInstanceId: obj.flow
      }
    })
  }
  async click(obj) {
    //???????????????????????????
    setBoardIdStorage(this.state.value.board_id)
    const { dispatch } = this.props

    // if (!checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS)) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    dispatch({
      type: 'workbenchPublicDatas/getRelationsSelectionPre',
      payload: {
        _organization_id: obj.org_id
      }
    })
    dispatch({
      type: 'projectDetail/getRelationsSelectionPre',
      payload: {
        _organization_id: obj.org_id
      }
    })
    this.props.updatePublicDatas({ board_id: this.state.value.board_id })
    // if (!checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS)) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    //--change in 2019/3/26--end
    await this.setState({
      totalId: {
        flow: obj.flow,
        board: obj.board
      }
    })
    await this.props.dispatch({
      type: 'workbenchDetailProcess/updateDatas',
      payload: { ...this.state, currentProcessInstanceId: obj.flow }
    })
    await this.props.click()
  }
  render() {
    const {
      itemValue = {},
      currentUserOrganizes = [],
      is_show_org_name,
      projectTabCurrentSelectedProject,
      is_all_org
    } = this.props
    const {
      flow_node_name,
      flow_template_name,
      name,
      board_name,
      board_id,
      status = '1',
      flow_instance_id,
      org_id,
      id,
      is_privilege
    } = itemValue
    // console.log(is_privilege, 'sssssss')
    // const { flow_node_name, name, board_name, board_id, status='1', flow_instance_id } = itemValue //status 1running 2stop 3 complete
    // console.log('hhhaha', this.props.itemValue)
    const obj = {
      org_id: this.state.value.org_id,
      flow: this.state.value.flow_instance_id,
      board: this.state.value.board_id
    }
    const filterColor = status => {
      let color = '#f2f2f2'
      if ('1' === status) {
        color = '#40A9FF'
      } else if ('2' === status) {
        color = '#FF4D4F'
      } else if ('3' === status) {
        color = '#73D13D'
      } else {
      }
      return color
    }

    return (
      <div className={indexstyles.processItem}>
        <div className={indexstyles.processText}>
          <Tooltip
            title={
              this.state.value.flow_node_name ||
              this.state.value.flow_instance_name
            }
          >
            <span
              className={indexstyles.ellipsis}
              style={{ cursor: 'pointer' }}
              onClick={this.click.bind(this, obj)}
            >
              {this.state.value.flow_node_name ||
                this.state.value.flow_instance_name}{' '}
              {this.state.value.flow_template_name}
            </span>
          </Tooltip>
          {/* <span onClick={this.gotoBoardDetail.bind(this, obj)} style={{marginLeft: 6, color: '#8c8c8c', cursor: 'pointer'}}>
            #{this.state.value.board_name}
          </span> */}
          {is_privilege == '1' && (
            <Tooltip title="?????????????????????" placement="top">
              <span
                style={{
                  color: 'rgba(0,0,0,0.50)',
                  marginRight: '5px',
                  marginLeft: '5px',
                  cursor: 'pointer'
                }}
              >
                <span className={`${globalStyle.authTheme}`}>&#xe7ca;</span>
              </span>
            </Tooltip>
          )}
          {projectTabCurrentSelectedProject == '0' && (
            <span style={{ marginLeft: 5, marginRight: 2, color: '#8C8C8C' }}>
              #
            </span>
          )}
          <Tooltip
            placement="topLeft"
            title={
              is_show_org_name &&
              projectTabCurrentSelectedProject == '0' &&
              is_all_org ? (
                <span>
                  {getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}{' '}
                  <Icon
                    type="caret-right"
                    style={{ fontSize: 8, color: '#8C8C8C' }}
                  />{' '}
                  {this.state.value.board_name}
                </span>
              ) : (
                <span>{this.state.value.board_name}</span>
              )
            }
          >
            <span
              style={{
                color: '#8c8c8c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={this.gotoBoardDetail.bind(this, obj)}
            >
              {is_show_org_name &&
                projectTabCurrentSelectedProject == '0' &&
                is_all_org && (
                  <span className={indexstyles.org_name}>
                    {getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
                  </span>
                )}
              {is_show_org_name &&
                projectTabCurrentSelectedProject == '0' &&
                is_all_org && (
                  <span>
                    <Icon
                      type="caret-right"
                      style={{ fontSize: 8, color: '#8C8C8C' }}
                    />
                  </span>
                )}
              {projectTabCurrentSelectedProject == '0' && (
                <span className={indexstyles.ellipsis}>
                  {this.state.value.board_name}
                </span>
              )}
            </span>
          </Tooltip>
        </div>
        <div>
          <div
            style={{ backgroundColor: filterColor(this.state.value.status) }}
          ></div>
        </div>
      </div>
    )
  }
}
