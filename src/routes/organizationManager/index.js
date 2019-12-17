import React from 'react';
import { connect } from "dva/index";
import { Icon, Tabs, message, Menu } from 'antd'
import indexStyles from './index.less'
import { color_4 } from '../../globalset/js/styles'
import ProjectRole from './ProjectRole'
import OrgnizationRole from './OrgnizationRole'
import BaseInfo from './BaseInfo'
import { getUrlQueryString } from '../../utils/util'
import NounDefinition from "./NounDefinition";
import { ORGANIZATION, PROJECTS } from "../../globalset/js/constant";
import { currentNounPlanFilterName } from "../../utils/businessFunction";
import FnManagement from './FnManagement';
import NormalMakeLcbPlans from './normalMakeLcbPlans'
import globalStyles from '@/globalset/css/globalClassName.less' 


const TabPane = Tabs.TabPane

const getEffectOrReducerByName = name => `organizationManager/${name}`

const Organization = (options) => {
  const { dispatch, model = {}, showBackBtn = true } = options
  const { datas: { tabSelectKey } } = model
  const updateDatas = (payload) => {
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: payload
    })
  }

  const routingJump = (path) => {
    dispatch({
      type: getEffectOrReducerByName('routingJump'),
      payload: {
        route: path,
      }
    })
  }
  const historyGoBack = () => {
    // window.history.go(-1)
    const nextPath = getUrlQueryString(window.location.href, 'nextpath')
    // console.log(nextPath)
    if (nextPath) {
      routingJump(nextPath)
    } else {
      routingJump('/technological/workbench')
      // window.history.go(-1)
    }
  }

  const asyncProprs = {
    model,
    dispatch,
    getFnManagementList(data) {
      dispatch({
        type: getEffectOrReducerByName('getFnManagementList'),
        payload: data
      })
    },
    setFnManagement(data) {
      dispatch({
        type: getEffectOrReducerByName('setFnManagement'),
        payload: data
      })
    },
    updateOrganization(data) {
      dispatch({
        type: getEffectOrReducerByName('updateOrganization'),
        payload: data
      })
    },
    uploadOrganizationLogo(data) {
      dispatch({
        type: getEffectOrReducerByName('uploadOrganizationLogo'),
        payload: data
      })
    },
    getRolePermissions(data) {
      dispatch({
        type: getEffectOrReducerByName('getRolePermissions'),
        payload: data
      })
    },
    saveRolePermission(data) {
      dispatch({
        type: getEffectOrReducerByName('saveRolePermission'),
        payload: data
      })
    },
    createRole(data) {
      dispatch({
        type: getEffectOrReducerByName('createRole'),
        payload: data
      })
    },
    updateRole(data) {
      dispatch({
        type: getEffectOrReducerByName('updateRole'),
        payload: data
      })
    },
    deleteRole(data) {
      dispatch({
        type: getEffectOrReducerByName('deleteRole'),
        payload: data
      })
    },
    copyRole(data) {
      dispatch({
        type: getEffectOrReducerByName('copyRole'),
        payload: data
      })
    },
    setDefaultRole(data) {
      dispatch({
        type: getEffectOrReducerByName('setDefaultRole'),
        payload: data
      })
    },
    savePermission(data) {
      dispatch({
        type: getEffectOrReducerByName('savePermission'),
        payload: data
      })
    },
    getPermissions(data) {
      dispatch({
        type: getEffectOrReducerByName('getPermissions'),
        payload: data
      })
    },
    getNounList(data) {
      dispatch({
        type: getEffectOrReducerByName('getNounList'),
        payload: data
      })
    },
    saveNounList(data) {
      dispatch({
        type: getEffectOrReducerByName('saveNounList'),
        payload: data
      })
    },
  }

  const onTabClick = (key) => {
    updateDatas({
      tabSelectKey: key
    })
  }

  const handleChangeNavStatus = ({key}) => {
    updateDatas({
      tabSelectKey: key
    })
  }

  // 渲染组织管理后台导航栏
 const renderManagementNavList = () => {
    return (
      <Menu
        selectedKeys={[tabSelectKey]}
        onClick={handleChangeNavStatus}
        getPopupContainer={triggerNode => triggerNode.parentNode} style={{minWidth: '228px', textAlign: 'center'}}>
        <Menu.Item key="1">基本信息</Menu.Item>
        <Menu.Item key="2">{`${currentNounPlanFilterName(ORGANIZATION)}角色`}</Menu.Item>
        <Menu.Item key="3">{`${currentNounPlanFilterName(PROJECTS)}角色`}</Menu.Item>
        <Menu.Item key="4">名词定义</Menu.Item>
        <Menu.Item key="5">功能管理</Menu.Item>
        <Menu.Item key="6">{`${currentNounPlanFilterName(PROJECTS)}项目解决方案`}</Menu.Item>
      </Menu>
    )
  }

  const renderManagementContainer = () => {
    let mainContent = (<div></div>)
    switch (tabSelectKey) {
      case '1':
        mainContent = (<div><BaseInfo {...asyncProprs} updateDatas={updateDatas}/></div>)
        break;
      case '2':
        mainContent = (<div><OrgnizationRole {...asyncProprs} updateDatas={updateDatas} /></div>)
        break
      case '3':
        mainContent = (<div><ProjectRole {...asyncProprs} updateDatas={updateDatas} /></div>)
        break
      case '4':
        mainContent = (<div><NounDefinition {...asyncProprs} updateDatas={updateDatas} /></div>)
        break
      case '5':
        mainContent = (<div><FnManagement {...asyncProprs} updateDatas={updateDatas}></FnManagement></div>)
        break
      case '6':
        mainContent = (<div><NormalMakeLcbPlans /></div>)
        break
      default:
        break;
    }
    return mainContent
  }


  return (
    <div className={indexStyles.organizationOut}>
      <div className={indexStyles.main}>
        {
          showBackBtn && (
            <div className={indexStyles.back} onClick={historyGoBack}>
              <Icon type="left" theme="outlined" />返回
          </div>
          )}
        <div className={indexStyles.orgManagementWrapper}>
          {/* 左边导航 */}
          <div className={indexStyles.org_managementNav}>
            {renderManagementNavList()}
          </div>
          {/* 右边内容 */}
          <div className={`${indexStyles.org_managementContainer} ${globalStyles.global_vertical_scrollbar}`}>
            {renderManagementContainer()}
          </div>
        </div>
      </div>
    </div>
  )
};

function mapStateToProps({ modal, organizationManager, loading }) {
  return { modal, model: organizationManager, loading }
}
export default connect(mapStateToProps)(Organization)
