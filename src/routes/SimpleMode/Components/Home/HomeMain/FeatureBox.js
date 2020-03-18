import React, { Component } from "react";
import dva, { connect } from "dva/index"
import indexStyles from './featurebox.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Icon, message, Tooltip } from 'antd';
import { setBoardIdStorage, isPaymentOrgUser, } from "@/utils/businessFunction"
class FeatureBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addProjectModalVisible: false
    };
  }

  componentWillMount() { }

  componentWillReceiveProps(nextProps) {
    const { projectList: old_projectList } = this.props;
    const { dispatch, projectList } = nextProps;
    if ((!old_projectList || old_projectList.length == 0) && projectList.length > 0) {
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
      const { user_set = {} } = userInfo
      const selectBoard = projectList.filter(item => item.board_id === user_set.current_board && item.org_id === user_set.current_org);

      if (selectBoard && selectBoard.length > 0) {
        //设置当前选中的项目
        setBoardIdStorage(user_set.current_board);
        dispatch({
          type: 'simplemode/updateDatas',
          payload: {
            simplemodeCurrentProject: { ...selectBoard[0] }
          }
        });
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
        });
      }
    }


  }

  addMyWorkBoxs = () => {
    this.props.setHomeVisible({
      simpleHeaderVisiable: false,
      myWorkbenchBoxsVisiable: false,
      wallpaperSelectVisiable: false,
      workbenchBoxSelectVisiable: true,
      createProjectVisiable: false,
    });
  }

  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({
      type: 'workbench/getProjectList',
      payload: {}
    })

    dispatch({
      type: 'investmentMap/getMapsQueryUser',
      payload: {}
    })

    dispatch({
      type: 'xczNews/getXczNewsQueryUser',
      payload: {}
    })

    if (localStorage.getItem('OrganizationId') !== "0") {
      dispatch({
        type: 'organizationManager/getFnManagementList',
        payload: {
          // organization_id: params.key,
        }
      })
    }
  }

  goWorkbenchBox = (item, isDisabled, tipTitle) => {

    if (isDisabled) {
      message.warn(tipTitle);
      return
    }
    const { id, code, status } = item
    const { dispatch } = this.props;

    if (code === 'regulations') {
      if (isDisabled) {
        message.warn("暂无可查看的数据");
        return
      } else if (code === 'regulations') {
        if (localStorage.getItem('OrganizationId') === "0") {
          localStorage.setItem('isRegulations', 'yes');
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
    });
    // 存储当前会话盒子
    window.sessionStorage.setItem('session_currentSelectedWorkbenchBox', JSON.stringify({ id, code }))

    if (code !== 'regulations') {
      dispatch({
        type: 'simplemode/routingJump',
        payload: {
          route: '/technological/simplemode/workbench'
        }
      });
    }
  }

  // 选择单一项目时判断对应该组织是否开启投资地图app
  isHasEnabledInvestmentMapsApp = () => {
    const { currentSelectedProjectOrgIdByBoardId, currentUserOrganizes = [] } = this.props
    let isDisabled = true
    let flag = false
    for (let val of currentUserOrganizes) {
      if (val['id'] == currentSelectedProjectOrgIdByBoardId) {
        let gold_data = val['enabled_app_list'].find(item => item.code == 'InvestmentMaps' && item.status == '1') || {}
        if (gold_data && Object.keys(gold_data) && Object.keys(gold_data).length) {
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
  getIsDisabled = (item) => {
    const { rela_app_id, code } = item
    const { currentUserOrganizes = [], projectList = [] } = this.props
    let isDisabled = true
    if (!projectList.length) {
      return true
    }
    if ("regulations" == code || "maps" == code) {
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
        const org = currentUserOrganizes.find(item => item.id == localStorage.getItem('OrganizationId')) || {}
        const enabled_app_list = org.enabled_app_list || []
        for (let val2 of enabled_app_list) {
          if (rela_app_id == val2['app_id'] && val2['status'] == '1') {
            isDisabled = false
            break
          }
        }
      }
    } else if (('board:files' == code || 'board:chat' == code) && localStorage.getItem('OrganizationId') != '0') {
      const org = currentUserOrganizes.find(item => item.id == localStorage.getItem('OrganizationId')) || {}
      const enabled_app_list = org.enabled_app_list || []
      let gold_data = enabled_app_list.find(item => item.code == 'Files') || {}
      if (gold_data && Object.keys(gold_data) && Object.keys(gold_data).length) {
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
    let tipTitle;
    let isDisabled = this.getIsDisabled(item);
    if (isDisabled) {
      tipTitle = '暂无可查看的数据'
    }

    // 这是在选择单一项目时 对投资地图的判断
    if (item.code == 'maps' && this.props.currentSelectedProjectOrgIdByBoardId && this.isHasEnabledInvestmentMapsApp()) {
      tipTitle = '暂无可查看的数据'
      isDisabled = true
    }

    if (!isPaymentUser) {
      if (item.code != 'board:plans') {
        tipTitle = '付费功能，请升级聆悉企业版';
        isDisabled = true;
      }

    } else {
      if (item.status == 0) {
        tipTitle = '功能开发中，敬请期待';
        isDisabled = true;
      }
    }

    return (
      <>
        {tipTitle ? (
          <Tooltip title={tipTitle} key={item.id}>
            <div key={item.id} className={indexStyles.myWorkbenchBox} onClick={(e) => this.goWorkbenchBox(item, isDisabled, tipTitle)} disabled={isDisabled}>
              <i dangerouslySetInnerHTML={{ __html: item.icon }} className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} ></i><br />
              <span className={indexStyles.myWorkbenchBox_title}>{item.name}</span>
            </div>
          </Tooltip>
        )
          : (
            <div key={item.id} className={indexStyles.myWorkbenchBox} onClick={(e) => this.goWorkbenchBox(item, isDisabled, tipTitle)} disabled={isDisabled}>
              <i dangerouslySetInnerHTML={{ __html: item.icon }} className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_icon}`} ></i><br />
              <span className={indexStyles.myWorkbenchBox_title}>{item.name}</span>
            </div>
          )}
      </>
    )

  }

  render() {

    const { projectList, myWorkbenchBoxList = [], simplemodeCurrentProject = {} } = this.props;

    let selectedKeys = ['0'];
    let isPaymentUser = false;
    if (simplemodeCurrentProject && simplemodeCurrentProject.board_id) {
      selectedKeys = [simplemodeCurrentProject.board_id];
      isPaymentUser = isPaymentOrgUser(simplemodeCurrentProject.org_id);
    } else {
      isPaymentUser = isPaymentOrgUser();
    }


    return (

      <div className={indexStyles.mainContentWapper}>

        <div className={indexStyles.myWorkbenchBoxWapper}>
          {
            myWorkbenchBoxList.map((item, key) => {
              return this.renderBoxItem(item, isPaymentUser);
            })
          }
          {
            projectList.length ? (
              <div className={indexStyles.myWorkbenchBox} onClick={this.addMyWorkBoxs} style={{ paddingTop: 10 }}>
                <i className={`${globalStyles.authTheme} ${indexStyles.myWorkbenchBox_add}`} >&#xe67e;</i>
              </div>
            ) : ''
          }
        </div>

      </div>

    );
  }
}

export default connect(
  ({
    workbench: {
      datas: { projectList } }
    ,
    simplemode: {
      myWorkbenchBoxList,
      simplemodeCurrentProject
    },
    technological: {
      datas: { currentUserOrganizes, currentSelectedProjectOrgIdByBoardId, userOrgPermissions }
    },
    investmentMap: {
      datas: {
        mapOrganizationList
      } },
    xczNews: {
      XczNewsOrganizationList
    },
  }) => ({
    projectList,
    myWorkbenchBoxList,
    currentUserOrganizes,
    simplemodeCurrentProject,
    XczNewsOrganizationList,
    currentSelectedProjectOrgIdByBoardId,
    userOrgPermissions,
    mapOrganizationList
  }))(FeatureBox)
