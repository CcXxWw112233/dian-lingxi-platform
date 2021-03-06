import React, { Component } from 'react'
import dva, { connect } from 'dva/index'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon, message, Tooltip } from 'antd'
import DropdownSelect from '../../Components/DropdownSelect/index'
import CreateProject from '@/routes/Technological/components/Project/components/CreateProject/index'
import simpleMode from '../../../../models/simpleMode'
import {
  getOrgNameWithOrgIdFilter,
  setBoardIdStorage,
  isPaymentOrgUser,
  selectBoardToSeeInfo,
  checkIsHasPermission,
  getOrgIdByBoardId
} from '@/utils/businessFunction'
import { isApiResponseOk } from '../../../../utils/handleResponseData'
import {
  ORG_TEAM_BOARD_CREATE,
  PROJECTS
} from '../../../../globalset/js/constant'
import { currentNounPlanFilterName } from '../../../../utils/businessFunction'
import { platformNouns } from '../../../../globalset/clientCustorm'
class MyWorkbenchBoxs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addProjectModalVisible: false
    }
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {
    const { projectList: old_projectList } = this.props
    const { dispatch, projectList } = nextProps
    if (
      (!old_projectList || old_projectList.length == 0) &&
      projectList.length > 0
    ) {
      const userInfo = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : {}
      const { user_set = {} } = userInfo
      const selectBoard = projectList.filter(
        item =>
          item.board_id === user_set.current_board_id &&
          item.org_id === user_set.current_org
      )

      if (selectBoard && selectBoard.length > 0) {
        //设置当前选中的项目
        setBoardIdStorage(user_set.current_board_id)
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: { ...selectBoard[0] }
          }
        })
        // dispatch({
        //   type: 'technological/updateDatas',
        //   payload: {
        //     currentSelectedProjectOrgIdByBoardId: selectBoard[0].board_id
        //   }
        // })
      } else {
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: {}
          }
        })
      }
    }
  }

  addMyWorkBoxs = () => {
    this.props.setHomeVisible({
      simpleHeaderVisiable: false,
      myWorkbenchBoxsVisiable: false,
      wallpaperSelectVisiable: false,
      workbenchBoxSelectVisiable: true,
      createProjectVisiable: false
    })
  }
  onSelectBoard = data => {
    // 首页的下拉选项
    // console.log('进来了','ssssssssssssssssssss_select')
    if (data.key === 'add') {
      this.setState({
        addProjectModalVisible: true
      })
      return this.handleCreateProject()
    } else {
      const { dispatch, projectList } = this.props
      if (data.key === 0) {
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: {}
          }
        })
        dispatch({
          type: 'accountSet/updateUserSet',
          payload: {
            current_board: {}
          }
        })
        dispatch({
          type: 'technological/updateDatas',
          payload: {
            currentSelectedProjectOrgIdByBoardId: ''
          }
        })
        // dispatch({
        //   type: 'gantt/updateDatas',
        //   payload: {
        //     gantt_board_id: 0,
        //   }
        // });
        selectBoardToSeeInfo({ board_id: '0', dispatch })
      } else {
        const selectBoard = projectList.filter(
          item => item.board_id === data.key
        )
        const selectOrgId = getOrgIdByBoardId(data.key)
        if (!selectBoard && selectBoard.length == 0) {
          message.error('数据异常，请刷新后重试')
          return
        }
        //设置当前选中的项目
        setBoardIdStorage(data.key)
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: { ...selectBoard[0] }
          }
        })

        dispatch({
          type: 'accountSet/updateUserSet',
          payload: {
            current_board_id: data.key
          }
        })

        dispatch({
          type: 'technological/updateDatas',
          payload: {
            currentSelectedProjectOrgIdByBoardId: selectOrgId
          }
        })

        // dispatch({
        //   type: 'gantt/updateDatas',
        //   payload: {
        //     gantt_board_id: data.key,
        //   }
        // });
        selectBoardToSeeInfo({
          board_id: selectBoard[0] && selectBoard[0].board_id,
          board_name: selectBoard[0] && selectBoard[0].board_name,
          dispatch
        })
      }
      // dispatch({
      //   type: 'gantt/updateDatas',
      //   payload: {
      //     gantt_board_id: data.key,
      //   }
      // })
    }
  }

  handleCreateProject = () => {
    this.setAddProjectModalVisible()
  }

  setAddProjectModalVisible = data => {
    if (data) {
      return
    }
    const { dispatch } = this.props
    const { addProjectModalVisible } = this.state
    this.setState({
      addProjectModalVisible: !addProjectModalVisible
    })
  }

  handleSubmitNewProject = data => {
    const { dispatch } = this.props
    this.setAddProjectModalVisible()
    const calback = (id, name) => {
      dispatch({
        type: 'workbench/getProjectList',
        payload: {}
      })
      selectBoardToSeeInfo({
        board_id: id,
        board_name: name,
        dispatch,
        org_id: data._organization_id
        // group_view_type: '4'
      }) //极简模式项目选择
      window.sessionStorage.removeItem('session_currentSelectedWorkbenchBox') //重置当前盒子类型
      dispatch({
        //重置当前盒子类型
        type: 'simplemode/updateDatas',
        payload: {
          currentSelectedWorkbenchBox: {}
        }
      })
      dispatch({
        type: 'simplemode/routingJump',
        payload: {
          route: '/technological/simplemode/workbench'
        }
      })
    }
    Promise.resolve(
      dispatch({
        type: 'project/addNewProject',
        payload: {
          ...data,
          calback
        }
      })
    )
    // .then((res) => {
    //   if (isApiResponseOk(res)) {
    //     dispatch({
    //       type: 'workbench/getProjectList',
    //       payload: {}
    //     });
    //   }

    // })
    // .then(() => {
    //   this.setAddProjectModalVisible();
    // });
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'investmentMap/getMapsQueryUser',
      payload: {}
    })

    dispatch({
      type: 'xczNews/getXczNewsQueryUser',
      payload: {}
    })

    if (localStorage.getItem('OrganizationId') !== '0') {
      dispatch({
        type: 'organizationManager/getFnManagementList',
        payload: {
          // organization_id: params.key,
        }
      })
    }
  }

  getMenuItemList(projectList) {
    const { currentUserOrganizes } = this.props
    let menuItemList = [
      { id: '0', name: `我参与的${currentNounPlanFilterName(PROJECTS)}` }
    ]
    projectList.map((board, index) => {
      const { board_id: id, board_name: name, org_id } = board
      menuItemList.push({
        id,
        name,
        parentName: getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)
      })
    })

    return menuItemList
  }

  goWorkbenchBox = (item, isDisabled, tipTitle) => {
    if (isDisabled) {
      message.warn(tipTitle)
      return
    }
    const { id, code, status } = item
    const { dispatch } = this.props

    if (code === 'regulations') {
      if (isDisabled) {
        message.warn('暂无可查看的数据')
        return
      } else if (code === 'regulations') {
        if (localStorage.getItem('OrganizationId') === '0') {
          localStorage.setItem('isRegulations', 'yes')
        }
        dispatch({
          type: 'xczNews/routingJump',
          payload: {
            route: '/technological/simplemode/workbench/xczNews/hot'
          }
        })
      }
    }

    dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        currentSelectedWorkbenchBox: { id, code }
      }
    })
    // 存储当前会话盒子
    window.sessionStorage.setItem(
      'session_currentSelectedWorkbenchBox',
      JSON.stringify({ id, code })
    )

    if (code !== 'regulations') {
      dispatch({
        type: 'simplemode/routingJump',
        payload: {
          route: '/technological/simplemode/workbench'
        }
      })
    }
  }

  // 判断是否有新建项目的权限
  isHasCreatBoardPermission = () => {
    const org_id = localStorage.getItem('OrganizationId')
    let flag = true
    if (org_id != '0') {
      if (!checkIsHasPermission(ORG_TEAM_BOARD_CREATE)) {
        flag = false
      }
    }
    return flag
  }

  // 选择单一项目时判断对应该组织是否开启投资地图app
  isHasEnabledInvestmentMapsApp = () => {
    const {
      currentSelectedProjectOrgIdByBoardId,
      currentUserOrganizes = []
    } = this.props
    let isDisabled = true
    let flag = false
    for (let val of currentUserOrganizes) {
      if (val['id'] == currentSelectedProjectOrgIdByBoardId) {
        let gold_data =
          val['enabled_app_list'].find(
            item => item.code == 'InvestmentMaps' && item.status == '1'
          ) || {}
        if (
          gold_data &&
          Object.keys(gold_data) &&
          Object.keys(gold_data).length
        ) {
          flag = true
          isDisabled = false
        } else {
          isDisabled = true
        }
      }
      if (flag) {
        break
      }
    }
    return isDisabled
  }

  /**
   * 投资地图是否禁用
   * 1.单组织没权限 - 投资地图灰掉
   * 2.单组织没开启地图 - 投资地图不展示|灰掉
   * 3.单组织有权限 - 投资地图可显示
   * 4.全组织都没开启 - 投资地图不展示
   * 5.全组织一个开启 - 进入展示组织-项目列表
   * 综上所述：
   * 1.地图图标的显示与否取决于用户是否自行将该功能添加到极简桌面上，只要用户所选的组织中含有可用的地图功能于访问权限，用户便可*以将地图的功能图标添加到桌面上。
   * 2.用户当下所选的组织不包含可用的地图功能或权限时，投资地图图标为禁用状态（图标本身不做消失处理）；
   * （所有功能图标都如此）
   */
  getIsDisabled = item => {
    const { rela_app_id, code } = item
    const { currentUserOrganizes = [] } = this.props
    let isDisabled = true
    if ('regulations' == code || 'maps' == code) {
      if (localStorage.getItem('OrganizationId') == '0') {
        let flag = false
        for (let val of currentUserOrganizes) {
          for (let val2 of val['enabled_app_list']) {
            if (rela_app_id == val2['app_id'] && val2['status'] == '1') {
              flag = true
              isDisabled = false
              break
            }
          }
          if (flag) {
            break
          }
        }
      } else {
        const org =
          currentUserOrganizes.find(
            item => item.id == localStorage.getItem('OrganizationId')
          ) || {}
        const enabled_app_list = org.enabled_app_list || []
        for (let val2 of enabled_app_list) {
          if (rela_app_id == val2['app_id'] && val2['status'] == '1') {
            isDisabled = false
            break
          }
        }
      }
    } else if (
      ('board:files' == code || 'board:chat' == code) &&
      localStorage.getItem('OrganizationId') != '0'
    ) {
      const org =
        currentUserOrganizes.find(
          item => item.id == localStorage.getItem('OrganizationId')
        ) || {}
      const enabled_app_list = org.enabled_app_list || []
      let gold_data = enabled_app_list.find(item => item.code == 'Files') || {}
      if (
        gold_data &&
        Object.keys(gold_data) &&
        Object.keys(gold_data).length
      ) {
        isDisabled = false
      } else {
        isDisabled = true
      }
    } else {
      isDisabled = false
    }
    return isDisabled
  }

  renderBoxItem = (item, isPaymentUser) => {
    let tipTitle
    let isDisabled = this.getIsDisabled(item)
    if (isDisabled) {
      tipTitle = '暂无可查看的数据'
    }

    // 这是在选择单一项目时 对投资地图的判断
    if (
      item.code == 'maps' &&
      this.props.currentSelectedProjectOrgIdByBoardId &&
      this.isHasEnabledInvestmentMapsApp()
    ) {
      tipTitle = '暂无可查看的数据'
      isDisabled = true
    }

    if (!isPaymentUser) {
      if (item.code != 'board:plans') {
        tipTitle = `付费功能，请升级${platformNouns}企业版`
        isDisabled = true
      }
    } else {
      if (item.status == 0) {
        tipTitle = '功能开发中，敬请期待'
        isDisabled = true
      }
    }

    return (
      <>
        {tipTitle ? (
          <Tooltip title={tipTitle} key={item.id}>
            <div
              key={item.id}
              className={indexStyles.myWorkbenchBox}
              onClick={e => this.goWorkbenchBox(item, isDisabled, tipTitle)}
              disabled={isDisabled}
            >
              <i
                dangerouslySetInnerHTML={{ __html: item.icon }}
                className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`}
              ></i>
              <br />
              <span className={indexStyles.myWorkbenchBox_title}>
                {item.name}
              </span>
            </div>
          </Tooltip>
        ) : (
          <div
            key={item.id}
            className={indexStyles.myWorkbenchBox}
            onClick={e => this.goWorkbenchBox(item, isDisabled, tipTitle)}
            disabled={isDisabled}
          >
            <i
              dangerouslySetInnerHTML={{ __html: item.icon }}
              className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`}
            ></i>
            <br />
            <span className={indexStyles.myWorkbenchBox_title}>
              {item.name}
            </span>
          </div>
        )}
      </>
    )
  }

  render() {
    const {
      projectList,
      myWorkbenchBoxList = [],
      simplemodeCurrentProject = {}
    } = this.props

    const { addProjectModalVisible = false } = this.state
    const menuItemList = this.getMenuItemList(projectList)
    const fuctionMenuItemList = this.isHasCreatBoardPermission()
      ? [
          {
            name: '新建项目',
            icon: 'plus-circle',
            selectHandleFun: this.createNewBoard,
            id: 'add'
          }
        ]
      : []
    let selectedKeys = ['0']
    let isPaymentUser = false
    if (simplemodeCurrentProject && simplemodeCurrentProject.board_id) {
      selectedKeys = [simplemodeCurrentProject.board_id]
      isPaymentUser = isPaymentOrgUser(simplemodeCurrentProject.org_id)
    } else {
      isPaymentUser = isPaymentOrgUser()
    }

    return (
      <div className={indexStyles.mainContentWapper}>
        <div className={indexStyles.projectSelector}>
          <DropdownSelect
            selectedKeys={selectedKeys}
            iconVisible={true}
            simplemodeCurrentProject={simplemodeCurrentProject}
            itemList={menuItemList}
            fuctionMenuItemList={fuctionMenuItemList}
            menuItemClick={this.onSelectBoard}
          ></DropdownSelect>
        </div>

        <div className={indexStyles.myWorkbenchBoxWapper}>
          {myWorkbenchBoxList.map((item, key) => {
            return this.renderBoxItem(item, isPaymentUser)
          })}
          <div
            className={indexStyles.myWorkbenchBox}
            onClick={this.addMyWorkBoxs}
          >
            <i
              className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_add}`}
            >
              &#xe67e;
            </i>
          </div>
        </div>

        <CreateProject
          setAddProjectModalVisible={this.setAddProjectModalVisible}
          addProjectModalVisible={addProjectModalVisible} //addProjectModalVisible
          addNewProject={this.handleSubmitNewProject}
        />
      </div>
    )
  }
}

export default connect(
  ({
    workbench: {
      datas: { projectList, projectTabCurrentSelectedProject }
    },
    simplemode: {
      myWorkbenchBoxList,
      workbenchBoxList,
      simplemodeCurrentProject
    },
    technological: {
      datas: {
        currentUserOrganizes,
        currentSelectedProjectOrgIdByBoardId,
        userOrgPermissions
      }
    },
    investmentMap: {
      datas: { mapOrganizationList }
    },
    xczNews: { XczNewsOrganizationList },
    project
  }) => ({
    project,
    projectList,
    projectTabCurrentSelectedProject,
    myWorkbenchBoxList,
    workbenchBoxList,
    currentUserOrganizes,
    simplemodeCurrentProject,
    mapOrganizationList,
    XczNewsOrganizationList,
    currentSelectedProjectOrgIdByBoardId,
    userOrgPermissions
  })
)(MyWorkbenchBoxs)
