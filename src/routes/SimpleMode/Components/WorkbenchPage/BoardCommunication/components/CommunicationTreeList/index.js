import React, { Component } from 'react'
import { connect } from 'dva'
import {
  Collapse,
  Icon,
  message,
  Tree,
  Button,
  Dropdown,
  Menu,
  Input
} from 'antd'
import {
  getOrgNameWithOrgIdFilter,
  isPaymentOrgUser,
  checkRoleAndMemberVisitControlPermissions
} from '@/utils/businessFunction'
import { getFileList } from '@/services/technological/file.js'
import { isApiResponseOk } from '@/utils/handleResponseData'
import styles from './index.less'
import CustormBadgeDot from '@/components/CustormBadgeDot'
import {
  boardHasUnReadCount,
  folderItemHasUnReadNo
} from '../../../../../../Technological/components/Gantt/ganttBusiness'
import globalStyles from '@/globalset/css/globalClassName.less'
import {
  fileRemove,
  updateFolder
} from '../../../../../../../services/technological/file'
import {
  PROJECT_FILES_FILE_INTERVIEW,
  NOT_HAS_PERMISION_COMFIRN,
  MESSAGE_DURATION_TIME,
  PROJECT_FILES_FILE_UPDATE,
  PROJECT_FILES_FOLDER
} from '../../../../../../../globalset/js/constant'
import Item from 'antd/lib/list/Item'
const { Panel } = Collapse
const { TreeNode, DirectoryTree } = Tree

