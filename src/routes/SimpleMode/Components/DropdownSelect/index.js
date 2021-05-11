import React, { Component } from 'react'
import { Menu, Dropdown, Input, Icon, Divider, message, Badge } from 'antd'
import { connect } from 'dva/index'
import styles from './index.less'
import { addMenbersInProject } from '../../../../services/technological/project'
import globalStyles from '@/globalset/css/globalClassName.less'
import {
  getOrgIdByBoardId,
  currentNounPlanFilterName
} from '../../../../utils/businessFunction'
import ShowAddMenberModal from '../../../../routes/Technological/components/Project/ShowAddMenberModal'
import { isApiResponseOk } from '../../../../utils/handleResponseData'
import { PROJECTS } from '../../../../globalset/js/constant'
import AutoSize from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'

class DropdownSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      addNew: false,
      inputValue: '',
      fuctionMenuItemList: this.props.fuctionMenuItemList,
      menuItemClick: this.props.menuItemClick,
      invite_board_id: '', //邀请加入的项目id
      show_add_menber_visible: false
    }
  }

  handleSeletedMenuItem = item => {}

  /** 渲染方法类的item 废弃 */
  renderFunctionMenuItem = itemList => {
    return itemList.map((item, index) => (
      <div
        key={item.id}
        style={{
          lineHeight: '30px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#000000',
          boxShadow: 'none',
          borderRadius: '0',
          border: '0',
          borderRight: '0px!important'
        }}
      >
        <span style={{ color: '#1890FF' }}>
          <Icon type={item.icon} style={{ fontSize: '17px' }} />
          <span style={{ paddingLeft: '10px' }}>{item.name}</span>
        </span>
      </div>
    ))
  }
  //添加项目成员操作-------
  boardInvitePartner = ({ board_id }, e) => {
    e.stopPropagation()
    this.setState(
      {
        invite_board_id: board_id
      },
      () => {
        this.setShowAddMenberModalVisibile()
      }
    )
  }
  setShowAddMenberModalVisibile = () => {
    this.setState({
      show_add_menber_visible: !this.state.show_add_menber_visible
    })
  }

  addMenbersInProject = values => {
    const { dispatch } = this.props
    const { board_id } = values
    addMenbersInProject({ ...values }).then(res => {
      if (isApiResponseOk(res)) {
        message.success('已成功添加项目成员')
        setTimeout(() => {
          this.handleAddMenberCalback({ board_id })
        }, 1000)
      } else {
        message.error(res.message)
      }
    })
  }
  handleAddMenberCalback = ({ board_id }) => {
    const { currentSelectedWorkbenchBox = {}, dispatch } = this.props
    const { code } = currentSelectedWorkbenchBox
    if ('board:plans' == code) {
      dispatch({
        type: 'gantt/getAboutUsersBoards',
        payload: {}
      })
    } else if ('board:chat' == code) {
      // dispatch({
      //     type: 'workbenchTaskDetail/projectDetailInfo',
      //     payload: {
      //         id: board_id
      //     }
      // })
    } else if ('board:files' == code) {
      // dispatch({
      //     type: 'projectDetail/getAboutUsersBoards',
      //     payload: {
      //         id: board_id
      //     }
      // })
    } else {
    }
  }
  //添加项目成员操作-------end

  // renderMenuItem = itemList => {
  //   return itemList.map((item, index) => (

  //   ))
  // }

  componentWillReceiveProps() {
    const { itemList, fuctionMenuItemList } = this.props
    this.setState({
      itemList: itemList,
      fuctionMenuItemList: fuctionMenuItemList
    })
  }

  /** 单个菜单渲染 */
  MenuItemRow = (goruplist, { style, index }) => {
    const { selectedKeys = [], menuItemClick } = this.props
    const item = goruplist[index] || {}
    /** 渲染类型是func的数据 */
    if (item._type === 'func')
      return (
        <div
          key={item.id}
          style={{
            lineHeight: '30px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#000000',
            boxShadow: 'none',
            borderRadius: '0',
            border: '0',
            borderRight: '0px!important',
            ...style
          }}
          className={styles.funcItem}
        >
          <span style={{ color: '#1890FF' }}>
            <Icon type={item.icon} style={{ fontSize: '17px' }} />
            <span style={{ paddingLeft: '10px' }}>{item.name}</span>
          </span>
        </div>
      )
    /** 渲染普通菜单 */
    return (
      <div
        key={item.id}
        style={style}
        disabled={item.disabled || false}
        onClick={menuItemClick.bind(this, { key: item.id })}
        className={`${
          item.disabled === true
            ? styles.menuItemDisabled
            : styles.menuItemNormal
        } ${selectedKeys.includes(item.id) ? styles.active : ''}`}
        title={`${item.name ? item.name : ''} ${
          item.parentName ? '#' + item.parentName : ''
        }`}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{ flex: 1, maxWidth: '500px' }}
            className={globalStyles.global_ellipsis}
          >
            {item.is_new == '1' ? <Badge dot>{item.name}</Badge> : item.name}
            <span style={{ marginLeft: 4 }}>
              {item.parentName && (
                <span className={styles.parentTitle}>#{item.parentName}</span>
              )}
            </span>
          </div>
          {item.id != '0' && (
            <div
              onClick={e => this.boardInvitePartner({ board_id: item.id }, e)}
              style={{
                color: '#40A9FF',
                fontSize: 16,
                width: 32,
                marginLeft: 6,
                fontWeight: 'bold',
                textAlign: 'right',
                cursor: 'pointer'
              }}
            >
              <span className={globalStyles.authTheme}>&#xe685;</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  /** 渲染overlay */
  renderContent() {
    const { fuctionMenuItemList = [], menuItemClick = () => {} } = this.state
    const { itemList = [], selectedKeys = [] } = this.props

    /** 合并了func类型的数据 */
    const grouplist = [
      ...fuctionMenuItemList.map(item => ({ ...item, _type: 'func' })),
      ...itemList
    ]

    return (
      <div
        className={styles.dropdownMenu}
        // onClick={menuItemClick}
        // selectedKeys={selectedKeys}
      >
        {/* {this.renderFunctionMenuItem(fuctionMenuItemList)} */}
        <AutoSize>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              itemCount={grouplist.length}
              itemSize={40}
            >
              {this.MenuItemRow.bind(this, grouplist)}
            </List>
          )}
        </AutoSize>
        {/* {this.renderMenuItem(itemList)} */}
      </div>
    )
  }
  render() {
    const {
      simplemodeCurrentProject,
      iconVisible = true,
      dropdownStyle = {}
    } = this.props
    const { show_add_menber_visible, invite_board_id } = this.state
    return (
      <div className={styles.wrapper}>
        <Dropdown
          overlay={this.renderContent()}
          trigger={['click']}
          //visible={visible}
          //onVisibleChange={this.handleVisibleChange}
        >
          <div
            className={styles.titleClassName}
            style={{
              display: 'inline-block',
              maxWidth: '248px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {iconVisible && (
              <span>
                <i
                  className={`${globalStyles.authTheme}`}
                  style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '20px' }}
                >
                  &#xe67d;
                </i>
                &nbsp; &nbsp;
              </span>
            )}
            <span style={{ fontWeight: '500', fontSize: '16px' }}>
              {simplemodeCurrentProject && simplemodeCurrentProject.board_id
                ? simplemodeCurrentProject.board_name
                : `我参与的${currentNounPlanFilterName(
                    PROJECTS,
                    this.props.currentNounPlan
                  )}`}
              <Icon type="down" style={{ fontSize: '12px' }} />
            </span>
          </div>
        </Dropdown>

        {show_add_menber_visible && (
          <ShowAddMenberModal
            invitationType="1"
            invitationId={invite_board_id}
            invitationOrg={getOrgIdByBoardId(invite_board_id)}
            show_wechat_invite={true}
            _organization_id={getOrgIdByBoardId(invite_board_id)}
            board_id={invite_board_id}
            addMenbersInProject={this.addMenbersInProject}
            modalVisible={show_add_menber_visible}
            setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile}
          />
        )}
      </div>
    )
  }
}

export default connect(
  ({
    simplemode: { currentSelectedWorkbenchBox = {} },
    organizationManager: {
      datas: { currentNounPlan }
    }
  }) => ({
    currentSelectedWorkbenchBox,
    currentNounPlan
  })
)(DropdownSelect)