@connect(mapStateToProps)
export default class CommunicationTreeList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actionList: ['重命名', '访问控制', '删除']
    }
  }

  componentDidMount() {
    const { isVisibleFileList } = this.props
    const {
      // is_show_board_file_area,
      boards_flies = []
    } = this.props
  }

  // 显示项目目录名（一级）
  showHeader = (item, isShowCompanyName) => {
    const { im_all_latest_unread_messages } = this.props
    const count = boardHasUnReadCount({
      board_id: item.id,
      im_all_latest_unread_messages
    })
    console.log('sssssssadad', count, item, im_all_latest_unread_messages)

    const { currentUserOrganizes = [] } = this.props
    return (
      <div className={styles.panelHeader}>
        <div className={styles.name} title={item.board_name}>
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              maxWidth: 240
            }}
          >
            {item.board_name}
            <CustormBadgeDot
              show_dot={count > 0}
              type={'showCount'}
              count={count}
              right={-6}
              top={-4}
            />
          </span>
        </div>
        {isShowCompanyName && (
          <div className={styles.org_name}>
            #{getOrgNameWithOrgIdFilter(item.org_id, currentUserOrganizes)}
          </div>
        )}
      </div>
    )
  }
  // 重命名
  handleRename = folder_id => {
    this.setState({
      folder_id: folder_id,
      current_action: 'rename'
    })
  }
  menuItemClick = (e, item) => {
    e.domEvent.stopPropagation()
    const { key } = e
    switch (key) {
      case '1':
        debugger

        const { projectDetailInfoData } = this.props
        const privileges = item.privileges
        const board_id = item.board_id
        const is_privilege = item.is_privilege
        // /**
        //  * 个人信息
        //  */
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        /**
         * 角色信息
         */
        const role =
          projectDetailInfoData.data &&
          projectDetailInfoData.data.find(item => item.user_id === userInfo.id)
        if (
          !checkRoleAndMemberVisitControlPermissions({
            privileges,
            board_id,
            board_permissions_code: [
              PROJECT_FILES_FOLDER,
              PROJECT_FILES_FILE_UPDATE
            ],
            role_id: role ? role.role_id : '',
            is_privilege: is_privilege
          })
        ) {
          setTimeout(() => {
            message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          }, 50)
          return
        }

        this.setIsShowChange(true, item)
        break
      case '2':
        this.requestRemoveItem(item)
        break
      case '3':
        // setBoardIdStorage(this.props.itemValue.board_id)
        this.toggleVisitControlModal(true, item)
        break
      default:
        break
    }
  }
  // 删除文件
  requestRemoveItem = async item => {
    const { dispatch } = this.props
    const {
      // itemValue: { board_id, privileges = [], is_privilege },
      projectDetailInfoData
    } = this.props
    const board_id = item.board_id
    const current_folder_id = item.folder_id

    // const {
    // getFolderFileList,
    // } = this.props
    const { id, type } = item
    const params = {
      board_id,
      arrays: JSON.stringify([{ type, id }])
    }
    const res = await fileRemove(params)
    if (isApiResponseOk(res)) {
      // getFolderFileList({ id: current_folder_id })
      this.props.queryCommunicationFileData()
      this.props.getCommunicationFolderList(board_id)
    } else {
      message.error(res.message)
    }
  }
  // 修改文件夹名
  requestUpdateFolder = async Item => {
    const { input_folder_value } = this.state
    const { dispatch } = this.props
    if (input_folder_value == '' || input_folder_value == Item.folder_name) {
      return false
    }
    const params = {
      board_id: Item.board_id,
      folder_id: Item.folder_id,
      folder_name: input_folder_value
    }
    const res = await updateFolder(params)
    if (isApiResponseOk(res)) {
      this.setState({
        local_name: input_folder_value
      })
      this.props.queryCommunicationFileData()
      this.props.getCommunicationFolderList(Item.board_id)
    } else {
      message.warn(res.message)
    }
  }
  setIsShowChange = (flag, item) => {
    console.log(item)
    this.setState({
      input_folder_id: item ? item.folder_id : ''
    })
  }

  // 更改名称
  inputOnPressEnter = (item, e) => {
    this.requestUpdateFolder(item)
    this.setIsShowChange(false)
  }
  inputOnBlur = e => {
    this.setIsShowChange(false)
  }
  inputOnchange = e => {
    const { value } = e.target
    this.setState({
      input_folder_value: value
    })
  }
  toggleVisitControlModal = (flag, item) => {
    this.props.toggleVisitControlModal(true, item)
  }
  renderMoreMenu = item => {
    const { type } = item
    return (
      <Menu onClick={e => this.menuItemClick(e, item)}>
        <Menu.Item key={1} style={{ width: 248 }}>
          <span style={{ fontSize: 14, color: `rgba(0,0,0,0.65)`, width: 248 }}>
            <i className={`${globalStyles.authTheme}`} style={{ fontSize: 16 }}>
              &#xe86d;
            </i>{' '}
            重命名
          </span>
        </Menu.Item>
        <Menu.Item key={3}>
          <span style={{ fontSize: 14, color: `rgba(0,0,0,0.65)`, width: 248 }}>
            <i className={`${globalStyles.authTheme}`} style={{ fontSize: 16 }}>
              &#xe86a;
            </i>{' '}
            访问控制
          </span>
        </Menu.Item>
        <Menu.Item key={2}>
          <span style={{ fontSize: 14, color: `rgba(0,0,0,0.65)`, width: 248 }}>
            <i className={`${globalStyles.authTheme}`} style={{ fontSize: 16 }}>
              &#xe68d;
            </i>{' '}
            删除
          </span>
        </Menu.Item>
      </Menu>
    )
  }
  getNewFolderName = e => {
    console.log(e.target.value)
  }
  // 渲染当前项目子节点树
  renderTreeNodes = communicationSubFolderData =>
    communicationSubFolderData.map(item => {
      const { type = '1', folder_name } = item
      const { folder_id, input_folder_value, input_folder_id } = this.state
      const { im_all_latest_unread_messages, wil_handle_types } = this.props
      const un_read_count = folderItemHasUnReadNo({
        type,
        relaDataId: item.folder_id,
        im_all_latest_unread_messages,
        wil_handle_types
      })
      if (item.child_data) {
        return (
          <TreeNode
            title={
              <span>
                <span style={{ position: 'relative' }}>
                  {input_folder_id == item.folder_id ? (
                    <Input
                      className={styles.folder_input}
                      style={{ height: 25 }}
                      autoFocus
                      defaultValue={item.folder_name}
                      onChange={this.inputOnchange}
                      onPressEnter={e => this.inputOnPressEnter(item, e)}
                      onBlur={e => this.inputOnPressEnter(item, e)}
                    />
                  ) : (
                    item.folder_name
                  )}
                  <CustormBadgeDot
                    show_dot={un_read_count > 0}
                    type={'showCount'}
                    count={un_read_count}
                    right={-6}
                    top={-4}
                  />
                </span>
                <span className={styles.dropDown_icon}>
                  <Dropdown
                    trigger={['click']}
                    overlay={this.renderMoreMenu(item)}
                  >
                    <span className={`${globalStyles.authTheme}`}>
                      &#xe7fd;
                    </span>
                  </Dropdown>
                </span>
              </span>
            }
            key={item.folder_id}
            dataRef={item}
          >
            {this.renderTreeNodes(item.child_data)}
          </TreeNode>
        )
      }
      return (
        <TreeNode title={item.folder_name} key={item.folder_id} {...item} />
      )
    })

  // 展开/收起节点时触发
  onExpand = expandedKeys => {
    // console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    console.log('onExpand', expandedKeys)
    const { dispatch } = this.props
    dispatch({
      type: 'projectCommunication/updateDatas',
      payload: {
        expandedKeys,
        autoExpandParent: false
      }
    })
  }

  // 点击树节点触发
  onSelect = (first_item, selectedKeys, info) => {
    // console.log('onSelect-first_item',first_item);
    // console.log('onSelect-selectedKeys',selectedKeys);
    // console.log('onSelect-info',info);
    // const currentInfo = info.selectedNodes[0].props.dataRef;
    const currentInfo = (
      info.selectedNodes.find(item => item.key == selectedKeys[0]) || {
        props: {}
      }
    ).props.dataRef
    // this.setState({ selectedKeys });
    this.props.onSelectTree(currentInfo, first_item)
  }

  render() {
    const {
      boards_flies = [],
      is_show_org_name,
      is_all_org,
      // currentUserOrganizes,
      // selectBoardFileModalVisible,
      isVisibleFileList,
      communicationSubFolderData = [],
      collapseActiveKeys,
      currentSelectBoardId,
      currentLayerSelectedStyle,
      expandedKeys,
      selectedKeys,
      currentFolderId
    } = this.props
    const isShowCompanyName = is_show_org_name && is_all_org // 是否显示归属组织
    const { child_data = [] } = communicationSubFolderData
    return (
      <div className={styles.communicationTreeList}>
        {/* 这里是左侧的项目交流列表 */}
        {isVisibleFileList && (
          <div className={styles.fileList}>
            <div
              className={`${styles.fileListContent} ${isShowCompanyName &&
                styles.arrowPosition}`}
            >
              <Collapse
                bordered={false}
                accordion
                // defaultActiveKey={collapseActiveKeys}
                defaultActiveKey={currentSelectBoardId}
                activeKey={currentSelectBoardId}
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                )}
                onChange={this.props.setCollapseActiveKeys}
              >
                {boards_flies &&
                  boards_flies.map((item, key) => {
                    const {
                      board_name,
                      id,
                      type,
                      org_id,
                      file_data = []
                    } = item
                    // console.log("boards_flies",item);
                    return (
                      // <Panel header={this.showHeader(item, isShowCompanyName)} key={`${item.id}_${item.file_data.length}`} onClick={()=>this.panelOnClick(item)}>
                      //添加付费过滤 liuyingj 2019-11-13
                      isPaymentOrgUser(org_id) && (
                        <Panel
                          header={this.showHeader(item, isShowCompanyName)}
                          key={`${item.id}`}
                          onClick={() => this.panelOnClick(item)}
                        >
                          {child_data && child_data.length ? (
                            <DirectoryTree
                              multiple
                              defaultExpandAll
                              onSelect={this.onSelect.bind(this, item)}
                              onExpand={this.onExpand}
                              expandedKeys={expandedKeys}
                              autoExpandParent={this.state.autoExpandParent}
                              selectedKeys={[currentFolderId]}
                            >
                              {this.renderTreeNodes(child_data)}
                            </DirectoryTree>
                          ) : (
                            ''
                          )}
                        </Panel>
                      )
                    )
                  })}
              </Collapse>
            </div>
          </div>
        )}
      </div>
    )
  }
}

function mapStateToProps({
  gantt: {
    datas: { is_show_board_file_area, boards_flies = [] }
  },
  technological: {
    datas: { currentUserOrganizes = [], is_show_org_name, is_all_org }
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  },
  imCooperation: { im_all_latest_unread_messages, wil_handle_types = [] },
  // projectCommunication:{
  //     count,
  // }
  projectCommunication: {
    currentBoardId,
    communicationProjectListData,
    communicationSubFolderData,
    expandedKeys
  }
}) {
  return {
    is_show_board_file_area,
    boards_flies,
    currentUserOrganizes,
    is_show_org_name,
    is_all_org,
    // count
    communicationSubFolderData,
    expandedKeys,
    im_all_latest_unread_messages,
    wil_handle_types,
    projectDetailInfoData
  }
}
